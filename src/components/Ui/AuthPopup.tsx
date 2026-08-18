import { useRouter } from "next/router";
import { Sparkles, X } from "lucide-react";

type AuthPopupProps = {
  open: boolean;
  close: () => void;
};

export default function AuthPopup({ open, close }: AuthPopupProps) {
  const router = useRouter();

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#080808] p-8 text-center shadow-2xl shadow-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            (close(), router.push("/"));
          }}
          className="absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500 transition-all duration-300 hover:border-purple-600/50 hover:bg-purple-600/10 hover:text-purple-400"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-600/10">
          <Sparkles size={30} />
        </div>

        <h2 className="text-3xl font-bold text-white">Explore WallVerse</h2>

        <p className="mt-3 leading-6 text-zinc-400">
          Create a free account to save your favourite wallpapers, generate AI
          wallpapers, download wallpapers, and enjoy the full WallVerse
          experience.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="flex-1 cursor-pointer rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/30"
          >
            Register Free
          </button>

          <button
            type="button"
            onClick={() => {
              (close(), router.push("/"));
            }}
            className="flex-1 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 font-semibold text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800 hover:text-white"
          >
            Maybe Later
          </button>
        </div>

        <p className="mt-5 text-xs text-zinc-600">
          Free account • No credit card required
        </p>
      </div>
    </div>
  );
}
