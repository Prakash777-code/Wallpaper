import Image from "next/image";
import { PexelsBackendResponse } from "@/types/pexels";
import { downloadWallpaper } from "@/services/Wallpapers/downloadWallpaper";

type WallpaperCardProps = {
  photo: PexelsBackendResponse;
  favouriteLoading: boolean;
  handleFavourites: (photo: PexelsBackendResponse) => void;
  openAuthPopup: () => void;
};

const checkAuthenticated = async (openAuthPopup: () => void) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/status`, {
    credentials: "include",
  });

  if (res.status === 401) {
    openAuthPopup();
    return false;
  }

  return true;
};

export default function WallpaperCard({
  photo,
  favouriteLoading,
  handleFavourites,
  openAuthPopup,
}: WallpaperCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-cyan-500/20">
      <div className="relative h-[420px] overflow-hidden">
        <div
          onClick={() => window.open(photo.imageUrl, "_blank")}
          className="absolute inset-0 cursor-pointer"
        >
          <Image
            src={photo.imageUrl}
            alt={photo.photographer}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition group-hover:opacity-100" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavourites(photo);
          }}
          disabled={favouriteLoading}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur-lg transition hover:scale-110 hover:bg-red-500"
        >
          ❤️
        </button>

        <button
          onClick={async (e) => {
            e.stopPropagation();

            const authenticated = await checkAuthenticated(openAuthPopup);

            if (!authenticated) {
              return;
            }

            downloadWallpaper(
              photo.imageUrl,
               String(photo.wallpaperId),
              photo.photographer,
            );
          }}
          className="absolute bottom-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-lg transition hover:scale-110 hover:bg-cyan-500"
        >
          ↓
        </button>

        <div className="absolute bottom-0 left-0 z-10 w-full p-5">
          <h2 className="text-lg font-bold text-white">{photo.photographer}</h2>
        </div>
      </div>
    </div>
  );
}
