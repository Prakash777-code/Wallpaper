import WallpaperCard from "@/components/Cards/WallpaperCard";
import { clearAllDownloads } from "@/services/Wallpapers/clearDonwnloads";
import { downloadWallpaper } from "@/services/Wallpapers/downloadWallpaper";
import { fetchDownloadedWallpapers } from "@/services/Wallpapers/fetchDownloads";
import { saveToFavourite } from "@/services/Wallpapers/saveFavourites";
import { PexelsBackendResponse } from "@/types/pexels";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function Downloads() {
  console.log("Entered download page");
  const [downloadedWallpapers, setDownloadedWallpapers] = useState<
    PexelsBackendResponse[]
  >([]);
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const [loading, setLoading] = useState(false);

  const getDownloadedWallpapers = async () => {
    console.log("Download wallpaper function called");
    try {
      setLoading(true);
      const { ok, status, data } = await fetchDownloadedWallpapers();

      if (!ok) {
        console.log("Error in api");
        return;
      }

      setDownloadedWallpapers(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Downloads mounted");
    getDownloadedWallpapers();
  }, []);

  const handleFavourites = async (wallpaper: PexelsBackendResponse) => {
    try {
      setFavouriteLoading(true);
      const { ok, status, data } = await saveToFavourite(wallpaper);
      if (status === 429) {
        toast.error("Too many request. Please try again later");
        return;
      }
      if (status === 409) {
        toast.error("Wallpaper is already in your favourites");
        return;
      }
      if (ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFavouriteLoading(false);
    }
  };

  const clear = async () => {
    const{ok,status,data} = await clearAllDownloads()
    if(ok){
      fetchDownloadedWallpapers()
      toast.success(data.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Your Downloads</h1>

          <p className="mt-2 text-zinc-400">
            Wallpapers you have downloaded recently.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-500" />
          </div>
        ) : downloadedWallpapers.length === 0 ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="text-center">
              <div className="mb-4 text-6xl">⬇️</div>

              <h2 className="text-2xl font-bold text-white">
                No downloads yet
              </h2>

              <p className="mt-3 text-zinc-400">
                Download wallpapers and they'll appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {downloadedWallpapers.map((wallpaper) => (
              <div
                key={wallpaper.wallpaperId}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-cyan-500/20"
              >
                <div className="relative h-[420px] overflow-hidden">
                  <div
                    onClick={() => window.open(wallpaper.imageUrl, "_blank")}
                    className="absolute inset-0 cursor-pointer"
                  >
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.photographer}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition group-hover:opacity-100" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavourites(wallpaper);
                    }}
                    disabled={favouriteLoading}
                    className="cursor-pointer absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur-lg transition hover:scale-110 hover:bg-red-500 disabled:cursor-not-allowed"
                  >
                    ❤️
                  </button>

                  <div className="absolute bottom-0 left-0 z-10 w-full p-5">
                    <h2 className="text-lg font-bold text-white">
                      {wallpaper.photographer}
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
