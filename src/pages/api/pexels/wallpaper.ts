import { searchLimit } from "@/lib/rateLimiter";
import { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const { success } = await searchLimit.limit(ip);
    if (!success) {
      return res.status(429).json({
        message: "Too many request. Please try again later",
      });
    }

    const query = (req.query.query as string) || "cars".trim().toLowerCase()
    const page = Number(req.query.page || 1);

    if (!query) {
      return res.status(400).json({
        message: "Query is empty",
      });
    }

    const cachedKey = `search:${query.toLowerCase()}:${page}`;

    const cachedData = await redis.get(cachedKey);

    if (cachedData) {
      console.log("Cached hit")
      return res.status(200).json(cachedData);
    }

    console.log("Cache miss")

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=16`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY!,
        },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to laod wallpapers",
      });
    }

    const data = await response.json();
    await redis.set(cachedKey, data, {
      ex: 60 * 10,
    });
    console.log("Pexels hit")
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
