"use client";

import { useState } from "react";
import AudioList from "../../components/AudioList";
import { Search } from "lucide-react";

export default function AudioPage() {
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(query);
    };

    return (
        <div className='max-w-2xl mx-auto p-6 flex flex-col gap-6 '>
            <div
                className='relative w-full cursor-pointer mb-10 '
                aria-haspopup='menu'
                aria-expanded='false'
            >
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search audio...'
                    className='w-full  z-2 flex h-10  bg-zinc-900 flex-row items-center gap-2 rounded-[30px] border border-alpha-light-8 px-6 text-sm hover:border-transparent hover:bg-white/8'
                />
                <div
                    onClick={handleSearch}
                    className='absolute top-2.25 right-5 cursor-pointer'
                >
                    <Search className='size-5 flex-none text-neutral-5000' />
                </div>
            </div>

            <AudioList q={search} />
        </div>
    );
}
