"use client";
import { useEffect, useState } from "react";
import type { Document } from "@/lib/documents";

function fileSizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ICON_MAP: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOC",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLS",
  "application/vnd.ms-excel": "XLS",
  "text/csv": "CSV",
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((data) => { setDocs(data); setLoading(false); });
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <p className="text-gray-500 text-sm mt-1">Fund reports, notices, and documents shared by your fund manager</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400 text-sm">Loading documents…</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-16 text-center">
          <p className="text-gray-400 text-sm">No documents have been shared yet.</p>
          <p className="text-gray-300 text-xs mt-1">Check back later or contact your fund manager.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {docs.map((doc) => (
              <li key={doc.id} className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: "#D4AF37", color: "#1a1a1a" }}
                  >
                    {ICON_MAP[doc.mimeType] ?? doc.originalName.split(".").pop()?.toUpperCase() ?? "FILE"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{doc.title}</p>
                    {doc.description && (
                      <p className="text-sm text-gray-500 mt-0.5 truncate">{doc.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      {" · "}{fileSizeLabel(doc.fileSize)}
                    </p>
                  </div>
                </div>
                <a
                  href={`/uploads/${doc.filename}`}
                  download={doc.originalName}
                  className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: "#534AB7" }}
                >
                  ↓ Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
