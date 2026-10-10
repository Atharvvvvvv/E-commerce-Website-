import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

/**
 * Ensures the request is made by an authenticated user.
 * Throws an error or returns session user.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }
  return session.user;
}

/**
 * Ensures the request is made by an ADMIN.
 * Throws an error if not logged in or not an ADMIN.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== Role.ADMIN) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
