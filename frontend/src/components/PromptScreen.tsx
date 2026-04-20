"use client";

import { IPromptPayload, postPromptApi } from "@/services/prompt.api";
import { useAuthStore } from "@/store/auth.store";
import { useMusicStore } from "@/store/music.store";
import { useToggleStore } from "@/store/profile.store";
import { useFirstLoginStore } from "@/store/userFirstLogin.store";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ArrowRight, Paperclip, Mic, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const PLACEHOLDERS = [
    "A rainy jazz café in Tokyo…",
    "Epic orchestral battle theme…",
    "Lo-fi beats for late night coding…",
    "Euphoric festival drop at sunrise…",
    "Melancholic piano in an empty station…",
];

export default function PromptScreen() {
    const { addPrompt } = useMusicStore();
    const { setOpen, setSignUpOpen } = useToggleStore();
    const { user } = useAuthStore((state) => state);
    const [promptText, setPromptText] = useState<string>("");
    const isActive = promptText.trim().length > 0;
    const [loading, setLoading] = useState(false);
    const [placeholder, setPlaceholder] = useState(0);
    const isFirstTimeLoggedIn = useFirstLoginStore(
        (s) => s.isFirstTimeLoggedIn,
    );

    useEffect(() => {
        const id = setInterval(
            () => setPlaceholder((p) => (p + 1) % PLACEHOLDERS.length),
            3500,
        );
        return () => clearInterval(id);
    }, []);

    const handleSubmit = async () => {
        if (!promptText.trim() || loading) return;
        setLoading(true);
        setOpen(true);

        const payload: IPromptPayload = {
            prompt: promptText.trim(),
            priority: 1,
        };

        try {
            const res = await postPromptApi(payload);

            // Optimistically add to store with QUEUED status
            addPrompt({
                id: res.data.id,
                prompt: res.data.prompt,
                title: res.data.title,
                status: res.data.status,
                progress: 0,
                audios: [],
                error: null,
                createdAt: res.data.createdAt,
            });

            setPromptText("");
        } catch (err) {
            console.error("Failed to submit prompt:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='relative flex items-center justify-center mb-10 py-2.5 min-h-147.5 overflow-x-hidden'>
            <div className='relative w-full'>
                <div
                    className='relative flex h-10 justify-center'
                    style={{ top: "calc(50% - 170px)" }}
                >
                    <div style={{ opacity: 1 }}>
                        <div className='absolute left-0 right-0 top-0 h-19 w-full text-center text-xl leading-tight text-white'>
                            <div className='block'>
                                <div
                                    className='w-full text-[24px] font-semibold tracking-[.32px] sm:text-[28px] md:text-[32px]'
                                    style={{ opacity: 1 }}
                                >
                                    What Song to Create ?
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-8'>
                    <div
                        className='relative mx-auto max-w-full'
                        style={{ height: 137, width: 800 }}
                    >
                        {isFirstTimeLoggedIn && user?.id && (
                            <>
                                <div className='absolute -inset-[2px] rounded-[36px] overflow-hidden pointer-events-none'>
                                    <motion.div
                                        className='absolute'
                                        style={{
                                            width: "200%",
                                            height: "200%",
                                            top: "-50%",
                                            left: "-50%",
                                            background:
                                                "conic-gradient(from 0deg, transparent 0deg, transparent 120deg, #FF7B16 180deg, #FF9A4D 200deg, transparent 240deg, transparent 360deg)",
                                        }}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                </div>

                                <div className='absolute -inset-[2px] rounded-[36px] overflow-hidden pointer-events-none opacity-60'>
                                    <motion.div
                                        className='absolute'
                                        style={{
                                            width: "200%",
                                            height: "200%",
                                            top: "-50%",
                                            left: "-50%",
                                            background:
                                                "conic-gradient(from 0deg, transparent 0deg, transparent 120deg, #FF7B16 180deg, #FF9A4D 200deg, transparent 240deg, transparent 360deg)",
                                            filter: "blur(10px)",
                                        }}
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        <div
                            className=' relative z-20 h-full w-full rounded-[28px] bg-[#1D2125] dark:bg-[#1D2125] transition duration-200 dark:border-zinc-800'
                            style={{ opacity: 1 }}
                        >
                            <div className='h-full w-full'>
                                <form className='overflow-hidden pb-12.5'>
                                    <div className='pt-5'>
                                        <div className='relative'>
                                            <AnimatePresence mode='wait'>
                                                {!promptText && (
                                                    <motion.div
                                                        key={placeholder}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 6,
                                                        }}
                                                        animate={{
                                                            opacity: promptText
                                                                ? 0
                                                                : 0.4,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -6,
                                                        }}
                                                        transition={{
                                                            duration: 0.4,
                                                        }}
                                                        className='pointer-events-none absolute left-5 top-2.5 z-0 h-14 w-full overflow-hidden bg-transparent '
                                                    >
                                                        <div className='pointer-events-none absolute top-2.5 z-0 h-8 w-[calc(100%-40px)] bg-transparent'>
                                                            <div className='tracking-[.32px] text-gray-500'>
                                                                {
                                                                    PLACEHOLDERS[
                                                                        placeholder
                                                                    ]
                                                                }
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <textarea
                                                onChange={(e) =>
                                                    setPromptText(
                                                        e.target.value,
                                                    )
                                                }
                                                value={promptText}
                                                className='px-5 py-5 -mt-5 block outline-none resize-none w-full bg-transparent text-base text-white h-16.5'
                                                style={{ height: 64 }}
                                            />
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between flex-col gap-y-2 sm:flex-row absolute bottom-3 left-3 right-3 h-20.5 sm:h-10'>
                                        <div className='flex w-full gap-2'>
                                            <div>
                                                <div className='relative'>
                                                    <div
                                                        className='group'
                                                        aria-haspopup='menu'
                                                        aria-expanded='false'
                                                        data-state='closed'
                                                    >
                                                        <div
                                                            className='hover:bg-neutral-500 border relative cursor-pointer rounded-full h-10 w-10 gap-1 text-sm border-zinc-700 text-neutral-500 transition-all duration-200 ease-out flex shrink-0 grow-0 items-center justify-center will-change-transform group-active:scale-95  hover:border-zinc-800 bg-transparent'
                                                            data-state='closed'
                                                        >
                                                            <Paperclip className='text-zinc-400' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className='group'
                                                aria-haspopup='menu'
                                                aria-expanded='false'
                                            >
                                                <div className='hover:bg-neutral-500 border relative cursor-pointer rounded-full h-10 w-10 gap-1 text-sm text-neutral-500 transition-all duration-200 ease-out flex shrink-0 grow-0 items-center justify-center will-change-transform group-active:scale-95 border-zinc-700 hover:border-zinc-800'>
                                                    <Mic />
                                                </div>
                                            </div>

                                            <div className='relative flex-1 sm:flex-none'>
                                                <button
                                                    type='button'
                                                    className='relative text-sm font-semibold leading-[160%] text-white/50 flex items-center justify-center gap-1.5 border  border-neutral-500 hover:border-neutral-600 hover:bg-neutral-500 active:scale-95 transition rounded-full h-10 w-10 px-3 z-10 will-change-transform w-full sm:w-auto'
                                                >
                                                    <Plus />
                                                    <span className='block'>
                                                        Instrumental
                                                    </span>
                                                </button>
                                            </div>

                                            <div
                                                data-name='LyricsButton'
                                                className='relative flex-1 sm:flex-none'
                                            >
                                                <button
                                                    type='button'
                                                    className='border-neutral-500 hover:border-neutral-600 hover:bg-neutral-500 active:scale-95 relative text-sm font-semibold leading-[160%] text-white/50 flex items-center justify-center gap-1.5 border transition rounded-full h-10 w-10 px-3 z-10 will-change-transform w-full sm:w-auto'
                                                >
                                                    <Plus />
                                                    <span className='block'>
                                                        Lyrics
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className='flex w-full items-center justify-end'>
                                            <div className='h-10 w-10'>
                                                <button
                                                    type='button'
                                                    onClick={
                                                        user?.id
                                                            ? () =>
                                                                  handleSubmit()
                                                            : () =>
                                                                  setSignUpOpen(
                                                                      true,
                                                                  )
                                                    }
                                                    disabled={!isActive}
                                                    className={`cursor-pointer relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-200
                                                    ${isActive ? "bg-neutral-700 hover:scale-105 active:scale-95" : "bg-neutral-600 opacity-80 cursor-not-allowed"}
                                                `}
                                                >
                                                    <span
                                                        className={`absolute inset-0 rounded-full bg-white transition-all duration-200
                                                    ${isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                                                    `}
                                                    />

                                                    {/* Icon */}
                                                    <span className='relative z-10 flex items-center justify-center'>
                                                        {isActive ? (
                                                            <ArrowRight className='opacity-60 transition-opacity duration-300 font-semibold text-neutral-800' />
                                                        ) : (
                                                            <ArrowRight className='opacity-60 transition-opacity duration-300' />
                                                        )}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                <button
                                    type='button'
                                    className='transition absolute bottom-3 left-3 sm:bottom-3 sm:left-auto sm:right-[60px] flex h-10 items-center justify-center rounded-full'
                                    aria-label='Tools'
                                    aria-haspopup='menu'
                                    aria-expanded='false'
                                    data-state='closed'
                                >
                                    <div className='flex items-center gap-1.25 rounded-full px-4 hover:bg-neutral-400 h-full text-sm font-semibold leading-[160%] tracking-[1%] text-white'>
                                        <span>Tools</span>
                                        <ChevronDown />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                role='presentation'
                tabIndex={0}
                className='border-transparent invisible absolute inset-0'
                style={{ zIndex: 130 }}
            >
                <input
                    accept='audio/mpeg,.mp3,audio/wav,.wav,audio/x-wav,.wav'
                    tabIndex={-1}
                    type='file'
                    style={{
                        border: 0,
                        clip: "rect(0px, 0px, 0px, 0px)",
                        clipPath: "inset(50%)",
                        height: 1,
                        margin: "0px -1px -1px 0px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        width: 1,
                        whiteSpace: "nowrap",
                    }}
                />
            </div>
        </section>
    );
}
