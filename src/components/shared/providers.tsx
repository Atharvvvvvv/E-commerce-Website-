"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="aesthete_theme"
    >
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
