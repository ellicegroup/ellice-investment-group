import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllInvestors } from "@/lib/investors";
import { getPortfolioFromSheets } from "@/lib/googleSheets";

function isAdmin(session: ReturnType<typeof Object.create> | null) {
  return (session?.user as { isAdmin?: boolean })?.isAdmin === true;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Fetch live portfolio once and compute each investor's current value
  const portfolio = await getPortfolioFromSheets();

  const investors = getAllInvestors().map(({ passwordHash: _, ...safe }) => ({
    ...safe,
    currentValue: portfolio.totalValue * (safe.allocationPercent / 100),
    portfolioLastUpdated: portfolio.lastUpdated,
  }));

  return NextResponse.json(investors, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" },
  });
}
