import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FirstLoginState {
    hasLoggedInBefore: boolean;
    isFirstTimeLoggedIn: boolean;
    markAsReturningUser: () => void;
}

export const useFirstLoginStore = create<FirstLoginState>()(
    persist(
        (set, get) => ({
            hasLoggedInBefore: false,
            isFirstTimeLoggedIn: false,
            markAsReturningUser: () => {
                const isFirstTime = !get().hasLoggedInBefore;
                set({
                    isFirstTimeLoggedIn: isFirstTime,
                    hasLoggedInBefore: true,
                });
            },
        }),
        { name: "first-login" },
    ),
);
