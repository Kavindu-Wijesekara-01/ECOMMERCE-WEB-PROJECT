"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface FilterSidebarProps {
  categories: string[];
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "All";
  const sortOption = searchParams.get("sort") || "latest";
  const searchQuery = searchParams.get("search") || "";

  // URL හදන Function එක
  const buildUrl = (cat: string, sort: string) => {
    const params = new URLSearchParams();
    if (cat !== "All") params.set("category", cat);
    if (searchQuery) params.set("search", searchQuery);
    if (sort !== "latest") params.set("sort", sort);
    return `/?${params.toString()}`;
  };

  return (
    <>
      {/* --- Mobile Toggle Button --- */}
      {/* Mobile එකට විතරක් Dark Button එක ලස්සනයි, ඒක එහෙමම තිබ්බා */}
      <div className="md:hidden sticky top-20 z-40 bg-gray-50/95 backdrop-blur-sm py-3 mb-4 -mx-4 px-4 shadow-sm border-b border-orange-100">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-slate-800 transition border-b-4 border-orange-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filter & Sort Products
        </button>
      </div>

      {/* --- Sidebar Content --- */}
      <aside 
        className={`
          fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:static md:bg-transparent md:z-auto md:w-full md:block
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible md:opacity-100 md:visible"}
        `}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`
            fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-white p-6 shadow-2xl transform transition-transform duration-300 overflow-y-auto
            md:sticky md:top-24 md:translate-x-0 md:w-full md:shadow-none md:p-0 md:bg-transparent md:h-fit md:rounded-xl md:overflow-visible
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header (Close Button) */}
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-xl font-bold text-slate-900">Filters</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* --- 1. Categories Section (Light Theme with Accents) --- */}
          <div className="bg-white md:p-5 md:rounded-xl md:shadow-sm md:border md:border-gray-200 mb-6 group hover:border-orange-200 transition-colors duration-300">
            {/* Header with Orange Accent Line */}
            <h2 className="font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2 text-lg">
              <span className="bg-orange-600 w-1.5 h-6 rounded-full"></span>
              Categories
            </h2>
            
            <div className="max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={buildUrl(cat, sortOption)}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium flex justify-between items-center ${
                        selectedCategory === cat
                          ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500 shadow-sm" // Active State
                          : "text-gray-600 hover:bg-gray-50 hover:text-orange-600 hover:pl-4" // Hover State
                      }`}
                    >
                      {cat}
                      {/* Active වුනාම පොඩි ඊතලයක් පෙන්නනවා */}
                      {selectedCategory === cat && (
                        <span className="text-orange-500 text-xs">●</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- 2. Sort By Section (Light Theme with Accents) --- */}
          <div className="bg-white md:p-5 md:rounded-xl md:shadow-sm md:border md:border-gray-200 group hover:border-orange-200 transition-colors duration-300">
            <h2 className="font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2 text-lg">
              <span className="bg-orange-600 w-1.5 h-6 rounded-full"></span>
              Sort By
            </h2>
            <ul className="space-y-2">
              {[
                { label: "Newest Arrivals", value: "latest" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" }
              ].map((option) => (
                <li key={option.value}>
                  <Link
                    href={buildUrl(selectedCategory, option.value)}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all border ${
                      sortOption === option.value 
                        ? "text-slate-900 font-bold bg-white border-orange-200 shadow-sm" 
                        : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-slate-800"
                    }`}
                  >
                    {/* Custom Radio Button */}
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      sortOption === option.value ? "border-orange-500" : "border-gray-300"
                    }`}>
                      {sortOption === option.value && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                    </span>
                    {option.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </aside>
    </>
  );
}