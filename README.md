# TransitOps

**TransitOps** is an end-to-end, full-stack logistics and fleet management platform designed to streamline operations, dispatching, and real-time tracking for logistics companies.

This repository is structured as a monorepo, containing all the moving parts of the system ranging from the dispatcher's web console to the driver's mobile application and the backend infrastructure.

## 🏗️ System Architecture

The project is broken down into four core directories:

### 1. [Web Console](./web/README.md) (`/web`)
A modern, high-performance web dashboard built for fleet operators and dispatchers. 
- **Tech:** React 18, Vite, TypeScript, TailwindCSS
- **Key Features:** Real-time data visualization, strict high-contrast monochrome design, global command palette search, and role-based access.
- *See the [Web README](./web/README.md) for setup instructions.*

### 2. [Driver App](./app/TransitOpsDriver/README.md) (`/app/TransitOpsDriver`)
A native mobile application built specifically for the drivers in the fleet.
- **Tech:** Android Native (Kotlin), Jetpack Compose / XML, Gradle
- **Key Features:** Trip assignments, ETA tracking, vehicle status reporting, and on-the-road navigation updates.
- *See the [App README](./app/TransitOpsDriver/README.md) for build instructions.*

### 3. Backend API (`/backend`)
The central nervous system of the platform, handling business logic, authentication, and database interactions.
- **Tech:** Node.js, Express, Prisma ORM
- **Key Features:** RESTful endpoints for fleet management, secure JWT authentication, and rate limiting.

### 4. Database (`/database`)
The data layer definitions and seeding scripts.
- **Tech:** PostgreSQL, SQL
- **Key Features:** `schema.sql` for defining relations (Users, Roles, Trips, Vehicles) and `seed.sql` with rich mock data for testing.

## 🚀 Getting Started

If you are a developer looking to spin up the project locally, please refer to the specific README files in the respective sub-directories.

- **To work on the UI/UX of the Web Console:** Navigate to `/web` and run `npm run dev`. *(Note: The frontend currently supports a mock authentication bypass for rapid prototyping without needing the backend).*
- **To work on the Mobile App:** Open the `/app/TransitOpsDriver` directory in Android Studio and sync Gradle.
- **To spin up the full stack:** You will need to provision a PostgreSQL database, run the SQL schema scripts, and start the Node.js backend before connecting the frontend clients.

## 🎨 Design Philosophy

TransitOps aims to replace clunky, outdated enterprise logistics software with a sleek, command-line-inspired UI. The design heavily utilizes a strict monochrome color palette (pure blacks, stark whites) and monospace typography for technical data points to ensure maximum readability and focus for operators.

## 👨‍💻 Development Team

This project was developed for the **Odoo Hackathon**. 

We are proud students from the **Odisha University of Technology and Research (OUTR), Bhubaneswar**.

- **Devidutta Mishra** (Team Leader)
- **Sibaditya Panda** (Team Member)
- **Swastik Ranjan Sahoo** (Team Member)
