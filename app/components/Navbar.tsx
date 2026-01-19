"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    // 👇 වෙනස 1: Background එක Slate-900 (තද අළු/කළු) කළා. Text එක White කළා.
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-orange-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- Logo --- */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Logo Box: Orange Background */}
              <div className="bg-orange-600 text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition">
                PC
              </div>
              <span className="text-xl font-bold text-white tracking-tight group-hover:text-orange-500 transition">
                PC <span className="text-orange-500">Solution</span>
              </span>
            </Link>
          </div>

          {/* --- Desktop Menu --- */}
          <div className="hidden md:flex items-center justify-center space-x-2 ">
            <Link 
              href="/" 
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isActive("/") 
                  ? "bg-orange-600 text-white shadow-md" 
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Shop
            </Link>
            
            {session?.user && (
              <Link 
                href="/my-orders" 
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive("/my-orders") 
                    ? "bg-orange-600 text-white shadow-md" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                My Orders
              </Link>
            )}
          </div>

          {/* --- Right Icons --- */}
          <div className="flex-1 flex justify-end items-center gap-4">
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full shadow-sm border border-slate-900">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-white/20">
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-white">{session.user.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">{(session.user as any).role}</p>
                  </div>

                  {(session.user as any).role === "admin" && (
                    <Link href="/admin" className="p-2 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition" title="Admin Dashboard">
                       {/* SVG Icon */}
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </Link>
                  )}

                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Logout"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 font-bold text-sm transition-all shadow-lg shadow-orange-600/20">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition"
              >
                {!isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu (Dark Theme) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/10 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-medium ${isActive("/") ? "bg-orange-600/20 text-orange-500 border border-orange-600/50" : "text-gray-300 hover:bg-white/5"}`}>
              Shop
            </Link>
            
            {session?.user && (
              <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl font-medium ${isActive("/my-orders") ? "bg-orange-600/20 text-orange-500 border border-orange-600/50" : "text-gray-300 hover:bg-white/5"}`}>
                My Orders
              </Link>
            )}

            <div className="border-t border-white/10 my-2 pt-2">
              {session?.user ? (
                <>
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center mt-4 bg-orange-600 text-white px-4 py-3 rounded-xl font-bold">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}