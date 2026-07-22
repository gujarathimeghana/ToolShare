# Neighborly – Hyper-local Tool Sharing & Help Marketplace

Neighborly is a commercial-grade, full-stack, hyper-local tool sharing and local help marketplace platform designed to empower communities by allowing neighbors to share power tools, equipment, and offer skilled help (plumbing, electrical, gardening, painting, repairs).

---

## Technical Architecture Overview

```
Neighborly Platform
 ├── Server (/server): Node.js + Express + MongoDB Atlas + Socket.IO + JWT + Helmet + Multer + Cloudinary
 ├── Web App (/client-web): React 18 + Vite + Tailwind CSS + Framer Motion + OpenStreetMap (Leaflet) + Socket.IO
 └── Mobile App (/mobile-app): Flutter 3 + Provider + Dio + OpenStreetMap (flutter_map) + Socket.IO
```

---

## Directory Structure

- `/server` — Express REST API server, Mongoose models, controllers, rate limiters, socket real-time handlers, seed script.
- `/client-web` — React + Vite web client featuring dark mode, glassmorphism theme, interactive maps, dashboard, real-time chat, admin panel.
- `/mobile-app` — Flutter mobile application built for Android & iOS with Provider state management.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas Connection URI
- **Flutter SDK**: 3.x+ (for mobile development)

---

### 1. Server Setup (`/server`)

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/neighborly
JWT_SECRET=neighborly_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
```

Seed initial categories and sample listings:

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```
The server will run on `http://localhost:5000`.

---

### 2. Web Client Setup (`/client-web`)

```bash
cd client-web
npm install
```

Start the Vite development server:

```bash
npm run dev
```
The web application will launch at `http://localhost:3000`.

---

### 3. Flutter Mobile Setup (`/mobile-app`)

```bash
cd mobile-app
flutter pub get
flutter run
```

---

## 🌟 Key Features

1. **Hyper-local OpenStreetMap Integration**: Proximity-based search using Leaflet for Web and `flutter_map` for Mobile with Nominatim geocoding.
2. **Real-Time Socket.IO Chat**: Instant peer-to-peer messaging with online status indicators.
3. **Cash & Flexible Payments**: Built-in support for Cash on Pickup and Pay Later without requiring mandatory upfront card payment.
4. **Admin Dashboard**: Moderation queue, user management, and platform analytics.
5. **Dark Mode Support**: Sleek, customizable dark and light themes across both Web and Android apps.

---

## 🛡️ License

Built with ❤️ for local communities. Distributed under the MIT License.
