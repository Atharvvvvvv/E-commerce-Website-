import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      {/* Hero Section */}
      <section className="border-b border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#161619] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-zinc-400 font-semibold mb-3 block">
              Curated Workspace & Apparel
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 leading-[1.15]">
              Designed for utility. Crafted for longevity.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-zinc-300 leading-relaxed">
              Explore essential instruments, premium knitwear, and tactile desk artifacts engineered with uncompromised material discipline.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
              >
                Explore Full Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=electronics"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 text-sm font-semibold hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Electronics & Hardware
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-100">Featured Categories</h2>
          <Link href="/products" className="text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="p-5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c20] hover:border-stone-400 dark:hover:border-zinc-600 hover:shadow-xs transition-all block group"
            >
              <h3 className="font-semibold text-stone-900 dark:text-zinc-100 group-hover:text-stone-600 dark:group-hover:text-zinc-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                {cat._count.products} products available
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
              Latest Additions
            </h2>
            <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
              Freshly stocked items ready for dispatch.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-stone-900 dark:text-zinc-100 hover:text-stone-600 dark:hover:text-zinc-300 inline-flex items-center gap-1"
          >
            All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price.toString()}
              stock={product.stock}
              imageUrl={product.imageUrl}
              categoryName={product.category.name}
            />
          ))}
        </div>
      </section>

      {/* Quality Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border border-stone-200 dark:border-zinc-800 bg-white dark:bg-[#1c1c20] rounded-lg p-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-stone-100 dark:bg-zinc-800 rounded-lg shrink-0">
              <Truck className="w-5 h-5 text-stone-800 dark:text-zinc-200" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-zinc-100">Swift Dispatch</h4>
              <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Orders packaged and shipped within 24 hours of placement.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-stone-100 dark:bg-zinc-800 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5 text-stone-800 dark:text-zinc-200" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-zinc-100">Authenticity Guarantee</h4>
              <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                All components manufactured directly with verified artisans.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-stone-100 dark:bg-zinc-800 rounded-lg shrink-0">
              <RefreshCw className="w-5 h-5 text-stone-800 dark:text-zinc-200" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 dark:text-zinc-100">Reliable Returns</h4>
              <p className="text-xs text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                Simple cancellation and order tracking right from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
