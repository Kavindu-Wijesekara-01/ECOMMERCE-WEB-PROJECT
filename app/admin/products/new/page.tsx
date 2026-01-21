import { addProduct } from "@/app/actions/addProduct";
import {connectToDatabase} from "@/lib/db";
import Product from "@/models/Product";

export default async function AddProductPage() {
  await connectToDatabase();
  
  // 👇 මෙතනත් Error එක හදන්න Data ටික String කරන්න ඕන
  const rawCategories = await Product.distinct("category");
  const categories = rawCategories.map((cat) => String(cat));

  return (
    // පසුබිම සුදු කරන්න 'bg-white' සහ අකුරු කළු කරන්න 'text-gray-900' දැම්මා
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Add New Product</h1>
        
        <form action={addProduct} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Title</label>
            <input type="text" name="title" required placeholder="Ex: Gaming Monitor" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (LKR)</label>
              <input type="number" name="price" required placeholder="0.00" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
            </div>
            {/* Stock */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
              <input type="number" name="stock" required placeholder="0" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category (Manual Type or Select) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              
              {/* මේක සාමාන්‍ය Input එකක් වගේමයි. Type කරන්න පුළුවන්. */}
              <input 
                list="category-options" 
                name="category" 
                required 
                placeholder="Type new or select..." 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" 
                autoComplete="off"
              />
              {/* යටින් Suggestion List එක එනවා */}
              <datalist id="category-options">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Brand */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
               <input type="text" name="brand" required placeholder="Ex: ASUS" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
            <input type="text" name="imageUrl" required placeholder="https://..." className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea name="description" required rows={4} placeholder="Product details..." className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg text-lg">
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
}