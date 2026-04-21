'use client'

import { useEffect, useState } from 'react'
import {
  SparkleIcon,
  SparkleRectangleIcon,
  NotebookIcon,
  TableIcon,
  DashboardIcon,
  QueryIcon,
  ModelsIcon,
  PipelineIcon,
  CertifiedFillIcon,
  CloseIcon,
  PlayIcon,
  BookmarkIcon,
  ShareIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleFillIcon,
  LightningIcon,
  VisibleIcon,
} from '@databricks/design-system'
import type { ComponentType } from 'react'

export type AssetType = 'notebook' | 'table' | 'dashboard' | 'query' | 'model' | 'pipeline' | 'genie'

export interface PreviewableAsset {
  id: string
  name: string
  description: string
  type: AssetType
  owner: string
  certified?: boolean
}

const TYPE_CFG: Record<AssetType, { label: string; icon: ComponentType<any>; color: string }> = {
  notebook:  { label: 'Notebook',  icon: NotebookIcon,          color: '#F48842' },
  table:     { label: 'Table',     icon: TableIcon,             color: '#1B7F80' },
  dashboard: { label: 'Dashboard', icon: DashboardIcon,         color: '#7849B8' },
  query:     { label: 'Query',     icon: QueryIcon,             color: '#2272B4' },
  model:     { label: 'Model',     icon: ModelsIcon,            color: '#C83A7F' },
  pipeline:  { label: 'Pipeline',  icon: PipelineIcon,          color: '#0E7C3A' },
  genie:     { label: 'Genie',     icon: SparkleRectangleIcon,  color: '#8C4BC9' },
}

function Ic({ icon: IconComp, size, color, style }: { icon: ComponentType<any>; size: number; color?: string; style?: React.CSSProperties }) {
  return (
    <span style={{
      width: size, height: size, flexShrink: 0, color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>
      <IconComp {...({} as any)} style={{ fontSize: size }} />
    </span>
  )
}

function AvatarCircle({ name, size }: { name: string; size: number }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  const palette = ['#434a93', '#2272B4', '#1B7F80', '#C83A7F', '#F48842', '#7849B8']
  const color = palette[name.charCodeAt(0) % palette.length]
  return (
    <span style={{
      width: size, height: size, borderRadius: 999,
      backgroundColor: color, color: '#fff',
      fontSize: size > 22 ? 10 : 9, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {initials}
    </span>
  )
}

const TABLE_SCHEMAS: Record<string, { name: string; type: string; desc?: string }[]> = {
  'dim_users': [
    { name: 'user_id',         type: 'bigint',   desc: 'Primary key' },
    { name: 'email',           type: 'string' },
    { name: 'segment',         type: 'string',   desc: 'enterprise | smb | consumer' },
    { name: 'lifecycle_stage', type: 'string',   desc: 'active | dormant | churned' },
    { name: 'signup_date',     type: 'date' },
    { name: 'country',         type: 'string' },
    { name: 'last_active_at',  type: 'timestamp' },
    { name: 'ltv_usd',         type: 'decimal(12,2)' },
  ],
  'fct_orders_daily': [
    { name: 'order_date', type: 'date',         desc: 'Partition key' },
    { name: 'order_id',   type: 'bigint',       desc: 'Primary key' },
    { name: 'user_id',    type: 'bigint',       desc: 'FK → dim_users' },
    { name: 'product_id', type: 'bigint',       desc: 'FK → dim_products' },
    { name: 'quantity',   type: 'int' },
    { name: 'revenue',    type: 'decimal(12,2)' },
    { name: 'currency',   type: 'string' },
    { name: 'channel',    type: 'string',       desc: 'web | mobile | partner' },
  ],
  'search_impressions': [
    { name: 'impression_id', type: 'string',    desc: 'UUID, primary key' },
    { name: 'user_id',       type: 'bigint' },
    { name: 'query',         type: 'string' },
    { name: 'surface',       type: 'string',    desc: 'topnav | catalog | recents' },
    { name: 'rank',          type: 'int' },
    { name: 'asset_id',      type: 'string' },
    { name: 'asset_type',    type: 'string' },
    { name: 'ts',            type: 'timestamp' },
  ],
  'churn_scores_v4': [
    { name: 'user_id',       type: 'bigint',         desc: 'FK → dim_users' },
    { name: 'score_date',    type: 'date' },
    { name: 'churn_prob',    type: 'double',         desc: '0.0 - 1.0' },
    { name: 'top_features',  type: 'array<string>' },
    { name: 'model_version', type: 'string' },
  ],
  'browse_funnel_daily': [
    { name: 'date',        type: 'date' },
    { name: 'surface',     type: 'string' },
    { name: 'impressions', type: 'bigint' },
    { name: 'clicks',      type: 'bigint' },
    { name: 'engagements', type: 'bigint' },
    { name: 'ctr',         type: 'double' },
  ],
}

const GENERIC_TABLE_SCHEMA = [
  { name: 'id',         type: 'bigint',    desc: 'Primary key' },
  { name: 'created_at', type: 'timestamp' },
  { name: 'updated_at', type: 'timestamp' },
  { name: 'status',     type: 'string' },
  { name: 'metadata',   type: 'map<string,string>' },
]

const SAMPLE_SQL: Record<string, string> = {
  'retention_lookback': `SELECT
  cohort_month,
  week_offset,
  COUNT(DISTINCT user_id) AS retained
FROM fct_sessions
WHERE event_date >= date_add(current_date(), -${'{{lookback_days}}'})
GROUP BY cohort_month, week_offset
ORDER BY cohort_month DESC`,
  'funnel_conversion': `WITH steps AS (
  SELECT user_id, MIN(ts) FILTER (WHERE event = 'view')   AS view_ts,
                          MIN(ts) FILTER (WHERE event = 'click') AS click_ts,
                          MIN(ts) FILTER (WHERE event = 'open')  AS open_ts
  FROM fct_browse_events
  WHERE date BETWEEN '{{start}}' AND '{{end}}'
  GROUP BY user_id
)
SELECT
  COUNT(view_ts)  AS viewed,
  COUNT(click_ts) AS clicked,
  COUNT(open_ts)  AS opened
FROM steps`,
  'search_eval_results': `SELECT
  eval_id,
  query,
  AVG(ndcg_at_5)  AS ndcg_5,
  AVG(click_rank) AS avg_click_rank
FROM search_eval_runs
WHERE run_date = '{{run_date}}'
GROUP BY eval_id, query`,
}

const GENERIC_SQL = `SELECT *
FROM ${'{{table}}'}
WHERE event_date BETWEEN '{{start}}' AND '{{end}}'
LIMIT 100`

export function PreviewPanel({ asset, onClose, theme }: { asset: PreviewableAsset | null; onClose: () => void; theme: any }) {
  const open = !!asset

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(17, 17, 17, 0.18)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          zIndex: 1050,
        }}
      />
      <aside
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 480, maxWidth: '95vw',
          backgroundColor: theme.colors.backgroundPrimary,
          borderLeft: `1px solid ${theme.colors.border}`,
          boxShadow: '-16px 0 40px rgba(0,0,0,0.08)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 1100,
          display: 'flex', flexDirection: 'column',
        }}
      >
        {asset && <PreviewContent asset={asset} onClose={onClose} theme={theme} />}
      </aside>
    </>
  )
}

