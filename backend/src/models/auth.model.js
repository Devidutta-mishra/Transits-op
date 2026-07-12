import { query } from "../database/pool.js";

class AuthModel {
  async findRoleByName(roleName) {
    const { rows } = await query(
      `
        SELECT id, name
        FROM roles
        WHERE LOWER(name) = LOWER($1)
        LIMIT 1
      `,
      [roleName]
    );

    return rows[0] || null;
  }

  async findUserByEmail(email) {
    const { rows } = await query(
      `
        SELECT
          users.id,
          users.full_name,
          users.email,
          users.phone,
          users.password_hash,
          users.status,
          users.is_active,
          users.created_at,
          users.updated_at,
          roles.name AS role,
          roles.id AS role_id
        FROM users
        INNER JOIN roles ON roles.id = users.role_id
        WHERE LOWER(users.email) = LOWER($1)
        LIMIT 1
      `,
      [email]
    );

    return rows[0] || null;
  }

  async findUserByPhone(phone) {
    const { rows } = await query(
      `
        SELECT
          users.id,
          users.phone
        FROM users
        WHERE phone = $1
        LIMIT 1
      `,
      [phone]
    );

    return rows[0] || null;
  }

  async findUserById(userId) {
    const { rows } = await query(
      `
        SELECT
          users.id,
          users.full_name,
          users.email,
          users.phone,
          users.status,
          users.is_active,
          users.created_at,
          users.updated_at,
          roles.name AS role,
          roles.id AS role_id
        FROM users
        INNER JOIN roles ON roles.id = users.role_id
        WHERE users.id = $1
        LIMIT 1
      `,
      [userId]
    );

    return rows[0] || null;
  }

  async createUser({ roleId, fullName, email, phone, passwordHash }) {
    const { rows } = await query(
      `
        INSERT INTO users (role_id, full_name, email, password_hash, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          role_id,
          full_name,
          email,
          phone,
          status,
          is_active,
          created_at,
          updated_at
      `,
      [roleId, fullName, email, passwordHash, phone]
    );

    const user = rows[0];
    const role = await this.findRoleById(user.role_id);

    return {
      ...user,
      role: role?.name || null
    };
  }

  async findRoleById(roleId) {
    const { rows } = await query(
      `
        SELECT id, name
        FROM roles
        WHERE id = $1
        LIMIT 1
      `,
      [roleId]
    );

    return rows[0] || null;
  }
}

export const authModel = new AuthModel();
