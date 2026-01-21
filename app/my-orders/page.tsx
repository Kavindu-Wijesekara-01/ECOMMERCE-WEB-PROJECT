import { auth } from "@/auth";
import {connectToDatabase} from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectToDatabase();
  
  // 👇 මෙන්න මේ වෙනස කරන්න
  // 1. Data ටික Database එකෙන් ගන්නවා
  const ordersData = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

  // 2. ඒක Plain JSON වලට හරවනවා (මේකෙන් _id එක string එකක් වෙනවා)
  const orders = JSON.parse(JSON.stringify(ordersData));

  // Status Bar එක හදන Function එක (පරණ එකමයි)
  const getProgress = (status: string) => {
    switch(status) {
        case 'Pending': return 10;
        case 'Processing': return 40;
        case 'Shipped': return 75;
        case 'Delivered': return 100;
        default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* ... ඉතුරු HTML ටික පරණ විදියමයි ... */}
      
      {/* දැන් මෙතන order._id භාවිතා කළාට Error එන්නේ නෑ, මොකද උඩදි අපි ඒක String කළා */}
      {/* <p className="font-mono text-sm">{order._id}</p> */}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/" className="text-orange-600 font-bold hover:underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Order ID</p>
                    {/* 👇 දැන් මේක වැඩ කරනවා */}
                    <p className="font-mono text-sm">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Total Amount</p>
                    <p className="font-bold text-orange-400">Rs. {order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${order.status === 'Delivered' ? 'bg-green-500 text-white' : 
                        order.status === 'Cancelled' ? 'bg-red-500 text-white' :
                        'bg-orange-500 text-white'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center mb-2 last:mb-0 text-sm border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                      <span className="text-slate-700 font-medium">{item.title} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span className="font-bold text-slate-900">Rs. {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Bar Area */}
                {order.status !== 'Cancelled' && (
                  <div className="px-6 pb-8">
                     <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Order Progress</p>
                     <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                           className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-500'}`}
                           style={{ width: `${getProgress(order.status)}%` }}
                        ></div>
                     </div>
                     <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
                        <span className={order.status === 'Pending' ? 'text-orange-600' : ''}>Placed</span>
                        <span className={order.status === 'Processing' ? 'text-orange-600' : ''}>Processing</span>
                        <span className={order.status === 'Shipped' ? 'text-blue-600' : ''}>Shipped</span>
                        <span className={order.status === 'Delivered' ? 'text-green-600' : ''}>Delivered</span>
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}