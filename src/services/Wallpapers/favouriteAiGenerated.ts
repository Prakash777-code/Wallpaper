import { AiType } from "@/types/favouriteAi";

export const favouriteAiGenerated = async (wallpaper: AiType) => {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      wallpaperId: wallpaper.id,
      imageUrl: wallpaper.imageUrl,
      photographer: wallpaper.photographer,
    }),
  });

  if (res.status === 401) {
    const postRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    if (postRes.status === 401) {
      return {
        ok: false,
        status: postRes.status,
        data: {
          message: "Unauthorized",
        },
      };
    }
    if (!postRes.ok) {
      const data = await postRes.json();
      return {
        ok: false,
        status: postRes.status,
        data,
      };
    }
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        wallpaperId: wallpaper.id,
        imageUrl: wallpaper.imageUrl,
        photographer: wallpaper.photographer,
      }),
    });
  }

  const data = await res.json();
  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
