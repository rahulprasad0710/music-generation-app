import { Request, Response } from "express";
import { UserService } from "../services/user.service";

const customerService = new UserService();

export class CustomerController {
    async getAll(req: Request, res: Response): Promise<void> {
        const data = await customerService.getAllUsers({
            limit: 10,
            page: 1,
        });

        res.status(200).json({
            success: true,
            data: data,
            message: "user fetched successfully",
        });
    }
}
