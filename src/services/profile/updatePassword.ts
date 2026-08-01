export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
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

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
