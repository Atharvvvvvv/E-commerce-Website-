import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

import { SafeImage } from "@/components/ui/safe-image";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/products");
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-zinc-800 pb-5">
          <div>
            <Link
              href="/admin"
              className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 inline-flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Overview
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
              Product Inventory Management
            </h1>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
              Manage product listings, pricing, stock levels, and store visibility.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-xs font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </div>

        <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs">
          {products.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 dark:text-zinc-400">
              No products found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-zinc-800/60 text-stone-500 dark:text-zinc-400 font-semibold border-b border-stone-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-3.5">Product</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Stock</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-zinc-800 text-stone-800 dark:text-zinc-200">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-zinc-800/40">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <SafeImage
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-9 h-9 object-cover rounded bg-stone-100 dark:bg-zinc-800 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-zinc-100">{p.name}</span>
                            <span className="block text-[11px] text-stone-400 dark:text-zinc-500 font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">{p.category.name}</td>
                      <td className="px-6 py-3.5 font-semibold text-stone-900 dark:text-zinc-100">
                        {formatCurrency(Number(p.price))}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`font-medium ${
                            p.stock <= 5 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-stone-800 dark:text-zinc-200"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.isActive
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                              : "bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-400"
                          }`}
                        >
                          {p.isActive ? "Active" : "Draft / Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <ProductRowActions productId={p.id} isActive={p.isActive} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
