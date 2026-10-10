import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/schemas/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Server-side validation with Zod
    const validationResult = RegisterSchema.safeParse(body);
    if (!validationResult.success) {
      const issue = validationResult.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { name, email, password } = validationResult.data;

    // 2. Prevent duplicate registrations
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    // 3. Hash password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Force Role.USER on public registration - completely ignore any client payload 'role'
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your registration" },
      { status: 500 }
    );
  }
}
