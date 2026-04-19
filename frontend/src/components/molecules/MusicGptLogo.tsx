"use client";

import Image from "next/image";
import musicLogo from "@/assets/musicgpt32.webp";
import ToggleMenuButton from "./ToggleSidebarBtn";

export default function MusicLogo() {
    return (
        <div className='flex items-center gap-2 cursor-pointer'>
            <div className='mr-2 block md:hidden'>
                <ToggleMenuButton />
            </div>

            <div className='flex items-center gap-2'>
                <div className='relative h-8 w-8'>
                    <Image
                        src={musicLogo}
                        alt='MusicGPT logo'
                        width={32}
                        height={32}
                        priority
                    />
                </div>

                <span className='ml-2 text-lg font-medium text-white'>
                    MusicGPT
                </span>
            </div>
        </div>
    );
}
