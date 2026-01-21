"use server";

import {connectToDatabase} from "@/lib/db";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId");
  const newStatus = formData.get("newStatus");

  await connectToDatabase();
  
  // Status එක update කරනවා
  await Order.findByIdAndUpdate(orderId, { status: newStatus });

  // Page එක refresh කරනවා
  revalidatePath("/admin/orders");
}