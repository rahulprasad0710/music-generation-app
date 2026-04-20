import { Home, Star, Compass, User, Heart, Plus, Globe } from "lucide-react";
import Link from "next/link";
import MusicLogo from "./molecules/MusicGptLogo";
import SearchTrigger from "./molecules/NavSearchBar";
import { useToggleStore } from "@/store/profile.store";

interface NavLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

function NavLink({ href, icon, label, active = false }: NavLinkProps) {
    return (
        <a
            href={href}
            className={`group relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-white hover:bg-white/8 active:scale-95 ${
                active ? "bg-white/8" : ""
            }`}
        >
            {icon}
            <span>{label}</span>
        </a>
    );
}

interface LibraryButtonProps {
    icon: React.ReactNode;
    label: string;
    href: string;
}

function LibraryButton({ icon, label, href }: LibraryButtonProps) {
    return (
        <Link
            href={href}
            className='flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-95'
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

const footerLinks = [
    { label: "Pricing", href: "/pricing" },
    { label: "Affiliate", href: "/earn" },
    { label: "API", href: "/api" },
    { label: "About", href: "/about" },
    { label: "Terms", href: "/terms-of-service" },
    { label: "Privacy", href: "/privacy-policy" },
];

export default function DesktopNavigation() {
    const { isMenubarOpen, setMenubarToggle } = useToggleStore();

    console.log({
        isMenubarOpen,
    });
    return (
        <aside
            className={`
                    fixed top-0 left-0 z-50
                    h-full w-75 md:w-50

                    flex flex-col justify-between

                    bg-white/3 backdrop-blur-[30px] md:backdrop-blur-none shadow-lg
                    border-r border-white/10 md:sm:border-none

                    transition-transform duration-300 ease-in-out

                    ${isMenubarOpen ? "translate-x-0" : "-translate-x-full"}

                    md:translate-x-0 md:flex
                `}
            style={{ background: "rgba(255, 255, 255, 0.03)" }}
        >
            <div className='flex flex-col gap-8 p-4'>
                {/* Logo */}
                <MusicLogo />

                <SearchTrigger />

                {/* Primary Nav */}
                <div className='flex flex-col gap-1 items-start'>
                    <NavLink
                        href='/'
                        icon={<Home className='size-5' />}
                        label='Home'
                    />
                    <NavLink
                        href='/create'
                        icon={<Star className='size-5' />}
                        label='Create'
                        active
                    />
                    <NavLink
                        href='/explore'
                        icon={<Compass className='size-5' />}
                        label='Explore'
                    />
                </div>
            </div>

            <nav className='flex h-[calc(100vh-200px)] flex-col gap-8 overflow-y-auto overflow-x-visible border-t border-transparent p-4 transition-colors duration-200 overscroll-contain'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='px-4 text-sm font-medium leading-9 text-neutral-400'>
                        Library
                    </div>
                    <LibraryButton
                        href='/users'
                        icon={<User className='size-5 text-neutral-400' />}
                        label='Users'
                    />
                    <LibraryButton
                        href='/audios'
                        icon={<Heart className='size-5 text-neutral-400' />}
                        label='Audio'
                    />
                    <LibraryButton
                        href='/audio?category=playlist'
                        icon={<Plus className='size-5 text-neutral-400' />}
                        label='New Playlist'
                    />
                </div>
            </nav>

            <div className='flex flex-col gap-5  py-4 sm:p-4'>
                <div className=' mb-4 rounded-2xl overflow-hidden relative'>
                    <div
                        className='p-4 relative'
                        style={{
                            background:
                                "linear-gradient(135deg, #4a3060 0%, #2d1f4a 60%, #1e1535 100%)",
                        }}
                    >
                        <div
                            className='absolute inset-0 opacity-30'
                            style={{
                                background:
                                    "radial-gradient(ellipse at top left, rgba(160,100,255,0.3) 0%, transparent 70%)",
                            }}
                        />

                        <div className='relative z-10'>
                            <p className='text-white font-bold text-sm leading-snug'>
                                Model v6 Pro is here!
                            </p>
                            <p className='text-white/60 text-sm mt-1 leading-snug'>
                                Pushing boundaries to the world&apos;s best AI
                                music model
                            </p>
                        </div>
                    </div>
                </div>
                {/* Language Switcher */}
                <button className='flex flex-row items-center gap-1.5 self-start px-3 py-2 bg-white/10 hover:bg-white/5 rounded-full text-neutral-300'>
                    <Globe className='size-4' />
                    <span className='text-xs font-medium leading-4 tracking-wide'>
                        Language
                    </span>
                </button>

                {/* Footer Links */}
                <div className='flex flex-row flex-wrap items-center text-sm text-white/50 gap-x-6 gap-y-5 sm:gap-x-3 sm:gap-y-1'>
                    {footerLinks.map((link) => (
                        <a key={link.href} className='text-xs' href={link.href}>
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    );
}
