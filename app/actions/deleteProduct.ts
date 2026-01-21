"use server";

import {connectToDatabase} from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id");
  
  await connectToDatabase();
  await Product.findByIdAndDelete(id);

  // Data මැකුවම පිටු refresh කරන්න
  revalidatePath("/admin");
  revalidatePath("/");
}