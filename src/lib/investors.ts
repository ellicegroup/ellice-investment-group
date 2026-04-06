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
  investedCapital: number;  // Total Commitment (same units as rollforward)
  currentValue: number;     // Latest end balance (overridden at runtime by live portfolio calc)
  allocationPercent: number; // Commitment / total fund commitment × 100
  statements: Statement[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Ellice Growth Fund I — Investor Rollforward Jan 1, 2025 to Dec 31, 2025
// Grand Total Commitment: 83,935   Grand Total End Balance: 108,656
//
// allocationPercent = investor Total Commitment / 83,935 × 100
// Default password for all: Investor@2024  (admin should reset per investor)
// ─────────────────────────────────────────────────────────────────────────────

// Pre-hashed "Investor@2024" — all investors share this until individually updated
const DEFAULT_HASH = "$2b$10$Yt2GwJR65BNyw7ovkEGf3OUC8mofcrM.NsRxZW5r.VIZzuOCVB.8W";

const TOTAL_COMMITMENT = 83935;

function alloc(commitment: number) {
  return parseFloat(((commitment / TOTAL_COMMITMENT) * 100).toFixed(3));
}

// 2025 annual statement helper
function stmt2025(
  id: string,
  openingBalance: number,
  closingBalance: number,
  contributions: number,
  transfers = 0
): Statement {
  // Net gain = closing - opening - contributions - transfers
  const gainLoss = closingBalance - openingBalance - contributions - transfers;
  const returnPercent = openingBalance > 0
    ? parseFloat(((gainLoss / openingBalance) * 100).toFixed(2))
    : 0;
  return {
    id,
    period: "Full Year 2025",
    date: "2025-12-31",
    openingBalance,
    closingBalance,
    contributions,
    withdrawals: 0,
    gainLoss,
    returnPercent,
  };
}

const INVESTORS: Investor[] = [
  {
    id: "INV00661",
    name: "Alisa Taukave",
    email: "alisa.taukave@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00661",
    joinDate: "2022-01-01",
    investedCapital: 6210,
    currentValue: 8194,
    allocationPercent: alloc(6210),
    statements: [stmt2025("s1", 7286, 8194, 0)],
  },
  {
    id: "INV00668",
    name: "Ellice Capital Advisors (GP)",
    email: "gp@ellicecapital.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00668",
    joinDate: "2022-01-01",
    investedCapital: 4974,
    currentValue: 6433,
    allocationPercent: alloc(4974),
    statements: [stmt2025("s1", 2106, 6433, 572, 3436)],
  },
  {
    id: "INV00664",
    name: "Emelisa Tuilagi",
    email: "emelisa.tuilagi@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00664",
    joinDate: "2022-01-01",
    investedCapital: 7014,
    currentValue: 9049,
    allocationPercent: alloc(7014),
    statements: [stmt2025("s1", 7291, 9049, 800)],
  },
  {
    id: "INV00654",
    name: "Galivaka Piliota",
    email: "galivaka.piliota@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00654",
    joinDate: "2022-01-01",
    investedCapital: 6129,
    currentValue: 7078,
    allocationPercent: alloc(6129),
    statements: [stmt2025("s1", 3562, 7078, 3093)],
  },
  {
    id: "INV00653",
    name: "Galivaka Teava",
    email: "galivaka.teava@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00653",
    joinDate: "2022-01-01",
    investedCapital: 4632,
    currentValue: 6112,
    allocationPercent: alloc(4632),
    statements: [stmt2025("s1", 8488, 6112, 0, -3436)],
  },
  {
    id: "INV00660",
    name: "Karlos Moresi",
    email: "karlos.moresi@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00660",
    joinDate: "2022-01-01",
    investedCapital: 3095,
    currentValue: 4084,
    allocationPercent: alloc(3095),
    statements: [stmt2025("s1", 3631, 4084, 0)],
  },
  {
    id: "INV00657",
    name: "Kasipo Teo",
    email: "kasipo.teo@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00657",
    joinDate: "2022-01-01",
    investedCapital: 18774,
    currentValue: 24773,
    allocationPercent: alloc(18774),
    statements: [stmt2025("s1", 22028, 24773, 0)],
  },
  {
    id: "INV00655",
    name: "Lamese Saamu",
    email: "lamese.saamu@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00655",
    joinDate: "2022-01-01",
    investedCapital: 3101,
    currentValue: 4092,
    allocationPercent: alloc(3101),
    statements: [stmt2025("s1", 3639, 4092, 0)],
  },
  {
    id: "INV00667",
    name: "Losaline Teo",
    email: "losaline.teo@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00667",
    joinDate: "2022-01-01",
    investedCapital: 3101,
    currentValue: 4092,
    allocationPercent: alloc(3101),
    statements: [stmt2025("s1", 3639, 4092, 0)],
  },
  {
    id: "INV00665",
    name: "Lototasi Vaguna",
    email: "lototasi.vaguna@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00665",
    joinDate: "2022-01-01",
    investedCapital: 4176,
    currentValue: 5482,
    allocationPercent: alloc(4176),
    statements: [stmt2025("s1", 4871, 5482, 0)],
  },
  {
    id: "INV00656",
    name: "Mase Tumua",
    email: "mase.tumua@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00656",
    joinDate: "2022-01-01",
    investedCapital: 3036,
    currentValue: 4006,
    allocationPercent: alloc(3036),
    statements: [stmt2025("s1", 3562, 4006, 0)],
  },
  {
    id: "INV00658",
    name: "Nefu Uniuni",
    email: "nefu.uniuni@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00658",
    joinDate: "2022-01-01",
    investedCapital: 6063,
    currentValue: 8000,
    allocationPercent: alloc(6063),
    statements: [stmt2025("s1", 7114, 8000, 0)],
  },
  {
    id: "INV00662",
    name: "Penihulo Lopati",
    email: "penihulo.lopati@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00662",
    joinDate: "2022-01-01",
    investedCapital: 3500,
    currentValue: 4618,
    allocationPercent: alloc(3500),
    statements: [stmt2025("s1", 4107, 4618, 0)],
  },
  {
    id: "INV00666",
    name: "Taniela Kepa Siose",
    email: "taniela.siose@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00666",
    joinDate: "2022-01-01",
    investedCapital: 8614,
    currentValue: 10642,
    allocationPercent: alloc(8614),
    statements: [stmt2025("s1", 7110, 10642, 2400)],
  },
  {
    id: "INV00659",
    name: "Teruka Avanitele",
    email: "teruka.avanitele@ellicegrowthfund.com",
    passwordHash: DEFAULT_HASH,
    accountNumber: "INV00659",
    joinDate: "2022-01-01",
    investedCapital: 1516,
    currentValue: 2000,
    allocationPercent: alloc(1516),
    statements: [stmt2025("s1", 1779, 2000, 0)],
  },
];

export function getInvestorByEmail(email: string): Investor | undefined {
  return INVESTORS.find((inv) => inv.email.toLowerCase() === email.toLowerCase());
}

export function getInvestorById(id: string): Investor | undefined {
  return INVESTORS.find((inv) => inv.id === id);
}

export function getAllInvestors(): Investor[] {
  return INVESTORS;
}
