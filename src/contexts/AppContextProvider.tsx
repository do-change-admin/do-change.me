"use client";

import React, { ReactNode } from "react";
import { ScannerProvider } from "./_scanner.context";
import { SlideMenuProvider } from "./_menu.context";
import {LocaleProvider} from "@/contexts/_locale.context";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ScannerProvider>
            <SlideMenuProvider>
                <LocaleProvider>
                    {children}
                </LocaleProvider>
            </SlideMenuProvider>
        </ScannerProvider>
    );
};
