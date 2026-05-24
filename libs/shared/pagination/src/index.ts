export interface Page<T> {
  items: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  total: number;
}

export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
  direction: "forward" | "backward";
}

export interface CursorPayload {
  timestamp: string;
  id: string;
}

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
}

export function decodeCursor(cursor: string): CursorPayload {
  const raw = Buffer.from(cursor, "base64url").toString("utf-8");
  const parsed = JSON.parse(raw) as Partial<CursorPayload>;

  if (typeof parsed.timestamp !== "string" || typeof parsed.id !== "string") {
    throw new Error("Invalid cursor payload");
  }

  return {
    timestamp: parsed.timestamp,
    id: parsed.id
  };
}
