import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { jwtPayload } from "@/types/jwt";

export function verifyAccessToken(req: NextApiRequest): jwtPayload | null {
    try {
        
        const token = req.cookies.accessToken;

        if (!token) return null;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwtPayload;

        return decoded;

    } catch (error) {
        return null;
    }
}

export function verifyRefreshToken(req:NextApiRequest):jwtPayload | null {

    try{
        const token = req.cookies.refreshToken

        if(!token){
            return null
        }

        const decoded = jwt.verify(
            token,
            process.env.REFRESH_SECRET as string
        ) as jwtPayload

        return decoded
    }catch(error){
        return null
    }
}