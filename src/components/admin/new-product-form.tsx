"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, PlusCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export function NewProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          imageUrl,
          categoryId,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create product");
        setLoading(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Minimalist Aluminum Desk Pad"
          className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
            Price (INR ₹) *
          </label>
          <input
            type="number"
            step="0.01"
            min="1"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1299.00"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
            Stock Inventory *
          </label>
          <input
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="25"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
            Category *
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
          Image URL (Unsplash or CDN) *
        </label>
        <input
          type="url"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
        />
        {imageUrl && (
          <div className="mt-2 flex items-center gap-3">
            <span className="text-[11px] text-stone-500 dark:text-zinc-400">Preview:</span>
            <img
              src={imageUrl}
              alt="preview"
              className="w-10 h-10 object-cover rounded border border-stone-200 dark:border-zinc-700"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1">
          Full Description *
        </label>
        <textarea
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed craft specifications, materials, and dimensional tolerances..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-[#151518] border border-stone-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-zinc-200 text-stone-900 dark:text-zinc-100"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-zinc-800">
        <Link
          href="/admin/products"
          className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors shadow-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              Create Product
            </>
          )}
        </button>
      </div>
    </form>
  );
}
