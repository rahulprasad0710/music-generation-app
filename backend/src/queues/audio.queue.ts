import { Queue } from "bullmq";
import { RedisConfig } from "@config/redis.config";

export interface AudioJobData {
    promptId: number;
    userId: number;
    prompt: string;
    isPremium: boolean;
}

let audioQueueInstance: Queue<AudioJobData> | null = null;

export async function getAudioQueue(): Promise<Queue<AudioJobData>> {
    if (audioQueueInstance) return audioQueueInstance;

    const redis = await RedisConfig.getInstance();

    audioQueueInstance = new Queue<AudioJobData>("audio-generation", {
        connection: redis,
        defaultJobOptions: {
            attempts: 3,
            backoff: { type: "exponential", delay: 3000 },
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 50 },
        },
    });

    audioQueueInstance.on("error", (err) => {
        console.error("[AudioQueue] Queue error:", err);
    });

    return audioQueueInstance;
}
