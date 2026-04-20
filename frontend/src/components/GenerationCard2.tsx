"use client";
import {
    PROMPT_FALLBACK_COLORS,
    STATUS_CONFIG,
} from "@/constants/prompt.constant";
import { PromptRecord } from "@/store/music.store";
import { Thumbnail } from "./promptStates/States";

export function getThumbnailFallbackColor(id: number): string {
    return PROMPT_FALLBACK_COLORS[id % PROMPT_FALLBACK_COLORS.length];
}

export function GenerationCard2({
    record,
    version,
}: {
    record: PromptRecord;
    version: number | false;
}) {
    const fallbackColor = getThumbnailFallbackColor(record.id);
    const cfg = STATUS_CONFIG[record.status];

    const isProcessing = record.status === "PROCESSING";
    const isFailed = record.status === "FAILED";
    const isDone = record.status === "COMPLETED";
    const progress = Math.min(100, Math.max(0, record.progress));

    const subtitle = isFailed
        ? (record.error ?? "Something went wrong")
        : isProcessing
          ? (cfg.subtitle ?? "Processing...")
          : (cfg.subtitle ?? "");

    const displayTitle = record.title ?? record.prompt;

    return (
        <div className='relative group mb-2 rounded-xl px-3 cursor-pointer  transition-colors duration-200 hover:bg-white/5'>
            {/* Background progress fill */}
            {isProcessing && (
                <div
                    className='absolute -inset-x-2 inset-y-0 rounded-xl overflow-hidden pointer-events-none'
                    style={{
                        opacity: isDone ? 0 : 1,
                        transition: "opacity 0.3s",
                    }}
                >
                    <div
                        className='h-full bg-white/8 transition-all  duration-300 ease-linear'
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Failed bg tint */}
            {isFailed && (
                <div className='absolute -inset-x-2 inset-y-0 rounded-xl bg-red-500/5 pointer-events-none' />
            )}

            {/* Card row */}
            <div className='relative min-h-18 rounded-xl py-2 flex items-start transition duration-200 '>
                <Thumbnail record={record} fallbackColor={fallbackColor} />

                {/* Text block */}
                <div className='absolute left-17.5 right-0 top-1.75 w-[calc(100%-115px)]'>
                    <p className='truncate text-[15px] text-white font-medium leading-snug'>
                        {displayTitle}
                    </p>
                    <p
                        className={`truncate text-[13px] leading-snug mt-0.5 ${cfg.subtitleClass}`}
                    >
                        {record?.message && record?.progress !== 100
                            ? record?.message
                            : subtitle}
                    </p>
                </div>

                {/* Right side: version badge OR status badge */}
                <div className='absolute right-2 top-4.5 flex items-center gap-2'>
                    {version !== false && isDone && (
                        <span className='cursor-default h-6 w-8 flex items-center justify-center rounded-lg font-semibold text-[14px] text-white/40 border border-white/25'>
                            v{version}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
