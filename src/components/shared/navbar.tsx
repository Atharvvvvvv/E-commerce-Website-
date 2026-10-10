import { auth } from "@/lib/auth";
import Link from "next/link";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { CartBadge } from "@/components/shared/cart-badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NavbarSearch } from "@/components/shared/navbar-search";
import { ShieldCheck, Package } from "lucide-react";
import { Suspense } from "react";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#151518]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-zinc-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-stone-900 dark:text-zinc-100 hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <span>AESTHETE</span>
            <span className="text-stone-400 dark:text-zinc-500 font-light text-sm">STORE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400">
            <Link
              href="/products"
              className="hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
            >
              Catalog
            </Link>
            <Link
              href="/products?category=electronics"
              className="hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
            >
              Tech
            </Link>
            <Link
              href="/products?category=apparel"
              className="hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
            >
              Apparel
            </Link>
            <Link
              href="/products?category=home-living"
              className="hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
            >
              Living
            </Link>
          </nav>
        </div>

        {/* Center: Search Field */}
        <div className="hidden sm:flex flex-1 max-w-xs md:max-w-sm justify-center">
          <Suspense fallback={<div className="w-full h-8 bg-stone-100 dark:bg-zinc-800 rounded-full animate-pulse" />}>
            <NavbarSearch />
          </Suspense>
        </div>

        {/* Right: Actions, Theme, Cart & Account */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <ThemeToggle />
          <CartBadge />

          <div className="h-4 w-px bg-stone-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          {session?.user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              <Link
                href="/orders"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-zinc-100 px-2 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-zinc-800/80 transition-colors"
                title="View your orders"
              >
                <Package className="w-4 h-4 text-stone-500 dark:text-zinc-400" />
                <span className="hidden md:inline">Orders</span>
              </Link>

              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-zinc-100 px-2.5 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-zinc-800/80 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-stone-800 dark:hover:bg-zinc-200 px-3 py-1.5 rounded-md transition-colors"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
