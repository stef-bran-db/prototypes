'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  useDesignSystemTheme,
  CompassIcon,
  NotebookIcon,
  ClockIcon,
  CatalogIcon,
  WorkflowsIcon,
  CloudIcon,
  QueryEditorIcon,
  QueryIcon,
  DashboardIcon,
  SparkleRectangleIcon,
  NotificationIcon,
  HistoryIcon,
  CloudDatabaseIcon,
  ChecklistIcon,
  IngestionIcon,
  PipelineIcon,
  RobotIcon,
  BeakerIcon,
  LayerIcon,
  ModelsIcon,
  CloudModelIcon,
  StorefrontIcon,
  PlusIcon,
} from '@databricks/design-system'
import { NavItemComponent, type NavItem } from './NavItemComponent'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navStructure: NavItem[] = [
  { path: '/workspace', label: 'Workspace', icon: NotebookIcon },
  { path: '/recents', label: 'Recents', icon: ClockIcon },
  { path: '/data', label: 'Catalog', icon: CatalogIcon },
  { path: '/discover', label: 'Discover', icon: CompassIcon },
  { path: '/jobs', label: 'Jobs & Pipelines', icon: WorkflowsIcon },
  { path: '/compute', label: 'Compute', icon: CloudIcon },
  { path: '/marketplace', label: 'Marketplace', icon: StorefrontIcon },

  { path: '/sql-editor', label: 'SQL Editor', icon: QueryEditorIcon, section: 'SQL' },
  { path: '/queries', label: 'Queries', icon: QueryIcon, section: 'SQL' },
  { path: '/dashboards', label: 'Dashboards', icon: DashboardIcon, section: 'SQL' },
  { path: '/genie', label: 'Genie', icon: SparkleRectangleIcon, section: 'SQL' },
  { path: '/alerts', label: 'Alerts', icon: NotificationIcon, section: 'SQL' },
  { path: '/query-history', label: 'Query History', icon: HistoryIcon, section: 'SQL' },
  { path: '/sql-warehouses', label: 'SQL Warehouses', icon: CloudDatabaseIcon, section: 'SQL' },

  { path: '/job-runs', label: 'Job Runs', icon: ChecklistIcon, section: 'Data Engineering' },
  { path: '/data-ingestion', label: 'Data Ingestion', icon: IngestionIcon, section: 'Data Engineering' },
  { path: '/pipelines', label: 'Pipelines', icon: PipelineIcon, section: 'Data Engineering' },

  { path: '/playground', label: 'Playground', icon: RobotIcon, section: 'AI/ML' },
  { path: '/experiments', label: 'Experiments', icon: BeakerIcon, section: 'AI/ML' },
  { path: '/features', label: 'Features', icon: LayerIcon, section: 'AI/ML' },
  { path: '/models', label: 'Models', icon: ModelsIcon, section: 'AI/ML' },
  { path: '/serving', label: 'Serving', icon: CloudModelIcon, section: 'AI/ML' },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { theme } = useDesignSystemTheme()
  const [newButtonState, setNewButtonState] = useState<'Default' | 'Hover' | 'Press'>('Default')

  // Group navigation items by section
  const groupedNav: { [key: string]: NavItem[] } = {}
  let currentSection = 'main'

  navStructure.forEach((item) => {
    if (item.section) {
      if (!groupedNav[item.section]) groupedNav[item.section] = []
      groupedNav[item.section].push(item)
    } else {
      if (!groupedNav[currentSection]) groupedNav[currentSection] = []
      groupedNav[currentSection].push(item)
    }
  })

  const getNewButtonStyles = () => {
    const baseColor = 'rgba(255, 73, 73, '
    switch (newButtonState) {
      case 'Press':
        return { backgroundColor: `${baseColor}0.24)`, borderColor: `${baseColor}0.24)` }
      case 'Hover':
        return { backgroundColor: `${baseColor}0.16)`, borderColor: `${baseColor}0.16)` }
      default:
        return { backgroundColor: `${baseColor}0.08)`, borderColor: `${baseColor}0.08)` }
    }
  }

  const newButtonStyles = getNewButtonStyles()

  const renderSection = (label: string, items: NavItem[]) => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <div style={{
        display: 'flex',
        height: '24px',
        alignItems: 'center',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        width: isOpen ? '176px' : 'auto',
      }}>
        {isOpen && (
          <span style={{
            fontSize: theme.typography.fontSizeSm,
            lineHeight: theme.typography.lineHeightXs,
            color: theme.colors.textSecondary,
          }}>
            {label}
          </span>
        )}
      </div>
      {items.map((item) => (
        <NavItemComponent
          key={item.path}
          item={item}
          isActive={pathname === item.path || pathname?.startsWith(item.path + '/')}
          isOpen={isOpen}
        />
      ))}
    </div>
  )

  return (
    <aside style={{
      width: isOpen ? '204px' : '8px',
      minWidth: isOpen ? '204px' : '8px',
      backgroundColor: theme.colors.backgroundSecondary,
      color: theme.colors.textPrimary,
      transition: 'width 0.3s ease, min-width 0.3s ease, padding 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 48px)',
      overflowY: isOpen ? 'auto' : 'hidden',
      overflowX: 'hidden',
      gap: '16px',
      paddingLeft: isOpen ? '12px' : '0px',
      paddingRight: isOpen ? '12px' : '0px',
      paddingBottom: '8px',
      borderRadius: '0 0 0 8px',
    }}>
      {isOpen && (
        <>
          {/* New button */}
          <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0', width: '100%' }}>
            <button
              onClick={() => {/* Handle new action */}}
              style={{
                width: '100%',
                height: '36px',
                borderRadius: theme.borders.borderRadiusMd,
                backgroundColor: newButtonStyles.backgroundColor,
                border: `1px solid ${newButtonStyles.borderColor}`,
                color: theme.colors.textPrimary,
                display: 'flex',
                gap: theme.spacing.sm,
                alignItems: 'center',
                padding: '0 12px',
                fontSize: theme.typography.fontSizeBase,
                lineHeight: theme.typography.lineHeightBase,
                fontWeight: theme.typography.typographyBoldFontWeight,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={() => setNewButtonState('Hover')}
              onMouseLeave={() => setNewButtonState('Default')}
              onMouseDown={() => setNewButtonState('Press')}
              onMouseUp={() => setNewButtonState('Hover')}
            >
              <div style={{ color: '#FF4949', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusIcon {...({} as any)} />
              </div>
              <span>New</span>
            </button>
          </div>

          {/* Main Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '16px' }}>
            {groupedNav.main && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {groupedNav.main.map((item) => (
                  <NavItemComponent
                    key={item.path}
                    item={item}
                    isActive={pathname === item.path || pathname?.startsWith(item.path + '/')}
                    isOpen={isOpen}
                  />
                ))}
              </div>
            )}

            {groupedNav['SQL'] && renderSection('SQL', groupedNav['SQL'])}
            {groupedNav['Data Engineering'] && renderSection('Data Engineering', groupedNav['Data Engineering'])}
            {groupedNav['AI/ML'] && renderSection('AI/ML', groupedNav['AI/ML'])}
          </div>
        </>
      )}
    </aside>
  )
}
