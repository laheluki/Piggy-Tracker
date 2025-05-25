import { create } from "zustand";

type ModalAuthStore = {
    isOpen: boolean;
    view: "sign-in" | "sign-up";
    setModalOpen: (isOpen: boolean) => void;
    setView: (view: "sign-in" | "sign-up") => void;
};

export const useModalAuth = create<ModalAuthStore>((set) => ({
    isOpen: false,
    view: "sign-in",
    setModalOpen: (isOpen) => set({ isOpen }),
    setView: (view) => set({ view }),
}));
