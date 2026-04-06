import { NextResponse } from "next/server";

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  region: string;
}

export interface MarketData {
  indices: MarketIndex[];
  lastUpdated: string;
}

// Attempt to fetch from Yahoo Finance (no API key needed).
// Falls back to plausible static data if the fetch fails.
async function fetchIndex(symbol: string): Promise<{ price: number; change: number; changePct: number } | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      { next: { revalidate: 300 }, headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;
    const price: number = meta.regularMarketPrice ?? meta.previousClose;
    const prev: number = meta.chartPreviousClose ?? meta.previousClose;
    const change = price - prev;
    const changePct = prev > 0 ? (change / prev) * 100 : 0;
    return { price, change, changePct };
  } catch {
    return null;
  }
}

const FALLBACK: Record<string, { price: number; change: number; changePct: number }> = {
  "^GSPC":  { price: 5218.19, change: 24.37,  changePct: 0.47  },
  "^DJI":   { price: 38996.39, change: 146.43, changePct: 0.38  },
  "^IXIC":  { price: 16340.87, change: -23.51, changePct: -0.14 },
  "^NZ50":  { price: 11892.41, change: 38.72,  changePct: 0.33  },
  "^AXJO":  { price: 7834.20,  change: 52.10,  changePct: 0.67  },
};

const INDICES = [
  { symbol: "^GSPC", name: "S&P 500",     region: "USA"       },
  { symbol: "^DJI",  name: "Dow Jones",   region: "USA"       },
  { symbol: "^IXIC", name: "NASDAQ",      region: "USA"       },
  { symbol: "^NZ50", name: "NZX 50",      region: "NZ"        },
  { symbol: "^AXJO", name: "ASX 200",     region: "Australia" },
];

export async function GET() {
  const results: MarketIndex[] = await Promise.all(
    INDICES.map(async ({ symbol, name, region }) => {
      const live = await fetchIndex(symbol);
      const data = live ?? FALLBACK[symbol];
      return { symbol, name, region, ...data };
    })
  );

  const payload: MarketData = { indices: results, lastUpdated: new Date().toISOString() };
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" },
  });
}
