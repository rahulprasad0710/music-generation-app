"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import RecentGenerations from "./RecentGenerations";
import { logoutApi } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { GradientAvatar } from "./molecules/ProfileIcon";
import AudioGeneration from "./AudioGeneration";
import { resetAllStores } from "@/store";

interface User {
    name: string;
    username: string;
    credits: number;
    maxCredits: number;
}

interface ProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLButtonElement | null>;
    user: User;
}

export default function ProfilePopupScreen({
    isOpen,
    onClose,
    anchorRef,
    user,
}: ProfilePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);

    const logoutFromStore = useAuthStore((state) => state.logoutFromStore);

    const handleLogout = async () => {
        try {
            const response = await logoutApi();

            if (response?.success) {
                logoutFromStore();
                resetAllStores();
            }
        } catch (error) {
            console.log({
                error,
            });
        }
    };

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        function handleClick(e: MouseEvent) {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        }

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        // Delay so the opening click doesn't immediately close it
        const t = setTimeout(() => {
            document.addEventListener("mousedown", handleClick);
            document.addEventListener("keydown", handleEsc);
        }, 10);

        return () => {
            clearTimeout(t);
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose, anchorRef]);

    // Compute popup position from anchor
    function getPosition() {
        if (!anchorRef.current) return { top: 0, right: 0 };
        const rect = anchorRef.current.getBoundingClientRect();
        return {
            top: rect.bottom + 10,
            right: window.innerWidth - rect.right,
        };
    }

    const pos = getPosition();

    if (typeof window === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        position: "fixed",
                        top: pos.top + 2,
                        right: pos.right - 18,
                        transformOrigin: "top right",
                        zIndex: 65,
                        width: "min(420px, calc(100vw - 48px))",
                    }}
                    className='
                        flex flex-col overflow-hidden
                         border border-white/10
                        shadow-[0_24px_48px_rgba(0,0,0,0.5)]
                        rounded-[28px]
                    '
                >
                    {/* Glass background layer */}
                    <div
                        className='absolute inset-0 -z-10 rounded-[28px]'
                        style={{
                            background: "#1D2125",
                            backdropFilter: "blur(40px) saturate(160%)",
                            WebkitBackdropFilter: "blur(40px) saturate(160%)",
                        }}
                    />

                    <div className='overflow-y-auto max-h-150 pretty-scrollbar p-4 flex flex-col gap-0 rounded-[28px]'>
                        {/* ── Profile head ─────────────────────────────── */}
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                                {/* Avatar */}
                                <GradientAvatar
                                    initial={
                                        user?.name?.charAt(0)?.toUpperCase() ||
                                        "J"
                                    }
                                    showNotification={false}
                                />
                                {/* Name + handle */}
                                <div className='leading-snug'>
                                    <p className='text-[15px] font-semibold text-white tracking-tight truncate max-w-[200px]'>
                                        {user.name}
                                    </p>
                                    <p className='text-sm text-white/45'>
                                        @{user.username}
                                    </p>
                                </div>
                            </div>
                            {/* Settings icon */}
                            <button className='w-8 h-8 rounded-full flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity active:scale-95'>
                                <svg
                                    className='w-5 h-5 text-white'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='1.8'
                                >
                                    <circle cx='12' cy='12' r='3' />
                                    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' />
                                </svg>
                            </button>
                        </div>
                        {/* ── Credits card ─────────────────────────────── */}
                        <div className='rounded-xl bg-white/5 px-4 py-3 flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-white'>
                                    <span className='font-semibold'>
                                        {user.credits}
                                    </span>
                                    <span className='text-white/50'>
                                        {" "}
                                        / {user.maxCredits} credits
                                    </span>
                                </span>
                                <button className='opacity-30 hover:opacity-60 transition-opacity'>
                                    <svg
                                        className='w-4 h-4 text-white'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='1.8'
                                    >
                                        <circle cx='12' cy='12' r='10' />
                                        <line x1='12' y1='8' x2='12' y2='12' />
                                        <line
                                            x1='12'
                                            y1='16'
                                            x2='12.01'
                                            y2='16'
                                        />
                                    </svg>
                                </button>
                            </div>
                            {/* Progress bar */}
                            <div className='flex items-center gap-3'>
                                <button
                                    className='
                                    flex items-center gap-1 rounded-full
                                    bg-white/8 hover:bg-white/15
                                    px-3 py-1.5 text-xs font-medium text-white
                                    transition-colors duration-150 active:scale-95
                                '
                                >
                                    Upgrade
                                    <svg
                                        className='w-3 h-3 opacity-70'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2.5'
                                    >
                                        <path d='M9 18l6-6-6-6' />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className='border-t border-white/5 mb-3' />
                        <AudioGeneration />
                        <RecentGenerations showMainTitle={false} />
                        <div className='border-t border-white/5 mt-3 pt-3'>
                            <button
                                onClick={handleLogout}
                                className=' cursor-pointer
                                w-full flex items-center gap-2.5 px-2 py-2 rounded-xl h-10
                                text-sm text-white/50 hover:text-red-400 hover:bg-red-500/8
                                transition-all duration-150 active:scale-[0.98]
                            '
                            >
                                <svg
                                    className='w-4 h-4'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='1.8'
                                >
                                    <path
                                        d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'
                                        strokeLinecap='round'
                                    />
                                    <polyline
                                        points='16 17 21 12 16 7'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <line
                                        x1='21'
                                        y1='12'
                                        x2='9'
                                        y2='12'
                                        strokeLinecap='round'
                                    />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
}
