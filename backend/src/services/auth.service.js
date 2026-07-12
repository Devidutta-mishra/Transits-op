import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

import { env } from "../config/env.js";
import { authRepository } from "../repositories/auth.repository.js";
import { AppError } from "../utils/appError.js";
import { normalizeRoleName, serializeUser } from "../utils/auth.js";
import { signJwt } from "../utils/jwt.js";

class AuthService {
  generateToken(user) {
    return signJwt({
      userId: user.id,
      email: user.email,
      role: typeof user.role === "string" ? user.role : user.role?.name
    });
  }

  async register(payload) {
    const existingUser = await authRepository.findUserByEmail(payload.email);

    if (existingUser) {
      throw new AppError("Email is already registered", 409, [
        { field: "email", message: "Email is already registered" }
      ]);
    }

    if (payload.phone) {
      const userWithPhone = await authRepository.findUserByPhone(payload.phone);

      if (userWithPhone) {
        throw new AppError("Phone is already registered", 409, [
          { field: "phone", message: "Phone is already registered" }
        ]);
      }
    }

    const roleName = normalizeRoleName(payload.role);
    const role = await authRepository.findRoleByName(roleName);

    if (!role) {
      throw new AppError("Invalid role selected", 400, [
        { field: "role", message: "Role does not exist" }
      ]);
    }

    const passwordHash = await bcrypt.hash(payload.password, env.bcryptRounds);

    let user;

    try {
      user = await authRepository.createUser({
        roleId: role.id,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || null,
        passwordHash
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("User with the provided unique field already exists", 409);
      }

      throw error;
    }

    return {
      token: this.generateToken(user),
      user: serializeUser(user)
    };
  }

  async login(payload) {
    const user = await authRepository.findUserByEmail(payload.email);

    if (!user || !user.passwordHash) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive || user.status !== "ACTIVE") {
      throw new AppError("User account is inactive", 403);
    }

    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.passwordHash
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
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      user: serializeUser(user)
    };
  }
}

export const authService = new AuthService();
