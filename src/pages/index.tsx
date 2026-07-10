import Image from "next/image";
import { useEffect, useState } from "react";
import { PexelsPhoto, PexelsResponse } from "@/types/pexels";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getPexelsWallpaper } from "@/service/pexelsWallpaper";
import { getUserName, logout } from "@/service/auth";
import { saveToFavourite } from "@/service/saveFavourites";

export default function Home() {
  const [wallpaper, setWallpaper] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("cars");
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [userName, setUserName] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      const { ok, data } = await logout();
      if (ok) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserName = async () => {
    const res = await getUserName();
    if (res?.ok) {
      const data = await res.json();
      setUserName(data.userName);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getPexelsWallpaper(query, controller.signal);
        if (data) {
          setWallpaper(data.photos);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleFavourites = async (wallpaper: PexelsPhoto) => {
    try {
      setFavouriteLoading(true);
      const { ok, status, data } = await saveToFavourite(wallpaper);

      if (status === 401) {
        router.push("/login");
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Explore Universe of Wallpapers
          </h1>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/10 px-5 py-2 shadow-lg backdrop-blur-md">
            <span className="text-xl">👋</span>
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text font-bold text-transparent">
              {userName}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40"
        >
          Logout
        </button>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-3 text-center text-5xl font-extrabold">
          Find Your Perfect
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            {" "}
            Wallpaper
          </span>
        </h1>

        <p className="mb-10 text-center text-gray-400">
          Search millions of beautiful wallpapers from Wallverse.
        </p>

        <div className="mx-auto mb-12 flex max-w-3xl gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/10 px-6 py-4 text-lg backdrop-blur-lg outline-none transition focus:border-cyan-400"
          />

          <button
            //onClick={fetchWallpaper}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/40 active:scale-95"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="mb-8 text-center text-xl">Loading wallpapers...</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wallpaper?.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-cyan-500/20"
            >
              <div onClick={() => window.open(photo.src.large, "_blank")} className="cursor-pointer relative h-[420px] overflow-hidden">
                <Image
                  src={photo.src.large}
                  alt={photo.photographer}
                  fill
                  className="cursor-pointer object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition group-hover:opacity-100" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavourites(photo)}
                  }
                  disabled={favouriteLoading}
                  className="cursor-pointer absolute right-4 top-4 rounded-full bg-white/20 p-3 text-xl backdrop-blur-lg transition hover:scale-110 hover:bg-red-500"
                >
                  ❤️
                </button>

                <div className="absolute bottom-0 left-0 w-full p-5">
                  <h2 className="text-lg font-bold">{photo.photographer}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && wallpaper.length === 0 && (
          <div className="mt-24 text-center text-gray-400">
            <h2 className="mb-2 text-3xl font-bold">
              Search Something Amazing ✨
            </h2>

            <p>Nature, Cars, Anime, Mountains, Space...</p>
          </div>
        )}
      </div>
    </main>
  );
}
