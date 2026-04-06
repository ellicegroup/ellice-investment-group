import bcrypt from "bcryptjs";

export interface Statement {
  id: string;
  period: string;
  date: string;
  openingBalance: number;
  closingBalance: number;
  contributions: number;
  withdrawals: number;
  gainLoss: number;
  returnPercent: number;
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  accountNumber: string;
  joinDate: string;
  investedCapital: number;
  currentValue: number;
  allocationPercent: number;
  statements: Statement[];
}

// In production, replace this with a real database query.
// Passwords below are hashed versions of the demo passwords shown in .env.local.example
const INVESTORS: Investor[] = [
  {
    id: "inv_001",
    name: "James Whitfield",
    email: "james@example.com",
    // password: Investor@2024
    passwordHash: bcrypt.hashSync("Investor@2024", 10),
    accountNumber: "EIG-2022-001",
    joinDate: "2022-03-15",
    investedCapital: 500000,
    currentValue: 682400,
    allocationPercent: 12.5,
    statements: [
      { id: "s1", period: "Q1 2026", date: "2026-03-31", openingBalance: 655000, closingBalance: 682400, contributions: 0, withdrawals: 0, gainLoss: 27400, returnPercent: 4.18 },
      { id: "s2", period: "Q4 2025", date: "2025-12-31", openingBalance: 630000, closingBalance: 655000, contributions: 0, withdrawals: 0, gainLoss: 25000, returnPercent: 3.97 },
      { id: "s3", period: "Q3 2025", date: "2025-09-30", openingBalance: 598000, closingBalance: 630000, contributions: 50000, withdrawals: 0, gainLoss: -18000, returnPercent: -2.84 },
      { id: "s4", period: "Q2 2025", date: "2025-06-30", openingBalance: 575000, closingBalance: 598000, contributions: 0, withdrawals: 0, gainLoss: 23000, returnPercent: 4.00 },
      { id: "s5", period: "Q1 2025", date: "2025-03-31", openingBalance: 550000, closingBalance: 575000, contributions: 0, withdrawals: 0, gainLoss: 25000, returnPercent: 4.55 },
      { id: "s6", period: "Q4 2024", date: "2024-12-31", openingBalance: 520000, closingBalance: 550000, contributions: 0, withdrawals: 0, gainLoss: 30000, returnPercent: 5.77 },
    ],
  },
  {
    id: "inv_002",
    name: "Sarah Chen",
    email: "sarah@example.com",
    // password: Investor@2024
    passwordHash: bcrypt.hashSync("Investor@2024", 10),
    accountNumber: "EIG-2023-002",
    joinDate: "2023-01-10",
    investedCapital: 250000,
    currentValue: 301750,
    allocationPercent: 6.8,
    statements: [
      { id: "s1", period: "Q1 2026", date: "2026-03-31", openingBalance: 290000, closingBalance: 301750, contributions: 0, withdrawals: 0, gainLoss: 11750, returnPercent: 4.05 },
      { id: "s2", period: "Q4 2025", date: "2025-12-31", openingBalance: 278000, closingBalance: 290000, contributions: 0, withdrawals: 0, gainLoss: 12000, returnPercent: 4.32 },
      { id: "s3", period: "Q3 2025", date: "2025-09-30", openingBalance: 288000, closingBalance: 278000, contributions: 0, withdrawals: 0, gainLoss: -10000, returnPercent: -3.47 },
      { id: "s4", period: "Q2 2025", date: "2025-06-30", openingBalance: 275000, closingBalance: 288000, contributions: 0, withdrawals: 0, gainLoss: 13000, returnPercent: 4.73 },
    ],
  },
];

export function getInvestorByEmail(email: string): Investor | undefined {
  return INVESTORS.find((inv) => inv.email.toLowerCase() === email.toLowerCase());
}

export function getInvestorById(id: string): Investor | undefined {
  return INVESTORS.find((inv) => inv.id === id);
}
