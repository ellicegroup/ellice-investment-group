import { google } from "googleapis";

export interface Position {
  ticker: string;    // e.g. "BRK.B"
  name: string;      // e.g. "Berkshire Hathaway"
  sector: string;    // e.g. "Financials"
  weight: number;    // percentage, e.g. 28.4
  color: string;     // hex color for chart
}

export interface FundPortfolio {
  fund: string;
  asOf: string;
  positions: Position[];
  lastUpdated: string;
}

// ── Fallback data (update these to match your actual holdings) ─────────────

const FUND1_FALLBACK: Position[] = [
  { ticker: "BRK.B",  name: "Berkshire Hathaway",  sector: "Financials",    weight: 28.4, color: "#534AB7" },
  { ticker: "JPM",    name: "JPMorgan Chase",       sector: "Financials",    weight: 14.8, color: "#7B74D4" },
  { ticker: "V",      name: "Visa",                 sector: "Financials",    weight: 10.0, color: "#AFA9EC" },
  { ticker: "AAPL",   name: "Apple",                sector: "Technology",    weight: 18.2, color: "#EF9F27" },
  { ticker: "MSFT",   name: "Microsoft",            sector: "Technology",    weight: 12.3, color: "#f5c46a" },
  { ticker: "XOM",    name: "Exxon Mobil",          sector: "Energy",        weight: 5.3,  color: "#1D9E75" },
  { ticker: "T-BILL", name: "US Treasury 3M",       sector: "Fixed Income",  weight: 2.5,  color: "#0F6E56" },
  { ticker: "CASH",   name: "Cash & Equivalents",   sector: "Cash",          weight: 8.5,  color: "#cccccc" },
];

const FUND2_FALLBACK: Position[] = [
  { ticker: "AAPL",   name: "Apple",                sector: "Technology",    weight: 32.0, color: "#534AB7" },
  { ticker: "MSFT",   name: "Microsoft",            sector: "Technology",    weight: 24.0, color: "#7B74D4" },
  { ticker: "NVDA",   name: "NVIDIA",               sector: "Technology",    weight: 18.0, color: "#AFA9EC" },
  { ticker: "BRK.B",  name: "Berkshire Hathaway",   sector: "Financials",    weight: 14.0, color: "#EF9F27" },
  { ticker: "CASH",   name: "Cash & Equivalents",   sector: "Cash",          weight: 12.0, color: "#cccccc" },
];

const CHART_COLORS = [
  "#534AB7", "#7B74D4", "#AFA9EC", "#EEEDFE",
  "#EF9F27", "#f5c46a", "#fad896",
  "#1D9E75", "#0F6E56", "#E1F5EE",
  "#13175c", "#2d2a8a",
];

// ── Google Sheets reader ────────────────────────────────────────────────────

function stripCurrency(v: string): number {
  return parseFloat(v.replace(/[$,%\s]/g, "")) || 0;
}

/**
 * Tries to read portfolio positions from a named tab in Google Sheets.
 * Expected columns (first row = header): Ticker | Name | Sector | Weight%
 * Falls back to hardcoded data if tab not found or credentials missing.
 */
async function readPositionsFromSheet(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  tabNames: string[]
): Promise<Position[] | null> {
  for (const tab of tabNames) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${tab}'!A1:F100`,
      });
      const rows: string[][] = (res.data.values || []).map((r) =>
        r.map((c) => String(c ?? "").trim())
      );
      if (rows.length < 2) continue;

      // Find header row to locate columns
      const header = rows[0].map((h) => h.toLowerCase());
      const tickerIdx  = header.findIndex((h) => h.includes("tick") || h.includes("symbol") || h === "id");
      const nameIdx    = header.findIndex((h) => h.includes("name") || h.includes("company") || h.includes("holding"));
      const sectorIdx  = header.findIndex((h) => h.includes("sector") || h.includes("asset") || h.includes("type"));
      const weightIdx  = header.findIndex((h) => h.includes("weight") || h.includes("alloc") || h.includes("%"));

      if (weightIdx === -1) continue; // Can't use this tab without a weight column

      const positions: Position[] = [];
      rows.slice(1).forEach((row, i) => {
        const weight = stripCurrency(row[weightIdx] || "0");
        if (weight <= 0) return;
        positions.push({
          ticker: tickerIdx >= 0 ? (row[tickerIdx] || `POS${i + 1}`) : `POS${i + 1}`,
          name:   nameIdx >= 0   ? (row[nameIdx]   || row[tickerIdx] || `Position ${i + 1}`) : `Position ${i + 1}`,
          sector: sectorIdx >= 0 ? (row[sectorIdx] || "Other") : "Other",
          weight,
          color: CHART_COLORS[i % CHART_COLORS.length],
        });
      });

      if (positions.length > 0) return positions;
    } catch {
      // Tab doesn't exist or read failed — try next
    }
  }
  return null;
}

export async function getPortfolioData(): Promise<{ fund1: FundPortfolio; fund2: FundPortfolio }> {
  const email        = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey       = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId =
    process.env.GOOGLE_METRICS_SPREADSHEET_ID ||
    process.env.GOOGLE_SPREADSHEET_ID ||
    "1EMhWsCA-ZT_U5o3kZsjGgHjFjUepWarX";

  const now = new Date().toISOString();

  const fallback = {
    fund1: { fund: "Ellice Growth Fund I",  asOf: "Q4 2025", positions: FUND1_FALLBACK, lastUpdated: now },
    fund2: { fund: "Ellice Growth Fund II", asOf: "Q4 2025", positions: FUND2_FALLBACK, lastUpdated: now },
  };

  if (!email || !rawKey || email.includes("your-service-account")) {
    return fallback;
  }

  try {
    const privateKey = rawKey.replace(/\\n/g, "\n");
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: email, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // Try common tab names for each fund
    const [fund1Pos, fund2Pos] = await Promise.all([
      readPositionsFromSheet(sheets, spreadsheetId, [
        "EGF I Holdings", "Fund I Holdings", "Fund I Portfolio",
        "EGF I Positions", "Portfolio I", "Portfolio", "Holdings",
      ]),
      readPositionsFromSheet(sheets, spreadsheetId, [
        "EGF II Holdings", "Fund II Holdings", "Fund II Portfolio",
        "EGF II Positions", "Portfolio II",
      ]),
    ]);

    return {
      fund1: { fund: "Ellice Growth Fund I",  asOf: "Q4 2025", positions: fund1Pos ?? FUND1_FALLBACK, lastUpdated: now },
      fund2: { fund: "Ellice Growth Fund II", asOf: "Q4 2025", positions: fund2Pos ?? FUND2_FALLBACK, lastUpdated: now },
    };
  } catch (err) {
    console.error("[Portfolio] Google Sheets fetch failed:", err);
    return fallback;
  }
}
