import { handleUserLogin } from "@/service/login";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      setLoading(true);
      const{ok,status,data} = await handleUserLogin(email,password)
      if(status === 401){
        toast.error(data.message)
        return
      }
      if (ok) {
        router.push("/");
      } else {
        console.log(status);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-purple-600/30 blur-[120px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Welcome Back 👋</h1>

          <p className="mt-2 text-slate-300">Login to continue exploring wallpapers</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="wallverse@gmail.com"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white/10"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="wallverse"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/40 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-white/10" />
          <span className="px-3 text-sm text-slate-400">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <p className="text-center text-sm text-slate-300">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="cursor-pointer font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Create one
          </button>
        </p>
      </div>
    </main>
  );
}
