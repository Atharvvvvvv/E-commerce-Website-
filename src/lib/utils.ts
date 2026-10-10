import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and merges Tailwind utility conflicts cleanly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Consistent currency formatting (INR / USD standard)
 */
export function formatCurrency(amount: number | string | { toNumber?: () => number }): string {
  const numericAmount =
    typeof amount === "number"
      ? amount
      : typeof amount === "string"
      ? parseFloat(amount)
      : amount?.toNumber
      ? amount.toNumber()
      : 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Generate human-readable unique order numbers
 * Example: ORD-20261010-AB12
 */
export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${randomSuffix}`;
}
