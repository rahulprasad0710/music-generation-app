"use client";

import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/auth.store";
import RecentGenerations from "@/components/RecentGenerations";
import PromptScreen from "@/components/PromptScreen";

export default function HomePage() {
    const { accessToken } = useAuthStore();

    useSocket(accessToken);

    // Hydrate store

    return (
        <section className='relative z-0 ml-0 md:ml-50 px-5'>
            <PromptScreen />
            <RecentGenerations showMainTitle={true} />
        </section>
    );
}
