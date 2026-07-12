const ROLE_ALIASES = {
  admin: "Admin",
  manager: "Fleet Manager",
  fleetmanager: "Fleet Manager",
  fleet_manager: "Fleet Manager",
  dispatcher: "Dispatcher",
  safetyofficer: "Safety Officer",
  safety_officer: "Safety Officer",
  financialanalyst: "Financial Analyst",
  financial_analyst: "Financial Analyst",
  driver: "Driver"
};

export function normalizeRoleName(role) {
  if (!role) {
    return "";
  }

  const normalizedKey = role.toLowerCase().replace(/[\s-]+/g, "");

  return ROLE_ALIASES[normalizedKey] || role.trim();
}

export function serializeUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}
