# 💻 PC Solution - Advanced E-commerce Platform

![Project Banner](https://media.licdn.com/dms/image/v2/D5622AQHDc1Yv4Kspaw/feedshare-shrink_2048_1536/B56ZvUlkg8IsAk-/0/1768798177578?e=1770854400&v=beta&t=YI-GTyrB9cl8g3R36HkXksW64530GdjGpIslAHBfW8E)

A fully functional, full-stack e-commerce application built with **Next.js 16 (App Router)**, **MongoDB**, and **Tailwind CSS**. This platform is engineered with advanced stock management logic, interactive UI components, and a secure admin dashboard.

## 🚀 Advanced Features

### 🛒 Smart Inventory & Stock Management
* **Real-time Stock Deduction:** Automatically reduces product stock in the database immediately after a confirmed order.
* **"Out of Stock" Intelligence:** * Automatically disables "Add to Cart" buttons for 0 stock items.
    * Visual indicators: Products appear in **Grayscale** with a "Sold Out" badge when unavailable.
* **Inventory Protection:** Prevents users from ordering more items than available in the inventory.

### ⭐ Interactive User Experience (UI/UX)
* **Dynamic Star Rating System:** Custom-built 5-star rating input with real-time **hover & click effects** (Orange/Gray logic).
* **Smart Related Products:** Algorithms that automatically suggest similar products from the same category (excluding the currently viewed item).
* **Responsive Marquee:** Auto-scrolling promo banners for offers and new arrivals.
* **Toast Notifications:** Beautiful popup notifications for cart actions and order success (using `react-hot-toast`).

### 💳 Seamless Checkout Process
* **Optimized Checkout Flow:** Single-page checkout with delivery details and order summary.
* **Visual Payment Form:** Professional UI for credit card details entry (Front-end simulation).
* **Order Tracking:** Users can view their full order history with status updates.

### 🛡️ Admin Power & Security
* **Secure Authentication:** Powered by **NextAuth.js** with secure session management.
* **Admin Dashboard:** * Full **CRUD** capabilities (Create, Read, Update, Delete) for Products.
    * View all customer orders and details.
* **Protected Routes:** Middleware to prevent unauthorized access to Admin pages.

---

## 🛠️ Tech Stack

* **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
* **Backend:** Next.js Server Actions & API Routes
* **Database:** [MongoDB Atlas](https://www.mongodb.com/) & [Mongoose ODM](https://mongoosejs.com/)
* **Authentication:** [NextAuth.js v5](https://next-auth.js.org/)
* **State Management:** React Context API (Cart)

