import { STATUS_CONFIG } from "@/constants/prompt.constant";
import { PromptRecord } from "@/store/music.store";
import { div } from "framer-motion/client";

export function Thumbnail({
    record,
    fallbackColor,
}: {
    record: PromptRecord;
    fallbackColor: string;
}) {
    const cfg = STATUS_CONFIG[record.status];
    const isDone = record.status === "COMPLETED";
    const isFailed = record.status === "FAILED";

    return (
        <div className='relative h-13 w-13 shrink-0'>
            <div
                className={`h-full w-full rounded-xl overflow-hidden bg-linear-to-br ${fallbackColor} flex items-center justify-center`}
            >
                {isFailed ? (
                    <FailedIcon />
                ) : isDone ? (
                    <div className='relative flex items-center justify-center w-10 h-10 group cursor-pointer'>
                        <span className='absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-200' />
                        <PlayIcon />
                    </div>
                ) : (
                    <MusicNoteIcon />
                )}
            </div>

            {cfg.showProgress && !isDone && (
                <div className='absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center pointer-events-none'>
                    <span className='text-white/90 text-[14px] font-semibold'>
                        {Math.round(record.progress)}%
                    </span>
                </div>
            )}

            {cfg.showPulse && (
                <span className='absolute -top-0.75 -left-0.75 transition duration-300'>
                    <span className='relative flex h-3 w-3'>
                        <i
                            className={`not-italic animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dotColor} opacity-60`}
                        />
                        <b
                            className={`not-italic font-normal relative inline-flex rounded-full h-3 w-3 ${cfg.dotColor}`}
                        />
                    </span>
                </span>
            )}
        </div>
    );
}

export function PlayIcon() {
    return (
        <svg
            className='relative z-10'
            width='22'
            height='22'
            viewBox='0 0 24 24'
            fill='none'
        >
            <polygon points='6,4 20,12 6,20' fill='rgba(255,255,255,0.85)' />
        </svg>
    );
}

export function MusicNoteIcon() {
    return (
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
            <path
                d='M9 18V5l12-2v13'
                stroke='rgba(255,255,255,0.6)'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <circle
                cx='6'
                cy='18'
                r='3'
                stroke='rgba(255,255,255,0.6)'
                strokeWidth='1.5'
            />
            <circle
                cx='18'
                cy='16'
                r='3'
                stroke='rgba(255,255,255,0.6)'
                strokeWidth='1.5'
            />
        </svg>
    );
}
export function FailedIcon() {
    return (
        <svg width='22' height='22' viewBox='0 0 24 24' fill='none'>
            <circle
                cx='12'
                cy='12'
                r='9'
                stroke='rgba(255,100,100,0.7)'
                strokeWidth='1.5'
            />
            <path
                d='M12 8v4M12 16h.01'
                stroke='rgba(255,100,100,0.85)'
                strokeWidth='1.5'
                strokeLinecap='round'
            />
        </svg>
    );
}
