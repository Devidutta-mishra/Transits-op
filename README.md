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

Photos--
<img width="1600" height="899" alt="WhatsApp Image 2026-07-12 at 4 59 07 PM" src="https://github.com/user-attachments/assets/006b6024-d840-4d66-8339-06b8abfd8445" />
<img width="1600" height="899" alt="WhatsApp Image 2026-07-12 at 4 59 24 PM" src="https://github.com/user-attachments/assets/be610cde-7c4d-4724-9c38-cb06599f0715" />
<img width="1600" height="899" alt="WhatsApp Image 2026-07-12 at 4 59 25 PM" src="https://github.com/user-attachments/assets/e5cdcf1c-44e2-4131-818a-f89c2373a078" />
<img width="277" height="557" alt="Screenshot 2026-07-12 at 4 53 13 PM" src="https://github.com/user-attachments/assets/205c825f-409d-41f5-bd6c-3e6f6a84a73c" />
<img width="277" height="557" alt="Screenshot 2026-07-12 at 4 52 58 PM" src="https://github.com/user-attachments/assets/2fd44dfb-7380-45f2-a1b8-e96d1796c2d6" />
<img width="1600" height="899" alt="WhatsApp Image 2026-07-12 at 4 59 27 PM" src="https://github.com/user-attachments/assets/a2bf395e-d665-4a79-a809-f2eab8793cdd" />
<img width="277" height="557" alt="Screenshot 2026-07-12 at 4 53 30 PM" src="https://github.com/user-attachments/assets/67384817-a09e-46e9-b94e-a6edd141db96" />
<img width="277" height="557" alt="Screenshot 2026-07-12 at 4 53 24 PM" src="https://github.com/user-attachments/assets/0b67143a-e260-4924-ad57-79d2853f7df5" />

