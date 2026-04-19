// components/UserList.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore, UserResult } from "../store/user.store";

interface Props {
    q: string;
}

function UserCard({ user }: { user: UserResult }) {
    return (
        <div
            className='flex items-center justify-between px-4 py-3 rounded-lg
                    border border-gray-800 bg-gray-900 hover:border-gray-700
                    transition-colors'
        >
            <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-medium text-gray-100'>
                    {user.name}
                </span>
                <span className='text-xs text-gray-400'>{user.email}</span>
            </div>

            <div className='flex items-center gap-2'>
                {user.isPremium && (
                    <span
                        className='px-2 py-0.5 rounded-full text-xs
                           bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    >
                        Premium
                    </span>
                )}
                <span
                    className={`px-2 py-0.5 rounded-full text-xs border ${
                        user.isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }`}
                >
                    {user.isActive ? "Active" : "Inactive"}
                </span>
            </div>
        </div>
    );
}

function Skeleton() {
    return (
        <div className='flex flex-col gap-2'>
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className='h-16 rounded-lg border border-gray-800 bg-gray-900
                     animate-pulse'
                />
            ))}
        </div>
    );
}

export default function UserList({ q }: Props) {
    const { users, isLoading, hasMore, error, fetchUsers, reset } =
        useUserStore();

    const cursorStack = useRef<Array<string | null>>([null]);
    const [pageIndex, setPageIndex] = useState(0);

    // reset on query change
    useEffect(() => {
        cursorStack.current = [null];
        setPageIndex(0);
        reset();
    }, [q]);

    // fetch on pageIndex or query change
    useEffect(() => {
        const cursor = cursorStack.current[pageIndex];
        fetchUsers(q || null, cursor);
    }, [q, pageIndex]);

    const handleNext = async () => {
        // cursor not yet stored → fetch and push
        if (cursorStack.current.length <= pageIndex + 1) {
            const next = await fetchUsers(
                q || null,
                cursorStack.current[pageIndex],
            );
            if (next) cursorStack.current.push(next);
        }
        setPageIndex((p) => p + 1);
    };

    const handlePrev = () => setPageIndex((p) => Math.max(0, p - 1));

    const isFirstPage = pageIndex === 0;
    const isLastPage = !hasMore;

    return (
        <div className='flex flex-col gap-4'>
            {/* count */}
            {!isLoading && !error && (
                <p className='text-xs text-gray-500'>
                    {users.length === 0
                        ? "No users found"
                        : `Showing ${users.length} user${users.length > 1 ? "s" : ""}`}
                </p>
            )}

            {/* list */}
            {isLoading ? (
                <Skeleton />
            ) : error ? (
                <p className='text-sm text-red-400'>{error}</p>
            ) : (
                <div className='flex flex-col gap-2'>
                    {users.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            )}

            {/* pagination */}
            <div className='flex items-center justify-between mt-2'>
                <button
                    onClick={handlePrev}
                    disabled={isFirstPage || isLoading}
                    className='px-4 py-2 rounded-md text-sm font-medium
                     bg-gray-800 text-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-700 transition-colors'
                >
                    ← Previous
                </button>

                <span className='text-xs text-gray-500'>
                    Page {pageIndex + 1}
                </span>

                <button
                    onClick={handleNext}
                    disabled={isLastPage || isLoading}
                    className='px-4 py-2 rounded-md text-sm font-medium
                     bg-gray-800 text-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     hover:bg-gray-700 transition-colors'
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
