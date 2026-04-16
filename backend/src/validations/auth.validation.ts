import { z } from "zod";

export const registerPayloadSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),

    email: z.string().email("Invalid email address").toLowerCase(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password too long"),
});

export const registerSchema = z.object({
    body: registerPayloadSchema,
});

export const loginPayloadSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password too long"),

    isRememberMe: z.boolean(),
});

export const loginSchema = z.object({
    body: loginPayloadSchema,
});

export type RegisterPayloadInput = z.infer<typeof registerPayloadSchema>;
export type LoginPayloadInput = z.infer<typeof loginPayloadSchema>;
