"use client";

import { useState } from "react";
import AudioList from "../../components/AudioList";
import { Search, X } from "lucide-react";

export default function AudioPage() {
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(query);
    };

    const handleClear = () => {
        setQuery("");
    };

    return (
        <div className='max-w-2xl mx-auto p-6 flex flex-col gap-6 '>
            <div
                className='relative w-full cursor-pointer mb-10 '
                aria-haspopup='menu'
                aria-expanded='false'
            >
                <form onSubmit={handleSearch} className='relative flex gap-2'>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Search audios...'
                        className='flex-1 px-3 py-2 pl-12 rounded-xl border border-gray-700 h-12
                     bg-gray-900 text-white text-sm outline-none
                     focus:border-neutral-500 transition-colors'
                    />
                    {query && (
                        <button
                            type='button'
                            onClick={handleClear}
                            className='absolute cursor-pointer p-1  text-sm text-gray-400 top-2 left-1 rounded-full bg-neutral-600/5
                       hover:text-white transition-colors'
                        >
                            <X className='h-5 w-5' />
                        </button>
                    )}
                    <button
                        type='submit'
                        className='cursor-pointer px-4 py-2  bg-neutral-700 text-white rounded-2xl
                     text-sm hover:bg-neutral-800 transition-colors'
                    >
                        Search
                    </button>
                </form>
            </div>

            <AudioList q={search} />
        </div>
    );
}
