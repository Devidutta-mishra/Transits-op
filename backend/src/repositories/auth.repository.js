import { prisma } from "../database/prisma.js";

export class AuthRepository {
  async findRoleByName(roleName) {
    return prisma.role.findFirst({
      where: {
        name: {
          equals: roleName,
          mode: "insensitive"
        }
      }
    });
  }

  async findUserByEmail(email) {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive"
        }
      },
      include: {
        role: true
      }
    });
  }

  async findUserByPhone(phone) {
    if (!phone) {
      return null;
    }

    return prisma.user.findFirst({
      where: {
        phone
      }
    });
  }

  async findUserById(userId) {
    return prisma.user.findUnique({
      where: {
        id: Number(userId)
      },
      include: {
        role: true
      }
    });
  }

  async createUser({ roleId, fullName, email, phone, passwordHash }) {
    return prisma.user.create({
      data: {
        roleId,
        fullName,
        email,
        phone,
        passwordHash
      },
      include: {
        role: true
      }
    });
  }
}

export const authRepository = new AuthRepository();
