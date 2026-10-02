# Small Business Management — MERN Stack

Manage **products, customers and sales** with price & quantity tracking in MongoDB,
REST APIs in Node.js/Express, and a React UI. Includes JWT authentication with
**role-based access** (`admin` / `staff`).

## Project structure

```
backend/   Express + Mongoose APIs (products, customers, sales, auth, dashboard)
frontend/  React + Vite UI (dashboard, products, customers, sales, users)
```

## Objectives covered

- MERN stack demonstration (MongoDB, Express, React, Node)
- CRUD on Products, Customers, Sales with Mongoose validation
- REST APIs: `GET/POST/PUT/DELETE` per resource
- JWT auth + role-based access (admin full access; staff cannot delete / manage users)
- Dashboard with revenue, counts, low-stock alerts, recent sales, 7-day revenue

## Quick start

### 1. MongoDB
Need a running MongoDB. Local default: `mongodb://127.0.0.1:27017/smallbiz`
or use MongoDB Atlas and put the URI in `backend/.env`.

### 2. Backend
```bash
cd backend
cp .env.example .env   # edit MONGO_URI + JWT_SECRET
npm install
npm run seed           # optional: admin@shop.com / admin123 + sample data
npm run dev            # http://localhost:5000
```

API index: `GET http://localhost:5000/` lists all endpoints.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173 (proxies /api -> :5000)
```

Production: set `VITE_API_URL=https://your-api/api` then `npm run build`.

## API reference

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | public | First user becomes `admin` |
| POST | `/api/auth/login` | public | Returns `{ token, user }` |
| GET | `/api/auth/me` | JWT | Current user |
| GET/PUT/DELETE | `/api/auth/users`, `/api/auth/users/:id/role` | admin | User management |
| GET/POST | `/api/products?search=&category=&lowStock=` | JWT / staff+ | Paginated list |
| GET/PUT | `/api/products/:id` | JWT / staff+ | |
| DELETE | `/api/products/:id` | admin | |
| GET/POST | `/api/customers?search=` | JWT / staff+ | |
| GET/PUT | `/api/customers/:id` | JWT / staff+ | |
| DELETE | `/api/customers/:id` | admin | |
| GET/POST | `/api/sales` | JWT / staff+ | POST validates stock, decrements on `completed` |
| PUT | `/api/sales/:id` | staff+ | Cancelling restores stock |
| DELETE | `/api/sales/:id` | admin | Restores stock |
| GET | `/api/dashboard/stats` | JWT | Revenue, counts, low stock, recent sales, daily revenue |

### Sale POST example
```json
{
  "customer": "<customerId>",
  "items": [{ "product": "<productId>", "quantity": 2 }],
  "tax": 50,
  "discount": 20,
  "paymentMethod": "upi",
  "status": "completed"
}
```

## Roles

- **admin**: everything, including deletes and user/role management.
- **staff**: view + create/update products, customers, sales; can cancel sales; **cannot** delete or manage users.

## Data models

- **Product**: `name, sku (unique), description, category, price, costPrice, quantity, lowStockThreshold`
- **Customer**: `name, email, phone*, company, address, notes`
- **Sale**: `invoiceNo (auto), customer, items[{product, name, price, quantity}], subtotal, tax, discount, total, paymentMethod, status, soldBy, saleDate`
- **User**: `name, email (unique), password (hashed), role`
