import { favourites } from "@/types/favourites";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { unfavouriteWallpaper } from "@/service/unfavourite";
import { fetchFavouriteWallpaper } from "@/service/fetchFavoutites";

export default function Favourites() {
  const [favourites, setFavourites] = useState<favourites[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      setLoading(true);

      const { ok, status, data } = await fetchFavouriteWallpaper();

      if (status === 401) {
        router.push("/login");
        return;
      }
      if (ok) {
        setFavourites(data);
      } else {
        toast.error(data.message);
      }
      //setFourites(data);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const unfavourite = async (wallpaperId: number) => {
    try {
      setDeleteLoader(true);
      const { ok, status, data } = await unfavouriteWallpaper(wallpaperId);

      if (status === 401) {
        router.push("/login");
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
              <div
                key={wallpaper.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/50"
              >
                <div className="relative h-[420px] overflow-hidden">
                  <img
                    src={wallpaper.image_url}
                    alt={wallpaper.photographer ?? "Wallpaper"}
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition group-hover:opacity-100" />

                  <button
                    onClick={() => unfavourite(wallpaper.wallpaper_id)}
                    className="cursor-pointer absolute right-4 top-4 rounded-full bg-red-500/90 p-3 text-white backdrop-blur transition hover:scale-110"
                  >
                    ✖
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-5">
                  <h2 className="text-lg font-bold">
                    {wallpaper.photographer}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
