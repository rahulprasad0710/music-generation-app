import { Worker, Job } from "bullmq";
import { prisma } from "@/lib/prisma";
import { RedisConfig } from "@config/redis.config";
import { SocketManager } from "@/socket/socket.manager";
import { AudioJobData } from "@/queues/audio.queue";

// ─── Simulate LLM streaming ───────────────────────────────────────────────
function simulateLLMStream(
    job: Job<AudioJobData>,
    userId: number,
    durationMs: number,
): Promise<void> {
    return new Promise((resolve) => {
        const intervalMs = 3000; // emit progress every 2s
        let elapsed = 0;

        const timer = setInterval(async () => {
            elapsed += intervalMs;
            const progress = Math.min(
                Math.round((elapsed / durationMs) * 100),
                99,
            );

            await job.updateProgress(progress);

            // Real-time progress event to the specific user
            SocketManager.emitToUser(userId, "job:progress", {
                promptId: job.data.promptId,
                progress,
            });

            if (elapsed >= durationMs) {
                clearInterval(timer);
                resolve();
            }
        }, intervalMs);
    });
}

// ─── Simulate audio generation (returns fake URLs) ────────────────────────
function generateFakeAudios(
    prompt: string,
): Array<{ title: string; audioUrl: string; durationMs: number }> {
    const seed = Date.now();
    return [
        {
            title: `${prompt.slice(0, 40)} — Version I`,
            audioUrl: `https://storage.musicgpt.fake/audio/${seed}-v1.mp3`,
            durationMs: Math.floor(Math.random() * 60000) + 30000,
        },
        {
            title: `${prompt.slice(0, 40)} — Version II`,
            audioUrl: `https://storage.musicgpt.fake/audio/${seed}-v2.mp3`,
            durationMs: Math.floor(Math.random() * 60000) + 30000,
        },
    ];
}

// ─── Worker ───────────────────────────────────────────────────────────────
export async function startAudioWorker() {
    const redis = await RedisConfig.getInstance();

    const worker = new Worker<AudioJobData>(
        "audio-generation",
        async (job: Job<AudioJobData>) => {
            const { promptId, userId, prompt } = job.data;
            const generationMs = Math.floor(Math.random() * 5000) + 5000; // 5–10s

            // ── 1. Mark PROCESSING ──────────────────────────────────────────────
            await prisma.prompt.update({
                where: { id: promptId },
                data: {
                    status: "PROCESSING",
                    startedAt: new Date(),
                    attempts: { increment: 1 },
                    jobId: job.id,
                },
            });

            // ── 2. Log JobEvent ─────────────────────────────────────────────────
            await prisma.jobEvent.create({
                data: {
                    promptId,
                    type: "JOB_PROCESSING",
                    payload: { jobId: job.id, attemptsMade: job.attemptsMade },
                },
            });

            // ── 3. Emit real-time to user ────────────────────────────────────────
            SocketManager.emitToUser(userId, "job:processing", {
                promptId,
                message: "Your music is being generated…",
            });

            // ── 4. Simulate LLM streaming ────────────────────────────────────────
            await simulateLLMStream(job, userId, generationMs);

            // ── 5. Create 2 Audio records ────────────────────────────────────────
            const fakeAudios = generateFakeAudios(prompt);

            const audios = await Promise.all(
                fakeAudios.map((a) =>
                    prisma.audio.create({
                        data: {
                            userId,
                            promptId,
                            title: a.title,
                            inputPrompt: prompt,
                            audioUrl: a.audioUrl,
                            durationMs: a.durationMs,
                        },
                    }),
                ),
            );

            // ── 6. Mark COMPLETED ────────────────────────────────────────────────
            const completedPrompt = await prisma.prompt.update({
                where: { id: promptId },
                data: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                    eventEmitted: true,
                    result: { audioIds: audios.map((a) => a.id) },
                },
                include: { audios: true },
            });

            // ── 7. Log JobEvent ─────────────────────────────────────────────────
            await prisma.jobEvent.create({
                data: {
                    promptId,
                    type: "JOB_COMPLETED",
                    payload: { audioIds: audios.map((a) => a.id) },
                },
            });

            // ── 8. Emit completion to user ───────────────────────────────────────
            SocketManager.emitToUser(userId, "job:completed", {
                promptId,
                audios: completedPrompt.audios,
            });

            return { promptId, audioIds: audios.map((a) => a.id) };
        },
        {
            connection: redis,
            concurrency: 5, // handle 5 jobs at once
        },
    );

    // ─── Worker error handler (runs AFTER all retries exhausted) ──────────
    worker.on("failed", async (job, err) => {
        if (!job) return;
        const { promptId, userId } = job.data;
        const isExhausted = job.attemptsMade >= (job.opts.attempts ?? 3);

        if (isExhausted) {
            await prisma.prompt.update({
                where: { id: promptId },
                data: {
                    status: "FAILED",
                    errorMessage: err.message,
                    eventEmitted: true,
                },
            });

            await prisma.jobEvent.create({
                data: {
                    promptId,
                    type: "JOB_FAILED",
                    payload: { error: err.message, attempts: job.attemptsMade },
                },
            });

            SocketManager.emitToUser(userId, "job:failed", {
                promptId,
                error: err.message,
                message: "Music generation failed. Please try again.",
            });
        }
    });

    worker.on("completed", (job) => {
        console.log(
            `✅ [Worker] Job ${job.id} completed (promptId=${job.data.promptId})`,
        );
    });

    worker.on("error", (err) => {
        console.error("[Worker] Worker error:", err);
    });

    console.log("🎵 [Worker] Audio worker started");
    return worker;
}
