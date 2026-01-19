"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", adminCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registration Successful! Please Login.");
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Create Account</h2>

        {error && <div className="mb-4 bg-red-100 text-red-600 p-3 rounded text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" required className="w-full border p-2 rounded" 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required className="w-full border p-2 rounded" 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required className="w-full border p-2 rounded" 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>

          {/* Admin Secret Code (Optional) */}
          <div className="pt-2 border-t mt-4">
             <label className="block text-xs font-medium text-gray-400 mb-1">Admin Code (Optional)</label>
             <input type="text" className="w-full border p-2 rounded text-sm" placeholder="Only for Admins"
               onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}