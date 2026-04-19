export interface UserResult {
    id: number;
    name: string;
    email: string;
    isPremium: boolean;
    isActive: boolean;
    isBlacklisted: boolean;
    createdAt: Date;
}

export interface UserPage {
    results: UserResult[];
    hasMore: boolean;
    nextCursor: string | null;
}
