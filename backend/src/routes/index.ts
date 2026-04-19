import { Router as ExpressRouter } from "express";

// import verifyToken from "../middlewares/authentication";

// ROUTES

import authRoute from "./auth.route";
import userRoute from "./user.route";
import promptRoute from "./prompt.route";
import audioRoute from "./audio.route";

const router = ExpressRouter();

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/prompts", promptRoute);
router.use("/audios", audioRoute);

// *  AUTH ROUTE router.use("/auth", authRoute);
// router.use(verifyToken); // * APPLY AUTH MIDDLEWARE
// router.use(tenantMiddleware); // * INTERNAL COMPANY TENANT

// //  * PROTECTED ROUTES

// router.use("/auth-settings", authSettingRoute);
// router.use("/customers", customerRoute);

export default router;
