import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search, category, sort } = await searchParams;

  // Build Prisma where clause
  const whereClause: {
    isActive: boolean;
    name?: { contains: string; mode: "insensitive" };
    category?: { slug: string };
  } = {
    isActive: true,
  };

  if (search) {
    whereClause.name = { contains: search, mode: "insensitive" };
  }

  if (category && category !== "all") {
    whereClause.category = { slug: category };
  }

  // Sorting logic
  let orderBy: { createdAt?: "desc" | "asc"; price?: "asc" | "desc" } = { createdAt: "desc" };
  if (sort === "price-low") {
    orderBy = { price: "asc" };
  } else if (sort === "price-high") {
    orderBy = { price: "desc" };
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy: orderBy,
      include: { category: true },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 dark:border-zinc-800 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Catalog
          </h1>
          <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
            Browse our full range of curated products ({products.length} {products.length === 1 ? "item" : "items"}).
          </p>
        </div>

        {/* Filter & Search Form */}
        <form method="GET" className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search products..."
              className="pl-9 pr-3 py-2 text-sm bg-white dark:bg-[#1c1c20] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 w-48 sm:w-64"
            />
          </div>

          <select
            name="category"
            defaultValue={category || "all"}
            className="px-3 py-2 text-sm bg-white dark:bg-[#1c1c20] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="sort"
            defaultValue={sort || "newest"}
            className="px-3 py-2 text-sm bg-white dark:bg-[#1c1c20] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </button>

          {(search || (category && category !== "all") || sort) && (
            <Link
              href="/products"
              className="px-3 py-2 text-xs font-semibold text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 underline"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1c1c20] border border-dashed border-stone-300 dark:border-zinc-800 rounded-lg">
          <p className="text-stone-500 dark:text-zinc-400 text-sm font-medium">
            No products matched your search or category filter.
          </p>
          <div className="mt-4">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-zinc-200 rounded-md hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Clear filters and view all
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
      )}
    </div>
  );
}
