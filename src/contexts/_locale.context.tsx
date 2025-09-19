"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface LocaleContextProps {
    locale: string;
    setLocale: (locale: string) => void;
}

type LangOption = {
    code: string;
    countryCode: string;
    name: string;
};

const LANGUAGES: LangOption[] = [
    { code: 'en', countryCode: 'US', name: 'English' },
    { code: 'es', countryCode: 'ES', name: 'Español' },
    { code: 'hy', countryCode: 'AM', name: 'Հայերեն' },
    { code: 'ru', countryCode: 'RU', name: 'Русский' },
];

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocaleState] = useState("en");

    useEffect(() => {
        const stored = localStorage.getItem("lang") || "en";
        setLocaleState(stored);
    }, []);

    const setLocale = (newLocale: string) => {
        localStorage.setItem("lang", newLocale);
        setLocaleState(newLocale);
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = () => {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
    return ctx;
};
