// components/AudioList.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioStore } from "../store/audio.store";
import { useAllAudioStore } from "@/store/allAudio.store";
import { GenerationItem } from "./RecentGenerations";
import { div } from "framer-motion/client";

interface Props {
    q?: string; // search query from parent / search input
}

export default function AudioList({ q = "" }: Props) {
    const { allAudiosData, isLoading, hasMore, fetchAllAudios, reset } =
        useAllAudioStore();

    // Stack of cursors: index 0 = first page (null), index N = nth page cursor
    const cursorStack = useRef<Array<string | null>>([null]);
    const [pageIndex, setPageIndex] = useState(0);

    // Fetch whenever query or pageIndex changes
    useEffect(() => {
        const cursor = cursorStack.current[pageIndex];
        fetchAllAudios(q || null, cursor);
    }, [q, pageIndex]);

    // Reset when query changes
    useEffect(() => {
        cursorStack.current = [null];
        setPageIndex(0);
        reset();
    }, [q]);

    const handleNext = async () => {
        // Only fetch next if we don't already have the cursor stored
        if (cursorStack.current.length <= pageIndex + 1) {
            const nextCursor = await fetchAllAudios(
                q || null,
                cursorStack.current[pageIndex],
            );
            if (nextCursor) {
                cursorStack.current.push(nextCursor);
            }
        }
        setPageIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        setPageIndex((prev) => Math.max(0, prev - 1));
    };

    const isFirstPage = pageIndex === 0;
    const isLastPage = !hasMore;

    return (
        <div className='flex flex-col gap-4'>
            {/* Results */}
            <div className='flex flex-col gap-2'>
                {isLoading ? (
                    <p className='text-sm text-gray-400'>Loading...</p>
                ) : allAudiosData?.length === 0 ? (
                    <p className='text-sm text-gray-400'>No results found.</p>
                ) : (
                    allAudiosData.map((audio) => (
                        // <GenerationItem key={audio.id} generation={[]} />
                        <div key={audio.id}>List</div>
                    ))
                )}
            </div>

            {/* Pagination controls */}
            <div className='flex items-center gap-3 mt-4'>
                <button
                    onClick={handlePrev}
                    disabled={isFirstPage || isLoading}
                    className='px-4 py-2 rounded-md text-sm font-medium bg-gray-800 text-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-700 transition-colors'
                >
                    ← Previous
                </button>

                <span className='text-sm text-gray-400'>
                    Page {pageIndex + 1}
                </span>

                <button
                    onClick={handleNext}
                    disabled={isLastPage || isLoading}
                    className='px-4 py-2 rounded-md text-sm font-medium bg-gray-800 text-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-700 transition-colors'
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
