"use client";
import { useRef, useState } from "react";
import RegisterForm from "./Modal/Register";
import AnimatedModal from "./Modal/ModalMain";
import LoginForm from "./Modal/LoginScreen";
import { useAuthStore } from "@/store/auth.store";
import ProfilePopupScreen from "./ProfilePopUpScreen";
import { useToggleStore } from "@/store/profile.store";
import MusicLogo from "./molecules/MusicGptLogo";
import Link from "next/link";
import { GradientAvatar } from "./molecules/ProfileIcon";

const Header = () => {
    const { user, isAuthenticating } = useAuthStore((state) => state);
    const { isOpen, setOpen, isSignUpOpen, setSignUpOpen } = useToggleStore();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { isMenubarOpen } = useToggleStore();

    return (
        <header className=' fixed left-0 top-0 z-50 h-20 w-[calc(100vw-20px)] pointer-events-auto bg-transparent'>
            <div className='relative flex h-full w-full items-center justify-between responsive-side-padding px-6'>
                <div className=' flex-1 '>
                    {isMenubarOpen && (
                        <Link
                            className='cursor-pointer block transition md:hidden'
                            href='/'
                        >
                            <MusicLogo />
                        </Link>
                    )}
                </div>
                <div className='pointer-events-auto flex h-20 items-center justify-end gap-x-base'>
                    {isAuthenticating && (
                        <div className='relative h-10 w-10'>
                            <span className='absolute inset-0 rounded-full bg-gray-800 dark:bg-neutral-800 animate-pulse' />
                            <span className='absolute inset-1 rounded-full bg-gray-900 dark:bg-neutral-700 animate-pulse' />
                        </div>
                    )}
                    {!isAuthenticating && !user?.authenticated && (
                        <button
                            type='button'
                            onClick={() => setSignUpOpen(true)}
                            className='cursor-pointer text-sm font-semibold leading-tight text-white p-4 rounded-full border border-white/20 hover:bg-white/10 transition-all active:scale-95'
                        >
                            Sign in
                        </button>
                    )}

                    {!isAuthenticating && user?.authenticated && (
                        <button
                            ref={buttonRef}
                            type='button'
                            onClick={() => setOpen(true)}
                            className='relative outline-none h-10 w-10 cursor-pointer'
                        >
                            <span className=' h-full w-full rounded-full absolute inset-0 dark:bg-neutral-900' />

                            <span className='absolute inset-px rounded-full h-9.5 w-9.5 bg-gray-800 text-white flex items-center justify-center text-sm font-semibold'>
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                            <GradientAvatar
                                initial={
                                    user?.name?.charAt(0)?.toUpperCase() || "U"
                                }
                                showNotification={true}
                            />
                        </button>
                    )}
                </div>
            </div>
            <AnimatedModal
                isOpen={isSignUpOpen}
                className='max-w-lg'
                blurEffect='16px'
                onClose={() => setSignUpOpen(false)}
                showCloseButton={false}
            >
                <LoginForm
                    onClose={() => setSignUpOpen(false)}
                    onSwitch={() => console.log("on Switch")}
                />
            </AnimatedModal>

            {user && (
                <ProfilePopupScreen
                    isOpen={isOpen}
                    onClose={() => setOpen(false)}
                    anchorRef={buttonRef}
                    user={{
                        name: user.name,
                        username: user.name,
                        credits: 400,
                        maxCredits: 600,
                    }}
                />
            )}
        </header>
    );
};

export default Header;
