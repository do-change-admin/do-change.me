"use client";

import { usePathname } from "next/navigation";
import {MobileBottomNav, Sidebar, Header, SlideMenu, Scanner} from "@/components";
import styles from "./Layout.module.css";
import React from "react";
import {useLocale} from "@/contexts/_locale.context";
import {allMessages} from "../../../locale";
import {NextIntlClientProvider} from "next-intl";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isTermsPage = pathname.includes("/terms");
  const isAdminPage = pathname.includes("/admin");

  const { locale } = useLocale();
  const messages = allMessages[locale] || allMessages["en"];

  if (isAuthPage || isTermsPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
    <SlideMenu/>
    <Scanner/>
      <div className={styles.app}>
        <Sidebar />
        <div className={styles.mainContent}>
          <header className={styles.header}>
            <Header />
          </header>
          <main className={styles.main}>
            <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            </NextIntlClientProvider>
          </main>
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}
