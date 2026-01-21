"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  
  // 1. Shipping Details State (මේවා Backend එකට යනවා)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // 2. Fake Payment State (මේවා Backend එකට යන්නේ නෑ - නිකන් Type කරන්න විතරයි)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: ""
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Processing your order...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          phone: formData.phone,
          address: formData.address,
          cart: cart,
          total: total,
          userEmail: session?.user?.email,
          // Payment details මෙතන යවන්නේ නෑ
        }),
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Order Placed Successfully! 🎉");
        clearCart();
        router.push("/my-orders");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error placing order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
        <button 
          onClick={() => router.push("/")}
          className="text-blue-600 font-bold hover:underline"
        >
          Go Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Checkout</h1>

        {/* Order Summary Box */}
        <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
          <ul className="space-y-2 mb-4">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between text-sm text-gray-600">
                <span>{item.title} (x{item.quantity})</span>
                <span className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-700">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">Rs. {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- Shipping Details Section --- */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input
              required
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
              placeholder="Ex: Kavindu Nimesh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number(Whatsapp)</label>
            <input
              required
              type="tel"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
              placeholder="Ex: 077 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
            <textarea
              required
              rows={3}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
              placeholder="Ex: No 123, Galle Road, Colombo 03"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            ></textarea>
          </div>

          {/* --- New Payment Details Section (Fake Form) --- */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center justify-between">
              Payment Details
              <div className="flex gap-2">
                 <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 border">VISA</span>
                 <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 border">Master</span>
              </div>
            </h3>
            
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                  />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={paymentData.expiry}
                      onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC / CVV</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                      value={paymentData.cvc}
                      onChange={(e) => setPaymentData({...paymentData, cvc: e.target.value})}
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="NAME ON CARD" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white uppercase"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                  />
               </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition shadow-lg text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>Confirm & Pay</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}