import { create } from "zustand";

interface LanguageState {
    lang: string;
    setLang: (lang: string) => void;
}

export const useLanguage = create<LanguageState>((set) => ({
    lang: localStorage.getItem("lang") || "id",
    setLang: (lang) => {
        localStorage.setItem("lang", lang);
        set({ lang });
    },
}));
