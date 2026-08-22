import AuthPopup from "@/components/Ui/AuthPopup";
import { getUserStatus } from "@/services/profile/status";
import { clearAllDownloads } from "@/services/Wallpapers/clearDonwnloads";
import { fetchDownloadedWallpapers } from "@/services/Wallpapers/fetchDownloads";
import { removeFromDownloads } from "@/services/Wallpapers/removeDownload";
import { saveToFavourite } from "@/services/Wallpapers/saveFavourites";
import { PexelsBackendResponse } from "@/types/pexels";
import router from "next/router";
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

  const checkAuthentication = async () => {
    const { status } = await getUserStatus();
    if (status === 401) {
      setShowAuthPopup(true);
      return;
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

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

  const deleteDownload = async (wallpaerId: number, imageUrl: string) => {
    const { ok, data } = await removeFromDownloads(wallpaerId, imageUrl);
    if (ok) {
      getDownloadedWallpapers();
      toast.success(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-500">
            Your Collection
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Your <span className="text-purple-500">Downloads</span>
          </h1>

          <p className="mt-2 text-zinc-500">
            Wallpapers you have downloaded recently.
          </p>
        </div>

        <AuthPopup open={showAuthPopup} close={() => setShowAuthPopup(false)} />

        {loading ? (
          <div className="flex min-h-[55vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-800 border-t-purple-500" />
          </div>
        ) : downloadedWallpapers.length === 0 ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950">
              <span className="text-4xl text-zinc-600">↓</span>
            </div>

            <h2 className="text-2xl font-bold md:text-3xl">No downloads yet</h2>

            <p className="mt-2 text-zinc-500">
              Download wallpapers and they will appear here.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-7 rounded-xl bg-purple-600 px-7 py-3 font-semibold text-white transition hover:bg-purple-500"
            >
              Explore Wallpapers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {downloadedWallpapers.map((wallpaper) => (
              <div
                key={wallpaper.wallpaperId}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40"
              >
                <div className="relative h-[420px] overflow-hidden">
                  <div
                    onClick={() => window.open(wallpaper.imageUrl, "_blank")}
                    className="absolute inset-0 cursor-pointer"
                  >
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.photographer}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavourites(wallpaper);
                    }}
                    disabled={favouriteLoading}
                    className="absolute left-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/50 text-lg backdrop-blur-md transition hover:scale-110 hover:bg-red-500 disabled:cursor-not-allowed"
                  >
                    ❤️
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDownload(wallpaper.wallpaperId, wallpaper.imageUrl);
                    }}
                    className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/50 text-sm text-white backdrop-blur-md transition hover:scale-110 hover:bg-red-500"
                  >
                    ✕
                  </button>

                  <div className="absolute bottom-0 left-0 z-10 w-full p-5">
                    <h2 className="text-lg font-bold text-white">
                      {wallpaper.photographer}
                    </h2>

                    <p className="mt-1 text-xs text-zinc-400">
                      Downloaded wallpaper
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
