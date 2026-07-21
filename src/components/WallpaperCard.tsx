import Image from "next/image";
import { PexelsPhoto } from "@/types/pexels";

type WallpaperCardProps = {
  photo: PexelsPhoto;
  favouriteLoading: boolean;
  handleFavourites: (photo: PexelsPhoto) => void;
};

export default function WallpaperCard({
  photo,
  favouriteLoading,
  handleFavourites,
}: WallpaperCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-cyan-500/20">
      <div
        onClick={() => window.open(photo.src.large, "_blank")}
        className="relative h-[420px] cursor-pointer overflow-hidden"
      >
        <Image
          src={photo.src.large}
          alt={photo.photographer}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition group-hover:opacity-100" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavourites(photo);
          }}
          disabled={favouriteLoading}
          className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/20 p-3 text-xl backdrop-blur-lg transition hover:scale-110 hover:bg-red-500"
        >
          ❤️
        </button>

        <div className="absolute bottom-0 left-0 w-full p-5">
          <h2 className="text-lg font-bold text-white">{photo.photographer}</h2>
        </div>
      </div>
    </div>
  );
}