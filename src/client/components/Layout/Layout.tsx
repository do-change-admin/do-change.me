"use client";

import { usePathname } from "next/navigation";
import { MobileBottomNav, Sidebar, SlideMenu, Scanner, AuctionAccess, Chat, Header } from "@/client/components";
import styles from "./Layout.module.css";
import React from "react";
import { allMessages } from "../../../../locale";
import { NextIntlClientProvider } from "next-intl";
import { ActionIcon, Image } from "@mantine/core";
import { useSlideMenu } from "@/client/contexts";
import { useLocalesStore } from "@/client/stores/locales.store";

export function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");
    const isTermsPage = pathname.includes("/terms");
    const isAdminPage = pathname.includes("/admin");
    const isReportPage = pathname.includes("/report");
    const isHome = pathname.includes("/home");
    const isLegal = pathname.includes("/legal");
    const { openMenu, isOpen, closeMenu } = useSlideMenu();

    const locale = useLocalesStore(x => x.locale);
    const messages = allMessages[locale] || allMessages["en"];

    if (isAuthPage || isTermsPage || isAdminPage || isHome || isLegal) {
        return <>{children}</>;
    }

    const handleOpenAuctionAccess = () => {
        if (isOpen) {
            closeMenu()
            return
        }
        openMenu(<AuctionAccess />);
    };


    return (
        <>
            <SlideMenu />
            <Scanner />
            <div className={styles.app}>
                <Sidebar />
                <div className={styles.mainContent}>
                    <div className={styles.chat}>
                        <Chat />
                    </div>
                    <ActionIcon
                        className={styles.auctionButton}
                        pos="fixed"
                        onClick={handleOpenAuctionAccess}
                        p="xl"
                        radius="lg"
                        bg="white"
                    >
                        <Image src="/auctionAccessIcon.png" w={50} h={50} />
                    </ActionIcon>
                    {!isReportPage && (
                        <header className={styles.header}>
                            <Header />
                        </header>
                    )}
                    <div className={styles.main}>
                        <NextIntlClientProvider locale={locale} messages={messages}>
                            {children}
                        </NextIntlClientProvider>
                    </div>
                    <MobileBottomNav />
                </div>
            </div>
        </>
    );
}
