import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Download, Heart, Home, Sparkles, User, X } from "lucide-react";
import { getUserStatus } from "@/services/profile/status";

interface SideDrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SideDrawer({ open, setOpen }: SideDrawerProps) {
  const [showLoginButton, setShowLoginButton] = useState(false);
  const checkAuthenticated = async () => {
    const { ok,status } = await getUserStatus();
    if(!ok){
      if(status === 401){
        setShowLoginButton(true)
      }else{
        setShowLoginButton(false)
      }
    }
  };

  useEffect(() => {
    checkAuthenticated()
  },[])
  const router = useRouter();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/favourites", label: "Favourites", icon: Heart },
    { href: "/ai", label: "AI", icon: Sparkles },
    { href: "/downloads", label: "Downloads", icon: Download },
    { href: "/profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 border-r border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-2xl font-bold text-cyan-400">WallVerse</h2>

          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-lg p-2 text-white hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 flex h-[calc(100%-96px)] flex-col px-4">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 text-lg font-medium transition-all duration-300 ${
                    router.pathname === link.href
                      ? "bg-cyan-500 text-white"
                      : "text-white hover:translate-x-2 hover:bg-white/10"
                  }`}
                >
                  <Icon size={22} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {showLoginButton && (
            <div className="mt-auto pb-6">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
                className="w-full cursor-pointer rounded-xl bg-cyan-500 px-4 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-cyan-600"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
