import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderConfirmationProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
      <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-8 sm:p-10 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
          Order Successfully Placed
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100 mt-4">
          Thank you for your order!
        </h1>

        <p className="text-sm text-stone-600 dark:text-zinc-400 mt-2">
          Your order identifier is{" "}
          <strong className="text-stone-900 dark:text-zinc-100 font-mono bg-stone-100 dark:bg-zinc-850 px-2 py-0.5 rounded border border-stone-200 dark:border-zinc-700">
            {order.orderNumber}
          </strong>
        </p>

        <div className="border-t border-b border-stone-200 dark:border-zinc-800 my-8 py-6 text-left grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <h3 className="font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
              Delivery Recipient
            </h3>
            <p className="font-semibold text-stone-900 dark:text-zinc-100">{order.recipientName}</p>
            <p className="text-stone-600 dark:text-zinc-400">{order.addressLine1}</p>
            {order.addressLine2 && <p className="text-stone-600 dark:text-zinc-400">{order.addressLine2}</p>}
            <p className="text-stone-600 dark:text-zinc-400">
              {order.city}, {order.state} - {order.postalCode}
            </p>
            <p className="text-stone-600 dark:text-zinc-400 mt-1">Phone: {order.recipientPhone}</p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 mb-2">
              Payment & Status
            </h3>
            <p className="text-stone-600 dark:text-zinc-400">
              Method:{" "}
              <strong className="text-stone-900 dark:text-zinc-200">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Simulated Card (Mock)"}
              </strong>
            </p>
            <p className="text-stone-600 dark:text-zinc-400 mt-1">
              Payment Status:{" "}
              <span className="font-semibold text-stone-800 dark:text-zinc-200">{order.paymentStatus}</span>
            </p>
            <p className="text-stone-600 dark:text-zinc-400 mt-1">
              Current Order Status:{" "}
              <span className="font-semibold text-stone-900 dark:text-zinc-100">{order.status}</span>
            </p>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="text-left mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-3">
            Purchased Artifacts
          </h3>
          <div className="divide-y divide-stone-100 dark:divide-zinc-800 border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-stone-900 dark:text-zinc-100">{item.productName}</span>
                  <span className="text-stone-500 dark:text-zinc-400 ml-2">× {item.quantity}</span>
                </div>
                <span className="font-semibold text-stone-900 dark:text-zinc-100">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))}
            <div className="p-3.5 bg-stone-50 dark:bg-zinc-800/50 flex justify-between items-center text-sm font-bold text-stone-900 dark:text-zinc-100">
              <span>Total Amount Paid / Due:</span>
              <span>{formatCurrency(Number(order.totalAmount))}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
          >
            <Package className="w-4 h-4" />
            View Order History
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Continue Browsing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
