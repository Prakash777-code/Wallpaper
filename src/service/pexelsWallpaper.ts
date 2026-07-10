export const getPexelsWallpaper = async (
  query: string,
  signal: AbortSignal,
) => {
  try {
    const res = await fetch(`/api/pexels/wallpaper?query=${encodeURIComponent(query)}`, { signal });
    if(!res.ok){
        console.log("Pexels api error")
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};
