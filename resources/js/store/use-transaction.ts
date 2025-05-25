import { create } from "zustand";

interface TransactionStore {
    shouldRefetch: boolean;
    triggerRefetch: () => void;
    resetRefetch: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
    shouldRefetch: false,
    triggerRefetch: () => set({ shouldRefetch: true }),
    resetRefetch: () => set({ shouldRefetch: false }),
}));
