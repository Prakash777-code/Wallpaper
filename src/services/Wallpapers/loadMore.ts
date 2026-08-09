export const checkLoadMore = async () => {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/status`, {
    credentials: "include",
  });

  if (res.status === 401) {
    const refresh = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    if (refresh.status === 401) {
      return {
        ok: false,
        status: refresh.status,
        data: {
          message: "Unauthorized",
        },
      };
    }
    if (!refresh.ok) {
      const data = await refresh.json();
      return {
        ok: false,
        status: refresh.status,
        data,
      };
    }

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/status`, {
      credentials: "include",
    });
  }

  const data = await res.json()

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
