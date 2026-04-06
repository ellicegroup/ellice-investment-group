import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getInvestorById } from "@/lib/investors";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = (session.user as { id?: string }).id;
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const investor = getInvestorById(id);
  if (!investor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Strip password hash before returning
  const { passwordHash: _, ...safe } = investor;
  return NextResponse.json(safe);
}
