"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { AppContextProvider } from "@/contexts";

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
                    {children}
                    </MantineProvider>
                </AppContextProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}
