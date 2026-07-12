import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
  register
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { loginRateLimiter } from "../middleware/rateLimit.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  loginValidator,
  registerValidator
} from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  asyncHandler(register)
);

router.post(
  "/login",
  loginRateLimiter,
  loginValidator,
  validateRequest,
  asyncHandler(login)
);

router.get("/me", authenticateToken, asyncHandler(getCurrentUser));
router.post("/logout", asyncHandler(logout));

export default router;
