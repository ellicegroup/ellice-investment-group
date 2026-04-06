import path from "path";
import fs from "fs";

export interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  originalName: string;
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
}

// In-memory store — persists across requests but resets on server restart.
// Replace with a database (Postgres/Supabase) for production.
const store: Document[] = [];

export function getAllDocuments(): Document[] {
  return [...store].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export function addDocument(doc: Document) {
  store.unshift(doc);
}

export function removeDocument(id: string): boolean {
  const idx = store.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  const [doc] = store.splice(idx, 1);
  // Delete physical file
  try {
    const filePath = path.join(process.cwd(), "public", "uploads", doc.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {}
  return true;
}

export function getDocumentById(id: string): Document | undefined {
  return store.find((d) => d.id === id);
}
