import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { getAudioQueue } from "@/queues/audio.queue";

export function startPromptScheduler() {
    // Every 60 seconds
    cron.schedule("* * * * *", async () => {
        try {
            // Find prompts stuck in PENDING (not yet picked up, within maxAttempts)
            const pendingPrompts = await prisma.prompt.findMany({
                where: {
                    status: "PENDING",
                    attempts: { lt: prisma.prompt.fields.maxAttempts }, // attempts < maxAttempts
                    jobId: null, // not yet queued
                },
                take: 50,
                orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
                include: { user: { select: { id: true } } },
            });

            if (pendingPrompts.length === 0) return;

            console.log(
                `[Scheduler] Rescuing ${pendingPrompts.length} orphaned PENDING prompts`,
            );

            const queue = await getAudioQueue();

            for (const p of pendingPrompts) {
                if (!p.userId) continue;

                const job = await queue.add(
                    "generate-audio",
                    { promptId: p.id, userId: p.userId, prompt: p.prompt },
                    { priority: p.priority, jobId: `prompt-${p.id}` },
                );

                await prisma.prompt.update({
                    where: { id: p.id },
                    data: { status: "QUEUED", jobId: job.id },
                });
            }
        } catch (err) {
            console.error("[Scheduler] Error:", err);
        }
    });

    console.log("🕐 [Scheduler] Prompt scheduler started");
}
