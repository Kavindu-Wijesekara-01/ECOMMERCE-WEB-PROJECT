import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

// 1. GET Request
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}

// 2. POST Request (මෙන්න මේ කොටස තමයි Error එක හදන්නේ)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    // 👇 විසඳුම: Frontend එකෙන් එන 'image' එක 'imageUrl' වලට හරවනවා
    const productData = {
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      brand: body.brand,
      stock: body.stock,
      // මෙන්න මෙතන තමයි වැඩේ වෙන්නේ:
      imageUrl: body.image || body.imageUrl, 
    };

    const newProduct = await Product.create(productData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error.message); // Terminal එකේ Error එක පෙන්නනවා
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT Request (Update කරනකොටත් මේ ප්‍රශ්නය එන්න පුළුවන්)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const { id, ...otherData } = body;

    // Update එකටත් නම ගලපනවා
    const updateData = {
      ...otherData,
      imageUrl: body.image || body.imageUrl,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating product" }, { status: 500 });
  }
}

// 4. DELETE Request
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
  }
}