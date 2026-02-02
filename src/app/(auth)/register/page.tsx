"use client";

import { registerAction } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        setError("Something went wrong!");
      }
    } catch {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg border border-slate-200">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              Create your account
            </h1>
            {/* <p className="text-sm text-slate-500">
              Start learning Russian with Russky
            </p> */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              {/* {state?.errors?.email && <p>{state?.errors?.email[0]}</p>} */}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-60"
            >
              {"Create account"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-slate-900 hover:underline"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
