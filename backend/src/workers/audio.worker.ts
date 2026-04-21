import { Worker, Job } from "bullmq";
import { prisma } from "@/lib/prisma";
import { RedisConfig } from "@config/redis.config";
import { SocketManager } from "@/socket/socket.manager";
import { AudioJobData } from "@/queues/audio.queue";

function getGenerationDuration(isPremium: boolean): number {
    if (isPremium) {
        return Math.floor(Math.random() * 10_000) + 50_000;
    } else {
        return Math.floor(Math.random() * 18_000) + 72_000;
    }
}

function shouldFail(elapsedMs: number, totalMs: number): boolean {
    const progress = elapsedMs / totalMs;

    if (progress < 0.25) return false;

    const midGenerationZone = progress >= 0.3 && progress <= 0.5;
    const failChance = midGenerationZone ? 0.06 : 0.02;

    return Math.random() < failChance;
}

function simulateLLMStream(
    job: Job<AudioJobData>,
    userId: number,
    totalMs: number,
    isPremium: boolean,
): Promise<{ failed: boolean; reason?: string }> {
    return new Promise((resolve) => {
        // Premium: tick every 4-6s | Free: tick every 6-10s
        const baseInterval = isPremium ? 4_000 : 7_000;
        const intervalMs = baseInterval + Math.floor(Math.random() * 3_000);

        let elapsed = 0;

        const messages = [
            "Analyzing your prompt…",
            "Composing melody structure…",
            "Generating rhythm patterns…",
            "Layering instruments…",
            "Applying audio effects…",
            "Mixing tracks…",
            "Finalizing audio output…",
            "Almost there…",
        ];
        let messageIndex = 0;

        const timer = setInterval(async () => {
            elapsed += intervalMs;

            // ── Random failure check ─────────────────────────────────────
            if (shouldFail(elapsed, totalMs)) {
                clearInterval(timer);
                resolve({
                    failed: true,
                    reason: pickRandom([
                        "Audio synthesis engine timeout",
                        "Model overloaded — generation failed",
                        "Unexpected error during composition",
                        "GPU memory exhausted during generation",
                    ]),
                });
                return;
            }

            const progress = Math.min(
                Math.round((elapsed / totalMs) * 100),
                99,
            );

            await job.updateProgress(progress);

            const message =
                messages[messageIndex] ?? "Processing your generation…";
            messageIndex = Math.min(messageIndex + 1, messages.length - 1);

            SocketManager.emitToUser(userId, "job:progress", {
                promptId: job.data.promptId,
                progress,
                message,
                isPremium,
            });

            if (elapsed >= totalMs) {
                clearInterval(timer);
                resolve({ failed: false });
            }
        }, intervalMs);
    });
}

// Random
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

//  audio generation
function generateFakeAudios(
    prompt: string,
): Array<{ title: string; audioUrl: string; durationMs: number }> {
    const seed = Date.now();
    const styles = ["Orchestral", "Lo-Fi", "Electronic", "Acoustic", "Jazz"];
    const style = pickRandom(styles);

    return [
        {
            title: `${prompt.slice(0, 40)} — ${style} Mix I`,
            audioUrl: `https://storage.musicgpt.fake/audio/${seed}-v1.mp3`,
            durationMs: Math.floor(Math.random() * 60_000) + 30_000,
        },
        {
            title: `${prompt.slice(0, 40)} — ${style} Mix II`,
            audioUrl: `https://storage.musicgpt.fake/audio/${seed}-v2.mp3`,
            durationMs: Math.floor(Math.random() * 60_000) + 30_000,
        },
    ];
}

// ! Worker
export async function startAudioWorker() {
    const redis = await RedisConfig.getInstance();

    const worker = new Worker<AudioJobData>(
        "audio-generation",
        async (job: Job<AudioJobData>) => {
            const { promptId, userId, prompt, isPremium = false } = job.data;
            const totalMs = getGenerationDuration(isPremium);

            // ── 1. Mark PROCESSING ───────────────────────────────────────────
            await prisma.prompt.update({
                where: { id: promptId },
                data: {
                    status: "PROCESSING",
                    startedAt: new Date(),
                    attempts: { increment: 1 },
                    jobId: job.id,
                },
            });

            await prisma.jobEvent.create({
                data: {
                    promptId,
                    type: "JOB_PROCESSING",
                    payload: {
                        jobId: job.id,
                        attemptsMade: job.attemptsMade,
                        estimatedMs: totalMs,
                        isPremium,
                    },
                },
            });

            SocketManager.emitToUser(userId, "job:processing", {
                promptId,
                estimatedSeconds: Math.round(totalMs / 1000),
                isPremium,
                message: isPremium
                    ? "Premium generation started — estimated ~50-60s"
                    : "Generation queued — estimated ~1.2-1.5 min",
            });

            const { failed, reason } = await simulateLLMStream(
                job,
                userId,
                totalMs,
                isPremium,
            );

            if (failed) {
                throw new Error(reason ?? "Generation failed unexpectedly");
            }

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

            await prisma.jobEvent.create({
                data: {
                    promptId,
                    type: "JOB_COMPLETED",
                    payload: { audioIds: audios.map((a) => a.id) },
                },
            });

            SocketManager.emitToUser(userId, "job:completed", {
                promptId,
                audios: completedPrompt.audios,
            });

            return { promptId, audioIds: audios.map((a) => a.id) };
        },
        {
            connection: redis,
            concurrency: 5,
        },
    );

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