function PreviewContent({ asset, onClose, theme }: { asset: PreviewableAsset; onClose: () => void; theme: any }) {
  const cfg = TYPE_CFG[asset.type]
  return (
    <>
      <div style={{
        padding: '18px 20px 18px',
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              color: cfg.color,
            }}>
              {cfg.label}
            </span>
            {asset.certified && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
                color: '#1B7F80',
              }}>
                <Ic icon={CertifiedFillIcon} size={12} />
                Certified
              </span>
            )}
          </div>
          <h2 style={{
            fontSize: 20, lineHeight: '26px',
            fontWeight: theme.typography.typographyBoldFontWeight,
            color: theme.colors.textPrimary,
            marginBottom: 6,
            letterSpacing: '-0.01em',
            wordBreak: 'break-word',
          }}>
            {asset.name}
          </h2>
          <p style={{
            fontSize: theme.typography.fontSizeSm, lineHeight: '18px',
            color: theme.colors.textSecondary,
            marginBottom: 10,
          }}>
            {asset.description}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: theme.typography.fontSizeSm,
            color: theme.colors.textSecondary,
          }}>
            <AvatarCircle name={asset.owner} size={18} />
            <span style={{ color: theme.colors.textPrimary, fontWeight: theme.typography.typographyBoldFontWeight }}>
              {asset.owner}
            </span>
            <span>· owner</span>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 30, height: 30, borderRadius: 7,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.backgroundPrimary,
            color: theme.colors.textSecondary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.colors.backgroundPrimary }}
        >
          <Ic icon={CloseIcon} size={13} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 24px' }}>
        {asset.type === 'table'     && <TablePreview asset={asset} theme={theme} />}
        {asset.type === 'dashboard' && <DashboardPreview asset={asset} theme={theme} />}
        {asset.type === 'notebook'  && <NotebookPreview asset={asset} theme={theme} />}
        {asset.type === 'query'     && <QueryPreview asset={asset} theme={theme} />}
        {asset.type === 'model'     && <ModelPreview asset={asset} theme={theme} />}
        {asset.type === 'pipeline'  && <PipelinePreview asset={asset} theme={theme} />}
        {asset.type === 'genie'     && <GeniePreview asset={asset} theme={theme} />}
      </div>

      <div style={{
        padding: '12px 20px',
        borderTop: `1px solid ${theme.colors.border}`,
        display: 'flex', gap: 8,
      }}>
        <button style={{
          flex: 1, height: 36, borderRadius: 8, border: 'none',
          backgroundColor: '#FF4949', color: '#fff',
          fontSize: theme.typography.fontSizeBase,
          fontWeight: theme.typography.typographyBoldFontWeight,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Ic icon={PlayIcon} size={12} /> Open
        </button>
        <PanelIconButton icon={BookmarkIcon} label="Pin" theme={theme} />
        <PanelIconButton icon={ShareIcon} label="Share" theme={theme} />
      </div>
    </>
  )
}

