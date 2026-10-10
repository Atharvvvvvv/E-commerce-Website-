import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { OrderStatusSchema } from "@/schemas/ecommerce";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: orderId } = await params;
    const body = await req.json();

    const parseResult = OrderStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid status" },
        { status: 400 }
      );
    }

    const { status: targetStatus } = parseResult.data;

    // Transactional transition with idempotent stock restoration
    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new Error("Order not found.");
      }

      // If already cancelled, do not allow transitioning out or restoring twice
      if (order.status === OrderStatus.CANCELLED) {
        throw new Error("Order is already cancelled and finalized.");
      }

      // If transitioning to CANCELLED from non-cancelled status, restore stock
      if (targetStatus === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }

      return await tx.order.update({
        where: { id: orderId },
        data: {
          status: targetStatus,
        },
      });
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
