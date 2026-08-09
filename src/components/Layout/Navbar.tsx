import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import SideDrawer from "./SideDrawer";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 items-center px-5">
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer rounded-lg p-2 text-white transition hover:bg-white/10"
          >
            <Menu size={28} />
          </button>

          <Link
            href="/"
            className="ml-4 text-2xl font-bold tracking-wide text-cyan-400"
          >
            WallVerse
          </Link>
        </nav>
      </header>

      <SideDrawer open={open} setOpen={setOpen} />
    </>
  );
}