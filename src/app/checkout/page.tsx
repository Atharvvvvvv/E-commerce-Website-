"use client";

import { useCart } from "@/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowLeft, CreditCard, Loader2, ShieldCheck, Truck } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "MOCK_CARD">("COD");

  const shippingFee = subtotal > 1000 ? 0 : subtotal > 0 ? 100 : 0;
  const estimatedTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
          Your cart is empty
        </h1>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-2 mb-6">
          Add items before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        recipientName,
        recipientPhone,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        state,
        postalCode,
        country: "India",
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?callbackUrl=/checkout");
          return;
        }
        setError(data.error || "Failed to process order.");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch {
      setError("A network error occurred. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 mt-2">
          Secure Checkout
        </h1>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h4 className="font-semibold">Unable to place order</h4>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Contact & Delivery Address */}
          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-stone-900 dark:text-zinc-100 border-b border-stone-100 dark:border-zinc-800 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-600 dark:text-zinc-400" />
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="House / Flat No., Street, Landmark"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                Apartment / Suite (Optional)
              </label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Floor 4, Unit 402"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Karnataka"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="560001"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-semibold text-stone-900 dark:text-zinc-100 border-b border-stone-100 dark:border-zinc-800 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-stone-600 dark:text-zinc-400" />
              2. Payment Option
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-stone-900 dark:border-zinc-300 bg-stone-50 dark:bg-zinc-800/60"
                    : "border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1"
                />
                <div>
                  <span className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                    Pay in cash upon physical delivery at your doorstep.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === "MOCK_CARD"
                    ? "border-stone-900 dark:border-zinc-300 bg-stone-50 dark:bg-zinc-800/60"
                    : "border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "MOCK_CARD"}
                  onChange={() => setPaymentMethod("MOCK_CARD")}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900 dark:text-zinc-100">
                      Simulated Online Payment (Mock)
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-semibold uppercase">
                      Instant Approval
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                    Safe testing simulator: marks order payment as Paid immediately.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Placement */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-6 space-y-5 sticky top-24 shadow-xs">
            <h2 className="text-base font-semibold text-stone-900 dark:text-zinc-100 border-b border-stone-200 dark:border-zinc-800 pb-3">
              Review Items ({items.length})
            </h2>

            <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-zinc-800 pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded bg-stone-100 dark:bg-zinc-800"
                    />
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-zinc-100 line-clamp-1">{item.name}</p>
                      <p className="text-stone-500 dark:text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900 dark:text-zinc-100">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 dark:border-zinc-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="text-stone-900 dark:text-zinc-100 font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Free</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>
              <div className="border-t border-stone-200 dark:border-zinc-800 pt-3 flex justify-between text-base font-bold text-stone-900 dark:text-zinc-100">
                <span>Total Due</span>
                <span>{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Place Order • {formatCurrency(estimatedTotal)}
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-400 dark:text-zinc-500 text-center leading-relaxed">
              By confirming, inventory will be reserved and verified on the server.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
