import { useRouter } from "next/router";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 text-3xl">
          🚀
        </div>

        <h2 className="text-3xl font-bold text-white">
          Explore Unlimited
        </h2>

        <p className="mt-3 text-slate-300">
          Register for free to unlock unlimited wallpapers, save your
          favourites, and enjoy the full experience.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer flex-1 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400 transition-all duration-300 hover:-translate-y-1"
          >
            Register Free
          </button>

          <button
            onClick={() => {
              close();
              router.push("/");
            }}
            className="cursor-pointer flex-1 rounded-xl border border-white/20 px-5 py-3 font-semibold text-slate-300 transition hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}