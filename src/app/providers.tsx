"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { AppContextProvider } from "@/contexts";

export function Providers({
    children,
    session,
}: {
    children: React.ReactNode;
    session?: Session | null;
}) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false
            },
            mutations: {
                retry: false,

            }
        }
    });


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
