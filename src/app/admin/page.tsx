import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, Package, ShoppingBag, TrendingUp, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | AESTHETE",
};

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  // Aggregate genuine database metrics
  const [userCount, productCount, orders] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PLACED" || o.status === "CONFIRMED").length;
  const grossRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-zinc-800 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-stone-900 text-stone-100 dark:bg-zinc-100 dark:text-zinc-900 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Administrative Operations
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
              Store Management Console
            </h1>
            <p className="text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
              Logged in as <strong className="text-stone-800 dark:text-zinc-200">{session.user.email}</strong> (Role: ADMIN)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="px-3.5 py-2 text-xs font-semibold bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-stone-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-[#1c1c20] border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 rounded-md hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        {/* 4 Overview Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-zinc-100">{formatCurrency(grossRevenue)}</p>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-1">Excludes cancelled orders</p>
          </div>

          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-zinc-100">{totalOrders}</p>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-1">{pendingOrders} awaiting fulfillment</p>
          </div>

          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Catalog</span>
              <Package className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-zinc-100">{productCount}</p>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-1">Products listed</p>
          </div>

          <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <Users className="w-4 h-4 text-stone-400 dark:text-zinc-500" />
            </div>
            <p className="text-2xl font-bold text-stone-900 dark:text-zinc-100">{userCount}</p>
            <p className="text-[11px] text-stone-400 dark:text-zinc-500 mt-1">Customers & staff</p>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-stone-200 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-stone-900 dark:text-zinc-100">Recent Customer Orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 flex items-center gap-1"
            >
              View all orders <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 dark:text-zinc-400">
              No orders have been recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-zinc-800/60 text-stone-500 dark:text-zinc-400 font-semibold border-b border-stone-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-3">Order #</th>
                    <th className="px-6 py-3">Recipient</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3">Total</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-zinc-800 text-stone-800 dark:text-zinc-200">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/50 dark:hover:bg-zinc-800/40">
                      <td className="px-6 py-3.5 font-mono font-medium">{ord.orderNumber}</td>
                      <td className="px-6 py-3.5 font-medium">{ord.recipientName}</td>
                      <td className="px-6 py-3.5 text-stone-500 dark:text-zinc-400">{ord.items.length} items</td>
                      <td className="px-6 py-3.5 font-semibold text-stone-900 dark:text-zinc-100">{formatCurrency(Number(ord.totalAmount))}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === "DELIVERED"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                              : ord.status === "CANCELLED"
                              ? "bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-400"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-stone-500 dark:text-zinc-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
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
