import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and passowrd are required",
      });
    }

    const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    const accessToken = jwt.sign(
      {userId:user.id},
      process.env.JWT_SECRET as string,
      {expiresIn:"5m"}
    )

    const refreshToken = jwt.sign(
      {userId:user.id},
      process.env.REFRESH_SECRET as string,
      {expiresIn:"7d"}
    )

    const accessCookie = serialize("accessToken",accessToken,{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite:"lax",
      maxAge:60*5,
      path:"/",
    });

    const refreshCookie = serialize("refreshToken",refreshToken,{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite:"lax",
      maxAge:60*60*24*7,
      path:"/"
    })

    res.setHeader("Set-Cookie", [accessCookie,refreshCookie])

    return res.status(200).json({
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
}