import { create } from "zustand";

type MobileMenuSheetStore = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export const useMobileMenuSheet = create<MobileMenuSheetStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));
