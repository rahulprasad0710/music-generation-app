import { UserPage } from "@/store/user.store";
import { ApiResponse } from "@/types/Api.type";
import { api } from "./axios.api";

export const getAllUsersApi = async (
    q: string | null,
    cursor: string | null,
): Promise<UserPage> => {
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (cursor) params.append("cursor", cursor);

    const res = await api.get<ApiResponse<UserPage>>(
        `/users?${params.toString()}`,
    );
    return res.data.data;
};
