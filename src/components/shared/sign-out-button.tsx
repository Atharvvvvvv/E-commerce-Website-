"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 px-2.5 py-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
      title="Sign out of account"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Sign Out</span>
    </button>
  );
}
