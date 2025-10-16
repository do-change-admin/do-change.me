"use client";

import { Alert, Group, Text, ThemeIcon } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";

interface WarningProps {
    title?: React.ReactNode;
    message: React.ReactNode;
    iconSize?: number;
    withBorder?: boolean;
}

export function Warning({
    title = "Warning",
    message,
    iconSize = 22,
    withBorder = true,
}: WarningProps) {
    return (
        <Alert
            color="yellow"
            radius="md"
            variant="light"
            styles={{
                root: {
                    border: withBorder
                        ? "1px solid var(--mantine-color-yellow-light)"
                        : "none",
                },
            }}
            icon={
                <ThemeIcon
                    color="yellow"
                    variant="light"
                    size={iconSize}
                    radius="xl"
                >
                    <FaExclamationTriangle size={iconSize} />
                </ThemeIcon>
            }
        >
            <Group align="flex-start" gap="xs">
                <div>
                    {title && (
                        <Text fw={600} size="sm" mb={2}>
                            {title}
                        </Text>
                    )}
                    <Text size="sm" c="dimmed">
                        {message}
                    </Text>
                </div>
            </Group>
        </Alert>
    );
}
