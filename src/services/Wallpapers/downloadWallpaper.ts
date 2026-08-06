export const downloadWallpaper = (
  imageUrl: string,
  wallpaperId:string,
  photographer:string
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pexels/download?url=${encodeURIComponent(imageUrl)}&wallpaperId=${wallpaperId}&photographer=${encodeURIComponent(photographer)}`;

  window.location.href = url;
};