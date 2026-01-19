"use client"; // මේක අනිවාර්යයි, මොකද අපි button click කරන නිසා

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  
  // Form එකේ තියෙන data තියාගන්න
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Error පණිවිඩ පෙන්නන්න
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login Button එක click කළාම වෙන දේ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. NextAuth හරහා backend එකට login request එක යවනවා
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Page එක refresh නොවී ඉන්න false දානවා
      });

      if (result?.error) {
        // Login වැරදි නම් error එක පෙන්නනවා
        setError("Email හෝ Password වැරදියි!");
        setLoading(false);
      } else {
        // 2. Login හරි නම් Home page එකට යවනවා
        router.push("/");
        router.refresh(); // Navbar එකේ වෙනස්කම් පෙන්නන්න page එක refresh කරනවා
      }
    } catch (err) {
      setError("Login වීමේ දෝෂයක්. නැවත උත්සාහ කරන්න.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Admin Login
        </h2>

        {/* Error එකක් ආවොත් රතු පාටින් පෙන්නන කොටස */}
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="admin@dkcreations.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="********"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            New here?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}