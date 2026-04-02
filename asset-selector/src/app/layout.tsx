import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Selector Prototype",
  description: "Prototype for improved Databricks Asset Selector",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
