import { errorResponse } from "../utils/apiResponse.js";

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || err.details || [];

  return res.status(statusCode).json(
    errorResponse(
      message,
      process.env.NODE_ENV === "production"
        ? errors
        : [
            ...errors,
            ...(err.stack ? [{ stack: err.stack }] : [])
          ]
    )
  );
}
