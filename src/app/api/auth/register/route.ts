import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { hashPassword } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!email || !password) return NextResponse.json({ error: "Missing email or password" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
