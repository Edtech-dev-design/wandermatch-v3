// ============================================================================
// WANDERMATCH V4.1 — AUTHENTICATION vs AUTHORIZATION MIDDLEWARE
// Strictly separates identity verification (Authentication) from RBAC (Authorization)
// ============================================================================

export function requireAuthenticatedUser(authUser) {
  if (!authUser || !authUser.userId) {
    const err = new Error("Unauthorized: Valid Bearer JWT required.");
    err.code = "28000";
    err.httpStatus = 401;
    throw err;
  }
  return authUser;
}

export function requireAdminRole(authUser) {
  requireAuthenticatedUser(authUser);
  if (authUser.role !== "admin" && authUser.role !== "super_admin") {
    const err = new Error("Forbidden: Administrator role required.");
    err.code = "42501";
    err.httpStatus = 403;
    throw err;
  }
  return authUser;
}

