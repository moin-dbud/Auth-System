# 🔐 Auth-System

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)

A secure and full-featured user authentication system built with Node.js, Express, MongoDB, and JWT. Includes support for registration, login, email verification, password reset, protected routes, and more.

---

## 📸 Demo

### Live Demo :- https://auth-system-tan.vercel.app/

---

## ✨ Features

- ✅ User Registration
- ✅ Email Verification via OTP
- ✅ Secure Login with JWT
- ✅ Password Reset via Email OTP
- ✅ Protected Routes (JWT Auth Middleware)
- ✅ Token Expiry Handling
- ✅ bcrypt Password Hashing
- ✅ Modular Code Structure

---

## 🛠️ Tech Stack

| Category     | Tech             |
|--------------|------------------|
| Backend      | Node.js, Express |
| Database     | MongoDB (Mongoose) |
| Authentication | JWT, bcrypt, nodemailer |
| Deployment   | GitHub + (any platform) |
| Others       | dotenv, cors, cookie-parser |

---


## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js Installed
- MongoDB connection URI
- EmailSMTP credentials (for sending OTPs and reset links)

---

## 🧪 Installation
```bash
# Clone the repository
git clone https://github.com/moin-dbud/Auth-System.git
cd Auth-System

# Install dependencies
npm install

# Create a .env file and add the following:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SENDER_EMAIL=your_email_register_in_brevo
SMTP_HOST=smtp_host
SMTP_PASSWORD=your_smtp_password
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user

# Start the server
node server.js
```
Server will run on http://localhost:5000

---

## 🔐 API Endpoints

| Method     | Endpoint                                |  Descrtion |
|--------------|---------------------------------------|----------------|
| POST      |       ```  /register ```       |    Register user |
| POST     |       ```  /login ```       |    Login user  |
| POST     |       ```  /logout ```       |   Logout user   |
| POST     |       ```  /send-verify-otp ```       |   Account Verification OTP   |
| POST     |       ```  /verify-account ```       |    Verify Account 
| POST     |       ```  /reset-password ```       |  Reset Password |
| POST     |       ```  /send-reset-otp ```       | Reset Password OTP  |
| GET      |       ```  /is-authenticate ```       |   User Authenticated |


---

## ✅ To-Do (Suggestions)
- Add frontend (React or HTML/CSS)

- Rate limiting & brute-force protection

- Account lockout after failed attempts

- Google/Facebook OAuth support

---

## 👤 Author

### Moin Sheikh
- **🔗 GitHub: https://github.com/moin-dbud/**
- **📧 Email: moinsheikh1303@gmail.com**
- **🔗 LinkedIn: https://www.linkedin.com/in/moin-sameer-sheikh-2a7690335/**
- **🐦 Twitter: https://x.com/Moin_Sheikh09**

---

## **💖 Contributing**
*If you'd like to contribute or suggest improvements, feel free to fork the repository and submit a pull request. All contributions are welcome!*

---

## 📄 License

**This project is licensed under the MIT License.**

---

## 🙏 Acknowledgements

- **Node.js: https://nodejs.org/**
- **Express.js: https://expressjs.com/**
- **MongoDB: https://www.mongodb.com/**
- **JWT.io: https://jwt.io/**
- **bcrypt: https://www.npmjs.com/package/bcrypt**


---

#
