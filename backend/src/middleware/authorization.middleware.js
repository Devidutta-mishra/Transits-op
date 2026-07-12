import { AppError } from "../utils/appError.js";

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

export function authorizeRoles(...allowedRoles) {
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

  return function roleAuthorizer(req, _res, next) {
    const userRole = normalizeRole(req.user?.role);

    if (!userRole) {
      return next(new AppError("Forbidden", 403));
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return next(new AppError("You are not authorized to perform this action", 403));
    }

    return next();
  };
}
