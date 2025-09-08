"use client";

import styles from "./Header.module.css";
import {LanguageSelector} from "@/components";
import {usePathname} from "next/navigation";
import cn from "classnames";

export const Header = ()=> {
    const path = usePathname();
    const isAuction = path.includes("auction") || path.includes("auth") || path.includes("report");
    return (
        <header className={cn(styles.header, {[styles.isAuction]: isAuction})}>
            <h1 className={styles.title}>do-change</h1>
            <div className={styles.right}>
                <LanguageSelector/>
            </div>
        </header>
    );
}
