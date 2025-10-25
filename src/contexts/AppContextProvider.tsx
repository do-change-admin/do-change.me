"use client";

import React, { ReactNode } from "react";
import { SlideMenuProvider } from "./_menu.context";

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SlideMenuProvider>
            {children}
        </SlideMenuProvider>
    );
};
