import { google } from "googleapis";

export interface FundMetrics {
  fund1Irr: string;
  fund1ReturnYtd: string;
  fund2ReturnYtd: string;
  sp500ReturnYtd: string;
  activeInvestors: number;
  lastUpdated: string;
}

function getMockMetrics(): FundMetrics {
  return {
    fund1Irr: "18.4%",
    fund1ReturnYtd: "+20.4%",
    fund2ReturnYtd: "+14.2%",
    sp500ReturnYtd: "+23.3%",
    activeInvestors: 15,
    lastUpdated: new Date().toISOString(),
  };
}

function findValue(rows: string[][], ...keywords: string[]): string {
  for (const row of rows) {
    const label = String(row[0] || "").toLowerCase();
    if (keywords.some((k) => label.includes(k.toLowerCase()))) {
      // Return the first non-empty cell after the label
      for (let i = 1; i < row.length; i++) {
        const v = String(row[i] || "").trim();
        if (v && v !== "0" && v !== "-") return v;
      }
    }
  }
  return "";
}

export async function getFundMetrics(): Promise<FundMetrics> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId =
    process.env.GOOGLE_METRICS_SPREADSHEET_ID ||
    process.env.GOOGLE_SPREADSHEET_ID ||
    "1EMhWsCA-ZT_U5o3kZsjGgHjFjUepWarX";

  if (!email || !rawKey || email.includes("your-service-account")) {
    return getMockMetrics();
  }

  try {
    const privateKey = rawKey.replace(/\\n/g, "\n");
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: email, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // Find the sheet with gid=302933126
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetMeta = meta.data.sheets?.find(
      (s) => s.properties?.sheetId === 302933126
    );
    const sheetName = sheetMeta?.properties?.title || "Summary";

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z200`,
    });

    const rows: string[][] = (res.data.values || []).map((r) =>
      r.map((c) => String(c ?? "").trim())
    );

    const fund1Irr =
      findValue(rows, "irr", "fund 1 irr", "egf1 irr", "growth fund 1 irr") ||
      getMockMetrics().fund1Irr;

    const fund1ReturnYtd =
      findValue(rows, "fund 1 return", "egf1 return", "growth fund 1 return", "fund i return", "2025 return fund 1") ||
      getMockMetrics().fund1ReturnYtd;

    const fund2ReturnYtd =
      findValue(rows, "fund 2 return", "egf2 return", "growth fund 2 return", "fund ii return", "2025 return fund 2") ||
      getMockMetrics().fund2ReturnYtd;

    const sp500ReturnYtd =
      findValue(rows, "s&p", "sp500", "benchmark", "s&p 500") ||
      getMockMetrics().sp500ReturnYtd;

    // Count active investors from the rollforward if present
    const investorCountRaw = findValue(rows, "investors", "total investors", "no. of investors");
    const activeInvestors = investorCountRaw
      ? parseInt(investorCountRaw.replace(/\D/g, ""), 10) || 15
      : 15;

    return {
      fund1Irr,
      fund1ReturnYtd,
      fund2ReturnYtd,
      sp500ReturnYtd,
      activeInvestors,
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[Metrics] Google Sheets fetch failed, using demo data:", err);
    return getMockMetrics();
  }
}
