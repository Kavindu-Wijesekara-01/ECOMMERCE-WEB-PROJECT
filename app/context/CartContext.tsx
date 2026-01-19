"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Session එක ගන්න ඕන

interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session } = useSession(); // දැනට ඉන්න User කවුද කියලා බලනවා

  // User ට අදාළව වෙනම නමකින් Save කරන්න Key එකක් හදාගන්නවා
  // User නැත්නම් 'cart_guest', User ඉන්නවා නම් 'cart_user@email.com'
  const storageKey = session?.user?.email ? `cart_${session.user.email}` : "cart_guest";

  // 1. Load Cart (User මාරු වෙනකොට මේක වැඩ කරනවා)
  useEffect(() => {
    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]); // කලින් දත්ත මුකුත් නැත්නම් Cart එක හිස් කරනවා
    }
  }, [storageKey]); // storageKey එක වෙනස් වුන ගමන් මේක රන් වෙනවා

  // 2. Save Cart (Cart එක වෙනස් වෙනකොට අදාළ Key එකට Save වෙනවා)
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } else {
      // Cart එක හිස් නම් Storage එකෙනුත් අයින් කරනවා (Clean up)
      // හැබැයි Guest කෙනෙක් User කෙනෙක් වුනාම Merge වෙන Logic එක සංකීර්ණ නිසා 
      // දැනට සරලව අයින් නොකර තියන්නත් පුළුවන්, නමුත් මේක හොඳයි.
      localStorage.setItem(storageKey, JSON.stringify([]));
    }
  }, [cart, storageKey]);

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          _id: product._id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl || product.image,
          quantity: 1,
        },
      ];
    });
    // Note: Alert එක මෙතනින් අයින් කළා
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(storageKey);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}