export const unfavouriteWallpaper = async (wallpaperId: number) => {
  const res = await fetch(`/api/wallpapers/${wallpaperId}`, {
    method: "DELETE",
  });
  const data = await res.json()

  return{
    ok:res.ok,
    status:res.status,
    data
  }
};
