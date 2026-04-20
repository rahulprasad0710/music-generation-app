import { useToggleStore } from "@/store/profile.store";
import { useState } from "react";

export default function ToggleMenuButton() {
    const { isMenubarOpen, setMenubarToggle } = useToggleStore();

    return (
        <button
            type='button'
            aria-label='Toggle Menu'
            onClick={() => setMenubarToggle()}
            className='box-border size-10 rounded-xl cursor-pointer  border border-neutral-500 bg-white/[0.08] hover:bg-white/[0.09] text-white backdrop-blur inline-flex items-center justify-center transition-colors duration-200 hover:bg-white/[0.16] relative'
        >
            {/* Menu Icon */}
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
                className={`pointer-events-none absolute size-5 text-white transition-opacity duration-200 ${
                    isMenubarOpen ? "opacity-0" : "opacity-100"
                }`}
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.667'
                    d='M7.5 2.5v15m-1-15h7c1.4 0 2.1 0 2.635.272a2.5 2.5 0 0 1 1.092 1.093C17.5 4.4 17.5 5.1 17.5 6.5v7c0 1.4 0 2.1-.273 2.635a2.5 2.5 0 0 1-1.092 1.092c-.535.273-1.235.273-2.635.273h-7c-1.4 0-2.1 0-2.635-.273a2.5 2.5 0 0 1-1.093-1.092C2.5 15.6 2.5 14.9 2.5 13.5v-7c0-1.4 0-2.1.272-2.635a2.5 2.5 0 0 1 1.093-1.093C4.4 2.5 5.1 2.5 6.5 2.5Z'
                />
            </svg>

            {/* Close Icon */}
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
                className={`pointer-events-none absolute size-5 text-white transition-opacity duration-200 ${
                    isMenubarOpen ? "opacity-100" : "opacity-0"
                }`}
            >
                <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.67'
                    d='M10 6.67 6.67 10m0 0L10 13.33M6.67 10h6.66M6.5 17.5h7c1.4 0 2.1 0 2.64-.27a2.5 2.5 0 0 0 1.09-1.1c.27-.53.27-1.23.27-2.63v-7c0-1.4 0-2.1-.27-2.63a2.5 2.5 0 0 0-1.1-1.1c-.53-.27-1.23-.27-2.63-.27h-7c-1.4 0-2.1 0-2.63.27a2.5 2.5 0 0 0-1.1 1.1C2.5 4.4 2.5 5.1 2.5 6.5v7c0 1.4 0 2.1.27 2.64.24.47.62.85 1.1 1.09.53.27 1.23.27 2.63.27Z'
                />
            </svg>
        </button>
    );
}
