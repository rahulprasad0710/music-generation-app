import { Request, Response } from "express";
import { AudioService } from "../services/audio.service";
import { searchAudioCached } from "@/config/cache";

const audioService = new AudioService();

export class AudioController {
    async getAll(req: Request, res: Response): Promise<void> {
        const { q = "", cursor } = req.query as { q?: string; cursor?: string };
        const data = await searchAudioCached(q, cursor);

        res.status(200).json({
            success: true,
            data: data,
            message: "user fetched successfully",
        });
    }

    async getAudioByUser(req: Request, res: Response): Promise<void> {
        const { verifiedUserId } = req;

        const data = await audioService.getAudioByUser(verifiedUserId, 1, 5);

        res.status(200).json({
            success: true,
            data: data,
            message: "user fetched successfully",
        });
    }
}
