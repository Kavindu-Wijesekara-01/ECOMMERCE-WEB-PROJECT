import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // 1. 👇 Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PC Solution",
  description: "Best Computer Accessories in Sri Lanka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1e293b', // Slate-800
                  color: '#fff',
                },
              }}
            />
            
            {/* Flex Column දාලා Footer එක යටටම තල්ලු කරනවා */}
            <div className="flex flex-col min-h-screen">
              <Navbar />
              
              <main className="flex-grow">
                {children}
              </main>

              {/* 2. 👇 Footer එක මෙතනට දාන්න */}
              <Footer />
            </div>
            
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}