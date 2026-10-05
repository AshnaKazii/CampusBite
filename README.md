# LA ROCHE QUICKBITE - Smart Pre-Order & Pickup System

La Roche QuickBite is a smart pre-order and pickup system developed explicitly for Shah & Anchor Kutchhi Engineering College (SAKEC) and its on-campus cafe, La Roche Cafe. 

Students often have only a 5-10 minute gap between lectures. This system allows them to pre-order food, skip the ordering queue, and simply collect their meal right on time! No generic food delivery concepts here — just highly focused Order → Prepare → Pickup operations for short breaks.

## Features (Phase 2 Full Stack)
- **Real Backend (Node.js/Express) + MongoDB**: Complete replacement of frontend mock states with real robust REST APIs connecting to Mongoose models.
- **JWT Authentication Flow**: Fully protected routing, login, and authorization. 
- **Real Menu Database**: Realistic seed script inserts ~60 cafe items categorized via reference ObjectIds.
- **Student Flow:** Browse Menu, Edit Cart, Choose between "ASAP" or "Scheduled Pickup" (server validates), Submit Special Instructions.
- **Order Tracking:** Visual status (PLACED → PREPARING → READY → COLLECTED), securely tied to MongoDB updates.
- **Cafe Staff Dashboard:** Incoming view prioritizing immediate orders via direct backend queries, allowing staff to quickly change statuses.

## Project Structure
- `client/`: React Frontend (Vite)
- `server/`: Node/Express REST API

### Backend Models
- `User.js`, `Cafe.js`, `Category.js`, `FoodItem.js`, `Order.js`, `Review.js`

## How to Run

### 1. Database Setup / Seed Script
Make sure MongoDB is running locally (or provide an Atlas URI in `.env`).
```bash
cd server
node src/seed/seed.js
```
*Note: If no mongo is detected, you can set `USE_IN_MEMORY_DB=true` inside `.env` to spawn a `mongodb-memory-server` temporarily for the seed or application boot.*

### credentials included in Seed:
- **Admin**: admin@laroche.local / password123
- **Cafe Staff**: staff@laroche.local / password123
- **Student**: student@laroche.local / password123

### 2. Start the Backend
```bash
cd server
npm install
npm run start
```
Runs at `http://localhost:5000`

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```
Runs at `http://localhost:5173`. We have included a `.env.example` mapping `VITE_API_URL` correctly.

### Implementation Reasoning
- **MongoDB**: Used due to the highly nested structures of order items inside standard receipts, giving flexible JSON schema storage.
- **Authentication**: JWT issues token into LocalStorage, decoding to grab `req.user` inside `requireAuth` middleware for complete stateless session management.
- **Scheduling**: The backend dynamically evaluates max prep-time alongside an imaginary queue offset using `orderTimingService.js` to estimate "ASAP" timings without front-end manipulation vulnerabilities.