function PanelIconButton({ icon: IconComp, label, theme }: { icon: ComponentType<any>; label: string; theme: any }) {
  const [h, setH] = useState(false)
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      aria-label={label}
      style={{
        width: 36, height: 36, borderRadius: 8,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: h ? theme.colors.backgroundSecondary : theme.colors.backgroundPrimary,
        color: theme.colors.textPrimary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <Ic icon={IconComp} size={13} />
    </button>
  )
}

function SectionHeader({ title, theme }: { title: string; theme: any }) {
  return (
    <h3 style={{
      fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
      textTransform: 'uppercase', letterSpacing: '0.04em',
      color: theme.colors.textSecondary,
      marginBottom: 10,
    }}>
      {title}
    </h3>
  )
}

function MetaRow({ items, theme }: { items: { label: string; value: string; icon?: ComponentType<any>; color?: string }[]; theme: any }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 8, marginBottom: 18,
    }}>
      {items.map((item, idx) => {
        const IconComp = item.icon
        return (
          <div key={idx} style={{
            padding: '10px 12px', borderRadius: 8,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.backgroundPrimary,
          }}>
            <div style={{
              fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
              color: theme.colors.textSecondary,
              textTransform: 'uppercase', letterSpacing: '0.03em',
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 4,
            }}>
              {IconComp && <Ic icon={IconComp} size={11} />}
              {item.label}
            </div>
            <div style={{
              fontSize: theme.typography.fontSizeBase,
              fontWeight: theme.typography.typographyBoldFontWeight,
              color: item.color ?? theme.colors.textPrimary,
            }}>
              {item.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TablePreview({ asset, theme }: { asset: PreviewableAsset; theme: any }) {
  const columns = TABLE_SCHEMAS[asset.name] ?? GENERIC_TABLE_SCHEMA
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Rows',      value: '847K',              icon: TableIcon },
        { label: 'Size',      value: '2.1 GB' },
        { label: 'Freshness', value: '2 hours ago',       icon: ClockIcon, color: '#0E7C3A' },
        { label: 'Refresh',   value: 'Daily · 06:00 UTC', icon: CalendarIcon },
      ]} />

      <SectionHeader title="Lineage" theme={theme} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 18 }}>
        <LineageChip label="Upstream" count={3} color="#2272B4" theme={theme} />
        <LineageChip label="Downstream" count={12} color="#7849B8" theme={theme} />
      </div>

      <SectionHeader title={`Schema · ${columns.length} columns`} theme={theme} />
      <div style={{ borderRadius: 8, border: `1px solid ${theme.colors.border}`, overflow: 'hidden' }}>
        {columns.map((col, idx) => (
          <div key={col.name} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 12px',
            borderBottom: idx === columns.length - 1 ? 'none' : `1px solid ${theme.colors.border}`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: theme.typography.fontSizeBase,
                fontWeight: theme.typography.typographyBoldFontWeight,
                color: theme.colors.textPrimary,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}>
                {col.name}
              </div>
              {col.desc && (
                <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>
                  {col.desc}
                </div>
              )}
            </div>
            <span style={{
              fontSize: 11, height: 20,
              padding: '0 8px', borderRadius: 4,
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.textSecondary,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}>
              {col.type}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function LineageChip({ label, count, color, theme }: { label: string; count: number; color: string; theme: any }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 8,
      backgroundColor: `${color}10`,
      border: `1px solid ${color}30`,
    }}>
      <div style={{
        fontSize: 11, color: color, fontWeight: theme.typography.typographyBoldFontWeight,
        textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 18, fontWeight: theme.typography.typographyBoldFontWeight,
        color: theme.colors.textPrimary,
      }}>
        {count} <span style={{ fontSize: 12, fontWeight: 400, color: theme.colors.textSecondary }}>
          {count === 1 ? 'asset' : 'assets'}
        </span>
      </div>
    </div>
  )
}

function DashboardPreview({ asset, theme }: { asset: PreviewableAsset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Views · 7d',  value: '147',         icon: VisibleIcon, color: '#E8511D' },
        { label: 'Last update', value: '6 hours ago', icon: ClockIcon },
        { label: 'Viz count',   value: '12 charts',   icon: DashboardIcon },
        { label: 'Refresh',     value: 'Hourly',      icon: CalendarIcon },
      ]} />
      <SectionHeader title="Data sources" theme={theme} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {['fct_orders_daily', 'dim_users', 'dim_products', 'fct_sessions'].map((t) => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 22, padding: '0 8px', borderRadius: 6,
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textPrimary,
            fontSize: 11, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}>
            <Ic icon={TableIcon} size={10} color="#1B7F80" />
            {t}
          </span>
        ))}
      </div>
      <SectionHeader title="Charts" theme={theme} />
      <div style={{
        padding: 12, borderRadius: 8, border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.backgroundSecondary,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {['Revenue', 'New users', 'Retention', 'Top products', 'Channel mix', 'Refunds'].map((label) => (
          <div key={label} style={{
            height: 58, borderRadius: 6, backgroundColor: '#fff',
            border: `1px solid ${theme.colors.border}`,
            padding: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: 10, color: theme.colors.textSecondary, fontWeight: theme.typography.typographyBoldFontWeight }}>{label}</div>
            <svg viewBox="0 0 60 14" style={{ width: '100%', height: 14 }}>
              <polyline points="0,11 10,8 20,10 30,5 40,7 50,3 60,4" fill="none" stroke="#7849B8" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>
    </>
  )
}

function NotebookPreview({ asset, theme }: { asset: PreviewableAsset; theme: any }) {
  const cells: { kind: 'markdown' | 'python'; content: string }[] = [
    { kind: 'markdown', content: '# Churn Model Training\n\nTrain an XGBoost churn classifier using features from the feature store.' },
    { kind: 'python',   content: "from databricks.feature_store import FeatureStoreClient\n\nfs = FeatureStoreClient()" },
    { kind: 'python',   content: "training_set = fs.create_training_set(\n    df=labels,\n    feature_lookups=FEATURE_LOOKUPS,\n    label='churned',\n)\ntraining_df = training_set.load_df()" },
    { kind: 'markdown', content: '## Train XGBoost model' },
    { kind: 'python',   content: "import xgboost as xgb\n\nmodel = xgb.train(\n    params={'objective': 'binary:logistic', 'max_depth': 6},\n    dtrain=xgb.DMatrix(training_df),\n    num_boost_round=200,\n)" },
  ]

  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Language', value: 'Python',      icon: NotebookIcon },
        { label: 'Cells',    value: '24 cells' },
        { label: 'Last run', value: '4 hours ago', icon: ClockIcon, color: '#0E7C3A' },
        { label: 'Runtime',  value: 'DBR 14.3 ML' },
      ]} />
      <SectionHeader title="Cells" theme={theme} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cells.map((cell, idx) => {
          const isMd = cell.kind === 'markdown'
          return (
            <div key={idx} style={{
              borderRadius: 8, overflow: 'hidden',
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.backgroundPrimary,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '4px 10px',
                backgroundColor: theme.colors.backgroundSecondary,
                borderBottom: `1px solid ${theme.colors.border}`,
                fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase',
                fontWeight: theme.typography.typographyBoldFontWeight,
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  color: isMd ? '#6B36A1' : '#0E7C3A',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 2,
                    backgroundColor: isMd ? '#8C4BC9' : '#2BB56A',
                  }} />
                  {isMd ? 'Markdown' : 'Python'}
                </span>
                <span style={{ color: theme.colors.textSecondary, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                  [{idx + 1}]
                </span>
              </div>
              <pre style={{
                margin: 0,
                padding: '10px 12px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 11, lineHeight: '17px',
                color: isMd ? '#4B2373' : theme.colors.textPrimary,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                backgroundColor: isMd ? '#FAF4FF' : theme.colors.backgroundPrimary,
              }}>
                {cell.content}
              </pre>
            </div>
          )
        })}
      </div>
      <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 10, textAlign: 'center' }}>
        Showing 5 of 24 cells
      </div>
    </>
  )
}

