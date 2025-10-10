import React, {Suspense} from 'react';
import {Providers} from "@/app/providers";
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {Inter} from "next/font/google";
import "./globals.css";

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
    title: "The Bid Space",
    description: "",
};


export default function SpaceLayout({children}: { children: React.ReactNode }) {
    return (<html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
        >
        <Suspense>
            <Providers>
                <div>{children}</div>
            </Providers>
        </Suspense>
        </body>
        </html>
    );
}
