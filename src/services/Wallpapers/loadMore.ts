export const checkLoadMore = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/status`, {
    credentials: "include",
  });
  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
