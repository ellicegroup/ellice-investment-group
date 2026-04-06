import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getInvestorById } from "@/lib/investors";
import { getPortfolioFromSheets } from "@/lib/googleSheets";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = (session.user as { id?: string }).id;
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const investor = getInvestorById(id);
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
