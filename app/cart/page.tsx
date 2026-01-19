"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, cartCount } = useCart();

  // මුළු එකතුව හදනවා
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty 😔</h1>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Shopping Cart ({cartCount} items)</h1>
        </div>

        <div className="p-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-0">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-500 text-sm">Rs. {item.price.toLocaleString()} x {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              ← Continue Shopping
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-lg text-gray-600">Subtotal</p>
            <p className="text-3xl font-bold text-gray-900 mb-4">Rs. {total.toLocaleString()}</p>
            
              <Link 
                  href="/checkout"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 w-full md:w-auto text-center inline-block"
                >
                  Checkout Now
              </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}