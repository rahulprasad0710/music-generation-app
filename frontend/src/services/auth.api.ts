// services/auth.ts
import { ApiResponse } from "@/types/Api.type";
import { api, authApi } from "./axios.api";

type LoginPayload = {
    email: string;
    password: string;
    isRememberMe: boolean;
};

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type AuthUser = {
    id: number;
    email: string;
    name: string;
    authenticated: boolean;
    isRememberMe: boolean;
    isActive: boolean;
    isBlacklisted: boolean;
    isPremium: boolean;
    type: "credentials";
    accessToken: string;
};

type LogoutResponse = {
    id: number;
    accessToken: null;
    refreshToken: null;
};

export const loginApi = async (
    payload: LoginPayload,
): Promise<ApiResponse<AuthUser>> => {
    const res = await authApi.post<ApiResponse<AuthUser>>(
        "/auth/login",
        payload,
    );

    return res.data;
};

export const registerApi = async (
    payload: RegisterPayload,
): Promise<ApiResponse<AuthUser>> => {
    const res = await authApi.post<ApiResponse<AuthUser>>(
        "/auth/register",
        payload,
    );

    return res.data;
};

export const getMeApi = async () => {
    const res = await authApi.get<ApiResponse<AuthUser>>("/auth/me");

    return res.data;
};

export const refreshMeApi = async () => {
    const res = await authApi.post<ApiResponse<AuthUser>>("/auth/refresh-me");

    return res.data;
};

export const logoutApi = async () => {
    const res = await api.get<ApiResponse<LogoutResponse>>("/auth/logout");

    return res.data;
};
