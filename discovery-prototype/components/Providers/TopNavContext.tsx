"use client";

import React, { createContext, useContext, useState } from "react";

interface TopNavContextType {
  topNavCollapsed: boolean;
  toggleTopNav: () => void;
}

const TopNavContext = createContext<TopNavContextType>({
  topNavCollapsed: false,
  toggleTopNav: () => {},
});

export function TopNavProvider({ children }: { children: React.ReactNode }) {
  const [topNavCollapsed, setTopNavCollapsed] = useState(false);
  return (
    <TopNavContext.Provider
      value={{
        topNavCollapsed,
        toggleTopNav: () => setTopNavCollapsed((p) => !p),
      }}
    >
      {children}
    </TopNavContext.Provider>
  );
}

export function useTopNav() {
  return useContext(TopNavContext);
}
