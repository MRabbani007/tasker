"use client";

import { registerAction } from "@/lib/auth/actions";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineTaskAlt } from "react-icons/md";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await registerAction(null, formData);

      if (res.status === 200) {
        router.push("/dashboard");
      } else if (res.status === 400 || res.status === 403) {
        setError("Invalid email or password");
      } else {
        setError("Could not create account. Please check your details.");
      }
    } catch {
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50/50 px-4 py-12">
      <div className="w-full max-w-110">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
              <MdOutlineTaskAlt size={24} />
            </div>
            <span className="font-bold text-2xl text-slate-900 tracking-tight">
              Tasker
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Join 10,000+ users mastering their daily focus
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm outline-none ring-indigo-600/10 transition-all focus:border-indigo-600 focus:bg-white focus:ring-4"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm outline-none ring-indigo-600/10 transition-all focus:border-indigo-600 focus:bg-white focus:ring-4"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm outline-none ring-indigo-600/10 transition-all focus:border-indigo-600 focus:bg-white focus:ring-4"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-rose-50 p-3 border border-rose-100">
                <p className="text-xs font-bold text-rose-600 text-center">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Social Proof / Benefit */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 p-2 rounded-lg">
              <CheckCircle2 size={14} className="text-emerald-500" />
              No credit card required to start
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
