'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { useDesignSystemTheme } from '@databricks/design-system'

export interface NavItem {
  path: string
  label: string
  icon: ComponentType<any>
  section?: string
  disabled?: boolean
}

interface NavItemComponentProps {
  item: NavItem
  isActive: boolean
  isOpen: boolean
}

export function NavItemComponent({ item, isActive, isOpen }: NavItemComponentProps) {
  const [hoverState, setHoverState] = useState<'Default' | 'Hover' | 'Press'>('Default')
  const [isPressed, setIsPressed] = useState(false)
  const { theme } = useDesignSystemTheme()
  const IconComponent = item.icon

  const state = item.disabled ? 'Disabled' : isPressed ? 'Press' : hoverState
  const isSelected = isActive && !item.disabled

  const getStyles = () => {
    if (item.disabled) return { backgroundColor: 'transparent', color: theme.colors.actionDisabledText, fontWeight: 400 }
    if (isSelected) return { backgroundColor: theme.colors.actionDefaultBackgroundHover, color: theme.colors.actionTertiaryTextHover, fontWeight: theme.typography.typographyBoldFontWeight }
    if (state === 'Hover' || state === 'Press') return { backgroundColor: theme.colors.actionDefaultBackgroundHover, color: theme.colors.actionTertiaryTextHover, fontWeight: 400 }
    return { backgroundColor: 'transparent', color: theme.colors.textPrimary, fontWeight: 400 }
  }

  const styles = getStyles()
  const iconColor = item.disabled ? theme.colors.actionDisabledText : (isSelected || state === 'Hover' || state === 'Press') ? theme.colors.actionTertiaryTextHover : '#7f8f9a'

  const content = (
    <div
      style={{
        display: 'flex', gap: theme.spacing.sm, height: '28px', alignItems: 'center',
        padding: '0 12px', borderRadius: theme.borders.borderRadiusSm,
        width: isOpen ? '176px' : 'auto', backgroundColor: styles.backgroundColor,
        color: styles.color, cursor: item.disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', fontSize: theme.typography.fontSizeBase,
        lineHeight: theme.typography.lineHeightBase, fontWeight: styles.fontWeight,
      }}
      onMouseEnter={() => !item.disabled && setHoverState('Hover')}
      onMouseLeave={() => { setHoverState('Default'); setIsPressed(false) }}
      onMouseDown={() => !item.disabled && setIsPressed(true)}
      onMouseUp={() => !item.disabled && setIsPressed(false)}
    >
      <div style={{ width: 16, height: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
        <IconComponent {...({} as any)} />
      </div>
      {isOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
    </div>
  )

  if (item.disabled) return content
  return <Link href={item.path} style={{ textDecoration: 'none', display: 'block' }}>{content}</Link>
}
