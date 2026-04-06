"use client";
import { useEffect, useState, useRef } from "react";
import type { Document } from "@/lib/documents";

function fileSizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notifying, setNotifying] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  function loadDocs() {
    return fetch("/api/admin/documents")
      .then((r) => r.json())
      .then((data) => { setDocs(data); setLoading(false); });
  }

  useEffect(() => { loadDocs(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim()) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("title", title.trim());
    form.append("description", description.trim());

    const res = await fetch("/api/admin/documents", { method: "POST", body: form });
    if (res.ok) {
      showToast("Document uploaded successfully");
      setTitle("");
      setDescription("");
      if (fileRef.current) fileRef.current.value = "";
      await loadDocs();
    } else {
      showToast("Upload failed", false);
    }
    setUploading(false);
  }

  async function handleNotify(doc: Document) {
    setNotifying(doc.id);
    const res = await fetch("/api/admin/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "document", title: doc.title, description: doc.description }),
    });
    const data = await res.json();
    showToast(`Notified ${data.sent} investor${data.sent !== 1 ? "s" : ""} by email`);
    setNotifying(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document?")) return;
    await fetch("/api/admin/documents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadDocs();
    showToast("Document deleted");
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
          style={{ background: toast.ok ? "#2D5A43" : "#dc2626" }}
        >
          {toast.msg}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <p className="text-gray-500 text-sm mt-1">Upload documents and push to all investors</p>
      </div>

      {/* Upload form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-5">Upload New Document</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Document Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Q1 2026 Fund Report"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional short description"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A43]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              File *
            </label>
            <input
              ref={fileRef}
              type="file"
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white cursor-pointer"
              style={{ ["--file-bg" as string]: "#2D5A43" }}
            />
            <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, CSV or images up to 20 MB</p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition"
              style={{ background: "#2D5A43" }}
            >
              {uploading ? "Uploading…" : "↑ Upload Document"}
            </button>
            <p className="text-xs text-gray-400">
              After uploading, use the <strong>Notify Investors</strong> button to email all investors.
            </p>
          </div>
        </form>
      </div>

      {/* Documents list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm">{docs.length} Document{docs.length !== 1 ? "s" : ""}</h2>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-gray-400 text-sm">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-400 text-sm">No documents uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {docs.map((doc) => (
              <li key={doc.id} className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: "#D4AF37" }}>
                    {doc.mimeType.includes("pdf") ? "PDF" : doc.originalName.split(".").pop()?.toUpperCase() ?? "FILE"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{doc.title}</p>
                    {doc.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{doc.description}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.originalName} · {fileSizeLabel(doc.fileSize)} · {new Date(doc.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/uploads/${doc.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleNotify(doc)}
                    disabled={notifying === doc.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition disabled:opacity-60"
                    style={{ background: "#2D5A43" }}
                  >
                    {notifying === doc.id ? "Sending…" : "✉ Notify Investors"}
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
