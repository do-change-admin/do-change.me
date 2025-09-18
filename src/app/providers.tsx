"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { AppContextProvider } from "@/contexts";
import { NextIntlClientProvider } from "next-intl";
import { allMessages } from "../../locale";
import {useLocale} from "@/contexts/_locale.context";

export function Providers({
                              children,
                              session,
                          }: {
    children: React.ReactNode;
    session?: Session | null;
}) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <AppContextProvider>
                    <MantineProvider>
                        <Notifications position="top-right" zIndex={1000} />
                            {children}
                    </MantineProvider>
                </AppContextProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}
