"use client";

import { usePathname } from "next/navigation";
import {MobileBottomNav, Sidebar, Header, SlideMenu, Scanner} from "@/components";
import styles from "./Layout.module.css";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isTermsPage = pathname.includes("/terms");
  const isAdminPage = pathname.includes("/admin");

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
            {children}
          </main>
          <MobileBottomNav />
        </div>
      </div>
    </>
  );
}
