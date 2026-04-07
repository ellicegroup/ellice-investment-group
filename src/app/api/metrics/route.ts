import { NextResponse } from "next/server";
import { getFundMetrics } from "@/lib/metricsSheets";

// Revalidate every 5 minutes
export const revalidate = 300;

export async function GET() {
  const metrics = await getFundMetrics();
  return NextResponse.json(metrics, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
  });
}
