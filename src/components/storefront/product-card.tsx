"use client";

import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  stock: number;
  imageUrl: string;
  categoryName?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  stock,
  imageUrl,
  categoryName,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const numPrice = typeof price === "string" ? parseFloat(price) : Number(price);
  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    addItem({
      productId: id,
      name,
      price: numPrice,
      imageUrl,
      stock,
      categoryName,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col hover:border-stone-400 dark:hover:border-zinc-600 hover:-translate-y-1 hover:shadow-md transition-all duration-200 shadow-xs">
      <Link href={`/products/${slug}`} className="relative aspect-square w-full bg-stone-100 dark:bg-zinc-800 overflow-hidden block">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
          }}
        />
        {categoryName && (
          <span className="absolute top-2.5 left-2.5 bg-stone-900/80 dark:bg-black/80 backdrop-blur text-white text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded">
            {categoryName}
          </span>
        )}
        {isOutOfStock ? (
          <span className="absolute bottom-2.5 left-2.5 bg-red-600/90 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
            Out of Stock
          </span>
        ) : stock <= 5 ? (
          <span className="absolute bottom-2.5 left-2.5 bg-amber-500/90 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
            Only {stock} Left
          </span>
        ) : null}
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${slug}`} className="block">
            <h3 className="text-sm font-semibold text-stone-900 dark:text-zinc-100 line-clamp-1 group-hover:text-stone-600 dark:group-hover:text-zinc-300 transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-base font-semibold text-stone-900 dark:text-zinc-100 mt-1">
            {formatCurrency(numPrice)}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-zinc-400">
            {isOutOfStock ? "Unavailable" : `${stock} in stock`}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : isOutOfStock
                ? "bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 cursor-not-allowed"
                : "bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-stone-800 dark:hover:bg-zinc-200"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : isOutOfStock ? (
              "Sold Out"
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
