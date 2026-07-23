import { verifyAccessToken } from "@/lib/auth";
import db from "@/lib/db";
import { updateUserNameLimit } from "@/lib/rateLimiter";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const user = verifyAccessToken(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const newName = req.body.newName as string;

  if (!newName) {
    return res.status(400).json({
      message: "New name is empty",
    });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const { success } = await updateUserNameLimit.limit(ip);
  if (!success) {
    return res.status(429).json({
      message: "Too many request. Please try again later",
    });
  }

  try {
    const [result]: any = await db.query(
      "UPDATE users SET userName=? WHERE id=?",
      [newName, user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Name changed",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
