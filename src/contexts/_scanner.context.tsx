"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ScannerContextType = {
    open: boolean;
    result: string | null;
    start: () => void;
    stop: () => void;
    setResult: (val: string | null) => void;
};

const ScannerContext = createContext<ScannerContextType | null>(null);

export const ScannerProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const start = () => {
        setResult(null);
        setOpen(true);
    };
    const stop = () => setOpen(false);

    return (
        <ScannerContext.Provider value={{ open, result, start, stop, setResult }}>
            {children}
        </ScannerContext.Provider>
    );
};

export const useScanner = () => {
    const ctx = useContext(ScannerContext);
    if (!ctx) throw new Error("useScanner must be inside ScannerProvider");
    return ctx;
};
