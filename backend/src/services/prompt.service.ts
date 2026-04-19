import { prisma } from "@/lib/prisma";
import { getAudioQueue } from "@/queues/audio.queue";

interface CreatePromptInput {
    userId: number;
    prompt: string;
    priority?: number;
}

export class PromptService {
    private static generateTitle(prompt: string): string {
        const words = prompt.trim().split(/\s+/).slice(0, 6).join(" ");
        return words.length < prompt.length ? `${words}…` : words;
    }

    async create(input: CreatePromptInput) {
        const { userId, prompt, priority = 1 } = input;
        const title = PromptService.generateTitle(prompt);

        // 1. Persist PENDING
        const createdPrompt = await prisma.prompt.create({
            data: { userId, prompt, title, status: "PENDING", priority },
        });

        // 2. Immediately enqueue (scheduler is only a failsafe)
        try {
            const queue = await getAudioQueue();

            const job = await queue.add(
                "generate-audio",
                { promptId: createdPrompt.id, userId, prompt },
                {
                    priority,
                    jobId: `prompt-${createdPrompt.id}`, // idempotency key
                },
            );

            // 3. Mark QUEUED synchronously so the scheduler skips it
            await prisma.prompt.update({
                where: { id: createdPrompt.id },
                data: { status: "QUEUED", jobId: job.id },
            });

            return { ...createdPrompt, status: "QUEUED" as const };
        } catch (err) {
            // Queue unavailable — scheduler will rescue. Still return PENDING.
            console.error(
                "[PromptService] Failed to enqueue, scheduler will retry:",
                err,
            );
            return createdPrompt;
        }
    }

    async searchPrompts(
        query: string,
        limit = 10,
        cursorRank?: number,
        cursorId?: number,
    ) {
        const result = await prisma.$queryRaw<
            Array<{
                id: number;
                prompt: string;
                status: string;
                createdAt: Date;
                rank: number;
            }>
        >`
            SELECT
            *,
            ts_rank(prompt_tsv, plainto_tsquery('english', ${query})) AS rank
            FROM "Prompt"
            WHERE
            (
                prompt ILIKE ${"%" + query + "%"}
                OR prompt_tsv @@ plainto_tsquery('english', ${query})
                OR prompt % ${query}
            )
            AND (
                ${cursorRank}::float IS NULL
                OR ${cursorId}::int IS NULL
                OR (ts_rank(prompt_tsv, plainto_tsquery('english', ${query})), id)
                    < (${cursorRank}::float, ${cursorId}::int)
            )
            ORDER BY rank DESC, id DESC
            LIMIT ${limit + 1};
        `;

        return result;
    }

    async getPromptByUser(userId: number, page = 1, limit = 20) {
        const result = await prisma.prompt.findMany({
            where: { userId },
            include: {
                audios: true,
                events: { orderBy: { createdAt: "desc" }, take: 1 },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        console.log({
            result2: await this.getAudioByUser(userId),
        });

        return result;
    }

    async getAudioByUser(userId: number, page = 1, limit = 20) {
        const result = await prisma.audio.findMany({
            where: { userId },
            include: {
                prompt: true,
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        console.log({
            result,
        });

        return result;
    }
}

// const hasNextPage = result.length > limit;
// return {
//     data: result.slice(0, limit),
//     nextCursor: hasNextPage
//         ? {
//               id: lastItem.id,
//               rank: lastItem.rank,
//           }
//         : null,
// };
