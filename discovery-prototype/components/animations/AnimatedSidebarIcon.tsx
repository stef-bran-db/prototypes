'use client'

import { useDesignSystemTheme } from '@databricks/design-system'

interface AnimatedSidebarIconProps {
  isOpen: boolean
  isHovered?: boolean
  style?: React.CSSProperties
}

export function AnimatedSidebarIcon({ isOpen, isHovered = false, style }: AnimatedSidebarIconProps) {
  const { theme } = useDesignSystemTheme()

  const color = isHovered ? theme.colors.actionTertiaryTextHover : theme.colors.textSecondary

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      style={{ ...style, color, transition: 'color 0.15s ease' }}
    >
      {/* Outer rounded rectangle — shared between both states */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13 1a3 3 0 0 1 3 3v8l-.004.154A3 3 0 0 1 13 15H3l-.154-.004a3 3 0 0 1-2.842-2.842L0 12V4a3 3 0 0 1 3-3zM3 2.5A1.5 1.5 0 0 0 1.5 4v8A1.5 1.5 0 0 0 3 13.5h10a1.5 1.5 0 0 0 1.5-1.5V4A1.5 1.5 0 0 0 13 2.5z"
        clipRule="evenodd"
      />

      {/* Vertical divider line — animates position, height, and corner radius */}
      <rect
        fill="currentColor"
        x={isOpen ? 5.25 : 3}
        y={isOpen ? 2.5 : 4.25}
        width="1.5"
        height={isOpen ? 11 : 7.5}
        rx={isOpen ? 0 : 0.75}
        style={{ transition: 'x 0.25s ease-in-out, y 0.25s ease-in-out, height 0.25s ease-in-out, rx 0.25s ease-in-out' }}
      />
    </svg>
  )
}
