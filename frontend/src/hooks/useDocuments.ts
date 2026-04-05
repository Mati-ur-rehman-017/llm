import { useCallback, useEffect, useState } from "react";
import { deleteDocument, listDocuments, uploadDocument } from "../services/api";
import type { Document } from "../types";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listDocuments();
      setDocuments(response.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
      console.error("Failed to load documents:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const upload = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      try {
        await uploadDocument(file);
        await loadDocuments(); // Refresh the list
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to upload document";
        setError(message);
        console.error("Failed to upload document:", err);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [loadDocuments],
  );

  const remove = useCallback(
    async (docId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await deleteDocument(docId);
        await loadDocuments(); // Refresh the list
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete document";
        setError(message);
        console.error("Failed to delete document:", err);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [loadDocuments],
  );

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  return {
    documents,
    isLoading,
    error,
    upload,
    remove,
    refresh: loadDocuments,
  };
}