function QueryPreview({ asset, theme }: { asset: PreviewableAsset; theme: any }) {
  const sql = SAMPLE_SQL[asset.name] ?? GENERIC_SQL
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Last run',    value: '30 min ago',   icon: ClockIcon, color: '#0E7C3A' },
        { label: 'Avg runtime', value: '1.8s',         icon: LightningIcon },
        { label: 'Rows',        value: '5.2K' },
        { label: 'Warehouse',   value: 'shared-sql-lg' },
      ]} />
      <SectionHeader title="SQL" theme={theme} />
      <pre style={{
        padding: 14, borderRadius: 8,
        backgroundColor: '#1E1E2E', color: '#E9E9F0',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 11, lineHeight: '17px',
        whiteSpace: 'pre-wrap', overflow: 'auto',
        border: `1px solid ${theme.colors.border}`,
      }}>{sql}</pre>
    </>
  )
}

function ModelPreview({ asset, theme }: { asset: PreviewableAsset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Version',  value: 'v4.1',           icon: ModelsIcon },
        { label: 'Stage',    value: 'Production',     icon: CheckCircleFillIcon, color: '#0E7C3A' },
        { label: 'Trained',  value: 'Mar 19, 2026',   icon: CalendarIcon },
        { label: 'Endpoint', value: 'churn-v4-prod' },
      ]} />
      <SectionHeader title="Metrics" theme={theme} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
        {[
          { label: 'AUC',       value: '0.914' },
          { label: 'Precision', value: '0.882' },
          { label: 'Recall',    value: '0.826' },
        ].map((m) => (
          <div key={m.label} style={{
            padding: '10px 12px', borderRadius: 8,
            backgroundColor: '#F0E5FA', border: '1px solid #E0CFF0',
          }}>
            <div style={{
              fontSize: 10, color: '#6B36A1',
              fontWeight: theme.typography.typographyBoldFontWeight,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              {m.label}
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: theme.typography.typographyBoldFontWeight,
              color: '#4B2373', marginTop: 2,
            }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
      <SectionHeader title="Training data" theme={theme} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['churn_scores_v4', 'dim_users', 'fct_sessions'].map((t) => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 22, padding: '0 8px', borderRadius: 6,
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textPrimary, fontSize: 11,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}>
            <Ic icon={TableIcon} size={10} color="#1B7F80" />
            {t}
          </span>
        ))}
      </div>
    </>
  )
}

