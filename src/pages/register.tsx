
import { userRegister } from "@/service/register";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fileds are required to register")
      return;
    }

    if(password.length < 6){
      toast.error("Password must be at least of 6 characters")
      return
    }

    try {
      setLoading(true);
      const{ok,status,data} = await userRegister(name,email,password)

      
      if (ok) {
        toast.success("You are ready to login")
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 return (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">

    <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-blue-600/30 blur-[130px]" />
    <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-600/30 blur-[130px]" />

    <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">

      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-3xl shadow-lg shadow-blue-500/30">
          🚀
        </div>

        <h1 className="text-4xl font-bold text-white">
          Create Account
        </h1>

        <p className="mt-2 text-slate-300">
          Join us and start exploring a universe of wallpapers
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Full Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/10"
          />
        </div>

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
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/10"
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
            placeholder="wallverse123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-white/10" />
        <span className="px-3 text-sm text-slate-400">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-sm text-slate-300">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="cursor-pointer font-semibold text-blue-400 transition hover:text-blue-300"
        >
          Sign In
        </button>
      </p>

    </div>
  </main>
);
}
