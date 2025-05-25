import { create } from "zustand";

type ModalStore = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export const useModal = create<ModalStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}));
