import React, {Suspense} from 'react';
import styles from './layout.module.css';
import {MobileBottomNav, Scanner, Sidebar, Header, SlideMenu} from "@/components";
import {Providers} from "./providers";
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {Inter} from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
    variable: "--font-inter",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "do-change",
    description: "",
};


export default function SpaceLayout({children}: { children: React.ReactNode }) {
    return (
        <html>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
        >
        <Suspense>
            <Providers>
                <SlideMenu />
                <Scanner/>
                <div className={styles.app}>
                    <Sidebar />
                    <div className={styles.mainContent}>
                        <header className={styles.header}>
                            <Header />
                        </header>
                        <main className={styles.main}>
                            {children}
                        </main>
                        <MobileBottomNav/>
                    </div>
                </div>
            </Providers>
        </Suspense>
        </body>
        </html>
    );
}
