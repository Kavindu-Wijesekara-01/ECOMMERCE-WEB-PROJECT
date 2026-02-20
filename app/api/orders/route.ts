import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db"; // 🔥 1. වරහන් { } දැම්මා
import Order from "@/models/Order";
import Product from "@/models/Product";
import rateLimit from "@/lib/rateLimit"; // 🛡️ 3 වැනි ලොක් එක සඳහා අලුතෙන් එකතු කළා

export async function POST(req: Request) {
  try {
    // ---------------------------------------------------------
    // 🛡️ SECURITY LOCK 3: RATE LIMITING (ස්පෑම් Orders නැවැත්වීම)
    // ---------------------------------------------------------
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    
    // නීතිය: එක IP එකකින් විනාඩියකට (60000ms) දාන්න පුළුවන් Orders 3යි!
    const isAllowed = rateLimit(ip, 3, 60000);

    if (!isAllowed) {
      console.warn(`🛑 Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: "Too many orders. Please try again after a minute. 🛑" },
        { status: 429 } // 429: Too Many Requests
      );
    }
    // ---------------------------------------------------------

    const body = await req.json();
    const { customerName, phone, address, cart, total, userEmail } = body;

    console.log("Checking Order Data:", { 
      Name: customerName, 
      Email: userEmail, 
      Total: total 
    });

    if (!userEmail) {
      console.error("❌ Error: No User Email Provided!");
      return NextResponse.json({ error: "User email is missing. Please login again." }, { status: 400 });
    }

    await connectToDatabase();

    // Order Items හදාගැනීම
    const orderItems = cart.map((item: any) => ({
      productId: item._id, // 🔥 2. item.id වෙනුවට item._id දැම්මා
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    // Order එක Create කිරීම
    const newOrder = await Order.create({
      customerName,
      phone,
      address,
      userEmail, 
      items: orderItems,
      totalAmount: total,
    });

    console.log("✅ Order Created Successfully with Email:", newOrder.userEmail);

    // ---------------------------------------------------------
    // 🔥 3. STOCK UPDATE LOGIC (නිවැරදි කරන ලදී)
    // ---------------------------------------------------------
    for (const item of cart) {
      // මෙතනත් item.id වෙනුවට item._id පාවිච්චි කරන්න ඕන
      const updatedProduct = await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
      });

      // Debugging: Stock අඩු වුනාද බලන්න Log එකක්
      if (updatedProduct) {
        console.log(`📉 Stock Updated for ${item.title}: -${item.quantity}`);
      } else {
        console.error(`⚠️ Stock Update Failed for ${item.title} (ID: ${item._id} not found)`);
      }
    }
    // ---------------------------------------------------------

    return NextResponse.json({ message: "Order Placed Successfully!", orderId: newOrder._id });
  } catch (error: any) {
    console.error("❌ ORDER API ERROR:", error);
    return NextResponse.json({ error: error.message || "Failed to place order" }, { status: 500 });
  }
}