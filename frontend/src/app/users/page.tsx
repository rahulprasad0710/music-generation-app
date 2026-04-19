"use client";

import { useState } from "react";
import UserList from "../../components/UserList";

export default function UsersPage() {
    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(input);
    };

    const handleClear = () => {
        setInput("");
        setQuery("");
    };

    return (
        <div className='max-w-3xl mx-auto p-6 flex flex-col gap-6'>
            <h1 className='text-xl font-medium text-gray-100'>Users</h1>

            <form onSubmit={handleSearch} className='flex gap-2'>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Search by name or email...'
                    className='flex-1 px-3 py-2 rounded-md border border-gray-700
                     bg-gray-900 text-white text-sm outline-none
                     focus:border-indigo-500 transition-colors'
                />
                {input && (
                    <button
                        type='button'
                        onClick={handleClear}
                        className='px-3 py-2 rounded-md text-sm text-gray-400
                       hover:text-white transition-colors'
                    >
                        Clear
                    </button>
                )}
                <button
                    type='submit'
                    className='px-4 py-2 rounded-md bg-indigo-600 text-white
                     text-sm hover:bg-indigo-500 transition-colors'
                >
                    Search
                </button>
            </form>

            <UserList q={query} />
        </div>
    );
}
