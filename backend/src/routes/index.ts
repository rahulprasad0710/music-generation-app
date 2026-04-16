import { Router as ExpressRouter } from "express";

// import verifyToken from "../middlewares/authentication";

// ROUTES

import authRoute from "./auth.route";
import userRoute from "./user.route";

const router = ExpressRouter();

router.use("/users", userRoute);
router.use("/auth", authRoute);

// *  AUTH ROUTE router.use("/auth", authRoute);
// router.use(verifyToken); // * APPLY AUTH MIDDLEWARE
// router.use(tenantMiddleware); // * INTERNAL COMPANY TENANT

// //  * PROTECTED ROUTES

// router.use("/auth-settings", authSettingRoute);
// router.use("/customers", customerRoute);

export default router;
