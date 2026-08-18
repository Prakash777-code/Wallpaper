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
import { getUserStatus } from "@/services/profile/status";

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
  const [upgradePopup, setUpgradePopup] = useState(false);

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

      if (status === 401) {
        openAuthPopup();
        return;
      }

      if (status === 429) {
        toast.error("Too many requests. Please try again later");
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

  const openAuthPopup = () => {
    setShowAuthPopup(true);
  };

  const handleLoadMore = async () => {
    try {
      const { ok, status } = await checkLoadMore();
      if (!ok && status === 401) {
        openAuthPopup();
        return;
      }
      if (status === 200) {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-zinc-900 bg-black/90 px-5 backdrop-blur-xl md:px-8">
            <div className="relative w-full max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-500">
                ⌕
              </span>

              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search wallpapers..."
                className="w-full rounded-full border border-zinc-800 bg-zinc-900/70 py-3 pl-12 pr-5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-600"
              />
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold">
                {userName ? userName.charAt(0).toUpperCase() : "❤️"}
              </div>
            </div>
          </header>

          <section className="px-5 py-8 md:px-8 lg:px-10">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm font-medium text-purple-500">
                  Welcome back{userName ? `, ${userName}` : ""}
                </p>

                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Discover Amazing{" "}
                  <span className="text-purple-500">Wallpapers</span>
                </h2>

                <p className="mt-2 text-zinc-500">
                  Explore. Download. Personalize.
                </p>
              </div>

              <select
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="w-fit rounded-xl border border-zinc-800 bg-black px-5 py-3 text-sm text-zinc-300 outline-none"
              >
                <option value="latest">Latest</option>
                <option value="popular">Popular</option>
                <option value="most-downloaded">Most Downloaded</option>
              </select>
            </div>

            <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setQuery("cars");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "cars"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                All
              </button>

              <button
                onClick={() => {
                  setQuery("nature");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "nature"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                Nature
              </button>

              <button
                onClick={() => {
                  setQuery("cars");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "cars"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                Cars
              </button>

              <button
                onClick={() => {
                  setQuery("anime");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "anime"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                Anime
              </button>

              <button
                onClick={() => {
                  setQuery("minimal");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "minimal"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                Minimal
              </button>

              <button
                onClick={() => {
                  setQuery("space");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "space"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                Space
              </button>

              <button
                onClick={() => {
                  setQuery("city");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "city"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                City
              </button>

              <button
                onClick={() => {
                  setQuery("abstract");
                  setPage(1);
                }}
                className={`shrink-0 cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition ${
                  query === "abstract"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                Abstract
              </button>
            </div>

            {loading && (
              <div className="mb-8 flex items-center justify-center gap-3 text-zinc-400">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />

                <span>Loading wallpapers...</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {" "}
              {Array.isArray(wallpaper) &&
                wallpaper.map((photo) => (
                  <WallpaperCard
                    key={photo.wallpaperId}
                    photo={photo}
                    favouriteLoading={favouriteLoading}
                    handleFavourites={handleFavourites}
                    openAuthPopup={() => setShowAuthPopup(true)}
                  />
                ))}
            </div>

            {!loading && wallpaper.length === 0 && (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-5xl">🔍</div>

                  <h3 className="text-xl font-semibold">No wallpapers found</h3>

                  <p className="mt-2 text-zinc-500">
                    Try searching for something else.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="group flex cursor-pointer items-center gap-3 rounded-full border border-purple-600 px-8 py-3.5 font-medium text-purple-400 transition duration-300 hover:bg-purple-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}

                {!loading && (
                  <span className="transition group-hover:translate-y-1">
                    ↓
                  </span>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>

      <AuthPopup open={showAuthPopup} close={() => setShowAuthPopup(false)} />

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="cursor-pointer fixed bottom-6 right-6 z-[1000] flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/30 bg-purple-600 text-2xl text-white shadow-lg shadow-purple-600/30 transition hover:-translate-y-1 hover:bg-purple-500"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </main>
  );
}
