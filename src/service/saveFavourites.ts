import { PexelsPhoto } from "@/types/pexels";

export const saveToFavourite = async(wallpaper:PexelsPhoto)=>{

    const res = await fetch("/api/wallpapers/favourite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallpaperId: wallpaper.id,
          url: wallpaper.src.portrait,
          photographer: wallpaper.photographer,
        }),
      });

      const data = await res.json()

      return{
        ok:res.ok,
        status:res.status,
        data,
      }
}