"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full mb-8 relative group">
      <div className="relative flex items-center">
        {/* Input Icon */}
        <div className="absolute left-4 text-gray-700 group-focus-within:text-orange-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search for products "
          className="w-full pl-14 pr-32 py-3 rounded-3xl border border-gray-200 bg-white text-slate-800 
                     shadow-xl shadow-slate-700/10 text-md
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent 
                     transition-all duration-300 placeholder:text-gray-400 text-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Search Button */}
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-orange-600 text-white px-6 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}