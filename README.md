# HealthCore HMS (Hospital Management System)

A complete Enterprise Hospital Management System built with a Modular Monolith architecture.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **Frontend:** React, Vite, TypeScript, React Router Dom, Vanilla CSS (Glassmorphism UI)
- **Security:** JWT Authentication, Role-Based Access Control, Helmet, CORS, Bcrypt.

## Architecture & Modules
This HMS is structured as a Modular Monolith with the following feature modules:
1. **Auth & RBAC**: Manage 8 different roles and robust permissions.
2. **Patients**: Registration and central profile management.
3. **Appointments**: Doctor schedules and booking.
4. **EMR & Consultations**: Clinical notes and patient history.
5. **Prescriptions**: Drug prescribing.
6. **Billing**: Invoices, multiple payment tracking.
7. **Pharmacy & Inventory**: Medication catalog, stock, and suppliers.
8. **Lab**: Test catalog, ordering, and result tracking.
9. **Notifications & Reports**: System events and report generation.

## How to Run

### Backend Setup
1. Navigate to `backend` folder.
2. Create a PostgreSQL database and configure the `.env` file (copy from `.env.example` if available) with your `DATABASE_URL`.
3. Run `npx prisma db push` to initialize your database schema.
4. Run `npm install` to install backend dependencies.
5. Run `npm run dev` (or `npx nodemon src/server.ts`) to start the API on port 5000.

### Frontend Setup
1. Navigate to `frontend` folder.
2. Run `npm install` to install frontend dependencies.
3. Run `npm run dev` to start the React application.
4. Access the dashboard from the browser and experience the premium UI!
