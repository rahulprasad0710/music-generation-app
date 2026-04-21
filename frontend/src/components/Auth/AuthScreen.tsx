"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import LoginForm from "../Modal/LoginScreen";
import RegisterForm from "../Modal/Register";

type Screen = "login" | "register";

const SLIDE_DISTANCE = 60;

const variants = {
    enterFromRight: {
        initial: { x: SLIDE_DISTANCE, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -SLIDE_DISTANCE, opacity: 0 },
    },
    enterFromLeft: {
        initial: { x: -SLIDE_DISTANCE, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: SLIDE_DISTANCE, opacity: 0 },
    },
};

const transition: Transition = {
    duration: 0.35,
    ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

interface AuthScreenProps {
    onClose?: () => void;
}

const AuthScreen = ({ onClose }: AuthScreenProps) => {
    const [screen, setScreen] = useState<Screen>("login");

    const [direction, setDirection] = useState<"left" | "right">("left");

    const switchTo = (next: Screen) => {
        setDirection(next === "register" ? "left" : "right");
        setScreen(next);
    };

    const chosen =
        direction === "left" ? variants.enterFromRight : variants.enterFromLeft;

    return (
        <div className='relative w-full overflow-hidden rounded-[28px]'>
            <AnimatePresence mode='wait' initial={false}>
                {screen === "login" ? (
                    <motion.div
                        key='login'
                        initial={chosen.initial}
                        animate={chosen.animate}
                        exit={chosen.exit}
                        transition={transition}
                    >
                        <LoginForm
                            onClose={onClose ?? (() => {})}
                            onSwitch={() => switchTo("register")}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key='register'
                        initial={chosen.initial}
                        animate={chosen.animate}
                        exit={chosen.exit}
                        transition={transition}
                    >
                        <RegisterForm onSwitch={() => switchTo("login")} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthScreen;
