# 💰 Smart Expense Tracker

A modern full-stack expense tracking application built with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 📁 Project Structure

```
SMART.EXPENSE/
├── frontend/          # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/           # Axios API layer
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth, Expense)
│   │   ├── pages/         # Dashboard, Expenses, Budgets, Analytics, Profile
│   │   └── utils/         # Helpers, formatters, constants
│   └── ...
│
└── backend/           # Node.js + Express + MongoDB
    ├── config/        # Database connection
    ├── controllers/   # Business logic (auth, expenses, budgets)
    ├── middleware/    # JWT auth, error handler
    ├── models/        # Mongoose schemas (User, Expense, Budget)
    ├── routes/        # Express routes
    ├── utils/         # JWT helper
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm

### 1. Clone & Install

```bash
# Install root dependencies (concurrently)
npm install

# Install all frontend + backend dependencies
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart_expense
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Start Development

```bash
# From project root — starts both backend (port 5000) and frontend (port 5173)
npm run dev
```

Or start individually:
```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | JWT-based register/login, persisted sessions |
| 📊 Dashboard | Overview cards, area + pie charts, recent transactions |
| 💸 Expenses | CRUD with filters, search, pagination |
| 🎯 Budgets | Monthly category budgets with progress tracking |
| 📈 Analytics | Bar charts, pie charts, category rankings, trends |
| 👤 Profile | Edit name and default currency |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3 |
| State | React Context + useReducer |
| Charts | Recharts |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

---

## 📡 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |

### Expenses
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/expenses` | List expenses (with filters) |
| GET | `/api/expenses/stats` | Spending statistics |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Budgets
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/budgets` | Get budgets for month |
| POST | `/api/budgets` | Create/update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

---

## 🎨 Design

- **Dark mode** glass-morphism design
- Custom color palette with indigo primary + orange accents
- Smooth animations and micro-interactions
- Fully responsive layout
- Google Fonts (Inter)
