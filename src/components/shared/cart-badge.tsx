"use client";

import { useCart } from "@/context/cart-context";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CartBadge() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative p-2 text-stone-700 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-zinc-100 rounded-md hover:bg-stone-100 dark:hover:bg-zinc-800/80 transition-colors inline-flex items-center"
      aria-label="View shopping cart"
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span
          key={itemCount}
          className="absolute -top-0.5 -right-0.5 bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm animate-badge-pop"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
