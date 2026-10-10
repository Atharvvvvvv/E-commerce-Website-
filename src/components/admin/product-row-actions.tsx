"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Power } from "lucide-react";

interface ProductActionsProps {
  productId: string;
  isActive: boolean;
}

export function ProductRowActions({ productId, isActive }: ProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    } catch {
      alert("Failed to toggle product status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure? If this product has historical orders, it will be deactivated instead of deleted to protect order history."
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to remove product");
      }
      router.refresh();
    } catch {
      alert("Error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleActive}
        disabled={loading}
        title={isActive ? "Deactivate product" : "Activate product"}
        className={`p-1.5 rounded transition-colors ${
          isActive
            ? "text-emerald-700 hover:bg-emerald-50"
            : "text-stone-400 hover:bg-stone-100"
        }`}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        title="Delete product"
        className="p-1.5 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
