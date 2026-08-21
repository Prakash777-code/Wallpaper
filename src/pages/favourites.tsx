import { favourites } from "@/types/favourites";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { unfavouriteWallpaper } from "@/services/Wallpapers/unfavourite";
import { fetchFavouriteWallpaper } from "@/services/Wallpapers/fetchFavoutites";
import FavouriteWallpaperCard from "@/components/Cards/FavouriteCard";
import AuthPopup from "@/components/Ui/AuthPopup";
import { getUserStatus } from "@/services/profile/status";

export default function Favourites() {
  const [favourites, setFavourites] = useState<favourites[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchFavourites();
  }, []);

  const openAuthPopup = () => {
    setShowAuthPopup(true);
  };

  const fetchFavourites = async () => {
    const { status } = await getUserStatus();
    if (status === 401) {
      openAuthPopup();
      return;
    }
    try {
      setLoading(true);

      const { ok, status, data } = await fetchFavouriteWallpaper();

      if (!ok) {
        if (status === 401) {
          openAuthPopup();
          return;
        }
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

      if (status === 429) {
        toast.error("Too many requets. Please try again later");
        return;
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
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-purple-500">
              Your Collection
            </p>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Your <span className="text-purple-500">Favourites</span>
            </h1>

            <p className="mt-2 text-zinc-500">
              {favourites.length} saved wallpapers
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-fit rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-purple-600 hover:bg-purple-600 hover:text-white"
          >
            Explore Wallpapers
          </button>
        </div>

        <AuthPopup open={showAuthPopup} close={() => setShowAuthPopup(false)} />

        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-800 border-t-purple-500" />
          </div>
        ) : favourites.length === 0 ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950">
              <span className="text-4xl text-zinc-600">♡</span>
            </div>

            <h2 className="text-2xl font-bold md:text-3xl">
              No favourites yet
            </h2>

            <p className="mt-2 max-w-md text-zinc-500">
              Save wallpapers you love and they will appear here.
            </p>

            <button
              onClick={() => router.push("/")}
              className="cursor-pointer mt-7 rounded-xl bg-purple-600 px-7 py-3 font-semibold  "
            >
              Explore Wallpapers
            </button>
          </div>
        ) : (
         <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
