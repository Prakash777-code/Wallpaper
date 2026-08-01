import { favourites } from "@/types/favourites";

type FavouriteWallpaperCardProps = {
  wallpaper: favourites;
  unfavourite: (wallpaperId: string) => void;
};

export default function FavouriteWallpaperCard({
  wallpaper,
  unfavourite,
}: FavouriteWallpaperCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-cyan-500/20">
      <div
        onClick={() => window.open(wallpaper.imageUrl, "_blank")}
        className=" cursor-pointer relative h-[420px] overflow-hidden"
      >
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.photographer ?? "Wallpaper"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition group-hover:opacity-100" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            unfavourite(wallpaper.wallpaperId);
          }}
          className="cursor-pointer absolute right-4 top-4 rounded-full bg-red-500/90 p-3 text-white backdrop-blur transition hover:scale-110"
        >
          ✖
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-5">
        <h2 className="text-lg font-bold">{wallpaper.photographer}</h2>
      </div>
    </div>
  );
}
