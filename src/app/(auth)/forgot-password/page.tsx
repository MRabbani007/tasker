"use client";

import { useState } from "react";
import Link from "next/link";
import { MdOutlineTaskAlt } from "react-icons/md";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPasswordAction } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Replace with your actual forgot password action
      await forgotPasswordAction(null, formData);

      setSubmitted(true);
    } catch {
      setError("We couldn't find an account with that email address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50/50 px-4 py-12">
      <div className="w-full max-w-100">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
              <MdOutlineTaskAlt size={24} />
            </div>
            <span className="font-bold text-2xl text-slate-900 tracking-tight">
              Tasker
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            We&apos;ll send you a link to get back into your account
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors pt-2"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </form>
          ) : (
            <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Check your email
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We&apos;ve sent a password reset link to your email address.
                  Please check your inbox (and spam folder).
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                Didn&apos;t receive it? Try again
              </button>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
