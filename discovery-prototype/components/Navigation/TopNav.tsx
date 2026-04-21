'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useDesignSystemTheme,
  SearchIcon,
  ChevronDownIcon,
  GridDashIcon,
  Button,
} from '@databricks/design-system'
import { AnimatedSidebarIcon } from '@/components/animations/AnimatedSidebarIcon'

interface TopNavProps {
  sidebarOpen: boolean
  onMenuClick: () => void
}

export function TopNav({ sidebarOpen, onMenuClick }: TopNavProps) {
  const { theme } = useDesignSystemTheme()
  const router = useRouter()
  const [workspaceName] = useState('Production')

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: '48px', backgroundColor: theme.colors.backgroundSecondary,
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: '16px', width: '100%',
    }}>
      {/* Left: Menu + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <Button type="tertiary" icon={<AnimatedSidebarIcon isOpen={sidebarOpen} />} onClick={onMenuClick} componentId="top-nav-menu"
          dangerouslyAppendWrapperCss={{ width: 32, height: 32, padding: theme.spacing.sm }} />
        <div
          onClick={() => router.push('/home')}
          style={{ display: 'flex', alignItems: 'center', gap: 0, height: 32, padding: '0 8px', cursor: 'pointer' }}
        >
          <div style={{ padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.textDisabled }}>
            <GridDashIcon {...({} as any)} />
          </div>
          <span style={{ fontSize: theme.typography.fontSizeMd, color: theme.colors.textDisabled, marginLeft: 4 }}>Databricks</span>
        </div>
      </div>

      {/* Center: Search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: 500, margin: '0 auto' }}>
        <div style={{
          width: '100%', height: 32, backgroundColor: theme.colors.backgroundPrimary,
          border: `1px solid ${theme.colors.borderDecorative}`, borderRadius: theme.borders.borderRadiusSm,
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
        }}>
          <SearchIcon {...({} as any)} style={{ width: 16, height: 16, color: '#7f8f9a', flexShrink: 0 }} />
          <input type="text" placeholder="Search data, notebooks, recents, and more..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: theme.typography.fontSizeBase, color: theme.colors.textPrimary }} />
          <span style={{ fontSize: theme.typography.fontSizeSm, color: theme.colors.actionDisabledText, whiteSpace: 'nowrap', flexShrink: 0 }}>⌘ + P</span>
        </div>
      </div>

      {/* Right: Workspace + icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 32, padding: '0 8px', borderRadius: theme.borders.borderRadiusSm, cursor: 'pointer' }}>
          <span style={{ fontSize: theme.typography.fontSizeBase, color: theme.colors.textPrimary }}>{workspaceName}</span>
          <ChevronDownIcon {...({} as any)} style={{ width: 16, height: 16, color: '#7f8f9a' }} />
        </div>
        <Button type="tertiary" icon={
          <div style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: '#434a93', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: theme.typography.fontSizeSm, fontWeight: theme.typography.typographyBoldFontWeight }}>U</div>
        } componentId="top-nav-user" dangerouslyAppendWrapperCss={{ width: 32, height: 32, padding: 4, borderRadius: 999 }} />
      </div>
    </header>
  )
}
