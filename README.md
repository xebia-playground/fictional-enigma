# DevShop CodeQL Demo

Clean full-stack e-commerce starter built with React, Express, MongoDB, and Mongoose.

## Run Locally

1. Start MongoDB locally.
2. Install backend dependencies: `cd backend && npm install`.
3. Copy `backend/.env.example` to `backend/.env` and update values if needed.
4. Seed demo products: `npm run seed`.
5. Start the backend: `npm run dev`.
6. Install frontend dependencies: `cd ../frontend && npm install`.
7. Start the frontend: `npm run dev`.

The API runs on `http://localhost:3000/api` by default. The first registered user is assigned the `admin` role for local setup.