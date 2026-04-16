// src/services/user.service.ts
import { prisma } from "@/lib/prisma";
import { RegisterPayloadInput } from "@/validations/auth.validation";

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
                isRememberMe: true,
                refreshToken: true,
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
        return response;
    }
}
