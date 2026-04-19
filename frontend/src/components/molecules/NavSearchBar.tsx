import { Search } from "lucide-react";

export default function SearchTrigger() {
    return (
        <div
            className='flex w-screen cursor-pointer flex-row items-center gap-3 md:w-42'
            aria-haspopup='menu'
            aria-expanded='false'
        >
            <div className='group relative z-2 flex h-9.25 w-65 flex-row items-center gap-2 rounded-[30px] border border-alpha-light-8 px-4 text-sm hover:border-transparent hover:bg-white/8 md:w-42'>
                <Search className='size-5 flex-none text-neutral-5000' />

                <div className='w-16 appearance-none font-medium text-white'>
                    Search
                </div>

                <div className='pointer-events-none flex w-10 items-center justify-end text-tinier'>
                    <div className='text-tinier'>Ctrl+</div>
                    <span className='text-tinier'>K</span>
                </div>
            </div>
        </div>
    );
}
