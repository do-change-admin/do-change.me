"use client";

import { useState } from "react";
import { Button, Group, Paper, Text } from "@mantine/core";

export const CookieBanner = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <Paper
            shadow="md"
            p="lg"
            radius="lg"
            style={{
                position: "fixed",
                backgroundColor: "rgba(59, 130, 246, 0.94)",
                color: "#fff",
                maxWidth: 300,
                bottom: 20,
                right: 20,
                zIndex: 1000,
            }}
        >
            <Text size="sm" mb="sm">
                Our website uses cookies to ensure proper functionality, personalize
                content, and improve your browsing experience. By continuing to use our
                site, you agree to the use of cookies. Learn more in our{" "}
                <a href="/privacy" style={{ textDecoration: "underline" }}>
                    Privacy Policy
                </a>{" "}
                .
            </Text>

            <Group justify="flex-end">
                <Button size="xs" onClick={() => setVisible(false)}>
                    Accept
                </Button>
            </Group>
        </Paper>
    );
}
