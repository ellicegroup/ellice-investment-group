import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllDocuments, addDocument, removeDocument } from "@/lib/documents";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

function isAdmin(session: ReturnType<typeof Object.create> | null) {
  return (session?.user as { isAdmin?: boolean })?.isAdmin === true;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(getAllDocuments());
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) ?? "";

  if (!file || !title) {
    return NextResponse.json({ error: "file and title are required" }, { status: 400 });
  }

  const ext = path.extname(file.name);
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(process.cwd(), "public", "uploads", filename), buffer);

  const doc = {
    id: randomUUID(),
    title,
    description,
    filename,
    originalName: file.name,
    uploadedAt: new Date().toISOString(),
    fileSize: file.size,
    mimeType: file.type,
  };
  addDocument(doc);

  return NextResponse.json(doc, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  const ok = removeDocument(id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
