"use client";

import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();

  const shippingFee = subtotal > 1000 ? 0 : subtotal > 0 ? 100 : 0;
  const estimatedTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-stone-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400 dark:text-zinc-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
          Your shopping cart is empty
        </h1>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-2 mb-8">
          Explore our collection of goods and add items to your cart.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-zinc-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Shopping Cart
          </h1>
          <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
            Review your items ({itemCount} {itemCount === 1 ? "item" : "items"}).
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-stone-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-slide-up transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md bg-stone-100 dark:bg-zinc-800 shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div>
                  {item.categoryName && (
                    <span className="text-[10px] uppercase font-semibold text-stone-400 dark:text-zinc-500 tracking-wider">
                      {item.categoryName}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-zinc-100">{item.name}</h3>
                  <p className="text-sm font-semibold text-stone-800 dark:text-zinc-200 mt-1">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    Stock available: {item.stock}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:border-l sm:border-stone-100 dark:sm:border-zinc-800 sm:pl-6">
                <div className="flex items-center border border-stone-300 dark:border-zinc-700 rounded bg-stone-50 dark:bg-zinc-800/80">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1.5 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-stone-900 dark:text-zinc-100 w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1.5 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right sm:min-w-[80px]">
                  <p className="text-sm font-bold text-stone-900 dark:text-zinc-100">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-stone-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 mt-1 inline-flex items-center gap-1 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-6 space-y-5 sticky top-24 shadow-xs">
            <h2 className="text-base font-semibold text-stone-900 dark:text-zinc-100 border-b border-stone-200 dark:border-zinc-800 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="text-stone-900 dark:text-zinc-100 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Free</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>
              {subtotal <= 1000 && (
                <p className="text-[11px] text-stone-500 dark:text-zinc-400 italic">
                  Tip: Add items over ₹1,000 for free delivery.
                </p>
              )}
              <div className="border-t border-stone-200 dark:border-zinc-800 pt-3 flex justify-between text-base font-bold text-stone-900 dark:text-zinc-100">
                <span>Estimated Total</span>
                <span>{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3 px-4 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-stone-400 dark:text-zinc-500 text-center">
              All prices and item availability will be officially confirmed at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
