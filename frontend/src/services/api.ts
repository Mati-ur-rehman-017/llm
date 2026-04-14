import type {
  ChatResponse,
  DocumentDeleteResponse,
  DocumentListResponse,
  DocumentUploadResponse,
  MessageHistoryItem,
} from "../types";

const API_BASE = "/api";

async function readErrorMessage(response: Response): Promise<string> {
  if (response.status === 413) {
    return "File too large for server upload limit";
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload.detail) {
        return payload.detail;
      }
    } catch {
      return `Request failed with status ${response.status}`;
    }
  }

  const text = await response.text();
  return text || `Request failed with status ${response.status}`;
}

export async function sendChat(
  message: string,
  history: MessageHistoryItem[] = [],
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Chat request failed: ${error}`);
  }

  return response.json() as Promise<ChatResponse>;
}

export async function sendChatStream(
  message: string,
  history: MessageHistoryItem[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): Promise<void> {
  const response = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const error = await response.text();
    onError(`Stream request failed: ${error}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError("No response body");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      const payload = trimmed.slice(6);
      if (payload === "[DONE]") {
        onDone();
        return;
      }

      try {
        const data = JSON.parse(payload) as { token?: string; error?: string };
        if (data.error) {
          onError(data.error);
          return;
        }
        if (data.token) {
          onToken(data.token);
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  onDone();
}

export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE}/health/`);
  if (!response.ok) throw new Error("Health check failed");
  return response.json() as Promise<{ status: string }>;
}

// Document API functions

export async function listDocuments(): Promise<DocumentListResponse> {
  const response = await fetch(`${API_BASE}/documents/`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list documents: ${error}`);
  }
  return response.json() as Promise<DocumentListResponse>;
}

export async function uploadDocument(
  file: File,
): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/documents/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await readErrorMessage(response);
    throw new Error(`Failed to upload document: ${error}`);
  }

  return response.json() as Promise<DocumentUploadResponse>;
}

export async function deleteDocument(
  docId: string,
): Promise<DocumentDeleteResponse> {
  const response = await fetch(`${API_BASE}/documents/${docId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete document: ${error}`);
  }

  return response.json() as Promise<DocumentDeleteResponse>;
}
