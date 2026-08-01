import { useEffect, useState } from "react";
import { PexelsBackendResponse, PexelsPhoto } from "@/types/pexels";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getPexelsWallpaper } from "@/services/Wallpapers/pexelsWallpaper";
import { saveToFavourite } from "@/services/Wallpapers/saveFavourites";
import { getUserProfile } from "@/services/profile/fetchProfile";
import WallpaperCard from "@/components/Cards/WallpaperCard";
import AuthPopup from "@/components/Ui/AuthPopup";
import { UserProfile } from "@/types/profile";
import { checkLoadMore } from "@/services/Wallpapers/loadMore";

export default function Home() {
  const [wallpaper, setWallpaper] = useState<PexelsBackendResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("cars");
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [page, setPage] = useState(1);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [profile, setProfile] = useState<UserProfile>();
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 900) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const savedQuery = localStorage.getItem("query");
    if (savedQuery) {
      setQuery(savedQuery);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("query", query);
  }, [query]);

  useEffect(() => {
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    const { ok, status, data } = await getUserProfile();
    if (!ok) {
      return;
    }
    setUserName(data.data.name);
  };

  useEffect(() => {
    console.log("Entered useeffect");
    if (!query.trim()) {
      console.log("query is empty");
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      console.log("Calling api");
      try {
        setLoading(true);
        const { ok, status, data } = await getPexelsWallpaper(
          query,
          page,
          controller.signal,
        );

        console.log(data.data);

        if (status === 429) {
          toast.error(data.message);
          return;
        }

        if (!ok) {
          toast.error(data.message);
          return;
        }
        if (page === 1) {
          setWallpaper(data.data);
        } else {
          setWallpaper((prev) => [...prev, ...data.data]);
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
  }, [query, page]);

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

  const handleLoadMore = async () => {
    try {
      const { ok, status, data } = await checkLoadMore();
      if(!ok){
        if(status === 401){
          setShowAuthPopup(true)
        }
      }
      if (status === 200) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
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
            <span className="text-xl">👋 </span>
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text font-bold text-transparent">
              {userName}
            </span>
          </div>
        </div>
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
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-xl border border-white/10 bg-white/10 px-6 py-4 text-lg backdrop-blur-lg outline-none transition focus:border-cyan-400"
          />
        </div>

        <AuthPopup open={showAuthPopup} close={() => setShowAuthPopup(false)} />

        {loading && (
          <p className="mb-8 text-center text-xl">Loading wallpapers...</p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.isArray(wallpaper) &&
            wallpaper.map((photo) => (
              <WallpaperCard
                key={photo.wallpaperId}
                photo={photo}
                favouriteLoading={favouriteLoading}
                handleFavourites={handleFavourites}
              />
            ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="cursor-pointer fixed bottom-6 right-6 z-[1000] h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </main>
  );
}
