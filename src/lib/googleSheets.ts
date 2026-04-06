import { google } from "googleapis";

export interface PortfolioHolding {
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercent: number;
  weight: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  lastUpdated: string;
  holdings: PortfolioHolding[];
}

function getMockPortfolio(): PortfolioSummary {
  const holdings: PortfolioHolding[] = [
    { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", shares: 1500, avgCost: 142.5, currentPrice: 189.3, marketValue: 283950, gainLoss: 70200, gainLossPercent: 32.84, weight: 18.2 },
    { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", shares: 800, avgCost: 280.0, currentPrice: 415.2, marketValue: 332160, gainLoss: 108160, gainLossPercent: 48.29, weight: 21.3 },
    { ticker: "BRK.B", name: "Berkshire Hathaway B", sector: "Financials", shares: 1200, avgCost: 290.0, currentPrice: 398.5, marketValue: 478200, gainLoss: 130200, gainLossPercent: 37.35, weight: 30.7 },
    { ticker: "JPM", name: "JPMorgan Chase", sector: "Financials", shares: 900, avgCost: 145.0, currentPrice: 198.7, marketValue: 178830, gainLoss: 48330, gainLossPercent: 37.00, weight: 11.5 },
    { ticker: "V", name: "Visa Inc.", sector: "Financials", shares: 600, avgCost: 210.0, currentPrice: 275.4, marketValue: 165240, gainLoss: 39240, gainLossPercent: 31.14, weight: 10.6 },
    { ticker: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", shares: 700, avgCost: 95.0, currentPrice: 118.2, marketValue: 82740, gainLoss: 16240, gainLossPercent: 24.42, weight: 5.3 },
    { ticker: "T-BILL", name: "US Treasury 3M", sector: "Fixed Income", shares: 40, avgCost: 980.0, currentPrice: 993.5, marketValue: 39740, gainLoss: 540, gainLossPercent: 1.35, weight: 2.5 },
  ];

  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
  const totalCost = holdings.reduce((s, h) => s + h.shares * h.avgCost, 0);
  const totalGainLoss = totalValue - totalCost;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent: (totalGainLoss / totalCost) * 100,
    lastUpdated: new Date().toISOString(),
    holdings,
  };
}

function parseNumber(val: string | undefined): number {
  if (!val) return 0;
  return parseFloat(val.replace(/[$,%]/g, "")) || 0;
}

export async function getPortfolioFromSheets(): Promise<PortfolioSummary> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!email || !rawKey || !spreadsheetId || email.includes("your-service-account")) {
    console.info("[Portfolio] Google Sheets credentials not configured — using demo data.");
    return getMockPortfolio();
  }

  try {
    const privateKey = rawKey.replace(/\\n/g, "\n");
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: email, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:Z200",
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return getMockPortfolio();

    const headers: string[] = rows[0].map((h: string) => String(h).trim().toLowerCase());

    const col = (row: string[], name: string) =>
      row[headers.findIndex((h) => h.includes(name))] ?? "";

    const holdings: PortfolioHolding[] = rows.slice(1)
      .filter((row) => row.length > 1 && row[0])
      .map((row) => {
        const ticker = String(col(row, "ticker") || col(row, "symbol") || row[0]).trim();
        const name = String(col(row, "name") || col(row, "company") || row[1] || ticker).trim();
        const sector = String(col(row, "sector") || col(row, "industry") || "Other").trim();
        const shares = parseNumber(col(row, "shares") || col(row, "quantity"));
        const avgCost = parseNumber(col(row, "avg") || col(row, "cost") || col(row, "price paid"));
        const currentPrice = parseNumber(col(row, "current") || col(row, "price") || col(row, "last"));
        const marketValue = parseNumber(col(row, "value") || col(row, "market")) || shares * currentPrice;
        const gainLoss = marketValue - shares * avgCost;
        const gainLossPercent = avgCost > 0 ? (gainLoss / (shares * avgCost)) * 100 : 0;
        return { ticker, name, sector, shares, avgCost, currentPrice, marketValue, gainLoss, gainLossPercent, weight: 0 };
      });

    const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
    holdings.forEach((h) => { h.weight = totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0; });
    const totalCost = holdings.reduce((s, h) => s + h.shares * h.avgCost, 0);
    const totalGainLoss = totalValue - totalCost;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent: totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0,
      lastUpdated: new Date().toISOString(),
      holdings,
    };
  } catch (err) {
    console.error("[Portfolio] Google Sheets fetch failed, using demo data:", err);
    return getMockPortfolio();
  }
}
