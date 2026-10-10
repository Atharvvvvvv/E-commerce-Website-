"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface StatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusDropdown({ orderId, currentStatus }: StatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    if (newStatus === "CANCELLED") {
      const confirmed = window.confirm(
        "Setting status to CANCELLED will restore all product inventory items back into the catalog. Proceed?"
      );
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update order status");
        setStatus(currentStatus);
      } else {
        setStatus(newStatus);
        router.refresh();
      }
    } catch {
      alert("Network error updating order status");
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={loading || status === "CANCELLED"}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="px-2.5 py-1 text-xs border border-stone-300 dark:border-zinc-700 rounded bg-white dark:bg-[#151518] text-stone-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-zinc-400 disabled:opacity-60"
      >
        <option value="PLACED">Placed</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500 dark:text-zinc-400" />}
    </div>
  );
}
