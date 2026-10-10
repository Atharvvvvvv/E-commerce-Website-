import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().nonnegative("Stock must be 0 or greater"),
  imageUrl: z.string().url("Valid image URL is required"),
  categoryId: z.string().min(1, "Please select a category"),
  isActive: z.boolean().default(true),
});

export const CategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50),
  description: z.string().optional(),
});

export const CheckoutSchema = z.object({
  recipientName: z.string().min(2, "Name is required").max(100),
  recipientPhone: z.string().min(8, "Valid phone number is required").max(15),
  addressLine1: z.string().min(5, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().default("India"),
  paymentMethod: z.enum(["COD", "MOCK_CARD"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Cart cannot be empty"),
});

export const OrderStatusSchema = z.object({
  status: z.enum(["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type CheckoutInput = z.infer<typeof CheckoutSchema>;
export type OrderStatusInput = z.infer<typeof OrderStatusSchema>;
