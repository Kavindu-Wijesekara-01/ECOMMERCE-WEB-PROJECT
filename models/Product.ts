import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true }, // උදා: Monitors, VGA Cards
    brand: { type: String, required: true },    // උදා: ASUS, MSI, Logitech (අලුතින් දැම්මා)
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;