# 🚀 HR Recruiter – Modern HR Management System
📘 Overview
HR Recruiter is a modern, full-stack Human Resource Management web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It is designed to streamline the entire recruitment process, from job posting to offer letter generation. Built for HR professionals and hiring teams, this platform simplifies candidate tracking, interview scheduling, user role management, and more.

## 📁 Folder Structure
```
HR App/
├── client/         # Frontend (React)
├── server/         # Backend (Express + MongoDB)
└── README.md
```

## ✨ Features
```
🔐 User Authentication
Secure registration, login, password reset, and role-based access (Admin/User).

📋 Job Listings
Create, edit, filter, and manage active job postings with ease.

👤 Candidate Management
Add, edit, track candidates, and associate them with specific job listings.

📅 Interview Scheduling
Schedule, reschedule, and manage interviews directly through the platform.

📄 Offer Letter Management
Generate, edit, and send digital offer letters to selected candidates.

🛠 Admin Dashboard
Manage users, monitor logs, and perform key administrative actions.

📱 Responsive Design
Fully responsive UI using Tailwind CSS for seamless experience across devices.

📊 Activity Logging
Track important user actions for transparency and auditing.

📧 Email Integration
Send password reset links and offer letters via email using Nodemailer.

🔐 JWT Authentication
Secured APIs using token-based authentication for better data protection.

🔍 Advanced Search & Filter
Quickly find relevant jobs, candidates, interviews, and offers.
```

## 🛠 Tech Stack
### Frontend
```
React.js
React Router
Tailwind CSS
SweetAlert2
Chart.js
```
### Backend
```
Node.js
Express.js
MongoDB & Mongoose
JWT (JSON Web Tokens)
Nodemailer
Dev Tools & Utilities
Vite (for fast build & development)
dotenv (environment variable management)
express-validator (form & request validation)
```

## 🚀 Getting Started
```
✅ Prerequisites
Ensure you have the following installed:
Node.js (v18 or above recommended)
MongoDB (Atlas account or a local instance)
```

## 🧩 Installation
1. Clone the Repository
```
git clone https://github.com/Rohit-Codess/HR.git
cd HR
```
2. Install Dependencies for Backend
```
cd server
npm install
```
3. Set Up Environment Variables
Create a .env file inside the server folder and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
```
4. Start the Backend Server
```
npm run dev
```
5. Install Dependencies for Frontend
Open a new terminal and run:
```
cd client
npm install
```
6. Start the Frontend Development Server
```
npm run dev
```

