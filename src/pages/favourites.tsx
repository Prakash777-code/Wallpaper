import { favourites } from "@/types/favourites";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { unfavouriteWallpaper } from "@/services/Wallpapers/unfavourite";
import { fetchFavouriteWallpaper } from "@/services/Wallpapers/fetchFavoutites";
import FavouriteWallpaperCard from "@/components/Cards/FavouriteCard";
import AuthPopup from "@/components/Ui/AuthPopup";

export default function Favourites() {
  const [favourites, setFavourites] = useState<favourites[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      setLoading(true);

      const { ok, status, data } = await fetchFavouriteWallpaper();

      if (!ok) {
        toast.error(data.message);
        return;
      }
      console.log(data);
      setFavourites(data.data);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const unfavourite = async (wallpaperId: string) => {
    try {
      setDeleteLoader(true);
      const { ok, status, data } = await unfavouriteWallpaper(wallpaperId);

      if(status === 429){
        toast.error("Too many requets. Please try again later")
        return
      }

      if (ok) {
        toast.success(data.message);
        fetchFavourites();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove wallpaper");
    } finally {
      setDeleteLoader(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-white">
              Your Favourites ❤️
            </h1>

            <p className="mt-2 text-slate-400">
              {favourites.length} saved wallpapers
            </p>
          </div>
        </div>

        <AuthPopup open={showAuthPopup} close={() => setShowAuthPopup(false)} />

        {loading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
          </div>
        ) : favourites.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center">
            <div className="text-7xl">💔</div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              No favourites yet
            </h2>

            <p className="mt-2 text-slate-400">
              Save wallpapers and they'll appear here.
            </p>

            <button
              onClick={() => router.push("/")}
              className=" cursor-pointer mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3 font-semibold text-white transition hover:scale-105"
            >
              Explore Wallpapers
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favourites.map((wallpaper) => (
              <FavouriteWallpaperCard
                key={wallpaper.id}
                wallpaper={wallpaper}
                unfavourite={unfavourite}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
