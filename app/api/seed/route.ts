import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    // ⚠️ 1. පරණ ලෙඩ තියෙන Users Collection එක සම්පූර්ණයෙන්ම මකලා දානවා.
    // (මෙතනදී කලින් හිටපු usersලා මැකෙනවා, අලුත් project එකක් නිසා අවුලක් නැහැ).
    try {
      await mongoose.connection.db?.dropCollection("users");
      console.log("Old users collection dropped!");
    } catch (e) {
      console.log("No existing collection to drop, proceeding...");
    }

    // 2. දැන් අලුතෙන්ම Admin ව හදමු
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@dkcreations.com",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({ message: "Fixed DB & Created Admin Successfully!" });
  } catch (error: any) {
    console.error("SEED ERROR:", error);
    return NextResponse.json({ 
      error: "Error creating admin", 
      details: error.message 
    }, { status: 500 });
  }
}