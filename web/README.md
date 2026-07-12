# TransitOps Web Console

The **TransitOps** web console is a modern, high-performance logistics dashboard built for fleet operators, dispatchers, and managers. It provides a real-time, command-center-like interface for managing trips, vehicles, maintenance logs, and financial expenses.

## Design Philosophy

The UI has been strictly engineered to follow a **Premium Monochrome Aesthetic**:
- **Deep Matte Backgrounds** (Pure Black & Dark Grey)
- **High Contrast Typography** (White & Light Grey)
- **Technical & Minimalist** (Sans-Serif for body text, Monospace for system IDs and data points)
- *All generic accent colors have been intentionally stripped away to provide a focused, distraction-free environment.*

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Charts:** Recharts

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the `web` directory:
   ```bash
   cd web
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

> **Note:** The authentication flow is currently mocked for rapid UI/UX development. You do not need to boot up the backend Node.js server or the PostgreSQL database. **Simply enter any dummy email and password on the Login page to instantly access the Dashboard.**

## Directory Structure

- `/src/components` - Reusable UI components (Dashboard, Layout, UI primitives)
- `/src/pages` - High-level page components (Login, Dashboard, Fleet, etc.)
- `/src/layouts` - Global layouts (Sidebar, Topbar)
- `/src/mock` - Extensive mock data simulating backend responses for rapid prototyping
- `/src/services` - API and mocked service layers
- `/src/hooks` - Custom React hooks (e.g., `useAuth`, `usePermission`)

## Features Overview

- **Global Command Palette:** Hit `CTRL+K` to search across trips, drivers, and vehicles quickly.
- **Role-Based Access:** Pre-configured mock roles (Fleet Manager, Dispatcher, Safety Officer, etc.) for testing permission models.
- **Dynamic Charts:** Real-time data visualization using Recharts styled to perfectly match the monochrome theme.
- **Responsive Layout:** A collapsible sidebar and mobile-friendly overlays for tracking ops on the go.
