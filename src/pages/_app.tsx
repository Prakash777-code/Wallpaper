import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hidNavbar = router.pathname === "/login" || router.pathname === "/register";
  return (
    <>
      {!hidNavbar && <Navbar/>}
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </>
  );
}
