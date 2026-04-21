"use client";

import { DesignSystemProvider as DuboisProvider } from "@databricks/design-system";

export function DesignSystemProvider({
  children,
  themeOverrides,
}: {
  children: React.ReactNode;
  themeOverrides?: Record<string, any>;
}) {
  return (
    <DuboisProvider
      getPopupContainer={() => document.body}
      flags={{}}
      {...(themeOverrides ? { themeOverrides } : {})}
    >
      {children}
    </DuboisProvider>
  );
}
