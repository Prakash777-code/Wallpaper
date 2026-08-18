import AuthPopup from "@/components/Ui/AuthPopup";
import { generateImage } from "@/services/ai/genearteImage";
import { getUserStatus } from "@/services/profile/status";
import { favouriteAiGenerated } from "@/services/Wallpapers/favouriteAiGenerated";
import { AiType } from "@/types/favouriteAi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Crown } from "lucide-react";

export default function Ai() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [aiData, setAiData] = useState<AiType | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const openAuthPopup = () => {
    setShowAuthPopup(true);
  };

  const showComingSoonToast = () => {
    toast("Coming soon 🚀", {
      style: {
        background: "#09090b",
        color: "#fff",
        border: "1px solid #27272a",
      },
    });
  };

  useEffect(() => {
    userStatus();
  }, []);

  const userStatus = async () => {
    const { status } = await getUserStatus();
    if (status === 401) {
      openAuthPopup();
      return;
    }
  };

  const createImage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error("Prompt is required to generate image");
      return;
    }

    try {
      setLoading(true);
      setImageLoading(true);
      setImageUrl("");
      const { ok, status, data } = await generateImage(prompt);

      if (status === 429) {
        if (data.limit && data.used >= data.limit) {
          toast.error(
            "You have reached your daily plan limit upgrade to pro or premium for more image generation",
          );
          setShowUpgrade(true);
          setImageLoading(false)
          return;
        }
      }

      const AiWallpaper: AiType = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        photographer: "Ai generated",
      };

      console.log(AiWallpaper);

      setAiData(AiWallpaper);

      if (!ok) {
        toast.error(data.message || "Failed to generate image");
        return;
      }
      setImageLoading(true);
      setImageUrl(data.imageUrl);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const favourite = async (wallpaper: AiType) => {
    if (!imageUrl) {
      return;
    }
    const { ok, status, data } = await favouriteAiGenerated(wallpaper);
    if (ok) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-purple-500">
            Create Something Unique
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            WallVerse <span className="text-purple-500">AI Studio</span>
          </h1>

          <p className="mt-2 text-zinc-500">
            Generate unique wallpapers with your imagination.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 md:p-7">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A futuristic city with neon lights at night..."
            className="h-40 w-full resize-none rounded-xl border border-zinc-800 bg-black p-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-600"
          />

          <AuthPopup
            open={showAuthPopup}
            close={() => setShowAuthPopup(false)}
          />

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              "Cyberpunk City",
              "Galaxy Space",
              "Dark Mountain",
              "Anime Wallpaper",
              "Ocean Sunset",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setPrompt(item)}
                className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 px-5 py-2 text-sm text-zinc-400 transition hover:border-purple-600 hover:bg-purple-600/10 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>

          {showUpgrade && (
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
              onClick={() => setShowUpgrade(false)}
            >
              <div
                className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setShowUpgrade(false)}
                  className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-zinc-900 text-lg text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white"
                >
                  ×
                </button>

                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                  <Crown size={25} />
                  </div>

                  <h2 className="text-3xl font-bold text-white md:text-4xl">
                    Choose Your Plan
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    Generate more, download better, and unlock exclusive
                    wallpapers.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div className="group rounded-2xl border border-zinc-800 bg-black p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-zinc-600 hover:bg-zinc-950 hover:shadow-2xl hover:shadow-black/60">
                    <p className="text-sm font-medium text-zinc-500">FREE</p>

                    <h3 className="mt-2 text-2xl font-bold text-white">Free</h3>

                    <p className="mt-2 text-sm text-zinc-500">
                      Everything you need to explore WallVerse.
                    </p>

                    <div className="mb-6 mt-6">
                      <span className="text-3xl font-bold text-white">₹0</span>

                      <span className="text-sm text-zinc-600">/month</span>
                    </div>

                    <div className="mb-6 rounded-xl bg-zinc-900 p-4 transition-all duration-300 group-hover:bg-zinc-800">
                      <p className="text-sm text-zinc-500">AI Generations</p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        5
                        <span className="ml-1 text-sm font-normal text-zinc-500">
                          /day
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p className="text-zinc-300">✓ Browse wallpapers</p>

                      <p className="text-zinc-300">✓ Search wallpapers</p>

                      <p className="text-zinc-300">✓ Save favourites</p>

                      <p className="text-zinc-300">✓ HD downloads</p>

                      <p className="text-zinc-300">✓ 5 AI generations/day</p>

                      <p className="text-zinc-600">× Exclusive wallpapers</p>

                      <p className="text-zinc-600">× Premium collections</p>
                    </div>

                    <button
                      disabled
                      className="mt-7 w-full cursor-not-allowed rounded-xl border border-zinc-800 py-3 text-sm font-semibold text-zinc-500"
                    >
                      Current Plan
                    </button>
                  </div>

                  <div className="group relative rounded-2xl border border-purple-600 bg-purple-500/5 p-6 shadow-lg shadow-purple-600/10 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-2xl hover:shadow-purple-600/25">
                    <div className="absolute right-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white transition-transform duration-300 group-hover:scale-105">
                      POPULAR
                    </div>

                    <p className="text-sm font-medium text-purple-400">PRO</p>

                    <h3 className="mt-2 text-2xl font-bold text-white">Pro</h3>

                    <p className="mt-2 text-sm text-zinc-500">
                      For users who create wallpapers regularly.
                    </p>

                    <div className="mb-6 mt-6">
                      <span className="text-3xl font-bold text-white">
                        ₹199
                      </span>

                      <span className="text-sm text-zinc-600">/month</span>
                    </div>

                    <div className="mb-6 rounded-xl bg-purple-500/10 p-4 transition-all duration-300 group-hover:bg-purple-500/15">
                      <p className="text-sm text-zinc-500">AI Generations</p>

                      <p className="mt-1 text-2xl font-bold text-purple-400">
                        20
                        <span className="ml-1 text-sm font-normal text-zinc-500">
                          /24 Hours
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p className="text-zinc-300">✓ Everything in Free</p>

                      <p className="text-zinc-300">✓ 100 AI generations/day</p>

                      <p className="text-zinc-300">
                        ✓ Higher quality generation
                      </p>

                      <p className="text-zinc-300">✓ 4K downloads</p>

                      <p className="text-zinc-300">✓ Exclusive wallpapers</p>

                      <p className="text-zinc-300">✓ Premium collections</p>

                      <p className="text-zinc-600">× Priority generation</p>
                    </div>

                    <button
                      type="button"
                       onClick={showComingSoonToast}
                      className="mt-7 w-full cursor-pointer rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/30 active:scale-95"
                    >
                      Upgrade to Pro
                    </button>
                  </div>

                  <div className="group rounded-2xl border border-pink-500/30 bg-pink-500/5 p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-2xl hover:shadow-pink-500/20">
                    <p className="text-sm font-medium text-pink-400">PREMIUM</p>

                    <h3 className="mt-2 text-2xl font-bold text-white">
                      Premium
                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">
                      The ultimate WallVerse experience.
                    </p>

                    <div className="mb-6 mt-6">
                      <span className="text-3xl font-bold text-white">
                        ₹399
                      </span>

                      <span className="text-sm text-zinc-600">/month</span>
                    </div>

                    <div className="mb-6 rounded-xl bg-pink-500/10 p-4 transition-all duration-300 group-hover:bg-pink-500/15">
                      <p className="text-sm text-zinc-500">AI Generations</p>

                      <p className="mt-1 text-2xl font-bold text-pink-400">
                        50
                        <span className="ml-1 text-sm font-normal text-zinc-500">
                          /24 Hour
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p className="text-zinc-300">✓ Everything in Pro</p>

                      <p className="text-zinc-300">✓ 200 AI generations/day</p>

                      <p className="text-zinc-300">
                        ✓ Highest quality generation
                      </p>

                      <p className="text-zinc-300">✓ 4K downloads</p>

                      <p className="text-zinc-300">✓ Exclusive wallpapers</p>

                      <p className="text-zinc-300">✓ Premium collections</p>

                      <p className="text-zinc-300">✓ Priority generation</p>
                    </div>

                    <button
                      type="button"
                      onClick={showComingSoonToast}
                      className="mt-7 w-full cursor-pointer rounded-xl border border-pink-500/40 bg-pink-500/10 py-3 text-sm font-semibold text-pink-400 transition-all duration-300 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/20 active:scale-95"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-600">
                  AI generation limits reset every day.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => createImage(prompt)}
            disabled={loading}
            className="mt-7 w-full cursor-pointer rounded-xl bg-purple-600 py-4 text-lg font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Wallpaper..." : "Generate Wallpaper ✨"}
          </button>
        </div>

        {(loading || imageLoading) && (
          <div className="mt-10 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-800 border-t-purple-500" />
          </div>
        )}

        {imageUrl && (
          <div className="mt-12">
            <div className="mb-5">
              <p className="text-sm font-medium text-purple-500">
                Generated Wallpaper
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Your <span className="text-purple-500">Creation</span>
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
              <img
                src={imageUrl}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                alt="AI Wallpaper"
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => favourite(aiData!)}
                disabled={loading || imageLoading}
                className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 font-medium text-zinc-300 transition hover:border-purple-600 hover:bg-purple-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ♡ Favourite
              </button>

              <a
                href={loading || imageLoading ? undefined : imageUrl}
                target="_blank"
                onClick={(e) => {
                  if (loading || imageLoading) {
                    e.preventDefault();
                  }
                }}
                className={`rounded-xl border border-zinc-800 px-6 py-3 font-medium transition ${
                  loading || imageLoading
                    ? "pointer-events-none cursor-not-allowed bg-zinc-900 text-zinc-600 opacity-50"
                    : "bg-zinc-900 text-zinc-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white"
                }`}
              >
                Open Image
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
