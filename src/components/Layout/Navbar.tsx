import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import SideDrawer from "./SideDrawer";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/90 backdrop-blur-xl">
        <nav className="flex h-16 items-center px-4">

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            <Menu size={26} />
          </button>

          <Link
            href="/"
            className="ml-3 text-xl font-bold text-white"
          >
            Wall<span className="text-purple-500">Verse</span>
          </Link>

        </nav>
      </header>

      <SideDrawer
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}