export const removeFromDownloads = async (
  wallpaperId: number,
  imageUrl: string,
) => {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pexels/download`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      wallpaperId,
      imageUrl,
    }),
  });

  if (res.status === 401) {
    const deleteRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    );
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

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pexels/download`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallpaperId,
        imageUrl,
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
