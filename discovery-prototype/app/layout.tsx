import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

const ClientOnlyDesignSystem = dynamic(
  () =>
    import("@/components/Providers/ClientOnlyDesignSystem").then(
      (mod) => mod.ClientOnlyDesignSystem,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#F7F7F7",
          fontFamily:
            'SF Pro Text, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        Loading...
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Databricks Prototype",
  description: "Lightweight Databricks frontend for prototyping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientOnlyDesignSystem>{children}</ClientOnlyDesignSystem>
      </body>
    </html>
  );
}
