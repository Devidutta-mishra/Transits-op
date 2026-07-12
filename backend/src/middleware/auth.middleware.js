import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";

export async function authenticateToken(req, _res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return next(new AppError("Authorization token is required", 401));
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}
