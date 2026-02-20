// app/page.tsx

import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Link from "next/link";
import SearchBar from "./components/SearchBar";
import PromoMarquee from "./components/PromoMarquee";
import FilterSidebar from "./components/FilterSidebar";

// 🚀 අලුත් වෙනස: මෙතනින් තමයි Next.js 16 වලට කියන්නේ මේ පේජ් එක Cache කරන්න කියලා.
// මේකෙන් අදහස් වෙන්නේ, තත්පර 60කට සැරයක් තමයි Database එකෙන් අලුත් Data ගන්නේ. අනිත් වෙලාවට 'ක්ෂණයෙන්' ලෝඩ් වෙනවා.
export const revalidate = 60; 



export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await connectToDatabase();

  const searchParams = await props.searchParams;
  
  const selectedCategory = (searchParams.category as string) || "All";
  const searchQuery = (searchParams.search as string) || "";
  const sortOption = (searchParams.sort as string) || "latest";

  // Categories ගන්නවා (මේවත් දැන් Cache වෙනවා)
  const distinctCategoriesData = await Product.distinct("category");
  const distinctCategories = distinctCategoriesData.map((cat) => String(cat));
  const allCategories = ["All", ...distinctCategories.sort()];

  // Query එක හදනවා
  const query: any = {};
  if (selectedCategory !== "All") query.category = selectedCategory;
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: "i" } },
      { brand: { $regex: searchQuery, $options: "i" } },
    ];
  }

  // Sort Logic
  let sortQuery: any = { stock: -1, createdAt: -1 };
  if (sortOption === "price_asc") sortQuery = { price: 1 };
  else if (sortOption === "price_desc") sortQuery = { price: -1 };

  // Next.js එකෙන් මේ Products ටික Cache කරලා තියාගන්නවා
  const products = await Product.find(query).sort(sortQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-[95%] xl:max-w-[1600px] mx-auto px-2 sm:px-4 flex flex-col md:flex-row gap-6 pb-10 pt-6">
        
        {/* --- Sidebar Area --- */}
        <div className="flex-shrink-0 md:w-64 sticky top-20 md:top-24 z-30 h-fit">
           <FilterSidebar categories={allCategories} />
        </div>

        {/* --- Main Content Area --- */}
        <div className="flex-1 min-w-0">
          <PromoMarquee />
          
          <SearchBar />

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2 mt-6">
            <div>
               <h1 className="text-2xl font-bold text-slate-800">
                {searchQuery ? `Search: "${searchQuery}"` : (selectedCategory === "All" ? "All Products" : selectedCategory)}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Sorted by: <span className="text-orange-600 font-medium">
                  {sortOption === "latest" ? "Newest" : sortOption === "price_asc" ? "Price (Low > High)" : "Price (High > Low)"}
                </span>
              </p>
            </div>
            
            <span className="text-sm font-bold bg-white px-4 py-1.5 rounded-full border border-gray-200 text-slate-700 shadow-sm mt-2 sm:mt-0">
              {products.length} Items Found
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No items found.</p>
              <Link href="/" className="text-orange-600 hover:text-orange-700 hover:underline mt-2 inline-block font-bold">
                Clear All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
              {products.map((product) => (
                <Link 
                  href={`/product/${product._id}`} 
                  key={product._id} 
                  // 👇 අලුත් වෙනස: prefetch={true} එකතු කළා, එතකොට Link එක Click කරන්න කලින්ම Page එක ලෝඩ් වෙනවා.
                  prefetch={true}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group relative"
                >
                  <div className="relative h-36 sm:h-44 w-full bg-white p-3 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded shadow-md transform -rotate-6">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex flex-col flex-grow">
                    <div className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider mb-1 truncate">
                      {product.brand}
                    </div>
                    
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-1 line-clamp-2 leading-tight min-h-[2.5rem]" title={product.title}>
                      {product.title}
                    </h3>
                    
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      
                      <span className="text-[10px] sm:text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1.5 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                        View
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}