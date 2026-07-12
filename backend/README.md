# TransitOps Backend

Production-ready backend foundation for the TransitOps logistics application, including JWT-based authentication.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM

## Project Structure

```text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

```bash
cd backend
npm install
```

## Create .env

Create a `.env` file in `backend/` using the values from `.env.example`.

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES=7d
BCRYPT_ROUNDS=12
NODE_ENV=development
```

## Prisma Generate

```bash
npm run prisma:generate
```

## Run Development Server

```bash
npm run dev
```

## Available Scripts

- `npm run dev` starts the development server with `nodemon`
- `npm start` starts the production server
- `npm run prisma:generate` generates the Prisma client
- `npm run prisma:migrate` runs Prisma migrations

## Authentication API

Base routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Compatibility routes are also mounted under `/api/v1/auth`.

### Postman Quick Test

1. Register a user with:

```json
{
  "fullName": "Transit Manager",
  "email": "manager@example.com",
  "phone": "9876543200",
  "password": "password123",
  "role": "manager"
}
```

2. Login with:

```json
{
  "email": "manager@example.com",
  "password": "password123"
}
```

3. Copy the returned JWT token and call `GET /api/auth/me` with:

```text
Authorization: Bearer <token>
```

4. Call `POST /api/auth/logout` to receive a stateless logout success response.

## Notes

- API routes are versioned under `/api/v1`
- Auth routes are also available under `/api/auth`
- Login requests are rate-limited
- Seed users now use bcrypt password hashes
- Existing database schema is reused without redesigning the `users` table
