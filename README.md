# E-Commerce & Custom Merchandise Platform

A full-stack custom merchandise e-commerce platform built with Node.js, Express, TypeScript, MongoDB, React, Redux Toolkit, and Tailwind CSS.

- **GitHub Repository**: [https://github.com/AbhayTripathi8090/ecom](https://github.com/AbhayTripathi8090/ecom)

---

## 📌 Project Overview

This project consists of three core components:
1. **Server (`/server`)**: Node.js & Express REST API powered by TypeScript, Mongoose, Zod validation, JWT authentication, and Cloudinary media upload.
2. **Customer Client (`/client`)**: React + Vite frontend application for customers to browse merchandise, customize prints (DTF, Screen Printing, Embroidery), manage cart & wishlist, and place orders.
3. **Admin Dashboard (`/admin`)**: React + Vite admin portal for managing products, categories, orders, customers, shipping, and viewing analytics dashboards.

---

## 🛠️ Project Setup Steps

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Instance (MongoDB Atlas or Local MongoDB)

### Installation & Local Execution

#### 1. Clone the Repository
```bash
git clone https://github.com/AbhayTripathi8090/ecom.git
cd ecom
```

#### 2. Backend Server Setup
```bash
cd server
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```
The server will start on `http://localhost:5000`.

#### 3. Frontend Client Setup
```bash
cd ../client
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```
The client app will run on `http://localhost:5173`.

#### 4. Admin Portal Setup
```bash
cd ../admin
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```
The admin portal will run on `http://localhost:5174` (or next available port).

---

## 🔐 Environment Variables

### Server (`server/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server listening port | `5000` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0` |
| `DB_NAME` | Database Name | `merch_store` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_super_secret_jwt_key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |
| `STRIPE_SECRET_KEY` | Stripe Secret API Key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Signing Secret | `whsec_...` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `your_razorpay_secret` |

### Client (`client/.env`)
| Variable | Description | Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base REST API URL | `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe Publishable Key | `pk_test_...` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` |

### Admin (`admin/.env`)
| Variable | Description | Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base REST API URL for Admin | `http://localhost:5000/api/v1` |

---

## 🗄️ Database Setup

The project uses MongoDB with Mongoose ODM. Schemas are structured modularly under `server/src/modules/`:
- **Users**: User authentication, profiles, role-based permissions (`user`, `admin`).
- **Products**: Merchandise items, price, discount price, brand, print customization options, images, and ratings.
- **Categories**: Product categories and taxonomies.
- **Cart**: User cart items with quantities and custom printing specifications.
- **Wishlist**: Saved product collection per user for easy access and purchase.
- **Orders**: Customer orders, item snapshots, shipping addresses, order status tracking.
- **Payments**: Payment tracking, Razorpay Orders, Stripe PaymentIntents, signature verification, webhook handlers, and manual verification.
- **Shipping**: Shipping methods, rates, and tracking details.

---

## 🔑 Demo Credentials

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `AdminPass123!`
- **Role**: `admin`

### Customer Account
- **Email**: `customer@example.com`
- **Password**: `CustomerPass123!`
- **Role**: `user`

---

## 🌐 API Documentation

Base Endpoint: `http://localhost:5000/api/v1`

### Auth Routes (`/auth`)
- `POST /auth/register` - Register new customer account
- `POST /auth/login` - User authentication & JWT cookie issuance
- `POST /auth/logout` - Logout & clear session
- `GET /auth/me` - Fetch currently logged-in user details

### Wishlist Routes (`/wishlist`)
- `GET /wishlist` - Get current user's saved wishlist items
- `POST /wishlist/products` - Add product to user wishlist (`{ productId }`)
- `DELETE /wishlist/products/:productId` - Remove product from wishlist
- `DELETE /wishlist` - Clear user wishlist

### Cart Routes (`/cart`)
- `GET /cart` - Fetch user shopping cart
- `POST /cart/items` - Add item to cart with customization details
- `PATCH /cart/items/:productId` - Update item quantity in cart
- `DELETE /cart/items/:productId` - Remove item from cart
- `DELETE /cart` - Clear entire cart

### Product Routes (`/products`)
- `GET /products` - List products with search, pagination, category filtering, and sorting
- `GET /products/:id` - Fetch product details by ID
- `POST /products` *(Admin)* - Create new merchandise item
- `PUT /products/:id` *(Admin)* - Update product details
- `DELETE /products/:id` *(Admin)* - Delete product

### Order Routes (`/orders`)
- `GET /orders` - Fetch orders (user order history / admin all orders)
- `GET /orders/:id` - Fetch order by ID
- `POST /orders` - Create new order from current cart
- `PATCH /orders/:id/status` *(Admin)* - Update order fulfillment status

### Payment Routes (`/payments`)
- `POST /payments/razorpay/create-order` - Create Razorpay Order ID for checkout
- `POST /payments/razorpay/verify` - Verify Razorpay payment signature
- `POST /payments/stripe/create-intent` - Create Stripe PaymentIntent for an order
- `POST /payments/stripe/webhook` - Stripe Webhook listener for payment events
- `GET /payments/order/:orderId` - Fetch payment details by Order ID
- `PATCH /payments/:id/status` *(Admin)* - Update payment status manually


---
