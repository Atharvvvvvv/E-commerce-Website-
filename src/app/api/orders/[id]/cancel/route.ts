import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderId } = await params;

    // Idempotent and concurrency-safe cancellation transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      // Check ownership unless admin
      if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
        throw new Error("Forbidden: You do not own this order.");
      }

      // Idempotency: If already cancelled, do nothing and return safely
      if (order.status === OrderStatus.CANCELLED) {
        return order;
      }

      // Disallow cancelling fulfilled or already shipped orders
      if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
        throw new Error(`Orders in status ${order.status} cannot be cancelled.`);
      }

      // 1. Mark status as CANCELLED
      const res = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });

      // 2. Restore inventory quantities atomically
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }

      return res;
    });

    return NextResponse.json(
      { message: "Order cancelled and stock restored successfully.", order: updatedOrder },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to cancel order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
