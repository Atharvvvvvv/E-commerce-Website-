import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { AddToCartForm } from "@/components/storefront/add-to-cart-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";

import { SafeImage } from "@/components/ui/safe-image";

export const revalidate = 60;

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const numPrice = Number(product.price);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Imagery */}
        <div className="aspect-square bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden relative shadow-xs">
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Details & Purchase Form */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-zinc-400">
                {product.category.name}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 mt-1">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-stone-900 dark:text-zinc-100 mt-3">
                {formatCurrency(numPrice)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300">
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            <div className="border-t border-b border-stone-200 dark:border-zinc-800 py-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-2">
                Overview & Specifications
              </h2>
              <p className="text-sm text-stone-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <AddToCartForm
              product={{
                id: product.id,
                name: product.name,
                price: numPrice,
                stock: product.stock,
                imageUrl: product.imageUrl,
                categoryName: product.category.name,
              }}
            />
          </div>

          <div className="mt-10 pt-6 border-t border-stone-100 dark:border-zinc-800 grid grid-cols-2 gap-4 text-xs text-stone-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-500 dark:text-zinc-400" />
              <span>Standard delivery within 3-5 days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-500 dark:text-zinc-400" />
              <span>100% Authentic Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
