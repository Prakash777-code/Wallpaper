import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  function pushToLogin() {
    router.push("/login");
  }
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 shadow-2xl">
      <nav className="relative mx-auto flex max-w-7xl items-center px-8 py-4">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide text-white transition duration-300 hover:scale-105"
        >
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            WallVerse
          </span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-2 py-2 backdrop-blur-md">
          <Link
            href="/"
            className="rounded-full px-5 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/50"
          >
            🏠 Home
          </Link>

          <Link
            href="/favourites"
            className="rounded-full px-5 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/50"
          >
            ❤️ Favourites
          </Link>
        </div>
      </nav>
    </header>
  );
}
