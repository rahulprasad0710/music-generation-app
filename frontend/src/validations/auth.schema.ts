import { z } from "zod";

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(2, "Must be at least 2 characters")
            .max(60, "Must be under 60 characters")
            .regex(
                /^[a-zA-Z\s'-]+$/,
                "Only letters, spaces, hyphens, apostrophes",
            ),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Enter a valid email address"),
        password: z
            .string()
            .min(8, "At least 8 characters")
            .regex(/[A-Z]/, "One uppercase letter required")
            .regex(/[0-9]/, "One number required"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
