import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusDropdown } from "@/components/admin/order-status-dropdown";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/orders");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: {
        select: { email: true, name: true },
      },
    },
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Link
            href="/admin"
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Overview
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Customer Orders Management
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Update fulfillment statuses, verify payment methods, and oversee deliveries.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 dark:text-zinc-400">
              No orders have been recorded in the database yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-zinc-800/60 text-stone-500 dark:text-zinc-400 font-semibold border-b border-stone-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-3.5">Order #</th>
                    <th className="px-6 py-3.5">Customer & Phone</th>
                    <th className="px-6 py-3.5">Items</th>
                    <th className="px-6 py-3.5">Total & Payment</th>
                    <th className="px-6 py-3.5">Destination</th>
                    <th className="px-6 py-3.5">Status Transition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-zinc-800 text-stone-800 dark:text-zinc-200">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/50 dark:hover:bg-zinc-800/40">
                      <td className="px-6 py-3.5">
                        <span className="font-mono font-bold text-stone-900 dark:text-zinc-100 block">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-stone-400 dark:text-zinc-500">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="font-semibold text-stone-900 dark:text-zinc-100 block">
                          {ord.recipientName}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400 block">
                          {ord.recipientPhone}
                        </span>
                        {ord.user?.email && (
                          <span className="text-[10px] text-stone-400 dark:text-zinc-500">
                            Account: {ord.user.email}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="space-y-0.5">
                          {ord.items.map((i) => (
                            <div key={i.id} className="text-stone-700 dark:text-zinc-300">
                              {i.productName} <span className="text-stone-400 dark:text-zinc-500">×{i.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className="font-bold text-stone-900 dark:text-zinc-100 block">
                          {formatCurrency(Number(ord.totalAmount))}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-3.5 text-stone-600 dark:text-zinc-400">
                        <span className="block truncate max-w-xs">{ord.addressLine1}</span>
                        <span className="text-[11px] text-stone-400 dark:text-zinc-500">
                          {ord.city}, {ord.state} - {ord.postalCode}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <OrderStatusDropdown
                          orderId={ord.id}
                          currentStatus={ord.status}
                        />
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
