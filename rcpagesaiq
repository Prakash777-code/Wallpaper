import { generateImage } from "@/services/ai/genearteImage";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Ai() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const createImage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error("Prompt is required to generate image");
      return;
    }

    try {
      setLoading(true);
      setImageLoading(true);
      setImageUrl("")
      const { ok, status, data } = await generateImage(prompt);

      if (status === 429) {
        toast.error("You have reached your free image generator plan");
        return;
      }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Wallverse AI Studio ✨
          </h1>

          <p className="mt-4 text-zinc-400">
            Generate unique wallpapers with your imagination
          </p>
        </div>

        <div className="mt-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: A futuristic city with neon lights at night..."
            className="
              w-full
              h-40
              rounded-2xl
              bg-black/40
              border
              border-white/10
              p-5
              text-white
              placeholder:text-zinc-500
              outline-none
              focus:border-purple-500
              transition
              resize-none
            "
          />

          <div className="flex flex-wrap gap-3 mt-5">
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
                className="
                  px-5
                  py-2
                  rounded-full
                  bg-white/10
                  border
                  border-white/10
                  text-sm
                  hover:bg-white/20
                  transition
                "
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => createImage(prompt)}
            disabled={loading}
            className="
              mt-8
              w-full
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-purple-600
              via-pink-500
              to-blue-600
              font-semibold
              text-lg
              shadow-lg
              hover:scale-[1.02]
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Creating Wallpaper..." : "Generate Wallpaper ✨"}
          </button>
        </div>

        {(loading || imageLoading) && (
          <div className="mt-10 flex justify-center">
            <div className="h-12 w-12 border-4 border-zinc-700 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        {imageUrl && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-5">Your Creation</h2>

            <div
              className="
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              shadow-2xl
            "
            >
              <img
                src={imageUrl}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                alt="AI Wallpaper"
                className="
                  w-full
                  aspect-video
                  object-cover
                "
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  hover:bg-white/20
                "
              >
                ♡ Favourite
              </button>

              <a
                href={imageUrl}
                target="_blank"
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                  hover:bg-white/20
                "
              >
                Open Image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
