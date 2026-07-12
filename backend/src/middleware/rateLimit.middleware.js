import rateLimit from "express-rate-limit";

import { errorResponse } from "../utils/apiResponse.js";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse("Too many login attempts. Please try again later.", [])
});
