# ⚙️ StockMaster - Backend API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

This is the backend server for **StockMaster**, a professional multi-branch inventory management system. It provides a robust RESTful API built with Node.js, Express, and MongoDB, handling authentication, role-based access control, real-time metrics, and strict inventory auditing (Kardex).

---

## 🏛️ Architecture

The server strictly follows the **MVC (Model-View-Controller)** architectural pattern, adapted for an API environment (Routes act as the View interface):

* **Models:** Mongoose schemas defining the data structure (Users, Products, Movements, Supermarkets, Notifications).
* **Controllers:** The core business logic (e.g., calculating dashboard KPIs, processing stock adjustments).
* **Routes:** API endpoints mapped to their respective controllers.
* **Middleware:** Request interceptors for JWT authentication, role verification, and error handling.
* **Utils:** Reusable helper functions like the `kardexLogger` (for audit trails) and `sendEmail` (for password recovery).

---

## 📂 Folder Structure

```text
server/
├── src/
│   ├── config/             # Database connection setup (db.ts)
│   ├── controllers/        # Business logic for all API endpoints
│   │   ├── authController.ts
│   │   ├── dashboardController.ts
│   │   ├── movementController.ts
│   │   ├── notificationController.ts
│   │   ├── productController.ts
│   │   ├── supermarketController.ts
│   │   └── userController.ts
│   ├── middleware/         # Custom Express middlewares
│   │   └── authMiddleware.ts
│   ├── models/             # Mongoose schemas representing DB collections
│   │   ├── Movement.ts
│   │   ├── Notification.ts
│   │   ├── Product.ts
│   │   ├── Supermarket.ts
│   │   └── User.ts
│   ├── routes/             # Express routers grouping endpoints
│   │   ├── authRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   ├── movementRoutes.ts
│   │   ├── notificationRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── supermarketRoutes.ts
│   │   └── userRoutes.ts
│   ├── utils/              # Global utility functions
│   │   ├── generateToken.ts
│   │   ├── kardexLogger.ts
│   │   └── sendEmail.ts
│   └── index.ts            # Application entry point
├── .env                    # Environment variables (Ignored by Git)
├── package.json            # Dependencies and NPM scripts
└── tsconfig.json           # TypeScript compiler configuration
```

## 📦 Main Libraries & Technologies
* **Express (v5.2.1):** Fast, unopinionated, minimalist web framework for Node.js.

* **Mongoose (v9.1.5):** Elegant MongoDB object modeling providing schema validation.

* **Bcryptjs:** Library to securely hash passwords before saving them to the database.

* **JSONWebToken (JWT):** Used to generate secure, stateless authentication tokens.

* **Nodemailer:** Module to send emails, used specifically for the password recovery flow via one-time tokens.

* **Cookie-Parser:** Middleware to parse cookies securely for JWT refresh mechanisms.

* **CORS:** Enables secure cross-origin requests from the React frontend.

---

## 🔐 Environment Variables (.env)
Create a .env file in the root of the server/ directory and configure the following variables. **Do not commit this file to version control.**

```# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/stockmaster

# Authentication (JWT)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Nodemailer / Email Service (For Password Recovery)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Frontend URL (For CORS and email reset links)
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Scripts & Lifecycle
This project is built with TypeScript, meaning it needs to be compiled into JavaScript before running in a production environment.

### Development Mode
Runs the server with nodemon, automatically restarting upon any file changes.

```
npm run dev
```

### Production Build
Compiles all TypeScript files from the `src/` directory into JavaScript inside a `dist/` folder.

```
npm run build
```

### Production Start
Starts the compiled Node.js server. You must run npm run build first.

```
npm start
```

## 📡 API Modules Overview
* **Auth** (`/api/auth`): Handles login, logout, JWT generation, and the password recovery flow (forgot/reset password).

* **Users** (`/api/users`): CRUD operations for system users and role management (Admin, Manager, Worker, Provider).

* **Supermarkets** (`/api/supermarkets`): Management of branches/locations.

* **Products** (`/api/products`): Inventory catalog, stock levels, minimum stock alerts, and soft-delete capabilities.

* **Movements** (`/api/movements`): The Kardex core. An immutable audit log recording every IN, OUT, and ADJUST operation.

* **Dashboard** (`/api/dashboard`): Aggregates data to provide real-time KPIs, charts, and low-stock alerts.

### 👨‍💻 Author
Ernesto - Information Technology and Digital Innovation Engineering Student.