import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPortfolioFromSheets } from "@/lib/googleSheets";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portfolio = await getPortfolioFromSheets();
  return NextResponse.json(portfolio, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" },
  });
}
