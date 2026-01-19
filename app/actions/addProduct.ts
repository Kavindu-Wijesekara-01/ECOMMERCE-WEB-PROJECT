"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  // 1. Form එකෙන් එන data ටික ගන්නවා
  const title = formData.get("title");
  const price = formData.get("price");
  const description = formData.get("description");
  const category = formData.get("category");
  const brand = formData.get("brand");
  const imageUrl = formData.get("imageUrl");
  const stock = formData.get("stock");

  // 2. Database එකට connect වෙනවා
  await connectToDatabase();

  // 3. අලුත් Product එක create කරනවා
  await Product.create({
    title,
    price,
    description,
    category,
    brand,
    imageUrl,
    stock,
  });

  // 4. Cache එක clear කරලා Admin Dashboard එකට ආපහු යවනවා
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}