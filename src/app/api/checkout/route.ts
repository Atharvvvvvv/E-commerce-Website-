import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CheckoutSchema } from "@/schemas/ecommerce";
import { generateOrderNumber } from "@/lib/utils";
import { PaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to place an order." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parseResult = CheckoutSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid checkout payload" },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const requestedItems = data.items;
    const productIds = requestedItems.map((i) => i.productId);

    // Concurrency-safe atomic transaction
    const orderResult = await prisma.$transaction(async (tx) => {
      // 1. Fetch live product data inside transaction to guarantee price and stock truth
      const dbProducts = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      });

      if (dbProducts.length !== requestedItems.length) {
        throw new Error("One or more selected products are no longer available.");
      }

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));

      let computedSubtotal = 0;
      const orderItemsToCreate: Array<{
        productId: string;
        productName: string;
        price: number;
        quantity: number;
      }> = [];

      // 2. Concurrency-Safe Stock Check & Decrement
      for (const item of requestedItems) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found.`);
        }

        // Conditional atomic stock decrement
        // Only update if current stock >= item.quantity
        const updated = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (updated.count === 0) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`
          );
        }

        const unitPrice = Number(product.price);
        computedSubtotal += unitPrice * item.quantity;

        orderItemsToCreate.push({
          productId: product.id,
          productName: product.name,
          price: unitPrice,
          quantity: item.quantity,
        });
      }

      // 3. Compute Server-Authoritative Totals (never trust client total)
      const shippingFee = computedSubtotal > 1000 ? 0 : 100;
      const totalAmount = computedSubtotal + shippingFee;

      const orderNumber = generateOrderNumber();
      const paymentStatus =
        data.paymentMethod === "MOCK_CARD" ? PaymentStatus.PAID : PaymentStatus.PENDING;

      // 4. Create Order and OrderItems atomically
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          paymentMethod: data.paymentMethod,
          paymentStatus: paymentStatus,
          recipientName: data.recipientName,
          recipientPhone: data.recipientPhone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || null,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          subtotal: computedSubtotal,
          shippingFee: shippingFee,
          totalAmount: totalAmount,
          items: {
            create: orderItemsToCreate.map((oi) => ({
              productId: oi.productId,
              productName: oi.productName,
              price: oi.price,
              quantity: oi.quantity,
            })),
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderNumber: orderResult.orderNumber,
        orderId: orderResult.id,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
