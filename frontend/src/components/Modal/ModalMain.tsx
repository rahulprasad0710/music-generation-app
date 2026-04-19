"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

type BlurEffect = "2px" | "4px" | "8px" | "16px" | "32px";

const blurClassMap: Record<BlurEffect, string> = {
    "2px": "backdrop-blur-[2px]",
    "4px": "backdrop-blur-[4px]",
    "8px": "backdrop-blur-[8px]",
    "16px": "backdrop-blur-[16px]",
    "32px": "backdrop-blur-[32px]",
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
    blurEffect?: BlurEffect;
}

export const AnimatedModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className = "",
    showCloseButton = true,
    blurEffect = "8px",
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${blurClassMap[blurEffect]}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 40 }}
                        transition={{ duration: 0.2 }}
                        className={`relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 shadow-xl ${className}`}
                    >
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className='absolute top-3 right-3 p-4 rounded-full cursor-pointer'
                            >
                                ✕
                            </button>
                        )}

                        <div className='p-6'>{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
};
export default AnimatedModal;
