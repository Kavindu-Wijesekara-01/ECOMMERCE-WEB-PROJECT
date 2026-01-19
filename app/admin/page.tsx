"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminPage() {
  // view: 'list' (Default) | 'add' | 'orders'
  const [currentView, setCurrentView] = useState("list");
  
  // --- States ---
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  
  // Form State
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    image: "", 
    stock: "",
  });

  // Load Data based on View
  useEffect(() => {
    if (currentView === "list") fetchProducts();
    if (currentView === "orders") fetchOrders();
  }, [currentView]);

  // --- API Functions ---
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?t=${new Date().getTime()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/all");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(isEditing ? "Updating..." : "Adding...");

    try {
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing ? { ...productForm, id: editId } : productForm;

      const res = await fetch("/api/products", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(isEditing ? "Product Updated!" : "Product Added!", { id: loadingToast });
        setProductForm({ title: "", description: "", price: "", category: "", brand: "", image: "", stock: "" });
        setIsEditing(false);
        setEditId("");
        setCurrentView("list"); // Save කළාම ආපහු List එකට යනවා
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Error occurred", { id: loadingToast });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const loadingToast = toast.loading("Deleting...");
    
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Deleted!", { id: loadingToast });
        fetchProducts();
      } else {
        toast.error("Failed to delete", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Error", { id: loadingToast });
    }
  };

  const handleEditClick = (product: any) => {
    setIsEditing(true);
    setEditId(product._id);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      image: product.imageUrl || product.image,
      stock: product.stock,
    });
    setCurrentView("add"); // Form එකට මාරු වෙනවා
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    toast.promise(
      fetch("/api/orders/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      }).then(async (res) => {
        if (!res.ok) throw new Error();
        setOrders((prev: any) =>
          prev.map((o: any) => o._id === orderId ? { ...o, status: newStatus } : o)
        );
      }),
      { loading: 'Updating...', success: 'Status Updated!', error: 'Failed' }
    );
  };

  // --- Components ---

  // Common Header
  const Header = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
      <button 
        onClick={() => { setCurrentView("list"); setIsEditing(false); }}
        className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition text-sm"
      >
        ← Back to Inventory
      </button>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h1>
    </div>
  );

  // 1. Inventory List View (Default Landing)
  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Top Bar with Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
                <p className="text-sm text-gray-500">Manage your products here</p>
             </div>
             
             <div className="flex w-full sm:w-auto gap-3">
                {/* Manage Orders Button */}
                <button 
                  onClick={() => setCurrentView("orders")}
                  className="flex-1 sm:flex-none bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-900 transition flex items-center justify-center gap-2"
                >
                  📦 Manage Orders
                </button>

                {/* Add Item Button */}
                <button 
                  onClick={() => { 
                    setIsEditing(false); 
                    setProductForm({ title: "", description: "", price: "", category: "", brand: "", image: "", stock: "" }); 
                    setCurrentView("add"); 
                  }} 
                  className="flex-1 sm:flex-none bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-700 transition flex items-center justify-center gap-2"
                >
                  ➕ Add Item
                </button>
             </div>
          </div>

          {/* Product List */}
          {isLoading ? <div className="text-center py-20 text-gray-400">Loading inventory...</div> : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               {products.length === 0 ? (
                 <div className="text-center py-10">
                    <p className="text-gray-400 mb-2">Inventory is empty.</p>
                    <button onClick={() => setCurrentView("add")} className="text-orange-600 font-bold text-sm hover:underline">Add your first item</button>
                 </div>
               ) : (
                 <div className="divide-y divide-gray-100">
                    {products.map((p: any) => (
                      <div key={p._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 p-1 flex-shrink-0">
                               <img src={p.imageUrl || p.image} alt="" className="w-full h-full object-contain" />
                            </div>
                            <div>
                               <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.title}</p>
                               <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                  <span className="bg-gray-100 px-1.5 rounded">{p.category}</span>
                                  <span className={p.stock > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                     {p.stock > 0 ? `In Stock: ${p.stock}` : "Out of Stock"}
                                  </span>
                                  <span>Rs. {p.price}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => handleEditClick(p)} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition">Edit</button>
                            <button onClick={() => handleDeleteProduct(p._id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition">Del</button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Add / Edit View
  if (currentView === "add") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <Header title={isEditing ? "Update Product" : "Add New Product"} />
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                  value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Brand</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                  value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Price (Rs)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                    value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Stock Qty</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                    value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <input type="text" list="cat-list" placeholder="Select or Type..." className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                  value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required />
                <datalist id="cat-list">
                  <option value="Laptops" /><option value="Monitors" /><option value="Mouse" /><option value="Keyboards" />
                  <option value="Headsets" /><option value="Processors" /><option value="VGA Cards" /><option value="SSD" />
                </datalist>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                  value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none" 
                  value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
              </div>
              
              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition shadow-md">
                {isEditing ? "Save Changes" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. Orders View
  if (currentView === "orders") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <Header title="Manage Orders" />

          {isLoading ? <p className="text-center p-10 text-gray-400">Loading orders...</p> : (
            <div className="space-y-4">
              {orders.length === 0 ? <p className="text-center text-gray-400 py-10">No orders yet.</p> : (
                orders.map((order: any) => (
                  <div key={order._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                       <div>
                          <p className="font-bold text-slate-800">{order.customerName}</p>
                          <p className="text-xs text-gray-500 font-mono">ID: {order._id}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-orange-600 text-lg">Rs. {order.totalAmount.toLocaleString()}</p>
                       </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                          ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {order.status}
                       </span>
                       <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                       >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                       </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}