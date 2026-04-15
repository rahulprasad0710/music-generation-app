import { Router as ExpressRouter } from "express";
import asyncTryCatchFn from "@utils/asyncTryCatchFn";
import { CustomerController } from "@controllers/user.controller";

const customerController = new CustomerController();

const router = ExpressRouter();

// router.use(verifyToken);

router.get("", asyncTryCatchFn(customerController.getAll));

export default router;
