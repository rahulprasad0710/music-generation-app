"use client";

import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth.store";
import RecentGenerations from "@/components/RecentGenerations";
import PromptScreen from "@/components/PromptScreen";
import AudioGeneration from "@/components/AudioGeneration";

export default function HomePage() {
    const { accessToken } = useAuthStore();
    useSocket(accessToken);

    // Hydrate store

    return (
        <section className='relative z-0 ml-0 md:ml-50 px-5'>
            <PromptScreen />

            <div className='w-full max-w-200 mx-auto mb-32'>
                <h2 className='text-base font-semibold text-white tracking-wide mb-4'>
                    Recent generations
                </h2>
                <AudioGeneration />
                <RecentGenerations showMainTitle={false} />
            </div>
        </section>
    );
}
