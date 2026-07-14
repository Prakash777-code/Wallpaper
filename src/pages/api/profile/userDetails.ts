import { verifyToken } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { UserProfile } from "@/types/profile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT userName, email, created_at FROM users WHERE id=?",
      [user.userId],
    );

    const [favouriteCount] = await db.query(
      "SELECT COUNT(*) AS totalFavourites FROM favourites WHERE user_id=?",
      [user.userId],
    );

    const result: UserProfile = {
      name: (rows as any)[0].userName,
      email: (rows as any)[0].email,
      memberSince: (rows as any)[0].created_at,
      totalFavourites: (favouriteCount as any)[0].totalFavourites,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
