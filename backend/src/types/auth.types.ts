export type ILoggedInUser = {
    id?: number;
    email?: string;
    name: string;
    type: "credentials";
    authenticated: boolean;
    refreshToken?: string | null;
    isRememberMe: boolean;
    isPremium: boolean;
    isActive: boolean;
    isBlacklisted: boolean;
};
