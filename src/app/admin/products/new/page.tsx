import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NewProductForm } from "@/components/admin/new-product-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/products/new");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
            Create Catalog Product
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Fill in the details to publish a new piece into the storefront catalog.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c20] border border-stone-200 dark:border-zinc-800 rounded-lg p-6 sm:p-8 shadow-xs">
          <NewProductForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
