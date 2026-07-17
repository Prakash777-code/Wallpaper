import { verifyAccessToken } from "@/lib/auth";
import { NextApiResponse, NextApiRequest } from "next";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { wallpaper_id } = req.query;
  const user = verifyAccessToken(req);

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.method === "DELETE") {
    if (!wallpaper_id) {
        console.log("Empty id");
      return res.status(400).json({
        message: "Empty wallpaper id",
      });
    }

    try {
      const [result]: any = await db.query(
        "DELETE FROM favourites WHERE wallpaper_id=? AND user_id=?",
        [wallpaper_id, user.userId],
      );

      if (result.affectedRows === 0) {
        console.log("Not found")
        return res.status(404).json({
          message: "Wallpaper not found",
        });
      }

      return res.status(200).json({
        message: "Wallpaper removed",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to remove wallpaper",
      });
    }
  }
}
