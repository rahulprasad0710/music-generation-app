import { Request, Response } from "express";
import { PromptService } from "../services/prompt.service";

const promptService = new PromptService();

export class PromptController {
    async getAll(req: Request, res: Response): Promise<void> {
        const data = await promptService.searchPrompts("T", 10);

        res.status(200).json({
            success: true,
            data: data,
            message: "user fetched successfully",
        });
    }

    async getPromptByUser(req: Request, res: Response): Promise<void> {
        const { verifiedUserId } = req;

        const data = await promptService.getPromptByUser(verifiedUserId, 1, 5);

        res.status(200).json({
            success: true,
            data: data,
            message: "user fetched successfully",
        });
    }

    async create(req: Request, res: Response): Promise<void> {
        const { verifiedUserId } = req;

        const payload = req.body;

        const data = await promptService.create({
            userId: verifiedUserId,
            prompt: payload.prompt,
            priority: payload.priority,
        });

        res.status(200).json({
            success: true,
            data: data,
            message: "Prompt created successfully",
        });
    }
}
