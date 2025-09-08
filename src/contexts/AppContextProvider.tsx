"use client";

import React, { ReactNode } from "react";
import { ScannerProvider } from "./_scanner.context";
import { SlideMenuProvider } from "./_menu.context";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ScannerProvider>
            <SlideMenuProvider>{children}</SlideMenuProvider>
        </ScannerProvider>
    );
};
