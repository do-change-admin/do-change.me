import { create } from 'zustand'

type LocalesStore = {
    locale: string;
    setLocale: (newLocale: string) => void;
}

export const useLocalesStore = create<LocalesStore>((set) => {
    return {
        locale: 'en',
        setLocale: (locale) => {
            set({ locale })
        }
    }
})