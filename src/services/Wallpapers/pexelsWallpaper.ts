export const getPexelsWallpaper = async (
  query: string,
  page: number,
  signal: AbortSignal,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pexels?query=${encodeURIComponent(query)}&page=${page}&perPage=16`,
    { signal },
  );

  const data = await res.json();

  console.log(data)

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
