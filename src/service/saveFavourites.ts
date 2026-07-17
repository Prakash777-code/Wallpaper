import { PexelsPhoto } from "@/types/pexels";

export const saveToFavourite = async (wallpaper: PexelsPhoto) => {
  let res = await fetch("/api/wallpapers/favourite", {
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

  if (res.status === 401) {
    const postRes = await fetch("/api/auth/refresh",{
      method:"POST"
    });
    if (postRes.status === 401) {
      return {
        ok: false,
        status:postRes.status,
        data:{
          message:"Unauthorized"
        }
      };
    }
    if(!postRes.ok){
      const data = await postRes.json()
      return{
        ok:false,
        status:postRes.status,
        data,
      }
    }
    res = await fetch("/api/wallpapers/favourite",{
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      wallpaperId: wallpaper.id,
      url: wallpaper.src.portrait,
      photographer: wallpaper.photographer,
    }),
    })
  }

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
