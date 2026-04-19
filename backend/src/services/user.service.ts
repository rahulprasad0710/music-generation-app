import { invalidateCache, USER_CACHE_KEY } from "@/config/cache";
import { APP_CONSTANT } from "@/constants/AppConstant";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { UserResult } from "@/types/user.types";
import { decodeCursor, encodeCursor } from "@/utils/help";
import { RegisterPayloadInput } from "@/validations/auth.validation";

export class UserService {
    async getUserById(userId: number) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                isPremium: true,
                isActive: true,
                isBlacklisted: true,
                createdAt: true,
                isRememberMe: true,
                refreshToken: true,
            },
        });
    }

    async getAllUsers(query: string, cursor?: string) {
        const decoded = cursor ? decodeCursor(cursor) : null;
        const search = query.trim();

        const rows = await prisma.$queryRaw<(UserResult & { rank: number })[]>`
                WITH ranked AS (
                SELECT
                    id,
                    name,
                    email,
                    "isPremium",
                    "isActive",
                    "isBlacklisted",
                    "createdAt",
                    CASE
                    WHEN LOWER(name)  = LOWER(${search})        THEN 1
                    WHEN LOWER(email) = LOWER(${search})         THEN 1
                    WHEN LOWER(name)  LIKE LOWER(${search + "%"}) THEN 2
                    WHEN LOWER(email) LIKE LOWER(${search + "%"}) THEN 2
                    WHEN LOWER(name)  LIKE LOWER(${"%" + search + "%"}) THEN 3
                    WHEN LOWER(email) LIKE LOWER(${"%" + search + "%"}) THEN 3
                    ELSE 4
                    END AS rank
                FROM "User"
                WHERE
                    "isBlacklisted" = false
                    AND (
                    ${
                        search === ""
                            ? Prisma.sql`TRUE`
                            : Prisma.sql`
                        LOWER(name)  LIKE LOWER(${"%" + search + "%"})
                        OR LOWER(email) LIKE LOWER(${"%" + search + "%"})
                        `
                    }
                    )
                )
                SELECT
                id,
                name,
                email,
                "isPremium",
                "isActive",
                "isBlacklisted",
                "createdAt",
                rank
                FROM ranked
                WHERE
                ${
                    decoded === null
                        ? Prisma.sql`TRUE`
                        : Prisma.sql`(
                        "createdAt" < ${decoded.createdAt}
                        OR ("createdAt" = ${decoded.createdAt} AND id > ${decoded.id})
                        )`
                }
                ORDER BY
                rank ASC,
                "createdAt" DESC,
                id ASC
                LIMIT ${APP_CONSTANT.PAGE_SIZE + 1}
            `;

        const hasMore = rows.length > APP_CONSTANT.PAGE_SIZE;
        const results = hasMore ? rows.slice(0, APP_CONSTANT.PAGE_SIZE) : rows;
        const last = results[results.length - 1];

        const response = {
            results: results.map(({ rank: _rank, ...u }) => u),
            hasMore,
            nextCursor:
                hasMore && last
                    ? encodeCursor({ createdAt: last.createdAt, id: last.id })
                    : null,
        };

        return response;
    }

    async getByEmail(email: string) {
        const response = await prisma.user.findUnique({
            where: { email: email },
        });
        return response;
    }

    async updateRefreshToken(
        userId: number,
        refreshToken?: string,
        isRememberMe?: boolean,
    ) {
        const response = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: refreshToken ?? null,
                isRememberMe: isRememberMe ?? false,
            },
        });

        return response;
    }

    async createUser(payload: RegisterPayloadInput) {
        const { name, email, password } = payload;

        const response = await prisma.user.create({
            data: {
                name,
                email,
                password,
                isActive: true,
                isBlacklisted: false,
                isPremium: false,
                refreshToken: null,
                createdAt: new Date(),
                updatedAt: undefined,
                isRememberMe: false,
            },
        });

        await invalidateCache(USER_CACHE_KEY);
        return response;
    }
}
