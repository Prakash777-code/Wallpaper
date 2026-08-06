export const fetchDownloadedWallpapers = async () => {
    console.log("Download api called")
  let res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pexels/downloaded`,
    {
      credentials: "include",
    },
  );
  if (res.status === 401) {
    const getRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (getRes.status === 401) {
      return {
        ok: false,
        status: getRes.status,
        data: {
          message: "Unauthorised",
        },
      };
    }

    if (!getRes.ok) {
      const data = await getRes.json();
      return {
        ok: false,
        status: getRes.status,
        data,
      };
    }

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pexels/downloaded`, {
      credentials: "include",
    });
  }

  const data = await res.json()

  return{
    ok:res.ok,
    status:res.status,
    data
  }
};
