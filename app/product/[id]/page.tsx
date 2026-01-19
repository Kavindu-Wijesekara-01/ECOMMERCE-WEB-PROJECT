import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { notFound } from "next/navigation";
import AddToCartButton from "../../components/AddToCartButton";
import Link from "next/link";
import { auth } from "@/auth";
import { addReview } from "@/app/actions/addReview";

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await connectToDatabase();
  const session = await auth();

  const product = await Product.findById(params.id);
  if (!product) return notFound();

  const reviews = await Review.find({ productId: params.id }).sort({ createdAt: -1 });

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:px-4">
      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto">
        
        {/* --- Breadcrumb --- */}
        <Link href="/" className="text-xs sm:text-sm text-gray-500 hover:text-orange-600 font-medium mb-4 inline-flex items-center gap-1 transition-colors">
          ← Back to Shop
        </Link>

        {/* --- Product Main Card (Compact Version) --- */}
        {/* Padding අඩු කළා (p-6), Margin අඩු කළා (mb-8) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Image (Height අඩු කළා) */}
            <div className="bg-white p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative group">
              <div className="relative w-full h-56 sm:h-64 md:h-80 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right: Details (Font sizes සහ Spacing අඩු කළා) */}
            <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-[10px] sm:text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                  {product.category}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 ml-2 uppercase tracking-wider">{product.brand}</span>
              </div>

              {/* Title Size අඩු කළා */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Price Size අඩු කළා */}
              <div className="flex flex-wrap items-end gap-3 mb-5 border-b border-gray-100 pb-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Rs. {product.price.toLocaleString()}
                </p>
                {product.stock > 0 ? (
                   <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    In Stock
                   </span>
                ) : (
                   <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                    Out of Stock
                   </span>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm prose-slate text-slate-600 mb-6 leading-relaxed line-clamp-4 md:line-clamp-none">
                <p>{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                 {product.stock > 0 ? (
                    <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                 ) : (
                    <button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-xl cursor-not-allowed text-sm">
                      Unavailable
                    </button>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Reviews Section (Moved Up ⬆️) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Review Form (Sticky on Desktop) */}
          <div className="lg:col-span-1 h-fit lg:sticky lg:top-24">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-slate-800 mb-3">Write a Review</h3>
              
              {session ? (
                <form action={addReview} className="space-y-3">
                  <input type="hidden" name="productId" value={params.id} />
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Rating</label>
                    <div className="relative">
                        <select name="rating" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                          <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                          <option value="4">⭐⭐⭐⭐ - Good</option>
                          <option value="3">⭐⭐⭐ - Average</option>
                          <option value="2">⭐⭐ - Poor</option>
                          <option value="1">⭐ - Very Bad</option>
                        </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Your Comment</label>
                    <textarea 
                      name="comment" 
                      required 
                      rows={3} 
                      placeholder="Share your thoughts..." 
                      className="w-full border border-gray-300 p-3 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 text-sm transition shadow-md">
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Login to review</p>
                  <Link href="/login" className="inline-block bg-orange-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-orange-700 transition">
                    Login Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                Customer Reviews 
                <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{reviews.length}</span>
              </h3>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-1">No reviews yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review._id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-xs sm:text-sm text-slate-900">{review.userName}</p>
                                <div className="flex text-orange-400 text-[10px]">
                                    {[...Array(5)].map((_, i) => (
                                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="pl-10">
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                            "{review.comment}"
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Related Products Section (Moved Down ⬇️) --- */}
        {relatedProducts.length > 0 && (
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-600 rounded-full"></span>
              You might also like
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((relProduct) => (
                <Link 
                  href={`/product/${relProduct._id}`} 
                  key={relProduct._id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group relative"
                >
                  <div className="relative h-32 sm:h-40 w-full bg-white p-3 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                    <img
                      src={relProduct.imageUrl}
                      alt={relProduct.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <div className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider mb-0.5 truncate">
                      {relProduct.brand}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-1 line-clamp-2 leading-tight min-h-[2rem]" title={relProduct.title}>
                      {relProduct.title}
                    </h3>
                    <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
                      <span className="text-sm font-extrabold text-slate-900">
                        Rs. {relProduct.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        View
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}