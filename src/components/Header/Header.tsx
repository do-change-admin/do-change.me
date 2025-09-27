"use client";

import styles from "./Header.module.css";
import {LanguageSelector} from "@/components";
import { usePathname} from "next/navigation";
import React from "react";

export const Header = ()=> {
    const pathname = usePathname();
    const showLanguage = pathname.includes("dealer");

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>do-change</h1>
            <div className={styles.right}>
                {showLanguage && (
                    <LanguageSelector/>
                )}
            </div>
        </header>
    );
}
