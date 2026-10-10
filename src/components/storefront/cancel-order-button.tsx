"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you wish to cancel this order? This will release reserved stock back to the catalog."
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to cancel order.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("An unexpected error occurred while contacting the server.");
      setLoading(false);
    }
  };

  return (
    <div className="inline-block">
      {error && <p className="text-xs text-red-600 mb-1">{error}</p>}
      <button
        onClick={handleCancel}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Cancelling...
          </>
        ) : (
          <>
            <AlertTriangle className="w-3.5 h-3.5" />
            Cancel Order
          </>
        )}
      </button>
    </div>
  );
}
