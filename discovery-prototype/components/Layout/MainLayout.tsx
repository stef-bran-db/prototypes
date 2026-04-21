'use client'

import { Sidebar } from '@/components/Navigation/Sidebar'
import { TopNav } from '@/components/Navigation/TopNav'
import { TopNavProvider, useTopNav } from '@/components/Providers/TopNavContext'
import { useDesignSystemTheme } from '@databricks/design-system'
import { useState } from 'react'

function MainLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme } = useDesignSystemTheme()
  const { topNavCollapsed } = useTopNav()

  return (
    <>
      {!topNavCollapsed && (
        <TopNav sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      )}
      <div style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        paddingTop: topNavCollapsed ? '8px' : '48px',
        transition: 'padding-top 0.2s ease',
        backgroundColor: theme.colors.backgroundSecondary,
      }}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
        <div style={{
          background: theme.colors.backgroundSecondary,
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <main style={{
            flex: 1,
            borderRadius: '12px 0 0 0',
            backgroundColor: theme.colors.backgroundPrimary,
            borderLeft: `1px solid ${theme.colors.border}`,
            borderTop: `1px solid ${theme.colors.border}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            color: theme.colors.textPrimary,
          }}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <TopNavProvider>
      <MainLayoutInner>{children}</MainLayoutInner>
    </TopNavProvider>
  )
}
