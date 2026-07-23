import { verifyAccessToken } from "@/lib/auth";
import db from "@/lib/db";
import { updatePasswordLimit } from "@/lib/rateLimiter";
import bcrypt from "bcryptjs";
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

  if (req.method !== "PUT") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current and new passwors are empty",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    const [rows]: any = await db.query("SELECT email FROM users WHERE id=?", [
      user.userId,
    ]);

    if (rows.length === 0) {
      console.log("Email not found");
    }

    const email = rows[0].email;

    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const identifier = `${ip}:${email}`;
    const { success } = await updatePasswordLimit.limit(identifier);
    if (!success) {
      return res.status(429).json({
        message: "Too many request. Please try again later",
      });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const [row]: any = await db.query("SELECT password FROM users WHERE id=?", [
      user.userId,
    ]);

    if (row.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, row[0].password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const [result]: any = await db.query(
      "UPDATE users SET password=? WHERE id=?",
      [hashedNewPassword, user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
