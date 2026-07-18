This is Craving Project 
using MERN Stack
Cravings is a modern food delivery site.

## 🚀 Features

- 🏠 Beautiful and responsive Home Page
- 🔐 User Authentication (Login & Register
- 🍽️ Featured Restaurants Section
- 🔍 Search Restaurants & Dishes
- 📊 Statistics Section
- ⭐ Restaurant Cards with Ratings
- 🤝 Restaurant Partner Section
- 📱 Mobile Responsive Design
- 🎨 Modern UI using Tailwind CSS
- ⚡ Fast Navigation using React Router

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Language:** JavaScript (ES6+)
- **Package Manager:** npm

---

## 📂 Project Structure

```
src/
│
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── Navbar.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── FoodTable.jsx
│
├── images/
│   ├── bgImage1.jpg
│   ├── undermango tree.avif
│   ├── Rajdarabr.webp
│   ├── country side coulture.webp
│   └── ...
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🎯 Main Pages

### 🏠 Home
- Hero Banner
- Search Bar
- Featured Restaurants
- Customer Reviews
- Statistics
- Restaurant Partner Section

### 🔑 Login
- User Login Form
- Responsive Design
- Background Hero Image

### 📝 Register
- User Registration Form
- Customer / Restaurant / Rider Selection
- Responsive Layout
- Hero Background

---

## 📸 Screens

- Home Page
- Login Page
- Register Page
- Restaurant Listing

---

🔐 Authentication

The project uses Cookie-based JWT Authentication.

After successful login, a secure Oreo cookie is generated and used for all authenticated API requests.

👥 User Roles
👤 Customer
🍽️ Restaurant
🛵 Rider
🛡️ Admin

Each role has its own protected APIs and permissions.

---

📂 API Modules
Module	Description
Auth	Registration, Login, Password Reset
Public	Public APIs without authentication
Common	Shared APIs for logged-in users
Restaurant	Restaurant profile, menu, orders, earnings
Customer	Orders, Cart, Favorites, Address Book
Rider	Delivery Management
Admin	Platform Management & Analytics

---

📖 API Documentation

The project contains 76 REST APIs categorized into seven modules.

Each API includes:

Endpoint
HTTP Method
Authentication Requirement
Request Body
Response Format
Success Status Codes
Error Responses
