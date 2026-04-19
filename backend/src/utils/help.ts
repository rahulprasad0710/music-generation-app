interface CursorPayload {
    rank: number;
    playCount: number;
    createdAt: Date;
    id: number;
}

interface CursorUserPayload {
    createdAt: Date;
    id: number;
}

export function encodeCursor(
    payload: CursorPayload | CursorUserPayload,
): string {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeCursor(cursor: string): CursorPayload {
    const raw = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    return { ...raw, createdAt: new Date(raw.createdAt) };
}

export function buildField(query: string, cursor?: string): string {
    return `${query}:${cursor ?? "start"}`;
}
