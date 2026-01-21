import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { notFound } from "next/navigation";
import AddToCartButton from "../../components/AddToCartButton";
import StarRatingInput from "../../components/StarRatingInput"; // අලුත් Component එක Import කළා
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

        {/* --- Product Main Card --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Image */}
            <div className="bg-white p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative group">
              <div className="relative w-full h-64 sm:h-72 md:h-96 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className={`max-w-full max-h-full object-contain mix-blend-multiply transition-all duration-500 ${product.stock === 0 ? "grayscale opacity-70" : "group-hover:scale-105"}`}
                />
                
                {/* Stock 0 නම් පින්තූරේ උඩ ලොකුවට පෙන්වනවා */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
                     <div className="bg-red-600 text-white px-6 py-2 text-xl font-bold uppercase tracking-widest shadow-xl transform -rotate-12 border-4 border-white">
                        Out of Stock
                     </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div className="p-5 sm:p-6 md:p-8 flex flex-col justify-center relative">
              <div className="mb-2">
                <span className="text-[10px] sm:text-xs font-extrabold text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                  {product.category}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 ml-2 uppercase tracking-wider">{product.brand}</span>
              </div>

              <h1 className="text-xl sm:text-xl md:text-2xl font-extrabold text-slate-700 mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Price & Stock Status */}
              <div className="flex flex-wrap items-end gap-3 mb-5 border-b border-gray-100 pb-4">
                <p className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                  Rs. {product.price.toLocaleString()}
                </p>
                
                {product.stock > 0 ? (
                   <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    In Stock
                   </span>
                ) : (
                   <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200 uppercase tracking-wide">
                    ⚠️ Out of Stock
                   </span>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-sm prose-slate text-slate-600 mb-6 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                 {product.stock > 0 ? (
                    <AddToCartButton product={JSON.parse(JSON.stringify(product))} />
                 ) : (
                    <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed text-sm uppercase tracking-wider border-2 border-gray-200 border-dashed">
                      Currently Unavailable
                    </button>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Reviews Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Review Form */}
          <div className="lg:col-span-1 h-fit lg:sticky lg:top-24">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-slate-800 mb-4">Write a Review</h3>
              
              {session ? (
                <form action={addReview} className="space-y-4">
                  <input type="hidden" name="productId" value={params.id} />
                  
                  {/* New Star Rating Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Add Your Rating</label>
                    <StarRatingInput />
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

                  <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 text-sm transition shadow-md">
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">Please login to write a review</p>
                  <Link href="/login" className="inline-block bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-orange-700 transition">
                    Login / Register
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
                <div className="text-center py-12 flex flex-col items-center justify-center">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-gray-900 font-medium text-sm">No reviews yet</p>
                    <p className="text-gray-400 text-xs">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review._id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                                {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-slate-900">{review.userName}</p>
                                <div className="flex text-orange-400 text-xs mt-0.5">
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
                      <div className="pl-12">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {review.comment}
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Related Products Section --- */}
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
                      className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-300 ${relProduct.stock === 0 ? "grayscale opacity-60" : "group-hover:scale-105"}`}
                    />
                     {relProduct.stock === 0 && (
                        <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">OUT OF STOCK</span>
                     )}
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