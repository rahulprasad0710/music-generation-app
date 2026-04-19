import { z } from "zod";

const CreatePromptPayloadSchema = z.object({
    prompt: z.string().min(3).max(1000),
    priority: z.number().int().min(1).max(10).optional(),
});

export const createRegisterSchema = z.object({
    body: CreatePromptPayloadSchema,
});
