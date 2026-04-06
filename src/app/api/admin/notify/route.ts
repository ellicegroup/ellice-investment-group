import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllInvestors } from "@/lib/investors";
import { sendNewDocumentEmail, sendNewStatementEmail } from "@/lib/email";

function isAdmin(session: ReturnType<typeof Object.create> | null) {
  return (session?.user as { isAdmin?: boolean })?.isAdmin === true;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { type, title, description, period } = body as {
    type: "document" | "statement";
    title?: string;
    description?: string;
    period?: string;
  };

  const investors = getAllInvestors();
  const results: { email: string; ok: boolean; error?: string }[] = [];

  for (const inv of investors) {
    try {
      if (type === "document" && title) {
        await sendNewDocumentEmail(inv.email, inv.name, title, description ?? "");
      } else if (type === "statement" && period) {
        await sendNewStatementEmail(inv.email, inv.name, period);
      }
      results.push({ email: inv.email, ok: true });
    } catch (err) {
      results.push({ email: inv.email, ok: false, error: String(err) });
    }
  }

  return NextResponse.json({ sent: results.filter((r) => r.ok).length, results });
}
