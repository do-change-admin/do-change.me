"use client";

import styles from "./Header.module.css";
import {LanguageSelector} from "@/components";

export const Header = ()=> {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>do-change</h1>
            <div className={styles.right}>
                <LanguageSelector/>
            </div>
        </header>
    );
}
