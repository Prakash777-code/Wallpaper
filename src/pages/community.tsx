import WallpaperCard from "@/components/Cards/WallpaperCard";
import { fetchCommunityWallpapers } from "@/services/Wallpapers/coomunityWallpapers";
import { saveToFavourite } from "@/services/Wallpapers/saveFavourites";
import { CommunityResponse } from "@/types/community";
import { PexelsBackendResponse } from "@/types/pexels";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Community() {
  const [communityWallpapers, setCommunityWallpapers] = useState<
    CommunityResponse[]
  >([]);
  const [loader, setLoader] = useState(false);
  const [favouriteLoader, setFavouriteLoader] = useState(false);

  useEffect(() => {
    getCommunityWallpapers();
  }, []);

  const getCommunityWallpapers = async () => {
    try {
      setLoader(true);
      const { ok, status, data } = await fetchCommunityWallpapers();

      if (ok) {
        setCommunityWallpapers(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleFavourite = async (wallpaper: PexelsBackendResponse) => {
    try {
      setFavouriteLoader(true);
      const { ok, status, data } = await saveToFavourite(wallpaper);

      if(ok){
        toast.success(data.message)
      }

      if(status === 409){
        toast.error(data.message)
        return 
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-purple-400">
            WallVerse Community
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Community Wallpapers
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Discover wallpapers shared by the WallVerse community.
          </p>
        </div>

        {loader ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-purple-500" />
          </div>
        ) : communityWallpapers.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/50 px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-2xl">
              🖼️
            </div>

            <h2 className="text-xl font-semibold">
              No community wallpapers yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-zinc-500">
              Be the first person to share a wallpaper with the WallVerse
              community.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {" "}
            {Array.isArray(communityWallpapers) &&
              communityWallpapers.map((photo) => (
                <WallpaperCard
                  key={photo.id}
                  photo={{
                    wallpaperId: photo.id,
                    imageUrl: photo.imageUrl,
                    photographer: photo.userName,
                  }}
                  favouriteLoading={favouriteLoader}
                  handleFavourites={handleFavourite}
                  openAuthPopup={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
