import {connectToDatabase} from "@/lib/db";
import Product from "@/models/Product";
import { updateProduct } from "@/app/actions/updateProduct";
import { notFound } from "next/navigation";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await connectToDatabase();
  const product = await Product.findById(params.id);

  if (!product) return notFound();

  return (
    // පසුබිම ලා අළු පාට (gray-50) සහ අකුරු තද අළු (gray-900) කළා
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl border border-gray-200 p-8">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            ID: {product._id.toString().slice(-6)}
          </span>
        </div>
        
        <form action={updateProduct} className="space-y-6">
          <input type="hidden" name="id" value={product._id.toString()} />

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Title</label>
            <input 
              type="text" 
              name="title" 
              defaultValue={product.title} 
              required 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (LKR)</label>
              <input 
                type="number" 
                name="price" 
                defaultValue={product.price} 
                required 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
              />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
              <input 
                type="number" 
                name="stock" 
                defaultValue={product.stock} 
                required 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input 
                type="text" 
                name="category" 
                defaultValue={product.category} 
                required 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
              />
            </div>
            {/* Brand */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
               <input 
                 type="text" 
                 name="brand" 
                 defaultValue={product.brand} 
                 required 
                 className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
               />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
            <input 
              type="text" 
              name="imageUrl" 
              defaultValue={product.imageUrl} 
              required 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" 
              defaultValue={product.description} 
              required 
              rows={5} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white leading-relaxed"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              Update Product
            </button>
            {/* Cancel Button (Go back to Dashboard) */}
            <a 
              href="/admin" 
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition text-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}