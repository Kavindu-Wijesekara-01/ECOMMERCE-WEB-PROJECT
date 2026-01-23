# 💻 PC Solution - Next.js E-commerce Platform

![Project Banner](public/banner.png)
> *Note: Please add a screenshot of your website named `banner.png` to the `public` folder.*

A modern, full-stack e-commerce application built with **Next.js 16 (App Router)**, **MongoDB**, and **Tailwind CSS**. Designed for computer accessories and tech products, featuring automated stock management, user authentication, and a dynamic shopping cart.

## 🚀 Key Features

### 🛒 User Experience
* **Product Browsing:** Filter products by categories (Keyboards, Mouse, Headsets, etc.) with search functionality.
* **Smart Cart System:** Real-time cart updates using React Context API.
* **Interactive Reviews:** 5-star rating system with hover effects and user comments.
* **Related Products:** Automatically suggests similar items on product pages.

### 💳 Checkout & Orders
* **Seamless Checkout:** User-friendly address form with a summary view.
* **Stock Management:** **Automated stock reduction** upon order placement (Prevents ordering out-of-stock items).
* **Order History:** Users can track their past orders and status.

### 🛡️ Admin & Security
* **Secure Authentication:** Powered by **NextAuth.js** (Credentials Provider).
* **Admin Dashboard:** Manage products (Add/Edit/Delete) and view customer orders.
* **Data Validation:** Robust form validation and error handling.

---

## 🛠️ Tech Stack

* **Frontend:** [Next.js 14](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
* **Backend:** Next.js API Routes (Serverless Functions)
* **Database:** [MongoDB Atlas](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Notifications:** React Hot Toast

---

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in the root directory and add the following variables:

```env
# Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pcsolution_db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=put_a_long_random_string_here

# Admin Access (Optional)
ADMIN_SECRET=ADMIN_POWER_123