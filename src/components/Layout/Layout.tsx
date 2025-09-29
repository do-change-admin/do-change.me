"use client";

import {usePathname} from "next/navigation";
import {MobileBottomNav, Sidebar, Header, SlideMenu, Scanner, AuctionAccess, Chat} from "@/components";
import styles from "./Layout.module.css";
import React from "react";
import {useLocale} from "@/contexts/_locale.context";
import {allMessages} from "../../../locale";
import {NextIntlClientProvider} from "next-intl";
import {ActionIcon, Image} from "@mantine/core";
import {useSlideMenu} from "@/contexts";
import {useProfile} from "@/hooks";

export function Layout({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");
    const isTermsPage = pathname.includes("/terms");
    const isAdminPage = pathname.includes("/admin");
  const { openMenu, isOpen, closeMenu } = useSlideMenu();
  const {data} = useProfile()

    const {locale} = useLocale();
    const messages = allMessages[locale] || allMessages["en"];

    if (isAuthPage || isTermsPage || isAdminPage) {
        return <>{children}</>;
    }

  const handleOpenAuctionAccess = () => {
    if (isOpen) {
      closeMenu()
      return
    }
    openMenu(<AuctionAccess/>);
  };


  return (
        <>
            <SlideMenu/>
            <Scanner/>
            <Chat />
            <div className={styles.app}>
                <Sidebar/>
                <div className={styles.mainContent}>
                  <ActionIcon
                      className={styles.auctionButton}
                      pos="fixed"
                      onClick={handleOpenAuctionAccess}
                      p="xl"
                      radius="lg"
                      bg="white"
                  >
                    <Image src="/auctionAccessIcon.png" w={50} h={50}/>
                  </ActionIcon>
                    <header className={styles.header}>
                        <Header/>
                    </header>
                    <main className={styles.main}>
                        <NextIntlClientProvider locale={locale} messages={messages}>
                            {children}
                        </NextIntlClientProvider>
                    </main>
                    <MobileBottomNav/>
                </div>
            </div>
        </>
    );
}
