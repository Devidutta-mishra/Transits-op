import { authService } from "../services/auth.service.js";
import { successResponse } from "../utils/apiResponse.js";

export async function register(req, res) {
  const result = await authService.register(req.body);
  return res.status(201).json(successResponse(result));
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  return res.status(200).json(successResponse(result));
}

export async function getCurrentUser(req, res) {
  const result = await authService.getCurrentUser(req.user.userId);
  return res.status(200).json(successResponse(result));
}

export async function logout(_req, res) {
  return res.status(200).json(
    successResponse({
      message: "Logged out successfully"
    })
  );
}
