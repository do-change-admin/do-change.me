import { create } from 'zustand'

type LocaleStore = {
    locale: string;
    setLocale: (newLocale: string) => void;
}

export const useLocaleStore = create<LocaleStore>((set) => {
    return {
        locale: 'en',
        setLocale: (locale) => {
            set({ locale })
        }
    }
})