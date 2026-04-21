"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/Layout";
import { DesignSystemProvider } from "@/components/Providers/DesignSystemProvider";

const themeOverrides = {
  colors: {
    backgroundSecondary: "#F7F7F7",
    textPrimary: "#161616",
    textSecondary: "#6F6F6F",
    border: "#EBEBEB",
  },
};

export function ClientOnlyDesignSystem({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#F7F7F7",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <DesignSystemProvider themeOverrides={themeOverrides}>
      <MainLayout>{children}</MainLayout>
    </DesignSystemProvider>
  );
}
