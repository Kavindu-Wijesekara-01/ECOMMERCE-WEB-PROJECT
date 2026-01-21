import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, adminCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectToDatabase();

    // 1. කලින් මේ Email එකෙන් කෙනෙක් ඉන්නවද බලනවා
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // 2. Password එක Hash කරනවා (ආරක්ෂාවට)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Admin වෙන්න ඕන නම් Secret Code එක බලනවා
    // අපි Secret Code එක විදියට "ADMIN_POWER_123" කියන එක දාමු (පස්සේ වෙනස් කරගන්න)
    let role = "customer";
    if (adminCode === "ADMIN_POWER_123") {
      role = "admin";
    }

    // 4. User ව Save කරනවා
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ message: "User registered successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}