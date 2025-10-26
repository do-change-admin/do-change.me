import { create } from 'zustand'

type LocalesState = {
    locale: string;
    setLocale: (newLocale: string) => void;
}

export const useLocalesState = create<LocalesState>((set) => {
    return {
        locale: 'en',
        setLocale: (locale) => {
            set({ locale })
        }
    }
})