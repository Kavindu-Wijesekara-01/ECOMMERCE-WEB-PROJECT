import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    userEmail: { type: String, required: true },
    items: [
      {
        productId: String,
        title: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    // 👇 මේ status කොටස අලුතින් එකතු කරන්න
    status: { 
      type: String, 
      default: "Pending", 
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] 
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;