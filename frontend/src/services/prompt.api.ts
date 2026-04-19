import { ApiResponse } from "@/types/Api.type";
import { api } from "./axios.api";
import { Prompt } from "@/types/music.type";

export type IPromptPayload = {
    prompt: string;
    priority: number;
};

export const postPromptApi = async (
    payload: IPromptPayload,
): Promise<ApiResponse<Prompt>> => {
    const res = await api.post<ApiResponse<Prompt>>("/prompts", payload);
    return res.data;
};

export const getPromptsByUserApi = async (): Promise<ApiResponse<Prompt[]>> => {
    const res = await api.get<ApiResponse<Prompt[]>>("/prompts/users");
    return res.data;
};
