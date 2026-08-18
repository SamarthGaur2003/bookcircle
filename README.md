# 📚 BookCircle

BookCircle is a full-stack **Peer-to-Peer Book Trading Platform** built with **Spring Boot** and **React.js**. It enables users to securely buy, sell, and discover books nearby, communicate with sellers in real time, and manage their listings through a modern, responsive interface.

---

## 🌐 Live Demo

🔗 **Frontend**: [https://bookcircle-iota.vercel.app](https://bookcircle-iota.vercel.app)
🔗 **Backend API**: [https://bookcircle-4d3q.onrender.com](https://bookcircle-4d3q.onrender.com)

> ⚠️ The backend is hosted on Render's free tier and may take 30-60 seconds to wake up on first request.

---

## 🚀 Features

- 🔐 **JWT Authentication & Authorization**: Secure stateless auth with custom security filters.
- 🤖 **AI-Powered Content Moderation**: Analyzes listings in real time using Google Gemini to filter out spam, scams, and policy violations before database persistence (with fail-open resilience).
- 🧠 **AI Review Summaries**: Synthesizes buyer feedback into concise seller summaries using Google Gemini, cached via Redis for ultra-low latency and minimal API overhead.
- ⚡ **Redis Caching**: Efficient `@Cacheable` and event-driven `@CacheEvict` caching for high performance.
- 📚 **Book Listing, Search & Multi-criteria Filtering**: Keyword, condition, price range, and location-based filtering with database pagination.
- 📍 **Nearby Book Discovery**: Geospatial distance calculation with Google Maps Geocoding API.
- 💬 **Real-time Chat**: WebSocket with STOMP protocol and SockJS for instant buyer-seller messaging.
- ☁️ **Cloudinary Media Storage**: Multi-image upload and cloud asset management.
- 📱 **Modern Reactive UI**: Built with React, Framer Motion animations, Lucide icons, and responsive design.

---

## 🛠️ Tech Stack

### Backend
- Java 21 / Spring Boot 3
- Spring Security & JWT
- Spring Data JPA & Hibernate
- Spring Data Redis & Spring Cache
- Google Gemini AI API
- Google Maps Geocoding API
- PostgreSQL / Neon Cloud DB
- WebSocket (STOMP / SockJS)
- Cloudinary Java SDK

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
git clone https://github.com/SamarthGaur2003/bookcircle.git
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
 
### Backend (`bookcircle-backend/.env`)

```env
DB_URL=jdbc:postgresql://localhost:5432/bookcircle
DB_USERNAME=postgres
DB_PASSWORD=postgres
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (`bookcircle-frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
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
