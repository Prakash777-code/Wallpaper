import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    console.log("Middleware redirected")
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);

      const { payload } = await jwtVerify(accessToken, secret);
      return NextResponse.next();
    } catch (error) {
      console.error(error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  matcher: ["/favourites", "/profile"],
};
