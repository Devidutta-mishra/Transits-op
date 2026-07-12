import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { authModel } from "../models/auth.model.js";
import { AppError } from "../utils/appError.js";
import { normalizeRoleName, serializeUser } from "../utils/auth.js";

class AuthService {
  generateToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpires
      }
    );
  }

  async register(payload) {
    const existingUser = await authModel.findUserByEmail(payload.email);

    if (existingUser) {
      throw new AppError("Email is already registered", 409, [
        { field: "email", message: "Email is already registered" }
      ]);
    }

    if (payload.phone) {
      const userWithPhone = await authModel.findUserByPhone(payload.phone);

      if (userWithPhone) {
        throw new AppError("Phone is already registered", 409, [
          { field: "phone", message: "Phone is already registered" }
        ]);
      }
    }

    const roleName = normalizeRoleName(payload.role);
    const role = await authModel.findRoleByName(roleName);

    if (!role) {
      throw new AppError("Invalid role selected", 400, [
        { field: "role", message: "Role does not exist" }
      ]);
    }

    const passwordHash = await bcrypt.hash(payload.password, env.bcryptRounds);

    const user = await authModel.createUser({
      roleId: role.id,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone || null,
      passwordHash
    });

    return {
      token: this.generateToken(user),
      user: serializeUser(user)
    };
  }

  async login(payload) {
    const user = await authModel.findUserByEmail(payload.email);

    if (!user || !user.password_hash) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.is_active || user.status !== "ACTIVE") {
      throw new AppError("User account is inactive", 403);
    }

    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.password_hash
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    return {
      token: this.generateToken(user),
      user: serializeUser(user)
    };
  }

  async getCurrentUser(userId) {
    const user = await authModel.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      user: serializeUser(user)
    };
  }
}

export const authService = new AuthService();
