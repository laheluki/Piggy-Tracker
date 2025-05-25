import { create } from "zustand";

export interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: async (user) => {
        set({ user });
    },
}));
