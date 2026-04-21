"use client";
import { motion } from "framer-motion";

interface AvatarProps {
    initial?: string;
    notificationCount?: number;
    size?: number;
    animate?: boolean;
    showNotification: boolean;
}

export function GradientAvatar({
    initial,
    notificationCount = 2,
    size = 48,
    animate = true,
    showNotification,
}: AvatarProps) {
    const borderWidth = 2.5;
    const innerSize = size - borderWidth * 2;
    // #4400ff, #0044ff,
    return (
        <div className='relative' style={{ width: size, height: size }}>
            {/* Rotating conic gradient ring */}
            <motion.div
                className='absolute inset-0 rounded-full'
                style={{
                    background:
                        "conic-gradient(from 0deg, #ff6b00, #ff0080, #9400ff,  #ff6b00)",
                    padding: borderWidth,
                }}
                animate={animate ? { rotate: 360 } : undefined}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Blurred glow */}
            <motion.div
                className='absolute -inset-[2px] rounded-full opacity-40'
                style={{
                    background:
                        "conic-gradient(from 0deg, #ff6b00, #ff0080, #9400ff,  #ff6b00)",
                    filter: "blur(6px)",
                }}
                animate={animate ? { rotate: 360 } : undefined}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Dark background cutout to show only the ring */}
            <div
                className='absolute rounded-full bg-[#0e0e0e]'
                style={{
                    inset: borderWidth,
                }}
            />

            {/* Avatar inner circle */}
            <div
                className='absolute rounded-full bg-transparent flex items-center justify-center'
                style={{ inset: borderWidth }}
            >
                <span
                    className='text-white font-normal select-none'
                    style={{ fontSize: innerSize * 0.38 }}
                >
                    {initial}
                </span>
            </div>

            {/* Notification badge */}
            {showNotification && notificationCount > 0 && (
                <div
                    className='absolute flex items-center text-black justify-center rounded-full bg-[#00C896] border-0 border-[#0e0e0e]   font-semibold'
                    style={{
                        width: size * 0.36,
                        height: size * 0.36,
                        fontSize: size * 0.2,
                        top: -size * 0.04,
                        right: -size * 0.04,
                    }}
                >
                    {notificationCount}
                </div>
            )}
        </div>
    );
}
