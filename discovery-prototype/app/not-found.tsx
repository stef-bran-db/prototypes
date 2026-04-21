"use client";

import { usePathname } from "next/navigation";
import { useDesignSystemTheme } from "@databricks/design-system";

function formatRouteName(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    )
    .join(" / ");
}

export default function NotFound() {
  const pathname = usePathname();
  const { theme } = useDesignSystemTheme();
  const routeName = formatRouteName(pathname);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: "100%",
        padding: "0 24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1
          style={{
            fontSize: theme.typography.fontSizeLg,
            fontWeight: theme.typography.typographyBoldFontWeight,
            color: theme.colors.textPrimary,
            marginBottom: 8,
          }}
        >
          404 — Page Not Found
        </h1>
        <p
          style={{
            fontSize: theme.typography.fontSizeBase,
            lineHeight: theme.typography.lineHeightBase,
            color: theme.colors.textSecondary,
          }}
        >
          This route hasn't been added yet.
        </p>
        <p
          style={{
            fontSize: theme.typography.fontSizeBase,
            lineHeight: theme.typography.lineHeightBase,
            color: theme.colors.textSecondary,
            marginTop: 4,
          }}
        >
          Prompt Claude or Cursor to{" "}
          <code
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "monospace",
              fontSize: theme.typography.fontSizeSm,
              color: theme.colors.textPrimary,
            }}
          >
            add a new page to <strong>{routeName}</strong>
          </code>
        </p>
      </div>
    </div>
  );
}
