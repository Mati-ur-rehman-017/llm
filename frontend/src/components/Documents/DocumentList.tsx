import { useState } from "react";
import type { Document } from "../../types";

interface DocumentListProps {
  documents: Document[];
  onDelete: (docId: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function DocumentList({
  documents,
  onDelete,
  isLoading,
}: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (docId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    setDeletingId(docId);
    const result = await onDelete(docId);
    setDeletingId(null);

    if (!result.success && result.error) {
      alert(`Failed to delete: ${result.error}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "indexed":
        return "text-[#10a37f]";
      case "processing":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-[#8e8ea0]";
    }
  };

  if (isLoading && documents.length === 0) {
    return (
      <div className="rounded-xl border border-[#4e4f60] bg-[#40414f] p-6 text-center">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4e4f60] border-t-[#10a37f]" />
        </div>
        <p className="mt-3 text-sm text-[#8e8ea0]">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-[#4e4f60] bg-[#40414f] p-6 text-center">
        <p className="text-4xl">📄</p>
        <p className="mt-3 text-sm font-medium text-[#c5c5d2]">
          No documents yet
        </p>
        <p className="mt-1 text-xs text-[#8e8ea0]">
          Upload your first document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#c5c5d2]">
          Indexed Documents ({documents.length})
        </h3>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="group rounded-lg border border-[#4e4f60] bg-[#40414f] p-4 transition-colors hover:border-[#565869]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-[#ececf1]">
                    {doc.filename}
                  </p>
                  <span
                    className={`text-xs font-medium ${getStatusColor(doc.status)}`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8e8ea0]">
                  <span>{doc.chunk_count} chunks</span>
                  <span>Indexed: {formatDate(doc.indexed_at)}</span>
                  {doc.metadata.category && (
                    <span>Category: {doc.metadata.category}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(doc.id, doc.filename)}
                disabled={deletingId === doc.id}
                className="ml-3 flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[#8e8ea0] transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                title="Delete document"
              >
                {deletingId === doc.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4e4f60] border-t-red-400" />
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
