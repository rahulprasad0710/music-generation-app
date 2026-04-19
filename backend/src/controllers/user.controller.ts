import { Request, Response } from "express";
import { searchUsersCached } from "@/config/cache";

export class CustomerController {
    async getAll(req: Request, res: Response): Promise<void> {
        const q = (req.query.q as string) ?? "";
        const cursor = req.query.cursor as string | undefined;

        const data = await searchUsersCached(q, cursor);

        res.status(200).json({
            success: true,
            data: data,
            message: "user fetched successfully",
        });
    }
}
