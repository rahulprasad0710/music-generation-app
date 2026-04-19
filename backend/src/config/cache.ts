import { RedisService } from "@/services/redis.service";
import { SearchPage } from "@/types/audio.types";
import { AudioService } from "@/services/audio.service";
import { UserPage } from "@/types/user.types";
import { buildField } from "@/utils/help";

const audioService = new AudioService();

const CACHE_TTL_SECONDS = 60;
const AUDIO_CACHE_KEY = "audio:search";
export const USER_CACHE_KEY = "user:search";

export async function searchAudioCached(
    query: string,
    cursor?: string,
): Promise<SearchPage> {
    const field = buildField(query, cursor);

    const cached = await RedisService.hGetValue<SearchPage>(
        AUDIO_CACHE_KEY,
        field,
    );
    if (cached) return cached;

    const result = await audioService.searchAudio(query, cursor);

    await RedisService.hSetValue<SearchPage>(AUDIO_CACHE_KEY, field, result);
    await RedisService.expire(AUDIO_CACHE_KEY, CACHE_TTL_SECONDS);

    return result;
}

export async function searchUsersCached(
    query: string,
    cursor?: string,
): Promise<UserPage> {
    const field = buildField(query, cursor);

    const cached = await RedisService.hGetValue<UserPage>(
        USER_CACHE_KEY,
        field,
    );
    if (cached) return cached;

    const { UserService } = await import("@/services/user.service");
    const result = await new UserService().getAllUsers(query, cursor);

    await RedisService.hSetValue<UserPage>(USER_CACHE_KEY, field, result);
    await RedisService.expire(USER_CACHE_KEY, CACHE_TTL_SECONDS);

    return result;
}

export async function invalidateCache(cacheKey: string): Promise<void> {
    await RedisService.del(cacheKey);
}
