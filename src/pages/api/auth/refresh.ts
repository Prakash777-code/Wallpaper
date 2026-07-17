import { verifyRefreshToken } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
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

  const user = verifyRefreshToken(req);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const accessToken = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "5m" },
  );

   const accessCookie = serialize("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 5,
    path: "/",
  });

  res.setHeader("Set-Cookie",accessCookie)

  return res.status(200).json({
    message:"Access token regenerated"
  })
}
