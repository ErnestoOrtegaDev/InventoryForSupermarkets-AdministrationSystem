# 📦 StockMaster

![Status](https://img.shields.io/badge/Status-In_Development-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logoColor=white)

**StockMaster** is a professional multi-branch inventory management system designed to optimize product control, audit movements, and prevent stockouts through real-time alerts.

---

## 🚀 Key Features

* **Multi-Branch Management:** Independent inventory control for different supermarket locations or branches, manageable from a single interface.
* **Audit and Kardex (Movement History):** Immutable and automatic recording of every merchandise entry (`IN`), exit (`OUT`), or adjustment (`ADJUST`) to prevent phantom shrinkage and maintain strict warehouse control.
* **Critical Stock Alerts:** Real-time notification system that alerts administrators when a product reaches its minimum inventory limit.
* **Dynamic Dashboard:** Control panel with key metrics, urgently restocked products, and total inventory value.
* **Soft Delete:** Logical deletion of products to maintain referential integrity within the accounting history.

---

## 🛠️ Tech Stack

The project is divided into two main applications using the MERN stack (with some modern improvements):

### Frontend (`/client`)
* **Core:** React.js with Vite
* **Language:** TypeScript
* **State Management:** Zustand
* **Styles & UI:** Tailwind CSS, Headless UI, Heroicons
* **HTTP Requests:** Axios with interceptors

### Backend (`/server`)
* **Core:** Node.js with Express.js
* **Language:** TypeScript
* **Database:** MongoDB with Mongoose (ODM)
* **Architecture:** MVC Pattern (Model-View-Controller)

---

## 📂 Project Structure

This repository contains both the client and server code, separated into their respective directories to maintain a clean and modular architecture:

```text
/
├── server/                 # RESTful API, Models, and Controllers
│   ├── src/
│   │   ├── config/         # Database Connection
│   │   ├── controllers/    # Business logic (Products, Movements, etc.)
│   │   ├── middleware/     # Middlewares (Authentication, Error handling)
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # API Endpoints
│   │   ├── utils/          # Global helpers (e.g., kardexLogger)
│   │   └── index.ts        # Main Express entry file
│   └── README.md           # Backend specific documentation
│
├── client/                 # User Interface (SPA)
│   ├── src/
│   │   ├── api/            # Axios Configuration
│   │   ├── components/     # Modular UI components (inventory, layout, supermarkets, users)
│   │   ├── pages/          # Main routing views
│   │   ├── store/          # Global state with Zustand
│   │   ├── types/          # TypeScript interfaces and types
│   │   └── App.tsx         # Router and root configuration
│   └── README.md           # Frontend specific documentation
│
└── README.md               # Global documentation (This file)

```

## ⚙️ Project Installation

To run this project in a development environment, you will need to run both environments separately. Please refer to the specific documentation for each module to see the required environment variables:

### Run the Backend

```text
cd server
npm install
npm run dev

```
### Run the Frontend

```text
cd client
npm install
npm run dev
```

### 👨‍💻 Author and Academic Context

Ernesto - Information Technology and Digital Innovation Engineering
Student at Universidad Politécnica de Durango (UNIPOLI DGO).

Developed as a technological solution for professional inventory management and merchandise traceability.