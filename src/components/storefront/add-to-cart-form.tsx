"use client";

import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryName?: string;
  };
}

export function AddToCartForm({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        categoryName: product.categoryName,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300">
          Quantity:
        </label>
        <div className="inline-flex items-center border border-stone-300 dark:border-zinc-700 rounded-md bg-white dark:bg-[#1c1c20]">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1 || isOutOfStock}
            className="p-2 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 py-1 text-sm font-semibold text-stone-900 dark:text-zinc-100 w-12 text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= product.stock || isOutOfStock}
            className="p-2 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`w-full py-3.5 px-6 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          added
            ? "bg-emerald-600 text-white"
            : isOutOfStock
            ? "bg-stone-200 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 cursor-not-allowed"
            : "bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-stone-800 dark:hover:bg-zinc-200 shadow-xs"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Added {quantity} to Cart
          </>
        ) : isOutOfStock ? (
          "Currently Unavailable"
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            Add to Cart • {formatCurrency(product.price * quantity)}
          </>
        )}
      </button>
    </div>
  );
}
