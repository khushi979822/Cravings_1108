This is Craving Project 
using MERN Stack
Cravings is a modern food delivery site.


# 📌 Table of Contents

- Introduction
- Features
- User Roles
- Tech Stack
- Project Architecture
- Folder Structure
- Authentication
- API Modules
- Environment Variables
- Running the Project
- Future Enhancements
- Author

  
# 🚀 Introduction

Cravings is designed to provide a complete online food ordering ecosystem.

Customers can browse restaurants, search dishes, place orders, and track deliveries.

Restaurant owners can manage menus, orders, and earnings.

Riders receive assigned deliveries and update delivery status.

Admins control the entire platform through analytics and management tools.

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

# 📈 Project Highlights

- MERN Stack Architecture
- JWT Cookie Authentication
- Role-Based Authorization
- Responsive UI
- RESTful APIs
- MongoDB Database
- Secure Password Encryption
- Modular Backend Architecture
- Clean React Components
- Tailwind CSS UI

# 👨‍💻 Author

***Khushi Kumari***

Computer Science Engineering Student

Jai Narain College of Technology, Bhopal

MERN Stack Developer
