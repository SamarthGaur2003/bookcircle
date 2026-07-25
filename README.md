# 📚 BookCircle

BookCircle is a full-stack **Peer-to-Peer Book Trading Platform** built with **Spring Boot** and **React.js**. It enables users to securely buy, sell, and discover books nearby, communicate with sellers in real time, and manage their listings through a modern, responsive interface.

---

## 🚀 Features

- 🔐 JWT-based Authentication & Authorization
- 📚 Book Listing, Search & Filtering
- 📍 Nearby Book Discovery (5 km Radius)
- 💬 Real-time Buyer–Seller Chat (WebSocket + STOMP)
- ☁️ Cloudinary Image Upload
- 🗺️ Google Maps Integration
- 📱 Responsive React UI

---

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- PostgreSQL
- WebSocket (STOMP)
- Cloudinary

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Google Maps API
- SockJS & STOMP

---

## 📂 Project Structure

```text
bookcircle/
│
├── bookcircle-backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── bookcircle-frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
└── README.md
```

---

## ⚡ Quick Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/bookcircle.git
cd bookcircle
```

### Backend

```bash
cd bookcircle-backend
mvn spring-boot:run
```

### Frontend

```bash
cd bookcircle-frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend

```env
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
JWT_SECRET=
CLOUDINARY_URL=
```

### Frontend

```env
VITE_API_BASE_URL=
VITE_WS_URL=
VITE_GOOGLE_MAPS_API_KEY=
```

---

## ✨ Project Highlights

- Developed secure REST APIs using Spring Boot and Spring Security.
- Implemented JWT-based authentication and authorization.
- Built real-time messaging using WebSocket (STOMP & SockJS).
- Integrated Google Maps for nearby book discovery within a **5 km radius**.
- Used Cloudinary for cloud-based image storage.
- Configured environment-based application settings for local and production environments.

---

## 📄 Documentation

For application screenshots, testing results, and project walkthrough, refer to the **BookCircle Testing PDF** available in this repository.

---

## 📜 License

This project is intended for educational and portfolio purposes.
