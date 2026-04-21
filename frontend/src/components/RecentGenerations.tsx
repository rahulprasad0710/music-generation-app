"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioStore, AudioGeneration } from "@/store/audio.store";
import Image from "next/image";
import { useMusicStore } from "@/store/music.store";
import { useAuthStore } from "@/store/auth.store";
import { GenerationCard2 } from "./GenerationCard2";

export function getThumbnailFallbackColor(id: number): string {
    const gradients = [
        "bg-gradient-to-r from-violet-500 to-purple-600",
        "bg-gradient-to-r from-teal-400 to-cyan-600",
        "bg-gradient-to-r from-rose-500 to-pink-600",
        "bg-gradient-to-r from-amber-400 to-orange-600",
        "bg-gradient-to-r from-blue-500 to-indigo-600",
        "bg-gradient-to-r from-emerald-400 to-green-600",
        "bg-gradient-to-r from-fuchsia-500 to-purple-700",
        "bg-gradient-to-r from-sky-400 to-blue-600",
        "bg-gradient-to-r from-lime-400 to-emerald-600",
        "bg-gradient-to-r from-red-500 to-rose-700",
    ];

    return gradients[id % gradients.length];
}

export function MusicNoteIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className={className}
        >
            <path d='M9 3v11.5a3.5 3.5 0 1 0 2 3.15V8h4V3H9Z' />
        </svg>
    );
}

export function PlayIcon() {
    return (
        <div className='relative flex items-center justify-center w-10 h-10 group cursor-pointer'>
            <span className='absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-200' />
            <svg
                className='relative z-10'
                width='22'
                height='22'
                viewBox='0 0 24 24'
                fill='none'
            >
                <polygon
                    points='6,4 20,12 6,20'
                    fill='rgba(255,255,255,0.85)'
                />
            </svg>
        </div>
    );
}

function DownloadIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={1.5}
            className={className}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
            />
        </svg>
    );
}

function DotsIcon({ className }: { className?: string }) {
    return (
        <svg viewBox='0 0 24 24' fill='currentColor' className={className}>
            <circle cx='5' cy='12' r='1.5' />
            <circle cx='12' cy='12' r='1.5' />
            <circle cx='19' cy='12' r='1.5' />
        </svg>
    );
}

export function GenerationItem({
    generation,
}: {
    generation: AudioGeneration;
}) {
    const { currentlyPlayingId, setCurrentlyPlaying } = useAudioStore();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isPlaying = currentlyPlayingId === generation.id;

    useEffect(() => {
        if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setCurrentlyPlaying(generation.id);
        } else {
            setCurrentlyPlaying(generation.id);
            audioRef.current?.play().catch(() => {});
        }
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const a = document.createElement("a");
        a.href = generation.audioUrl;
        a.download = `${generation.title}.mp3`;
        a.click();
    };

    const fallbackColor = getThumbnailFallbackColor(generation.id);
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className=' relative flex items-center gap-4 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors duration-200'>
            {/* Thumbnail */}
            <button
                onClick={togglePlay}
                className='relative h-13 w-13 shrink-0 rounded-lg overflow-hidden focus:outline-none'
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {generation.thumbnail ? (
                    <Image
                        src={generation.thumbnail}
                        alt=''
                        className='h-full w-full object-cover'
                    />
                ) : (
                    <div
                        className={`h-full w-full ${fallbackColor} flex items-center justify-center`}
                    >
                        <div
                            className='relative flex items-center justify-center w-10 h-10 cursor-pointer'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isHovered ? (
                                <PlayIcon />
                            ) : (
                                <MusicNoteIcon className='h-5 w-5 text-white/70' />
                            )}
                        </div>
                    </div>
                )}
                {/* Play/Pause overlay */}
                <div
                    className={`h-full w-full ${fallbackColor} flex items-center justify-center`}
                >
                    <div
                        className='relative flex items-center justify-center w-10 h-10 cursor-pointer'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {isHovered ? (
                            <PlayIcon />
                        ) : (
                            <MusicNoteIcon className='h-5 w-5 text-white/70' />
                        )}
                    </div>
                </div>
            </button>

            {/* Info */}
            <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                    <p className='truncate text-sm font-semibold text-white leading-snug'>
                        {generation.title}
                    </p>
                </div>
                <p className='truncate text-xs text-white/40 mt-0.5'>
                    {generation.inputPrompt}
                </p>
            </div>

            {/* Actions */}
            <div className='flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
                <span className='shrink-0 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/50 border border-gray-600'>
                    {generation.version}
                </span>
                <button
                    onClick={handleDownload}
                    className='flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition-colors'
                    aria-label='Download'
                >
                    <DownloadIcon className='h-5 w-5 text-white/50' />
                </button>
            </div>
            <button
                className='flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition-colors'
                aria-label='More options'
            >
                <DotsIcon className='h-5 w-5 text-white/50' />
            </button>
        </div>
    );
}

function SkeletonItem() {
    return (
        <div className='flex items-center gap-4 px-3 py-2.5 animate-pulse'>
            <div className='h-13 w-13 shrink-0 rounded-lg bg-white/10' />
            <div className='flex-1 space-y-2'>
                <div className='h-3 w-2/5 rounded bg-white/10' />
                <div className='h-2.5 w-1/3 rounded bg-white/10' />
            </div>
            <div className='hidden sm:block h-2.5 w-8 rounded bg-white/10' />
        </div>
    );
}

type IRecentGenerationsProps = {
    showMainTitle: boolean;
};

export default function RecentGenerations(props: IRecentGenerationsProps) {
    const { generations, isLoading, error, fetchGenerations } = useAudioStore();
    const prompts = useMusicStore((s) => s.prompts);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (accessToken) {
            fetchGenerations();
        }
    }, [accessToken, fetchGenerations]);

    return (
        <div className='flex flex-col gap-0.5'>
            {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonItem key={i} />
                ))}

            {error && (
                <div className='rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
                    Failed to load generations: {error}
                </div>
            )}

            {!isLoading && !error && generations.length === 0 && (
                <p className='text-sm text-white/30 px-3 py-4'>
                    Create your first song!
                </p>
            )}

            {!isLoading &&
                generations.map((gen) => (
                    <GenerationItem key={gen.id} generation={gen} />
                ))}
        </div>
    );
}
