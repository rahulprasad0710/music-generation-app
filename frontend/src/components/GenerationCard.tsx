"use client";
import { PromptRecord } from "@/store/music.store";
import { getThumbnailFallbackColor } from "./RecentGenerations";

// ── Main Card ────────────────────────────────────────────────────────────
export function GenerationCard({ record }: { record: PromptRecord }) {
    const fallbackColor = getThumbnailFallbackColor(record.id);

    return (
        <div className='group relative flex items-center gap-4 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors duration-200'>
            <button className='relative h-13 w-13 shrink-0 rounded-lg overflow-hidden focus:outline-none'>
                <div
                    className={`h-full w-full ${fallbackColor} flex items-center justify-center`}
                >
                    <div className='font-medium'>
                        {record.status === "PROCESSING" &&
                            `${record.progress}%`}
                    </div>
                </div>
            </button>

            <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                    <p className='truncate text-sm font-semibold text-white leading-snug'>
                        {record.title}
                    </p>
                </div>
                <p className='truncate text-xs text-white/40 mt-0.5'>
                    {record.prompt}
                </p>
            </div>
        </div>
    );
}
