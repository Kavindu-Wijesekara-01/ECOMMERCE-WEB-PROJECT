import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 border-t border-orange-600/30 pt-12 pb-8 mt-auto">
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Column 1: Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="bg-orange-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-lg">
              PC
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              PC <span className="text-orange-500">Solution</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-4">
            Your one-stop shop for premium computer accessories, gaming gear, and high-performance hardware in Sri Lanka.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-orange-500 transition">Shop All Products</Link></li>
            <li><Link href="/my-orders" className="hover:text-orange-500 transition">My Orders</Link></li>
            <li><Link href="/cart" className="hover:text-orange-500 transition">View Cart</Link></li>
            <li><Link href="/login" className="hover:text-orange-500 transition">Login / Register</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div>
          <h3 className="text-white font-bold mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-orange-500 transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-orange-500 transition">FAQ</a></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="text-white font-bold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">📍</span> No 123, Tech Street, Colombo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">📞</span> +94 77 123 4567
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">✉️</span> support@PCSolution.lk
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} PC Solution. All rights reserved.</p>
      </div>
    </footer>
  );
}