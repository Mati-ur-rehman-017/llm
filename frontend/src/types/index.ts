export interface Source {
  doc_id: string;
  score: number;
  text: string;
}

export interface ChatResponse {
  response: string;
  sources: Source[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

export interface MessageHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface Document {
  id: string;
  filename: string;
  status: "indexed" | "processing" | "failed";
  indexed_at: string;
  chunk_count: number;
  metadata: Record<string, string>;
}

export interface DocumentUploadResponse {
  id: string;
  status: "success" | "error";
  message: string;
  chunks_created: number;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
}

export interface DocumentDeleteResponse {
  status: "success" | "error";
  message: string;
}

export type ActiveTab = "chat" | "documents";
