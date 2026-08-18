import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Download, Heart, Home, Sparkles, User, X, Crown } from "lucide-react";
import { getUserStatus } from "@/services/profile/status";
import toast from "react-hot-toast";

interface SideDrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SideDrawer({ open, setOpen }: SideDrawerProps) {
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [notAuthenticated, setNotAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();

  const closeDrawer = () => {
    setOpen(false);
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
    const checkAuthenticated = async () => {
      try {
        const { ok, status } = await getUserStatus();

        if (!ok && status === 401) {
          setNotAuthenticated(true);
          setShowLoginButton(true);
          setAuthChecked(true);
          return;
        }

        setShowLoginButton(false);
        setAuthChecked(true);
      } catch (error) {
        console.log(error);
      }
    };

    checkAuthenticated();
  }, []);

  useEffect(() => {
    if (open || showUpgrade) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, showUpgrade]);

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/favourites",
      label: "Favourites",
      icon: Heart,
    },
    {
      href: "/ai",
      label: "AI Generated",
      icon: Sparkles,
    },
    {
      href: "/downloads",
      label: "Downloads",
      icon: Download,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <>
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[9990] bg-black/70 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-[9999] h-screen w-72 bg-[#080808] shadow-2xl shadow-black transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-800 px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
                <span className="text-xl text-white">◈</span>
              </div>

              <h2 className="text-2xl font-bold text-white">
                Wall<span className="text-purple-500">Verse</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-white transition hover:border-purple-500 hover:bg-purple-600"
              aria-label="Close drawer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
              Menu
            </p>

            <nav className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;

                const isActive =
                  link.href === "/"
                    ? router.pathname === "/"
                    : router.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeDrawer}
                    className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? "border-l-2 border-purple-500 bg-purple-500/10 text-purple-400"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    <Icon size={21} strokeWidth={isActive ? 2.5 : 2} />

                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-600/50 hover:bg-zinc-900 hover:shadow-xl hover:shadow-purple-600/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Crown size={21} />
                </div>

                <h3 className="font-semibold text-white">Go Premium</h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Unlock exclusive wallpapers and features.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();

                    if (!authChecked) {
                      return;
                    }

                    if (showLoginButton) {
                      router.push("/login");
                      return;
                    }

                    setShowUpgrade(true);
                  }}
                  className="mt-4 w-full cursor-pointer rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/30 active:scale-95"
                >
                  Upgrade Now
                </button>
              </div>

              {showLoginButton && (
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    router.push("/login");
                  }}
                  className="mt-3 w-full cursor-pointer rounded-xl border border-purple-600/50 bg-purple-600/10 px-4 py-3 font-semibold text-purple-400 transition-all duration-300 hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-600/20 active:scale-95"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {showUpgrade && !notAuthenticated && (
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
                Generate more, download better, and unlock exclusive wallpapers.
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
                  <span className="text-3xl font-bold text-white">₹199</span>

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

                  <p className="text-zinc-300">✓ Higher quality generation</p>

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

                <h3 className="mt-2 text-2xl font-bold text-white">Premium</h3>

                <p className="mt-2 text-sm text-zinc-500">
                  The ultimate WallVerse experience.
                </p>

                <div className="mb-6 mt-6">
                  <span className="text-3xl font-bold text-white">₹399</span>

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

                  <p className="text-zinc-300">✓ Highest quality generation</p>

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
    </>
  );
}
