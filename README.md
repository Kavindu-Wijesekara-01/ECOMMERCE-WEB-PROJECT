# 💻 PC Solution - Advanced Full-Stack E-commerce Platform

![Project Banner](https://media.licdn.com/dms/image/v2/D5622AQHDc1Yv4Kspaw/feedshare-shrink_2048_1536/B56ZvUlkg8IsAk-/0/1768798177578?e=1770854400&v=beta&t=YI-GTyrB9cl8g3R36HkXksW64530GdjGpIslAHBfW8E)

A production-ready, full-stack e-commerce application engineered for performance, security, and scalability. Built with **Next.js 16 (App Router)**, **MongoDB**, and **Tailwind CSS**. This platform goes beyond basic CRUD operations, featuring advanced serverless architecture, robust security protocols, and intelligent inventory management.

---

## 🔥 Enterprise-Grade Features

### ⚡ Architecture & Performance Optimization
* **Serverless Architecture:** Utilizes Next.js API routes acting as serverless functions, ensuring high scalability without the overhead of managing a traditional always-on server.
* **Incremental Static Regeneration (ISR):** Implemented advanced caching (`revalidate: 60`) on the homepage. Products are served from cache for instant loading speeds (0 delay), while automatically revalidating data every 60 seconds.
* **Instant Navigation:** Leveraged Next.js `<Link prefetch={true}>` for background data fetching, resulting in seamless, SPA-like instantaneous page transitions.

### 🛡️ Robust Security Protocols
* **Admin API Protection:** Secure server-side validation using NextAuth sessions. Prevents unauthorized POST/PUT/DELETE requests at the API route level, ensuring only authorized admins can modify the database.
* **Strict Input Validation (Zod):** Integrated **Zod** schema validation across API endpoints to sanitize user input, prevent NoSQL injections, and block invalid data (e.g., negative prices/stock) from reaching the database.
* **Rate Limiting (Anti-Spam):** Custom in-memory rate-limiting middleware implemented on critical endpoints (like Order placement) to prevent bot spamming and database exhaustion (e.g., limited to 3 orders per IP per minute).

### 🛒 Smart Inventory & Stock Management
* **Atomic Stock Deduction:** Automatically and securely reduces product stock in the database immediately after a confirmed order.
* **"Out of Stock" Intelligence:** * Automatically disables "Add to Cart" buttons for zero-stock items.
    * Visual indicators: Products dynamically appear in **Grayscale** with a "Sold Out" badge when unavailable.
* **Inventory Protection:** System actively prevents users from adding or ordering more items than currently available in the database.

### ⭐ Interactive User Experience (UI/UX)
* **Dynamic Star Rating System:** Custom-built 5-star rating input with real-time **hover & click effects**.
* **Smart Related Products:** Algorithms that automatically suggest similar products from the same category.
* **Responsive Marquee:** Auto-scrolling promo banners for offers and new arrivals.
* **Toast Notifications:** Beautiful, non-intrusive popup notifications for cart actions and order success using `react-hot-toast`.

### 💳 Seamless Checkout & Admin Panel
* **Optimized Checkout Flow:** Single-page checkout with delivery details, dynamic total calculation, and order summary.
* **Admin Dashboard:** Full **CRUD** capabilities for Products and comprehensive views of customer orders.
* **Protected Routes:** Middleware to prevent unauthorized access to Admin UI pages.

---

## 🛠️ Tech Stack

* **Frontend:** [Next.js 16](https://nextjs.org/) (App Router), React, Tailwind CSS
* **Backend:** Next.js Serverless API Routes
* **Database:** [MongoDB Atlas](https://www.mongodb.com/) & [Mongoose ODM](https://mongoosejs.com/)
* **Authentication:** [NextAuth.js v5](https://next-auth.js.org/)
* **Security & Validation:** [Zod](https://zod.dev/)
* **State Management:** React Context API (Cart State)

---

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in the root directory and add the following:

```env
# MongoDB Connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pcsolution_db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_random_string