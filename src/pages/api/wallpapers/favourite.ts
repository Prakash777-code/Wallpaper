import { verifyAccessToken } from "@/lib/auth";
import db from "@/lib/db";
import { favouriteLimit } from "@/lib/rateLimiter";
import { redis } from "@/lib/redis";
import { favourites } from "@/types/favourites";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = verifyAccessToken(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.method === "POST") {
    const { wallpaperId, url, photographer } = req.body;

    if (!wallpaperId || !url || !photographer) {
      return res.status(400).json({
        message: "Wallpaper id and url are required",
      });
    }

    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const { success } = await favouriteLimit.limit(ip);
    if (!success) {
      return res.status(429).json({
        message: "Too many request. Please try again later",
      });
    }

    try {
      await db.query(
        "INSERT INTO favourites (user_id,wallpaper_id, image_url,photographer) values(?,?,?,?)",
        [user.userId, wallpaperId, url, photographer],
      );
      await redis.del(`Favourites:${user.userId}`)
      return res.status(200).json({
        message: "Saved successfully",
      });
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "Wallpaper is already in your favourites",
        });
      }

      console.log(error);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  if (req.method === "GET") {
    try {
      const cachedKey = `Favourites:${user.userId}`;
      const cachedData = await redis.get(cachedKey);
      if (cachedData) {
        console.log("Cache hit")
        return res.status(200).json(cachedData)
      }

      console.log("Cache miss")

      const [rows] = await db.query(
        "SELECT * FROM favourites WHERE user_id=?",
        [user.userId],
      );
      await redis.set(cachedKey, rows as favourites[],{
        ex:60*30
      })
      console.log("Wallverse hit")
      return res.status(200).json(rows as favourites[]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to load wallpapers",
      });
    }
  }

  return res.status(405).json({
    message: "Method not allowed",
  });
}
