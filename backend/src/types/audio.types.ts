export interface CursorPayload {
    rank: number;
    playCount: number;
    createdAt: Date;
    id: number;
}

export interface AudioSearchResult {
    id: number;
    title: string;
    inputPrompt: string;
    audioUrl: string;
    hlsUrl: string | null;
    thumbnail: string | null;
    durationMs: number | null;
    playCount: number;
    likeCount: number;
    createdAt: Date;
    rank: number;
}

export interface SearchPage {
    results: AudioSearchResult[];
    nextCursor: string | null;
    hasMore: boolean;
}
