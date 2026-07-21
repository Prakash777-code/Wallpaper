export const editUserName = async (newName: string) => {
  let res = await fetch("/api/profile/editName", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newName }),
  });

  if (res.status === 401) {
    const putRes = await fetch("/api/auth/refresh");
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

    res = await fetch("/api/auth/refresh");
  }

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
