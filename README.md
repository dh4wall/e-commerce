# 🛒 ShopEasy — MERN E-Commerce App

A simple full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- View all products
- Add products to cart
- Remove items from cart
- Place a simulated order (cart is cleared after order)
- Data stored in MongoDB Atlas

---

## 📁 Project Structure

```
ECOMMERCE APP/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   ├── models/
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   └── routes/
│       ├── products.js
│       ├── cart.js
│       └── orders.js
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        └── App.css
```

---

## ⚙️ Setup Instructions

### Step 1: Clone or Open the Project
```bash
cd "ECOMMERCE APP"
```

### Step 2: Configure MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Create a database user (username + password)
3. Whitelist your IP address (Network Access → Add IP → Allow from Anywhere: `0.0.0.0/0`)
4. Get your connection string: **Connect → Drivers → Node.js**
5. Open `backend/.env` and replace the placeholder:

```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=5000
```

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 4: Start the Backend
```bash
npm run dev
```
> Server will run on **http://localhost:5000**
> Sample products are auto-seeded on first run.

### Step 5: Install Frontend Dependencies (new terminal)
```bash
cd frontend
npm install
```

### Step 6: Start the Frontend
```bash
npm start
```
> React app will open at **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint       | Description             |
|--------|----------------|-------------------------|
| GET    | /products      | Get all products        |
| POST   | /cart          | Add item to cart        |
| GET    | /cart          | Get all cart items      |
| DELETE | /cart/:id      | Remove item from cart   |
| POST   | /orders        | Place an order          |
| GET    | /orders        | Get all orders          |

---

## 🛠 Tech Stack

| Layer     | Technology       |
|-----------|-----------------|
| Frontend  | React 18        |
| Backend   | Node.js + Express |
| Database  | MongoDB Atlas   |
| ODM       | Mongoose        |
