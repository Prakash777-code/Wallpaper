import { favourites } from "@/types/favourites";
import { downloadWallpaper } from "@/services/Wallpapers/downloadWallpaper";

type FavouriteWallpaperCardProps = {
  wallpaper: favourites;
  unfavourite: (wallpaperId: string) => void;
};

export default function FavouriteWallpaperCard({
  wallpaper,
  unfavourite,
}: FavouriteWallpaperCardProps) {
  return (
    <div className="group relative h-[280px] overflow-hidden rounded-2xl bg-zinc-900 sm:h-[360px] lg:h-[420px]">
      <div
        onClick={() => window.open(wallpaper.imageUrl, "_blank")}
        className="relative h-full w-full cursor-pointer overflow-hidden"
      >
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.photographer ?? "Wallpaper"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition duration-300 group-hover:opacity-100" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            unfavourite(String(wallpaper.wallpaperId));
          }}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-500/90 text-white backdrop-blur-md transition hover:scale-110"
        >
          ✖
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            downloadWallpaper(
              wallpaper.imageUrl,
              String(wallpaper.wallpaperId),
              wallpaper.photographer,
            );
          }}
          className="absolute bottom-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-lg transition hover:scale-110 hover:bg-purple-600"
        >
          ↓
        </button>

        <div className="absolute bottom-0 left-0 z-10 w-full p-5">
          <h2 className="text-lg font-bold text-white">
            {wallpaper.photographer}
          </h2>
        </div>
      </div>
    </div>
  );
}
