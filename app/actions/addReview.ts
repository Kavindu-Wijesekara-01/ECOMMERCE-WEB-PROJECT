"use server";

import connectToDatabase from "@/lib/db";
import Review from "@/models/Review";
import { auth } from "@/auth"; // ඔයාගේ auth path එක check කරන්න
import { revalidatePath } from "next/cache";

export async function addReview(formData: FormData) {
  const session = await auth();

  // Login වෙලා නැත්නම් Review දාන්න බෑ
  if (!session?.user) {
    return; 
  }

  const productId = formData.get("productId");
  const rating = formData.get("rating");
  const comment = formData.get("comment");

  await connectToDatabase();

  await Review.create({
    productId,
    userName: session.user.name || "Customer",
    userEmail: session.user.email,
    rating: Number(rating),
    comment,
  });

  // Page එක Refresh කරනවා අලුත් Review එක පෙන්නන්න
  revalidatePath(`/product/${productId}`);
}