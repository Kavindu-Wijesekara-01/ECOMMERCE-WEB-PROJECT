import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { auth } from "@/auth";
import { z } from "zod"; // 👈 අලුතෙන් එකතු කළා (Zod Library එක)

// 👇 SECURITY LOCK 2: Data වල හැඩය (Schema) හදනවා. මේ නීති වලින් පිට මොකුත් දාන්න බෑ!
const productSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(5, "Description is too short"),
  // coerce.number() එකෙන් කරන්නේ අකුරු විදියට "3500" ආවත් ඒක ඉලක්කමක් (3500) කරලා සෘණ අගයන් නෑ කියලා තහවුරු කරන එකයි
  price: z.coerce.number().nonnegative("Price cannot be negative"), 
  category: z.string().min(2, "Category is required"),
  brand: z.string().min(2, "Brand is required"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  image: z.string().optional(),
  imageUrl: z.string().optional(),
});

// 1. GET Request (Public)
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}

// 2. POST Request (අලුතෙන් බඩු දාන කොටස)
export async function POST(req: Request) {
  try {
    // 🛡️ SECURITY LOCK 1: Admin ද කියලා බලනවා
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Only Admins can add products!" }, { status: 401 });
    }

    const body = await req.json();

    // 🛡️ SECURITY LOCK 2: Zod එකෙන් Data ටික චෙක් කරනවා. වැරදි නම් මේක මෙතනින්ම නවතිනවා!
    const validatedData = productSchema.parse(body);

    await connectToDatabase();

    const productData = {
      title: validatedData.title,
      description: validatedData.description,
      price: validatedData.price,
      category: validatedData.category,
      brand: validatedData.brand,
      stock: validatedData.stock,
      imageUrl: validatedData.image || validatedData.imageUrl, 
    };

    const newProduct = await Product.create(productData);
    return NextResponse.json(newProduct, { status: 201 });
    
  } catch (error: any) {
    // Zod එකෙන් අල්ලගත්ත වැරැද්දක් නම් ඒක පෙන්නනවා
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
    }
    console.error("POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT Request (බඩු Update කරන කොටස)
export async function PUT(req: Request) {
  try {
    // 🛡️ SECURITY LOCK 1
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Only Admins can update products!" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...otherData } = body;

    // 🛡️ SECURITY LOCK 2: Update කරන දේවලුත් Zod එකෙන් චෙක් කරනවා
    const validatedData = productSchema.parse(otherData);

    await connectToDatabase();

    const updateData = {
      ...validatedData,
      imageUrl: validatedData.image || validatedData.imageUrl,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Error updating product" }, { status: 500 });
  }
}

// 4. DELETE Request (බඩු මකන කොටස)
export async function DELETE(req: Request) {
  try {
    // 🛡️ SECURITY LOCK 1
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Only Admins can delete products!" }, { status: 401 });
    }

    const { id } = await req.json();
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
  }
}