function PipelinePreview({ asset, theme }: { asset: PreviewableAsset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Last run', value: 'Success',           icon: CheckCircleFillIcon, color: '#0E7C3A' },
        { label: 'Duration', value: '4m 12s' },
        { label: 'Schedule', value: 'Daily · 06:00 UTC', icon: CalendarIcon },
        { label: 'Tasks',    value: '7 tasks',           icon: PipelineIcon },
      ]} />
      <SectionHeader title="Task graph" theme={theme} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
        {['ingest_raw_events', 'clean_events', 'enrich_with_dim_users', 'aggregate_daily', 'write_gold_table'].map((task) => (
          <div key={task} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999,
              backgroundColor: '#DFF7E7', color: '#0E7C3A',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Ic icon={CheckCircleFillIcon} size={12} />
            </span>
            <div style={{
              flex: 1, padding: '8px 12px', borderRadius: 6,
              backgroundColor: theme.colors.backgroundSecondary,
              fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}>
              {task}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function GeniePreview({ asset, theme }: { asset: PreviewableAsset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Tables',      value: '6 connected', icon: TableIcon },
        { label: 'Domain',      value: 'Growth' },
        { label: 'Sessions',    value: '142 · 7d',    icon: SparkleIcon, color: '#8C4BC9' },
        { label: 'Avg latency', value: '2.3s',        icon: LightningIcon },
      ]} />
      <SectionHeader title="Sample questions teammates asked" theme={theme} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          'What was our browse → open funnel conversion last week?',
          'Which surfaces had the biggest impression drop?',
          'Show me the top 10 assets by engagement in the file browser',
          'How many unique users hit Catalog explorer yesterday?',
        ].map((q, idx) => (
          <div key={idx} style={{
            padding: '10px 12px', borderRadius: 8,
            backgroundColor: '#F0E5FA', border: '1px dashed #C9A6E6',
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Ic icon={SparkleIcon} size={12} color="#8C4BC9" style={{ marginTop: 2 }} />
            <span style={{ fontSize: 12, lineHeight: '17px', color: '#4B2373' }}>{q}</span>
          </div>
        ))}
      </div>
    </>
  )
}
