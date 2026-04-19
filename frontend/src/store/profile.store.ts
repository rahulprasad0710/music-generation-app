import { create } from "zustand";

type ToggleState = {
    isOpen: boolean;
    setToggle: () => void;
    setOpen: (value: boolean) => void;

    isSignUpOpen: boolean;
    setSignUpToggle: () => void;
    setSignUpOpen: (value: boolean) => void;

    isMenubarOpen: boolean;
    setMenubarToggle: () => void;
    setMenubarOpen: (value: boolean) => void;
};

export const useToggleStore = create<ToggleState>((set) => ({
    isOpen: false,
    isSignUpOpen: false,
    isMenubarOpen: false,

    setToggle: () =>
        set((state) => ({
            isOpen: !state.isOpen,
        })),

    setOpen: (value) =>
        set(() => ({
            isOpen: value,
        })),

    setSignUpToggle: () =>
        set((state) => ({
            isSignUpOpen: !state.isOpen,
        })),

    setSignUpOpen: (value) =>
        set(() => ({
            isSignUpOpen: value,
        })),

    setMenubarToggle: () =>
        set((state) => ({
            isMenubarOpen: !state.isOpen,
        })),

    setMenubarOpen: (value) =>
        set(() => ({
            isMenubarOpen: value,
        })),
}));
