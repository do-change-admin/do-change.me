"use client";

import React, {useEffect, useState} from "react";
import { Button, Group, Paper, Text } from "@mantine/core";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
    const accepted = getCookie("cookieAccepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('cookieAccepted', 'true', { maxAge: 60 * 60 * 24 * 365});
    setVisible(false);
  };

  if (!checked || !visible) return null;

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
        <Link href="/terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          Privacy Policy
        </Link>{" "}
        .
      </Text>

      <Group justify="flex-end">
        <Button size="xs" onClick={handleAccept}>
          Accept
        </Button>
      </Group>
    </Paper>
  );
}
