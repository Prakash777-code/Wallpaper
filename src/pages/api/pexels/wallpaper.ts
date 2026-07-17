import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
 
  /*const user=verifyToken(req)
  if(!user){
    return res.status(401).json({
      message:"Unauthorized"
    })
  }
    **/

  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const query = req.query.query as string;
  const page = Number(req.query.page || 1)

  if (!query) {
    return res.status(400).json({
      message: "Query is empty",
    });
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=20`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY!,
        },
      },
    );

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to laod wallpapers",
      });
    }

    const data = await response.json();
    return res.status(200).json(data)
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
