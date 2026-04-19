import { prisma } from "@/lib/prisma";
import { getAudioQueue } from "@/queues/audio.queue";
import { decodeCursor, encodeCursor } from "@/utils/help";
import { Prisma } from "../generated/prisma/client";
import { AudioSearchResult, SearchPage } from "@/types/audio.types";
import { APP_CONSTANT } from "@/constants/AppConstant";

export class AudioService {
    async searchAudio(query: string, cursor?: string): Promise<SearchPage> {
        const decoded = cursor ? decodeCursor(cursor) : null;
        const tsQuery = query.trim().split(/\s+/).join(" & ");

        const rows = await prisma.$queryRaw<AudioSearchResult[]>`
                        WITH ranked AS (
                        SELECT
                            id,
                            title,
                            "inputPrompt",
                            "audioUrl",
                            "hlsUrl",
                            thumbnail,
                            "durationMs",
                            "playCount",
                            "likeCount",
                            "createdAt",
                            CASE
                            WHEN LOWER(title) = LOWER(${query})
                                THEN 1
                            WHEN LOWER(title) LIKE LOWER(${query + "%"})
                                THEN 2
                            WHEN to_tsvector('english', title) @@ to_tsquery('english', ${tsQuery})
                                THEN 3
                            WHEN similarity(LOWER(title), LOWER(${query})) > 0.2
                                THEN 4
                            ELSE 5
                            END AS rank
                        FROM "Audio"
                        WHERE
                            LOWER(title) = LOWER(${query})
                            OR LOWER(title) LIKE LOWER(${query + "%"})
                            OR LOWER(title) LIKE LOWER(${"%" + query + "%"})
                            OR to_tsvector('english', title) @@ to_tsquery('english', ${tsQuery})
                            OR similarity(LOWER(title), LOWER(${query})) > 0.2
                        )
                        SELECT
                        id,
                        title,
                        "inputPrompt",
                        "audioUrl",
                        "hlsUrl",
                        thumbnail,
                        "durationMs",
                        "playCount",
                        "likeCount",
                        "createdAt",
                        rank
                        FROM ranked
                        WHERE
                        ${
                            decoded === null
                                ? Prisma.sql`TRUE`
                                : Prisma.sql`(
                                rank > ${decoded.rank}
                                OR (rank = ${decoded.rank} AND "playCount" < ${decoded.playCount})
                                OR (rank = ${decoded.rank} AND "playCount" = ${decoded.playCount} AND "createdAt" < ${decoded.createdAt})
                                OR (rank = ${decoded.rank} AND "playCount" = ${decoded.playCount} AND "createdAt" = ${decoded.createdAt} AND id > ${decoded.id})
                                )`
                        }
                        ORDER BY
                        rank ASC,
                        "playCount" DESC,
                        "createdAt" DESC,
                        id ASC
                        LIMIT ${APP_CONSTANT.PAGE_SIZE + 1}
                    `;

        const hasMore = rows.length > APP_CONSTANT.PAGE_SIZE;
        const results = hasMore ? rows.slice(0, APP_CONSTANT.PAGE_SIZE) : rows;
        const lastRow = results[results.length - 1];

        return {
            results,
            hasMore,
            nextCursor:
                hasMore && lastRow
                    ? encodeCursor({
                          rank: lastRow.rank,
                          playCount: lastRow.playCount,
                          createdAt: lastRow.createdAt,
                          id: lastRow.id,
                      })
                    : null,
        };
    }

    async getAudioByUser(userId: number, page = 1, limit = 5) {
        const result = await prisma.audio.findMany({
            where: { userId },
            include: {
                prompt: true,
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        return result;
    }
}
