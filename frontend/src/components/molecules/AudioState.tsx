import { PromptRecord } from "@/store/music.store";

export function PulsatingBars({ progress }: { progress: number }) {
    const randomNumber = Math.random() * 24 + 8;
    const randomNumber2 = 0.8 + Math.random() * 0.4;

    {
        return (
            <div className='flex flex-col gap-3 p-4'>
                <div className='flex items-center gap-3'>
                    <div className='flex items-end gap-[3px] h-8'>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className='w-[3px] bg-violet-500 rounded-full'
                                animate={{
                                    height: ["6px", `${randomNumber}px`, "6px"],
                                }}
                                transition={{
                                    duration: randomNumber2,
                                    repeat: Infinity,
                                    delay: i * 0.08,
                                }}
                            />
                        ))}
                    </div>
                    <span className='text-xs text-zinc-400'>
                        Generating… {progress}%
                    </span>
                </div>
                <div className='w-full bg-zinc-800 rounded-full h-1'>
                    <motion.div
                        className='h-1 bg-violet-500 rounded-full'
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        );
    }
}

export function AudioTracks({ audios }: { audios: PromptRecord["audios"] }) {
    return (
        <div className='grid grid-cols-2 gap-3 p-4'>
            {audios.map((audio, i) => (
                <motion.div
                    key={audio.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className='
            bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3
            hover:border-violet-500/50 transition-colors group cursor-pointer
          '
                >
                    {/* Waveform visual */}
                    <div className='flex items-end gap-[2px] h-6 mb-2'>
                        {Array.from({ length: 20 }).map((_, j) => (
                            <div
                                key={j}
                                className='w-[2px] bg-violet-400/60 rounded-full group-hover:bg-violet-400 transition-colors'
                                style={{
                                    height: `${Math.random() * 18 + 4}px`,
                                }}
                            />
                        ))}
                    </div>
                    <p className='text-xs text-white truncate font-medium'>
                        {audio.title}
                    </p>
                    {audio.durationMs && (
                        <p className='text-[10px] text-zinc-500 mt-0.5'>
                            {Math.floor(audio.durationMs / 1000)}s
                        </p>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

export function FailedState({ error }: { error: string }) {
    return (
        <div className='flex items-center gap-3 p-4 text-red-400'>
            <span className='text-lg'>⚠</span>
            <div>
                <p className='text-sm font-medium'>Generation failed</p>
                <p className='text-xs text-red-400/70 mt-0.5'>{error}</p>
            </div>
        </div>
    );
}
