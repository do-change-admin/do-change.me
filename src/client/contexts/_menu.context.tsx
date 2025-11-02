"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type SlideMenuContextType = {
    isOpen: boolean;
    content: ReactNode;
    openMenu: (content: ReactNode) => void;
    closeMenu: () => void;
    toggleMenu: () => void;
};

const SlideMenuContext = createContext<SlideMenuContextType | null>(null);

export const SlideMenuProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);

    const openMenu = (newContent: ReactNode) => {
        setContent(newContent);
        setIsOpen(true);
    };

    const closeMenu = () => setIsOpen(false);
    const toggleMenu = () => setIsOpen(prev => !prev);

    return (
        <SlideMenuContext.Provider value={{ isOpen, content, openMenu, closeMenu, toggleMenu }}>
            {children}
        </SlideMenuContext.Provider>
    );
};

export const useSlideMenu = () => {
    const ctx = useContext(SlideMenuContext);
    if (!ctx) throw new Error("useSlideMenu must be used inside SlideMenuProvider");
    return ctx;
};
