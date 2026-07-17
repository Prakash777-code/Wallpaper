import { verifyAccessToken } from "@/lib/auth";
import db from "@/lib/db";
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

    try {
      await db.query(
        "INSERT INTO favourites (user_id,wallpaper_id, image_url,photographer) values(?,?,?,?)",
        [user.userId, wallpaperId, url, photographer],
      );

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
      const [rows] = await db.query(
        "SELECT * FROM favourites WHERE user_id=?",
        [user.userId],
      );
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
