import { useState } from "react";
import type { Document } from "../types";

export function useDocuments() {
  const [documents] = useState<Document[]>([]);
  const isAvailable = false;

  return { documents, isAvailable };
}
