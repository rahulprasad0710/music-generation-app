import cors from "cors";
import { createServer } from "http";
import helmet from "helmet";
import express from "express";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { corsOptions } from "./config/corsConfig";
import { APP_CONSTANT } from "./constants/AppConstant";
import routes from "./routes/index";
import cookieParser from "cookie-parser";

import { SocketManager } from "@/socket/socket.manager";
import { startPromptScheduler } from "@/schedulers/prompt.scheduler";
import AppError from "./utils/AppError";
import { ErrorType } from "./enums/error.enum";
import { startAudioWorker } from "./workers/audio.worker";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();
const app = express();
export const httpServer = createServer(app);

const port = Number(process.env.PORT) || 8000;

app.use(express.json());

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

SocketManager.init(httpServer);

await startAudioWorker();
startPromptScheduler();

app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    }),
);

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.use("/api", routes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Page not found.`, ErrorType.NOT_FOUND_ERROR));
});

app.use(errorHandler);

httpServer.listen(port, () => {
    console.log(
        `ENV : ${APP_CONSTANT.NODE_ENV} | Server is running on port ${port}`,
    );
});
