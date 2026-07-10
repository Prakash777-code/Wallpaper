import { verifyToken } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function(req:NextApiRequest, res:NextApiResponse){

    const user=verifyToken(req)
    if(!user){
        return res.status(401).json({
            message:"Unautorized"
        })
    }

    if(req.method !== "GET"){
        return res.status(405).json({
            message:"Method not allowed"
        })
    }

    try{
        const [rows]:any=await db.query(
            "SELECT userName FROM users WHERE id=?",
            [user.userId]
        )

        const result=rows[0]
        const userName=result.userName
        return res.status(200).json({
            userName
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}