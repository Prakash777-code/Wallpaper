export const getPexelsWallpaper = async (
  query: string,
  page: number,
  signal: AbortSignal,
) => {
  const res = await fetch(
    `/api/pexels/wallpaper?query=${encodeURIComponent(query)}&page=${page}`,
    { signal },
  );

  const data = await res.json();

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
};
