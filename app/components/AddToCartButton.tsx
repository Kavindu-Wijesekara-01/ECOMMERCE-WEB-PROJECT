"use client";

import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart! 🛒`, {
      duration: 3000,
      position: "bottom-right",
      icon: '🍊', // පොඩි වෙනසක්
      style: {
        background: '#1e293b', // Slate-800
        color: '#fff',
      },
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      // 👇 Blue වෙනුවට Orange දාලා, Shadow එක හැදුවා
      className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2"
    >
      <span>Add to Cart</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </button>
  );
}