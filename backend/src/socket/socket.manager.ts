import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { decodeToken } from "@/middlewares/authentication.middleware";

export interface AuthSocket extends Socket {
    userId?: number;
}

export class SocketManager {
    private static io: IOServer | null = null;

    /** Call once at server startup */
    public static init(httpServer: HTTPServer): IOServer {
        if (this.io) return this.io;

        this.io = new IOServer(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
                credentials: true,
            },
            transports: ["websocket", "polling"],
        });

        // ── Auth middleware ───────────────────────────────────────────────────
        this.io.use(async (socket: AuthSocket, next) => {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers["authorization"]?.split(" ")[1];

            if (!token) return next(new Error("Authentication token missing"));

            try {
                // const payload = verifyAccessToken(token) as { userId: number };
                const payload = (await decodeToken(token)) as {
                    userId: number;
                };

                socket.userId = payload.userId;
                next();
            } catch {
                next(new Error("Invalid token"));
            }
        });

        // ── Connection handler ────────────────────────────────────────────────
        this.io.on("connection", (socket: AuthSocket) => {
            const userId = socket.userId!;
            const room = `user:${userId}`;

            socket.join(room);
            console.log(`[Socket] User ${userId} connected → room ${room}`);

            socket.on("disconnect", (reason) => {
                console.log(`[Socket] User ${userId} disconnected: ${reason}`);
            });

            // Client can subscribe to a specific prompt for granular updates
            socket.on("subscribe:prompt", (promptId: number) => {
                socket.join(`prompt:${promptId}`);
            });
        });

        return this.io;
    }

    /** Emit an event to every socket belonging to a user */
    public static emitToUser<T>(userId: number, event: string, data: T): void {
        if (!this.io) {
            console.warn("[Socket] io not initialized — cannot emit");
            return;
        }
        this.io.to(`user:${userId}`).emit(event, data);
    }

    /** Emit to a specific prompt room (all watchers) */
    public static emitToPrompt<T>(
        promptId: number,
        event: string,
        data: T,
    ): void {
        if (!this.io) return;
        this.io.to(`prompt:${promptId}`).emit(event, data);
    }

    public static getIO(): IOServer | null {
        return this.io;
    }
}
