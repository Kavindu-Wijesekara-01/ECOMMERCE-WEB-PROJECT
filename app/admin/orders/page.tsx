import {connectToDatabase} from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateOrderStatus } from "@/app/actions/updateOrderStatus";

export default async function AdminOrdersPage() {
  const session = await auth();

  // Admin ද කියලා check කරනවා
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  await connectToDatabase();
  const orders = await Order.find({}).sort({ createdAt: -1 });

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Customer Orders</h1>
          <Link 
            href="/admin" 
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4 border-b">Order Details</th>
                  <th className="p-4 border-b">Customer</th>
                  <th className="p-4 border-b">Items</th>
                  <th className="p-4 border-b">Amount</th>
                  <th className="p-4 border-b text-center">Current Status</th>
                  <th className="p-4 border-b text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No orders found yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 align-top">
                        <span className="font-mono text-xs text-gray-400">#{order._id.toString().slice(-6)}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <p className="font-bold text-sm">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-[150px] leading-tight">{order.address}</p>
                        <p className="text-xs text-blue-500 mt-1">{order.userEmail}</p>
                      </td>
                      <td className="p-4 align-top">
                        <ul className="text-sm space-y-1">
                          {order.items.map((item: any, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="bg-gray-100 px-1.5 rounded text-xs font-mono font-bold">x{item.quantity}</span>
                              <span className="truncate max-w-[200px]" title={item.title}>{item.title}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 align-top font-bold text-gray-900">
                        Rs. {order.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-4 align-top text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          order.status === "Pending" 
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200" 
                            : order.status === "Confirmed" 
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : order.status === "Delivered" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 align-top text-right">
                        
                        {/* 1. Pending නම් Confirm කරන්න Button එක */}
                        {order.status === "Pending" && (
                          <form action={updateOrderStatus}>
                            <input type="hidden" name="orderId" value={order._id.toString()} />
                            <input type="hidden" name="newStatus" value="Confirmed" />
                            
                            <button 
                              type="submit" 
                              className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-1 ml-auto"
                            >
                              ✓ Confirm Order
                            </button>
                          </form>
                        )}
                        
                        {/* 2. Confirmed නම් Delivered කරන්න Button එක */}
                        {order.status === "Confirmed" && (
                           <form action={updateOrderStatus}>
                            <input type="hidden" name="orderId" value={order._id.toString()} />
                            <input type="hidden" name="newStatus" value="Delivered" />
                            <button type="submit" className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700 transition shadow-sm flex items-center gap-1 ml-auto">
                              🚚 Mark Delivered
                            </button>
                          </form>
                        )}

                        {/* 3. Delivered නම් Completed පෙන්නනවා */}
                        {order.status === "Delivered" && (
                          <span className="text-xs font-medium text-gray-400 italic flex items-center justify-end gap-1">
                            ✅ Completed
                          </span>
                        )}

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}