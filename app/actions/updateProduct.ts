"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(formData: FormData) {
  const id = formData.get("id");
  
  const data = {
    title: formData.get("title"),
    price: formData.get("price"),
    category: formData.get("category"),
    brand: formData.get("brand"),
    imageUrl: formData.get("imageUrl"),
    stock: formData.get("stock"),
    description: formData.get("description"),
  };

  await connectToDatabase();
  await Product.findByIdAndUpdate(id, data);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}