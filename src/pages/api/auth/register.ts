import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { signupLimiter } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const { success } = await signupLimiter.limit(ip);
  if (!success) {
    return res.status(429).json({
      message: "Too many request. Please try again later",
    });
  }

  try {
    const [existingUser]: any = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (userName,email,password) VALUES (?,?,?)",
      [name, email, hashedPassword],
    );

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to register user",
    });
  }
}
