"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-8 shadow-sm">
      <div className="mb-8">
        <Link href="/" className="text-xs uppercase tracking-widest text-stone-500 dark:text-zinc-400 font-semibold hover:text-stone-900 dark:hover:text-zinc-100 transition-colors">
          ← Storefront
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 mt-3">
          Sign in to your account
        </h1>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Enter your credentials to access your account and orders.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-800 dark:text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100 transition-all placeholder:text-stone-400 dark:placeholder:text-zinc-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300" htmlFor="password">
              Password
            </label>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100 transition-all placeholder:text-stone-400 dark:placeholder:text-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-stone-800 dark:hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-stone-100 dark:border-zinc-800 text-center">
        <p className="text-sm text-stone-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-stone-900 dark:text-zinc-100 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-stone-400">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
