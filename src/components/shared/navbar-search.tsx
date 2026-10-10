"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

export function NavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(currentSearch);
  const [, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      if (query.trim()) {
        router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/products");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <Search className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search catalog..."
        className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-100/80 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-300 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 transition-all"
      />
    </form>
  );
}
