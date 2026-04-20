"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useMusicStore } from "@/store/music.store";
import { Audio } from "@/store/music.store";

let socket: Socket | null = null;

export function useSocket(token: string | null) {
    const { setProcessing, setProgress, setCompleted, setFailed } =
        useMusicStore();
    const connected = useRef(false);

    useEffect(() => {
        if (!token || connected.current) return;

        socket = io(process.env.NEXT_PUBLIC_API_URL!, {
            auth: { token },
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("[Socket] Connected:", socket?.id);
            connected.current = true;
        });

        // ── Bind events to Zustand ──────────────────────────────────────────
        socket.on(
            "job:processing",
            ({ promptId, message }: { promptId: number; message?: string }) => {
                setProcessing(promptId, message);
            },
        );

        socket.on(
            "job:progress",
            ({
                promptId,
                progress,
                message,
            }: {
                promptId: number;
                progress: number;
                message?: string;
            }) => {
                setProgress(promptId, progress, message);
            },
        );

        socket.on(
            "job:completed",
            ({ promptId, audios }: { promptId: number; audios: Audio[] }) => {
                setCompleted(promptId, audios);
            },
        );

        socket.on(
            "job:failed",
            ({ promptId, error }: { promptId: number; error: string }) => {
                setFailed(promptId, error);
            },
        );

        socket.on("disconnect", () => {
            console.warn("[Socket] Disconnected");
            connected.current = false;
        });

        return () => {
            socket?.disconnect();
            socket = null;
            connected.current = false;
        };
    }, [token]);
}
