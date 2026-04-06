import bcrypt from "bcryptjs";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Single admin account — change credentials via env vars in production.
// Default: admin@elliceinvestmentgroup.com / Admin@2024
const ADMIN: AdminUser = {
  id: "admin_001",
  name: process.env.ADMIN_NAME ?? "Fund Administrator",
  email: process.env.ADMIN_EMAIL ?? "etekafa@elliceinvestmentgroup.com",
  passwordHash:
    process.env.ADMIN_PASSWORD_HASH ??
    // bcrypt of "Admin@2024"
    "$2b$10$sASxsBAoLCEyVdq6rYzNAOSVpdlSqGQ4g793/EPGonUPzZuqsni0O",
};

export async function verifyAdmin(email: string, password: string): Promise<AdminUser | null> {
  if (email.toLowerCase() !== ADMIN.email.toLowerCase()) return null;
  const valid = await bcrypt.compare(password, ADMIN.passwordHash);
  return valid ? ADMIN : null;
}

export function getAdminByEmail(email: string): AdminUser | null {
  return email.toLowerCase() === ADMIN.email.toLowerCase() ? ADMIN : null;
}
