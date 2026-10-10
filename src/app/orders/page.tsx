import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { CancelOrderButton } from "@/components/storefront/cancel-order-button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-stone-200 dark:border-zinc-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
          Order History
        </h1>
        <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Review all previous transactions and delivery tracking details.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-8 shadow-xs">
          <Package className="w-12 h-12 text-stone-300 dark:text-zinc-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-stone-900 dark:text-zinc-100">No orders placed yet</h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 mb-6">
            When you purchase items from our catalog, their status and invoice details will appear here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isCancellable =
              order.status === "PLACED" || order.status === "CONFIRMED";

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-zinc-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-stone-900 dark:text-zinc-100">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                            : order.status === "CANCELLED"
                            ? "bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-400 line-through"
                            : order.status === "SHIPPED"
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isCancellable && <CancelOrderButton orderId={order.id} />}
                    <div className="text-right">
                      <p className="text-xs text-stone-400 dark:text-zinc-500">Total Paid</p>
                      <p className="text-base font-bold text-stone-900 dark:text-zinc-100">
                        {formatCurrency(Number(order.totalAmount))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-stone-100 dark:divide-zinc-800/60">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 dark:text-zinc-100">{item.productName}</span>
                        <span className="text-stone-500 dark:text-zinc-400">× {item.quantity}</span>
                      </div>
                      <span className="font-medium text-stone-800 dark:text-zinc-200">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-stone-50 dark:bg-zinc-800/50 rounded p-3 text-[11px] text-stone-600 dark:text-zinc-400 flex flex-wrap justify-between gap-2 border border-stone-100 dark:border-zinc-800/60">
                  <span>
                    Shipping to: <strong className="text-stone-900 dark:text-zinc-200">{order.recipientName}</strong>, {order.city},{" "}
                    {order.state} ({order.postalCode})
                  </span>
                  <span>
                    Payment: <strong className="text-stone-900 dark:text-zinc-200">{order.paymentMethod}</strong> ({order.paymentStatus})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
