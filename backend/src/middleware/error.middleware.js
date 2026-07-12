import { Prisma } from "@prisma/client";

import { errorResponse } from "../utils/apiResponse.js";

export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || err.details || [];

  if (statusCode >= 500) {
    console.error(err);
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database initialization failed";
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Unique constraint violation";
    }
  }

  return res.status(statusCode).json(
    errorResponse(message, Array.isArray(errors) ? errors : [])
  );
}
