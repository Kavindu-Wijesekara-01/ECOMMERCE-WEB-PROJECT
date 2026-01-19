import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, phone, address, cart, total, userEmail } = body;

    // 👇 1. මේ Log එක Terminal එකේ වැටෙනවද බලන්න
    console.log("Checking Order Data:", { 
      Name: customerName, 
      Email: userEmail, // <-- මෙතන Email එක තියෙනවද?
      Total: total 
    });

    if (!userEmail) {
      console.error("❌ Error: No User Email Provided!");
      return NextResponse.json({ error: "User email is missing. Please login again." }, { status: 400 });
    }

    await connectToDatabase();

    const orderItems = cart.map((item: any) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    const newOrder = await Order.create({
      customerName,
      phone,
      address,
      userEmail, 
      items: orderItems,
      totalAmount: total,
    });

    console.log("✅ Order Created Successfully with Email:", newOrder.userEmail);

    for (const item of cart) {
      await Product.findByIdAndUpdate(item.id, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json({ message: "Order Placed Successfully!", orderId: newOrder._id });
  } catch (error: any) {
    console.error("❌ ORDER API ERROR:", error);
    return NextResponse.json({ error: error.message || "Failed to place order" }, { status: 500 });
  }
}