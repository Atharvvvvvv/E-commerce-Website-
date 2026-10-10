import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check if product is tied to historical orders
    const hasOrders = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (hasOrders > 0) {
      // Historical integrity safeguard: Soft-deactivate to avoid breaking OrderItem relations
      const updated = await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        message: "Product is referenced in existing customer orders. It has been deactivated instead of deleted.",
        product: updated,
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
