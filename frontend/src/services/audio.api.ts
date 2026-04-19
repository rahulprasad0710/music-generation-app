import { ApiResponse } from "@/types/Api.type";
import { api } from "./axios.api";
import { AllAudioData, Audio } from "@/types/music.type";

export const getUserAudiosApi = async () => {
    const res = await api.get<ApiResponse<Audio[]>>("/audios/users");

    return res.data;
};

export const getAllAudiosApi = async (
    q: string | null,
    cursor: string | null,
): Promise<ApiResponse<AllAudioData>> => {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (cursor) params.append("cursor", cursor);

    const res = await api.get<ApiResponse<AllAudioData>>(
        `/audios?${params.toString()}`,
    );
    return res.data;
};
