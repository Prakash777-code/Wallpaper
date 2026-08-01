export const unfavouriteWallpaper = async (wallpaperId: string) => {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${wallpaperId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 401) {
    const deleteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (deleteRes.status === 401) {
      return {
        ok: false,
        status: deleteRes.status,
        data: {
          message: "Unauthorized",
        },
      };
    }
    if (!deleteRes.ok) {
      const data = await deleteRes.json();
      return {
        ok: false,
        status: deleteRes.status,
        data,
      };
    }

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${wallpaperId}`, {
      method: "DELETE",
      credentials: "include",
    });
  }
  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
