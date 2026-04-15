// src/services/user.service.ts
import { prisma } from "@/lib/prisma";

type GetAllUsersParams = {
    page?: number;
    limit?: number;
};

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
            },
        });
    }

    async getAllUsers({ page = 1, limit = 10 }: GetAllUsersParams) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isPremium: true,
                    isActive: true,
                    isBlacklisted: true,
                    createdAt: true,
                },
            }),
            prisma.user.count(),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
