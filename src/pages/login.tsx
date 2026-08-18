import { handleUserLogin } from "@/services/auth/login";
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
      toast.error("Email and password are required to login");
      return;
    }

    try {
      setLoading(true);
      const { ok, status, data } = await handleUserLogin(email, password);
      if (status === 429) {
        toast.error(data.message);
        return;
      }
      if (ok) {
        router.replace("/");
      } else {
        toast.error("Invalid email or password");
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-purple-600/10 blur-[140px]" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-pink-600/10 blur-[140px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-zinc-900 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold shadow-lg shadow-purple-600/20">
            W
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Login to continue exploring wallpapers
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
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
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-600 focus:bg-zinc-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-600 focus:bg-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-purple-600 py-3 font-semibold text-white transition duration-300 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-600/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-zinc-900" />

          <span className="px-3 text-xs uppercase tracking-widest text-zinc-600">
            or
          </span>

          <div className="h-px flex-1 bg-zinc-900" />
        </div>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="cursor-pointer font-semibold text-purple-500 transition hover:text-purple-400"
          >
            Create one
          </button>
        </p>
      </div>
    </main>
  );
}
