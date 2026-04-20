import Image from "next/image";
import musicLogo from "@/assets/musicgpt32.webp";
import ToggleMenuButton from "./ToggleSidebarBtn";
import Link from "next/link";

export default function MusicLogo() {
    return (
        <div className='flex items-center gap-2'>
            {/* Toggle button - NOT inside Link */}
            <div className='mr-2 block md:hidden cursor-pointer'>
                <ToggleMenuButton />
            </div>

            <Link
                href='/'
                className='flex  items-center gap-2 cursor-pointer transition duration-100 active:scale-95'
            >
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
            </Link>
        </div>
    );
}
