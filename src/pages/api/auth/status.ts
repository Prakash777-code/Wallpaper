import { verifyAccessToken } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {

    if(req.method !== "GET"){
        return res.status(405).json({
            message:"Method not allowed"
        })
    }

    const user = verifyAccessToken(req)
    if(!user){
        return res.status(401).json({
            status:"Unauthenticated"
        })
    }

    return res.status(200).json({
        status:"Authenticated"
    })
    
}