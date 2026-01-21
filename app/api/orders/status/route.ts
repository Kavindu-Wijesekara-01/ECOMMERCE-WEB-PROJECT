import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";

export async function PUT(req: Request) {
  try {
    const { orderId, status } = await req.json();
    await connectToDatabase();

    await Order.findByIdAndUpdate(orderId, { status });

    return NextResponse.json({ message: "Status Updated" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}