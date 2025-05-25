import { create } from "zustand";

type BlurStore = {
    isBlur: boolean;
    setIsBlur: (isOpen: boolean) => void;
};

export const useBlur = create<BlurStore>((set) => ({
    isBlur: false,
    setIsBlur: (isBlur) => set({ isBlur }),
}));
