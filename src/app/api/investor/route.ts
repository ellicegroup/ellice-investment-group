import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getInvestorById } from "@/lib/investors";
import { getPortfolioFromSheets } from "@/lib/googleSheets";
import { fastapiGetInvestor, mapFastapiInvestor } from "@/lib/fastapiClient";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = session.user as { id?: string; apiToken?: string };
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ── FastAPI backend ────────────────────────────────────────────────────────
  if (user.apiToken) {
    const fastapiData = await fastapiGetInvestor(user.apiToken);
    if (fastapiData) {
      return NextResponse.json(
        mapFastapiInvestor(fastapiData),
        { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
      );
    }
    // Token present but fetch failed — return error rather than showing wrong data
    return NextResponse.json({ error: "Failed to fetch investor data" }, { status: 502 });
  }

  // ── Hardcoded fallback ─────────────────────────────────────────────────────
  const investor = getInvestorById(user.id);
  if (!investor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Compute live account value from portfolio total × investor's allocation %
  const portfolio = await getPortfolioFromSheets();
  const liveValue = portfolio.totalValue * (investor.allocationPercent / 100);

  const { passwordHash: _, ...safe } = investor;
  return NextResponse.json(
    { ...safe, currentValue: liveValue, portfolioLastUpdated: portfolio.lastUpdated },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } }
  );
}
