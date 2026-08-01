export const editUserName = async (newName: string) => {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ newName }),
  });

  if (res.status === 401) {
    const putRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (putRes.status === 401) {
      return {
        ok: false,
        status: putRes.status,
        data: {
          message: "Unauthorized",
        },
      };
    }
    if (!putRes.ok) {
      const data = await putRes.json();
      return {
        ok: false,
        status: putRes.status,
        data,
      };
    }

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newName }),
    });
  }

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
