import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { jwtPayload } from "@/types/jwt";

export function verifyToken(req: NextApiRequest): jwtPayload | null {
    try {
        
        const token = req.cookies.token;

        if (!token) return null;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwtPayload;

        console.log(decoded)

        return decoded;

    } catch (error) {
        return null;
    }
}