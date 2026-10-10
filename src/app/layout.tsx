import { Navbar } from "@/components/shared/navbar";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

export const metadata = {
  title: "AESTHETE | Curated Contemporary Goods",
  description: "Minimalist, high-durability essentials for daily life and workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans transition-colors duration-200">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#161619] py-12 text-center text-xs text-stone-500 dark:text-zinc-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 AESTHETE.STORE. Built for precision & endurance.</p>
              <div className="flex gap-6">
                <span>Secure Next.js Checkout</span>
                <span>•</span>
                <span>PostgreSQL & Prisma</span>
                <span>•</span>
                <span>Role-Based Access</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
