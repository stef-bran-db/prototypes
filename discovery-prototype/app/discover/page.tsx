'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useDesignSystemTheme,
  SparkleIcon,
  SparkleRectangleIcon,
  TrendingIcon,
  LightningIcon,
  CertifiedFillIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SlidersIcon,
  NotebookIcon,
  TableIcon,
  DashboardIcon,
  QueryIcon,
  ModelsIcon,
  PipelineIcon,
  UserGroupIcon,
  SearchIcon,
  ShieldCheckIcon,
  VisibleIcon,
  CloseIcon,
  PlayIcon,
  ShareIcon,
  BookmarkIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleFillIcon,
} from '@databricks/design-system'
import type { ComponentType } from 'react'

type AssetType = 'notebook' | 'table' | 'dashboard' | 'query' | 'model' | 'pipeline' | 'genie'
type HeuristicKey = 'trending' | 'team' | 'certified' | 'suggested'

// Sized icon wrapper: antd icons can overflow their width/height, so constrain via a flex box + fontSize
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

type ChartType = 'line' | 'bars' | 'area' | 'spike'

interface Asset {
  id: string
  name: string
  description: string
  type: AssetType
  owner: string
  meta: string
  certified?: boolean
  sparkline?: number[]        // 0-1 values
  chartType?: ChartType       // viz style for trending
  teammates?: string[]        // initials
  reason?: string             // "because you..."
  certifiedBy?: string
  certifiedOn?: string
}

interface Heuristic {
  key: HeuristicKey
  label: string
  tagline: string
  icon: ComponentType<any>
  color: string
  accent: string
  bgAlpha: string
  count: number
}

const ASSET_TYPE_CONFIG: Record<AssetType, { label: string; icon: ComponentType<any>; color: string }> = {
  notebook:  { label: 'Notebook',  icon: NotebookIcon,  color: '#F48842' },
  table:     { label: 'Table',     icon: TableIcon,     color: '#1B7F80' },
  dashboard: { label: 'Dashboard', icon: DashboardIcon, color: '#7849B8' },
  query:     { label: 'Query',     icon: QueryIcon,     color: '#2272B4' },
  model:     { label: 'Model',     icon: ModelsIcon,    color: '#C83A7F' },
  pipeline:  { label: 'Pipeline',  icon: PipelineIcon,  color: '#0E7C3A' },
  genie:     { label: 'Genie',     icon: SparkleRectangleIcon, color: '#8C4BC9' },
}

const HEURISTICS: Heuristic[] = [
  { key: 'trending',  label: 'Trending',              tagline: 'Surging engagement this week',     icon: TrendingIcon,       color: '#E8511D', accent: '#B84014', bgAlpha: '#FDEAE0', count: 24 },
  { key: 'team',      label: 'Popular with your team', tagline: 'What Unified Browse is opening',   icon: UserGroupIcon,      color: '#2272B4', accent: '#185684', bgAlpha: '#E2EEF8', count: 18 },
  { key: 'certified', label: 'Certified',              tagline: 'Vetted and trusted across Databricks', icon: CertifiedFillIcon, color: '#1B7F80', accent: '#13595A', bgAlpha: '#DDF0F0', count: 47 },
  { key: 'suggested', label: 'Picked for you',         tagline: 'Based on your recent work',        icon: SparkleIcon,        color: '#8C4BC9', accent: '#6B36A1', bgAlpha: '#F0E5FA', count: 12 },
]

const ASSETS_BY_HEURISTIC: Record<HeuristicKey, Asset[]> = {
  trending: [
    // Steady linear climb
    { id: 't1', name: 'North Star Metrics', description: 'Company-wide metrics dashboard — 147 viewers this week', type: 'dashboard', owner: 'Executive Team', meta: '+212% views', certified: true,
      sparkline: [0.10, 0.18, 0.27, 0.36, 0.45, 0.54, 0.63, 0.72, 0.81, 0.92] },
    // Sawtooth — volatile but trending up
    { id: 't2', name: 'fct_orders_daily', description: 'Canonical order fact table — used by 38 dashboards', type: 'table', owner: 'Data Platform', meta: '94 queries today', certified: true,
      sparkline: [0.35, 0.55, 0.30, 0.60, 0.42, 0.68, 0.52, 0.80, 0.65, 0.92] },
    // Hockey stick — flat, then sharp takeoff
    { id: 't3', name: 'Pricing Experiments', description: 'A/B test readouts for the new pricing model', type: 'notebook', owner: 'Growth', meta: 'Trending in Growth',
      sparkline: [0.18, 0.20, 0.19, 0.21, 0.22, 0.24, 0.32, 0.55, 0.80, 0.98] },
    // Stair step — plateau, rise, plateau, rise
    { id: 't4', name: 'retention_lookback', description: 'Parameterized retention cohort query', type: 'query', owner: 'Analytics', meta: '+58% runs',
      sparkline: [0.25, 0.25, 0.25, 0.48, 0.48, 0.48, 0.70, 0.70, 0.88, 0.88] },
    // S-curve — slow start, accelerate, flatten
    { id: 't5', name: 'Revenue Attribution', description: 'Multi-touch attribution across marketing channels', type: 'dashboard', owner: 'Marketing Analytics', meta: '+94% views',
      sparkline: [0.10, 0.12, 0.18, 0.30, 0.48, 0.65, 0.78, 0.85, 0.88, 0.90] },
    // Exponential — accelerating upward
    { id: 't6', name: 'churn_scores_v4', description: 'Latest customer churn prediction scores', type: 'table', owner: 'ML Platform', meta: '+120% queries', certified: true,
      sparkline: [0.05, 0.08, 0.12, 0.17, 0.24, 0.34, 0.48, 0.65, 0.85, 0.98] },
    // Dip and recovery — V shape trending up
    { id: 't7', name: 'funnel_conversion', description: 'Session-level funnel conversion rates query', type: 'query', owner: 'Growth', meta: '+47% runs',
      sparkline: [0.55, 0.48, 0.40, 0.32, 0.28, 0.32, 0.45, 0.60, 0.75, 0.88] },
    // Smooth gentle rise — mature asset
    { id: 't8', name: 'Lakehouse Monitoring', description: 'Data freshness + pipeline health across 200+ pipelines', type: 'dashboard', owner: 'Data Platform', meta: '+38% views', certified: true,
      sparkline: [0.58, 0.60, 0.62, 0.63, 0.65, 0.68, 0.70, 0.73, 0.76, 0.80] },
  ],
  team: [
    { id: 'p1', name: 'Unified Browse Weekly', description: 'Team KPI dashboard — 12 teammates viewed this week', type: 'dashboard', owner: 'Stef Bran', meta: '12 teammates', teammates: ['SB', 'BT', 'CC', 'TT', 'SC', 'MH', 'JK', 'AL'] },
    { id: 'p2', name: 'search_impressions', description: 'Search surface impression telemetry', type: 'table', owner: 'Unified Browse', meta: '8 teammates', certified: true, teammates: ['BT', 'SC', 'TT', 'CC', 'MH', 'JK'] },
    { id: 'p3', name: 'Eval: Discovery v2', description: 'Running eval grid for the discovery agent', type: 'notebook', owner: 'Behrooz T.', meta: '6 teammates', teammates: ['BT', 'SB', 'CC', 'TT'] },
    { id: 'p4', name: 'Asset Selector Ingest', description: 'Upstream pipeline feeding the asset selector', type: 'pipeline', owner: 'UI Infra', meta: '5 teammates', teammates: ['CC', 'TT', 'JK'] },
    { id: 'p5', name: 'browse_funnel_daily', description: 'Daily funnel: impressions → clicks → engagement', type: 'table', owner: 'Unified Browse', meta: '7 teammates', teammates: ['SB', 'BT', 'CC', 'TT', 'SC'] },
    { id: 'p6', name: 'Search Quality Dashboard', description: 'Weekly search NDCG, CTR, and eval results', type: 'dashboard', owner: 'Search Quality', meta: '9 teammates', certified: true, teammates: ['BT', 'SC', 'TT', 'SB', 'CC'] },
    { id: 'p7', name: 'Navigation Refactor Notes', description: 'Design doc + eng decisions for nav v2', type: 'notebook', owner: 'Catherine C.', meta: '4 teammates', teammates: ['CC', 'TT', 'SB'] },
    { id: 'p8', name: 'browse_ui_errors', description: 'JS error telemetry for all browse surfaces', type: 'table', owner: 'Unified Browse', meta: '6 teammates', teammates: ['BT', 'SC', 'JK', 'CC'] },
  ],
  certified: [
    { id: 'c1', name: 'dim_users',             description: 'Canonical user dimension — segment and lifecycle fields',  type: 'table',     owner: 'Core Data',     meta: 'Gold',      certified: true, certifiedBy: 'Data Platform', certifiedOn: 'Jan 2026' },
    { id: 'c2', name: 'fct_orders_daily',      description: 'Gold-layer daily orders fact table',                       type: 'table',     owner: 'Data Platform', meta: 'Gold',      certified: true, certifiedBy: 'Data Platform', certifiedOn: 'Dec 2025' },
    { id: 'c3', name: 'Revenue Recognition',   description: 'Company-standard revenue reporting dashboard',              type: 'dashboard', owner: 'Finance',       meta: 'Silver',    certified: true, certifiedBy: 'Finance Ops',   certifiedOn: 'Feb 2026' },
    { id: 'c4', name: 'customer_ltv_v2',       description: 'LTV model scored weekly — used by 6 teams',                  type: 'model',     owner: 'ML Platform',   meta: 'Gold',      certified: true, certifiedBy: 'ML Governance', certifiedOn: 'Mar 2026' },
    { id: 'c5', name: 'churn_scores_v4',       description: 'Latest customer churn prediction scores',                   type: 'table',     owner: 'ML Platform',   meta: 'Gold',      certified: true, certifiedBy: 'ML Governance', certifiedOn: 'Mar 2026' },
    { id: 'c6', name: 'Pipeline: Events Gold', description: 'Canonical event stream aggregation pipeline',                type: 'pipeline',  owner: 'Data Platform', meta: 'Gold',      certified: true, certifiedBy: 'Data Platform', certifiedOn: 'Nov 2025' },
    { id: 'c7', name: 'dim_products',          description: 'Product catalog dimension with categories and hierarchies',   type: 'table',     owner: 'Core Data',     meta: 'Gold',      certified: true, certifiedBy: 'Data Platform', certifiedOn: 'Oct 2025' },
    { id: 'c8', name: 'Finance KPIs',          description: 'Board-level financial metrics dashboard',                     type: 'dashboard', owner: 'Finance',       meta: 'Silver',    certified: true, certifiedBy: 'Finance Ops',   certifiedOn: 'Jan 2026' },
  ],
  suggested: [
    { id: 's1', name: 'Customer LTV Model',    description: 'Used by teams working on retention — might be relevant',       type: 'model',     owner: 'ML Platform',    meta: 'Matches your work',       reason: 'because you edited churn_scores_v4' },
    { id: 's2', name: 'Browse Funnel Genie',   description: 'Ask anything about the browse → engage funnel',                 type: 'genie',     owner: 'Unified Browse', meta: 'New in your team',        reason: 'your team just published this' },
    { id: 's3', name: 'dim_users',             description: 'User dimension with segment and lifecycle attributes',          type: 'table',     owner: 'Core Data',      meta: 'Joins your usual tables', certified: true, reason: 'joins fct_orders_daily' },
    { id: 's4', name: 'Discovery Eval Runs',   description: 'Run log of all discovery agent evaluations',                    type: 'dashboard', owner: 'Discovery Eng',  meta: 'Based on activity',       reason: 'your recent search_eval_results work' },
    { id: 's5', name: 'Navigation Telemetry',  description: 'Breakdown of where users click in the left nav',                type: 'dashboard', owner: 'Navigation PM',  meta: 'Similar to your recents', reason: 'similar to Unified Browse Weekly' },
    { id: 's6', name: 'search_eval_results',   description: 'Historical search quality eval run results',                    type: 'table',     owner: 'Search Quality', meta: 'Matches recent queries',  reason: 'you queried this last Tuesday' },
    { id: 's7', name: 'Asset Impressions Genie', description: 'Ask questions about asset-level impression data',              type: 'genie',     owner: 'Unified Browse', meta: 'New Genie space',         reason: 'based on your telemetry work' },
    { id: 's8', name: 'fct_page_views',         description: 'Canonical page view fact table',                                type: 'table',     owner: 'Data Platform',  meta: 'Used alongside your tables', certified: true, reason: 'your teammates use this daily' },
  ],
}

const COLLECTIONS = [
  { title: 'Customer Analytics Starter Pack', description: '8 canonical tables + 3 dashboards to get going', count: 11, colors: ['#FF7A45', '#FF4949'], icon: TableIcon },
  { title: 'Weekly Metrics Review',           description: 'Everything finance, growth, and ops open on Monday', count: 14, colors: ['#7849B8', '#C83A7F'], icon: DashboardIcon },
  { title: 'ML in Production',                description: 'Live models, feature stores, and monitoring boards', count: 9,  colors: ['#2272B4', '#1B7F80'], icon: ModelsIcon },
  { title: 'Onboard to Unified Browse',       description: 'The docs, dashboards, and notebooks your team uses', count: 12, colors: ['#0E7C3A', '#1B7F80'], icon: NotebookIcon },
  { title: 'Genie Spaces to Try',             description: 'Talk to your data — curated by domain experts',      count: 7,  colors: ['#8C4BC9', '#434a93'], icon: SparkleRectangleIcon },
]

const PULSE_EVENTS = [
  { color: '#E8511D', icon: TrendingIcon,       text: 'Pricing Experiments is trending — up 212% this week' },
  { color: '#2272B4', icon: UserGroupIcon,      text: '13 teammates are viewing Unified Browse Weekly right now' },
  { color: '#1B7F80', icon: CertifiedFillIcon,  text: 'dim_users was re-certified Gold by Data Platform 2h ago' },
  { color: '#8C4BC9', icon: SparkleIcon,        text: 'A new Genie space matches your recent work — try it' },
  { color: '#0E7C3A', icon: LightningIcon,      text: 'churn_scores_v4 just refreshed — 847k rows scored' },
]

const SHELVES: { key: HeuristicKey; title: string; tagline: string }[] = [
  { key: 'trending',  title: 'Trending this week',     tagline: 'Surging engagement across the org' },
  { key: 'team',      title: 'Popular with your team',  tagline: 'What Unified Browse is opening' },
  { key: 'suggested', title: 'Picked for you',          tagline: 'Based on your recent work and collaborators' },
  { key: 'certified', title: 'Certified',               tagline: 'Gold and Silver assets vetted by owners' },
]

export default function DiscoverPage() {
  const { theme } = useDesignSystemTheme()
  const [query, setQuery] = useState('')
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null)

  useEffect(() => {
    if (!previewAsset) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreviewAsset(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [previewAsset])

  return (
    <>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        width: '100%',
      }}>
        <div style={{
          padding: '40px 48px 80px',
          maxWidth: 1280,
          margin: '0 auto',
        }}>
          <Hero theme={theme} query={query} setQuery={setQuery} />

          {SHELVES.map((s) => {
            const heuristic = HEURISTICS.find((h) => h.key === s.key)!
            return (
              <Shelf
                key={s.key}
                theme={theme}
                title={s.title}
                tagline={s.tagline}
                heuristic={heuristic}
                assets={ASSETS_BY_HEURISTIC[s.key]}
                onPreview={setPreviewAsset}
              />
            )
          })}

          <CollectionsRow theme={theme} />

          <BrowseAllCTA theme={theme} />
        </div>
      </div>
      <PreviewPanel asset={previewAsset} onClose={() => setPreviewAsset(null)} theme={theme} />
    </>
  )
}

const ASK_SAMPLE_QUESTIONS = [
  'What do we have on churn?',
  'Tables for revenue',
  'Dashboards my team is using',
  'Certified customer data',
]

const QUICK_FILTERS: { key: string; label: string; icon?: ComponentType<any> }[] = [
  { key: 'certified',  label: 'Certified',  icon: CertifiedFillIcon },
  { key: 'dashboard',  label: 'Dashboards', icon: DashboardIcon },
  { key: 'table',      label: 'Tables',     icon: TableIcon },
  { key: 'notebook',   label: 'Notebooks',  icon: NotebookIcon },
  { key: 'model',      label: 'Models',     icon: ModelsIcon },
  { key: 'mine',       label: 'Owned by me' },
  { key: 'team',       label: 'My team' },
  { key: 'recent7',    label: 'Updated < 7d' },
]

function Hero({ theme, query, setQuery }: { theme: any; query: string; setQuery: (v: string) => void }) {
  const [focused, setFocused] = useState(false)
  const [mode, setMode] = useState<'ask' | 'search'>('ask')
  const router = useRouter()
  const submit = (q?: string) => {
    const value = (q ?? query).trim()
    if (!value) return
    router.push(`/discover/ask?q=${encodeURIComponent(value)}`)
  }

  const askActive = mode === 'ask'

  return (
    <div style={{ textAlign: 'left', marginBottom: 40 }}>
      <h1 style={{
        fontSize: 28, lineHeight: '34px',
        fontWeight: theme.typography.typographyBoldFontWeight,
        color: theme.colors.textPrimary,
        letterSpacing: '-0.01em',
        marginBottom: 6,
      }}>
        Discover
      </h1>

      <p style={{
        fontSize: 14, lineHeight: '20px',
        color: theme.colors.textSecondary,
        marginBottom: 18,
      }}>
        {askActive
          ? 'Describe what you need, or explore what your team uses below.'
          : 'Search assets by name, owner, tag, or type.'}
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px 6px 14px', height: 48,
        borderRadius: 10,
        backgroundColor: theme.colors.backgroundPrimary,
        border: `1px solid ${focused ? theme.colors.actionTertiaryTextHover : theme.colors.border}`,
        boxShadow: focused ? `0 0 0 4px ${theme.colors.actionDefaultBackgroundHover}` : '0 1px 2px rgba(0,0,0,0.04)',
        transition: 'all 0.15s ease',
      }}>
        {askActive
          ? <Ic icon={SparkleIcon} size={16} color="#FF4949" />
          : <Ic icon={SearchIcon} size={16} color={theme.colors.textSecondary} />}
        <input
          type="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore
          data-bwignore
          data-form-type="other"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
          placeholder={askActive
            ? 'Ask anything — "revenue dashboards", "churn model", "certified user tables"'
            : 'Search by name, owner, tag, or type…'}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontSize: theme.typography.fontSizeBase,
            color: theme.colors.textPrimary,
          }}
        />
        <ModeToggle theme={theme} mode={mode} setMode={setMode} />
      </div>

      <div style={{ marginTop: 14 }}>
        {askActive
          ? <SampleQuestions theme={theme} questions={ASK_SAMPLE_QUESTIONS} onAsk={submit} />
          : <SearchFilters theme={theme} />}
      </div>
    </div>
  )
}

function SampleQuestions({
  theme, questions, onAsk,
}: { theme: any; questions: string[]; onAsk: (q: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{
        fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase',
        fontWeight: theme.typography.typographyBoldFontWeight,
        color: theme.colors.textSecondary,
        flexShrink: 0,
      }}>
        Try asking
      </span>
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onAsk(q)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 28, padding: '0 12px', borderRadius: 999,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.backgroundPrimary,
            color: theme.colors.textPrimary,
            fontSize: theme.typography.fontSizeSm,
            cursor: 'pointer', transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary
            e.currentTarget.style.borderColor = theme.colors.borderDecorative
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundPrimary
            e.currentTarget.style.borderColor = theme.colors.border
          }}
        >
          <Ic icon={SparkleIcon} size={11} color="#FF4949" />
          {q}
        </button>
      ))}
    </div>
  )
}

function SearchFilters({ theme }: { theme: any }) {
  const [active, setActive] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState(false)

  const toggle = (key: string) => {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const advancedActive = 0

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {QUICK_FILTERS.map((f) => {
          const isActive = active.has(f.key)
          return (
            <button
              key={f.key}
              onClick={() => toggle(f.key)}
              style={{
                height: 28, padding: '0 10px', borderRadius: 999,
                border: `1px solid ${isActive ? theme.colors.textPrimary : theme.colors.border}`,
                backgroundColor: isActive ? theme.colors.textPrimary : 'transparent',
                color: isActive ? theme.colors.backgroundPrimary : theme.colors.textSecondary,
                fontSize: theme.typography.fontSizeSm,
                fontWeight: theme.typography.typographyBoldFontWeight,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}
            >
              {f.icon && <Ic icon={f.icon} size={11} color={isActive ? theme.colors.backgroundPrimary : theme.colors.textSecondary} />}
              {f.label}
            </button>
          )
        })}
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            height: 28, padding: '0 10px', borderRadius: 999,
            border: `1px dashed ${theme.colors.borderDecorative}`,
            backgroundColor: 'transparent',
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizeSm,
            fontWeight: theme.typography.typographyBoldFontWeight,
            cursor: 'pointer', transition: 'all 0.15s',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            marginLeft: 4,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <Ic icon={SlidersIcon} size={11} color={theme.colors.textSecondary} />
          More filters
          {advancedActive > 0 && (
            <span style={{
              padding: '0 6px', height: 16, borderRadius: 999,
              backgroundColor: theme.colors.textPrimary, color: theme.colors.backgroundPrimary,
              fontSize: 10, fontWeight: theme.typography.typographyBoldFontWeight,
              display: 'inline-flex', alignItems: 'center',
            }}>
              {advancedActive}
            </span>
          )}
          <Ic icon={expanded ? ChevronDownIcon : ChevronRightIcon} size={11} color={theme.colors.textSecondary} />
        </button>
      </div>

      {expanded && (
        <div style={{
          marginTop: 12, padding: 16,
          borderRadius: 10,
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}>
          <FilterGroup theme={theme} title="Catalog" options={['main', 'analytics', 'finance_gold', 'ml_gold', 'marketing_dw']} />
          <FilterGroup theme={theme} title="Tier"    options={['Gold', 'Silver', 'Uncertified']} />
          <FilterGroup theme={theme} title="Last updated" options={['Today', 'This week', 'This month', 'This quarter']} />
        </div>
      )}
    </div>
  )
}

function FilterGroup({ theme, title, options }: { theme: any; title: string; options: string[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  return (
    <div>
      <div style={{
        fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase',
        fontWeight: theme.typography.typographyBoldFontWeight,
        color: theme.colors.textSecondary,
        marginBottom: 8,
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {options.map((o) => {
          const isOn = selected.has(o)
          return (
            <label key={o} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: theme.typography.fontSizeSm,
              color: isOn ? theme.colors.textPrimary : theme.colors.textSecondary,
              cursor: 'pointer',
              userSelect: 'none',
            }}>
              <input
                type="checkbox"
                checked={isOn}
                onChange={(e) => {
                  const next = new Set(selected)
                  if (e.target.checked) next.add(o)
                  else next.delete(o)
                  setSelected(next)
                }}
                style={{ accentColor: theme.colors.textPrimary }}
              />
              {o}
            </label>
          )
        })}
      </div>
    </div>
  )
}

function ModeToggle({
  theme, mode, setMode,
}: { theme: any; mode: 'ask' | 'search'; setMode: (m: 'ask' | 'search') => void }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 2,
      borderRadius: 8, border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.backgroundSecondary,
      flexShrink: 0,
    }}>
      {(['ask', 'search'] as const).map((m) => {
        const active = m === mode
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              height: 28, padding: '0 12px', borderRadius: 6, border: 'none',
              backgroundColor: active ? theme.colors.backgroundPrimary : 'transparent',
              color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
              fontSize: theme.typography.fontSizeSm,
              fontWeight: theme.typography.typographyBoldFontWeight,
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Ic
              icon={m === 'ask' ? SparkleIcon : SearchIcon}
              size={12}
              color={active ? (m === 'ask' ? '#FF4949' : theme.colors.textPrimary) : theme.colors.textSecondary}
            />
            {m === 'ask' ? 'Ask' : 'Search'}
          </button>
        )
      })}
    </div>
  )
}

function PulseStrip({ theme }: { theme: any }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % PULSE_EVENTS.length), 3600)
    return () => clearInterval(id)
  }, [])
  const ev = PULSE_EVENTS[idx]
  const Icon = ev.icon
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 10, marginBottom: 36,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 14px 7px 10px',
        borderRadius: 999,
        backgroundColor: theme.colors.backgroundPrimary,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        maxWidth: 680,
      }}>
        <span style={{
          position: 'relative', width: 8, height: 8, borderRadius: 999,
          backgroundColor: ev.color, flexShrink: 0,
        }}>
          <span style={{
            position: 'absolute', inset: -4, borderRadius: 999,
            backgroundColor: ev.color, opacity: 0.3,
            animation: 'pulse 1.6s ease-out infinite',
          }} />
        </span>
        <Icon {...({} as any)} style={{ width: 14, height: 14, color: ev.color, flexShrink: 0 }} />
        <span key={idx} style={{
          fontSize: theme.typography.fontSizeBase,
          color: theme.colors.textPrimary,
          animation: 'fadeIn 0.5s ease',
        }}>
          {ev.text}
        </span>
      </div>
      <style>{`
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sparkleShimmer { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
      `}</style>
    </div>
  )
}

function HeuristicTiles({ theme, active, setActive }: { theme: any; active: HeuristicKey; setActive: (k: HeuristicKey) => void }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14, marginBottom: 48,
    }}>
      {HEURISTICS.map((h) => (
        <HeuristicTile key={h.key} theme={theme} heuristic={h} active={active === h.key} onClick={() => setActive(h.key)} />
      ))}
    </div>
  )
}

function HeuristicTile({ theme, heuristic, active, onClick }: { theme: any; heuristic: Heuristic; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const Icon = heuristic.icon
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', alignItems: 'flex-start', textAlign: 'left',
        height: 148, padding: 18, borderRadius: 14,
        border: active ? `2px solid ${heuristic.color}` : `1px solid ${hovered ? heuristic.color : 'transparent'}`,
        backgroundColor: heuristic.bgAlpha,
        cursor: 'pointer', transition: 'all 0.18s ease',
        boxShadow: active ? `0 6px 20px ${heuristic.color}22` : hovered ? `0 4px 14px ${heuristic.color}18` : 'none',
        transform: (active || hovered) ? 'translateY(-1px)' : 'none',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', right: -14, bottom: -18, color: heuristic.color, opacity: 0.10, pointerEvents: 'none' }}>
        <Icon {...({} as any)} style={{ width: 120, height: 120 }} />
      </div>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, backgroundColor: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: heuristic.color, boxShadow: `0 1px 2px ${heuristic.color}25`,
        }}>
          <Icon {...({} as any)} style={{ width: 16, height: 16 }} />
        </div>
        <ChevronRightIcon {...({} as any)} style={{
          width: 16, height: 16, color: heuristic.accent,
          opacity: (active || hovered) ? 1 : 0.6,
          transform: hovered ? 'translateX(2px)' : 'none',
          transition: 'all 0.15s ease',
        }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div style={{ fontSize: 16, lineHeight: '20px', fontWeight: theme.typography.typographyBoldFontWeight, color: heuristic.accent, marginBottom: 2 }}>
          {heuristic.label}
        </div>
        <div style={{ fontSize: theme.typography.fontSizeSm, lineHeight: '18px', color: heuristic.accent, opacity: 0.75, marginBottom: 6 }}>
          {heuristic.tagline}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          height: 20, padding: '0 8px', borderRadius: 999,
          backgroundColor: '#ffffff', color: heuristic.accent,
          fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
        }}>
          {heuristic.count} assets
        </div>
      </div>
    </button>
  )
}

function ActiveSection({ theme, heuristic, assets, onPreview }: { theme: any; heuristic: Heuristic; assets: Asset[]; onPreview: (a: Asset) => void }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14, gap: 16,
      }}>
        <span style={{
          fontSize: theme.typography.fontSizeSm,
          color: theme.colors.textSecondary,
        }}>
          Showing {assets.length} of {heuristic.count}
        </span>
        <button
          style={{
            height: 28, padding: '0 10px', borderRadius: 6, border: 'none',
            backgroundColor: 'transparent', color: heuristic.accent,
            fontSize: theme.typography.fontSizeSm,
            fontWeight: theme.typography.typographyBoldFontWeight,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = heuristic.bgAlpha }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          See all {heuristic.count}
          <ChevronRightIcon {...({} as any)} style={{ width: 14, height: 14 }} />
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
      }}>
        {assets.map((a) => (
          <AssetCard key={a.id} asset={a} heuristic={heuristic} theme={theme} onPreview={onPreview} />
        ))}
      </div>
    </section>
  )
}

function Shelf({
  theme, title, tagline, heuristic, assets, onPreview,
}: {
  theme: any
  title: string
  tagline: string
  heuristic: Heuristic
  assets: Asset[]
  onPreview: (a: Asset) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    return () => {
      el.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [assets.length])

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth - 80), behavior: 'smooth' })
  }

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 12, gap: 16,
      }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{
            fontSize: 18, lineHeight: '24px',
            fontWeight: theme.typography.typographyBoldFontWeight,
            color: theme.colors.textPrimary,
            letterSpacing: '-0.005em',
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: theme.typography.fontSizeSm,
            color: theme.colors.textSecondary,
            marginTop: 2,
          }}>
            {tagline}
          </p>
        </div>
        <button
          style={{
            height: 28, padding: '0 10px', borderRadius: 6, border: 'none',
            backgroundColor: 'transparent', color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizeSm,
            fontWeight: theme.typography.typographyBoldFontWeight,
            cursor: 'pointer', flexShrink: 0,
            display: 'inline-flex', alignItems: 'center', gap: 2,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary
            e.currentTarget.style.color = theme.colors.textPrimary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = theme.colors.textSecondary
          }}
        >
          See all {heuristic.count}
          <Ic icon={ChevronRightIcon} size={13} />
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: 14,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: 2,
            padding: '8px 0 12px',
            margin: '-8px 0 -12px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {assets.map((a) => (
            <div
              key={a.id}
              style={{
                flexShrink: 0, width: 290, scrollSnapAlign: 'start',
              }}
            >
              <AssetCard asset={a} heuristic={heuristic} theme={theme} onPreview={onPreview} />
            </div>
          ))}
          <div style={{ flexShrink: 0, width: 16 }} />
        </div>

        {/* Edge fade + scroll buttons */}
        {canScrollLeft && (
          <>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: 48,
              background: `linear-gradient(to right, ${theme.colors.backgroundPrimary}, ${theme.colors.backgroundPrimary}00)`,
              pointerEvents: 'none',
            }} />
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              style={{
                position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
                width: 32, height: 32, borderRadius: 999,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.backgroundPrimary,
                color: theme.colors.textPrimary,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Ic icon={ChevronLeftIcon} size={14} />
            </button>
          </>
        )}
        {canScrollRight && (
          <>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, right: 0, width: 60,
              background: `linear-gradient(to left, ${theme.colors.backgroundPrimary}, ${theme.colors.backgroundPrimary}00)`,
              pointerEvents: 'none',
            }} />
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                width: 32, height: 32, borderRadius: 999,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.backgroundPrimary,
                color: theme.colors.textPrimary,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Ic icon={ChevronRightIcon} size={14} />
            </button>
          </>
        )}
      </div>
    </section>
  )
}

function BrowseAllCTA({ theme }: { theme: any }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: 36,
        padding: '20px 24px',
        borderRadius: 12,
        border: `1px solid ${hovered ? theme.colors.borderDecorative : theme.colors.border}`,
        backgroundColor: hovered ? theme.colors.backgroundSecondary : theme.colors.backgroundPrimary,
        cursor: 'pointer', transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}
    >
      <div>
        <div style={{
          fontSize: theme.typography.fontSizeBase,
          fontWeight: theme.typography.typographyBoldFontWeight,
          color: theme.colors.textPrimary,
          marginBottom: 2,
        }}>
          Browse all assets
        </div>
        <div style={{ fontSize: theme.typography.fontSizeSm, color: theme.colors.textSecondary }}>
          Explore everything you have access to by catalog, schema, owner, or type.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.colors.textSecondary, flexShrink: 0 }}>
        <span style={{ fontSize: theme.typography.fontSizeSm, fontWeight: theme.typography.typographyBoldFontWeight }}>
          1,247 assets
        </span>
        <Ic icon={ChevronRightIcon} size={14} />
      </div>
    </div>
  )
}

function AssetCard({ asset, heuristic, theme, onPreview }: { asset: Asset; heuristic: Heuristic; theme: any; onPreview: (a: Asset) => void }) {
  const [hovered, setHovered] = useState(false)
  const cfg = ASSET_TYPE_CONFIG[asset.type]
  const Icon = cfg.icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 16, borderRadius: 10,
        border: `1px solid ${hovered ? theme.colors.borderDecorative : theme.colors.border}`,
        backgroundColor: theme.colors.backgroundPrimary,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex', flexDirection: 'column', gap: 10,
        minHeight: 220,
        boxShadow: hovered ? '0 4px 14px rgba(0, 0, 0, 0.06)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            width: 24, height: 24, borderRadius: 6,
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textSecondary,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon {...({} as any)} style={{ fontSize: 12 }} />
          </span>
          <span style={{
            fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
            textTransform: 'uppercase', letterSpacing: '0.03em',
            color: theme.colors.textSecondary,
          }}>
            {cfg.label}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onPreview(asset) }}
          aria-label="Preview"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 24, padding: '0 10px', borderRadius: 6,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.backgroundPrimary,
            color: theme.colors.textPrimary,
            fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
            lineHeight: 1,
            cursor: 'pointer', transition: 'all 0.15s',
            opacity: hovered ? 1 : 0,
          }}
        >
          <Ic icon={VisibleIcon} size={12} />
          <span>Preview</span>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <h3 style={{
            fontSize: theme.typography.fontSizeBase,
            fontWeight: theme.typography.typographyBoldFontWeight,
            color: theme.colors.textPrimary,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            flex: 1, minWidth: 0,
          }}>
            {asset.name}
          </h3>
          {asset.certified && (
            <CertifiedFillIcon {...({} as any)} style={{ width: 14, height: 14, color: '#1B7F80', flexShrink: 0 }} />
          )}
        </div>
        <p style={{
          fontSize: theme.typography.fontSizeSm, lineHeight: '18px',
          color: theme.colors.textSecondary,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>
          {asset.description}
        </p>
      </div>

      <HeuristicDetail asset={asset} heuristic={heuristic} theme={theme} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, paddingTop: 8, borderTop: `1px solid ${theme.colors.border}`,
        fontSize: theme.typography.fontSizeSm, color: theme.colors.textSecondary,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
          <AvatarCircle name={asset.owner} size={18} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {asset.owner}
          </span>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          flexShrink: 0, color: theme.colors.textSecondary,
        }}>
          <Ic icon={LightningIcon} size={11} />
          {asset.meta}
        </span>
      </div>
    </div>
  )
}

function HeuristicDetail({ asset, heuristic, theme }: { asset: Asset; heuristic: Heuristic; theme: any }) {
  if (heuristic.key === 'trending' && asset.sparkline) {
    return <Sparkline data={asset.sparkline} color="#2272B4" theme={theme} />
  }
  if (heuristic.key === 'team' && asset.teammates) {
    return <AvatarStack initials={asset.teammates} color={heuristic.color} theme={theme} />
  }
  if (heuristic.key === 'certified' && asset.certifiedBy) {
    return <CertPill tier={asset.meta} by={asset.certifiedBy} on={asset.certifiedOn} color={heuristic.color} theme={theme} />
  }
  if (heuristic.key === 'suggested' && asset.reason) {
    return <ReasonPill reason={asset.reason} color={theme.colors.textPrimary} theme={theme} />
  }
  return null
}

function Sparkline({ data, color, theme }: { data: number[]; color: string; theme: any }) {
  const width = 180
  const height = 28
  const pad = 2
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const gradId = `g-${color.replace('#', '')}`

  const stepX = (width - pad * 2) / (data.length - 1)
  const pts = data.map((v, i) => {
    const x = pad + i * stepX
    const y = height - pad - ((v - min) / range) * (height - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const linePath = `M ${pts.join(' L ')}`
  const fillPath = `${linePath} L ${pad + (data.length - 1) * stepX},${height} L ${pad},${height} Z`
  const lastX = pad + (data.length - 1) * stepX
  const lastY = height - pad - ((data[data.length - 1] - min) / range) * (height - pad * 2)

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r={3} fill={color} />
      <circle cx={lastX} cy={lastY} r={6} fill={color} opacity={0.18} />
    </svg>
  )
}

function AvatarStack({ initials, color, theme }: { initials: string[]; color: string; theme: any }) {
  const size = 20
  const maxVisible = 4
  const large = false
  const visible = initials.slice(0, maxVisible)
  const extra = initials.length - visible.length
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{
        fontSize: 10, color: theme.colors.textSecondary,
        fontWeight: theme.typography.typographyBoldFontWeight,
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        Opened by
      </span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {visible.map((i, idx) => (
          <div key={idx} style={{
            width: size, height: size, borderRadius: 999,
            backgroundColor: ['#434a93', '#2272B4', '#1B7F80', '#C83A7F', '#F48842', '#7849B8'][idx % 6],
            color: '#fff', fontSize: large ? 10 : 9,
            fontWeight: theme.typography.typographyBoldFontWeight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${theme.colors.backgroundPrimary}`,
            marginLeft: idx === 0 ? 0 : -6,
          }}>
            {i}
          </div>
        ))}
        {extra > 0 && (
          <div style={{
            width: size, height: size, borderRadius: 999,
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textSecondary, fontSize: large ? 10 : 9,
            fontWeight: theme.typography.typographyBoldFontWeight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${theme.colors.backgroundPrimary}`,
            marginLeft: -6,
          }}>
            +{extra}
          </div>
        )}
      </div>
    </div>
  )
}

function CertPill({ tier, by, on, color, theme }: { tier: string; by: string; on?: string; color: string; theme: any }) {
  const isGold = tier === 'Gold'
  const large = false
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: large ? 30 : 24,
        padding: '0 12px', borderRadius: 999,
        backgroundColor: isGold ? '#FDE9BF' : '#E8E8EC',
        color: isGold ? '#8A5800' : '#4A4A52',
        fontSize: large ? 12 : 11, fontWeight: theme.typography.typographyBoldFontWeight,
      }}>
        <Ic icon={ShieldCheckIcon} size={large ? 14 : 12} />
        {tier} certified
      </div>
      {large && (
        <span style={{ fontSize: 12, color: theme.colors.textSecondary }}>
          by <strong style={{ color: theme.colors.textPrimary }}>{by}</strong> · {on}
        </span>
      )}
    </div>
  )
}

function ReasonPill({ reason, color, theme }: { reason: string; color: string; theme: any }) {
  const cleaned = reason.replace(/^because\s+/i, '')
  const display = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  return (
    <div style={{
      paddingLeft: 10,
      borderLeft: `2px solid ${theme.colors.borderDecorative}`,
      fontSize: 12, lineHeight: '16px',
      color: theme.colors.textSecondary,
    }}>
      {display}
    </div>
  )
}

function AvatarCircle({ name, size }: { name: string; size: number }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  const palette = ['#434a93', '#2272B4', '#1B7F80', '#C83A7F', '#F48842', '#7849B8']
  const color = palette[name.charCodeAt(0) % palette.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      backgroundColor: color, color: '#fff',
      fontSize: size > 22 ? 10 : 9,
      fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function CollectionsRow({ theme }: { theme: any }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{
            fontSize: 20, lineHeight: '24px',
            fontWeight: theme.typography.typographyBoldFontWeight,
            color: theme.colors.textPrimary, marginBottom: 2,
          }}>
            Curated collections
          </h2>
          <p style={{ fontSize: theme.typography.fontSizeBase, color: theme.colors.textSecondary }}>
            Hand-picked bundles to jump into a workflow fast
          </p>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 14,
      }}>
        {COLLECTIONS.map((c, idx) => <CollectionCard key={idx} collection={c} theme={theme} />)}
      </div>
    </section>
  )
}

function CollectionCard({ collection, theme }: { collection: typeof COLLECTIONS[0]; theme: any }) {
  const [hovered, setHovered] = useState(false)
  const Icon = collection.icon
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.backgroundPrimary,
        transition: 'all 0.18s ease',
        boxShadow: hovered ? '0 8px 20px rgba(0,0,0,0.08)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex', flexDirection: 'column', minHeight: 180,
      }}
    >
      {/* Gradient cover */}
      <div style={{
        height: 78, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${collection.colors[0]} 0%, ${collection.colors[1]} 100%)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 85% 20%, rgba(255,255,255,0.25), transparent 50%)',
        }} />
        <div style={{
          position: 'absolute', right: -6, bottom: -10,
          color: '#fff', opacity: 0.25,
        }}>
          <Icon {...({} as any)} style={{ width: 72, height: 72 }} />
        </div>
        <div style={{
          position: 'absolute', top: 10, left: 12,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          height: 20, padding: '0 8px', borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.22)', color: '#fff',
          fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
          backdropFilter: 'blur(4px)',
        }}>
          {collection.count} assets
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <h3 style={{
          fontSize: theme.typography.fontSizeBase,
          fontWeight: theme.typography.typographyBoldFontWeight,
          color: theme.colors.textPrimary,
          lineHeight: '18px',
        }}>
          {collection.title}
        </h3>
        <p style={{
          fontSize: theme.typography.fontSizeSm, lineHeight: '17px',
          color: theme.colors.textSecondary,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {collection.description}
        </p>
      </div>
    </div>
  )
}

// --- Preview panel ---

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
    { name: 'user_id',      type: 'bigint',    desc: 'FK → dim_users' },
    { name: 'score_date',   type: 'date' },
    { name: 'churn_prob',   type: 'double',    desc: '0.0 - 1.0' },
    { name: 'top_features', type: 'array<string>' },
    { name: 'model_version', type: 'string' },
  ],
  'browse_funnel_daily': [
    { name: 'date',         type: 'date' },
    { name: 'surface',      type: 'string' },
    { name: 'impressions',  type: 'bigint' },
    { name: 'clicks',       type: 'bigint' },
    { name: 'engagements',  type: 'bigint' },
    { name: 'ctr',          type: 'double' },
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

function getTableSchema(asset: Asset) {
  return TABLE_SCHEMAS[asset.name] ?? GENERIC_TABLE_SCHEMA
}

function getSql(asset: Asset) {
  return SAMPLE_SQL[asset.name] ?? GENERIC_SQL
}

function PreviewPanel({ asset, onClose, theme }: { asset: Asset | null; onClose: () => void; theme: any }) {
  const open = !!asset
  return (
    <>
      {/* Backdrop */}
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
      {/* Panel */}
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

function PreviewContent({ asset, onClose, theme }: { asset: Asset; onClose: () => void; theme: any }) {
  const cfg = ASSET_TYPE_CONFIG[asset.type]
  return (
    <>
      {/* Header */}
      <div style={{
        padding: '18px 20px 18px',
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6,
          }}>
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
          <CloseIcon {...({} as any)} style={{ width: 13, height: 13 }} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 24px' }}>
        {asset.type === 'table'     && <TablePreview asset={asset} theme={theme} />}
        {asset.type === 'dashboard' && <DashboardPreview asset={asset} theme={theme} />}
        {asset.type === 'notebook'  && <NotebookPreview asset={asset} theme={theme} />}
        {asset.type === 'query'     && <QueryPreview asset={asset} theme={theme} />}
        {asset.type === 'model'     && <ModelPreview asset={asset} theme={theme} />}
        {asset.type === 'pipeline'  && <PipelinePreview asset={asset} theme={theme} />}
        {asset.type === 'genie'     && <GeniePreview asset={asset} theme={theme} />}
      </div>

      {/* Footer actions */}
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

function PanelIconButton({ icon: Icon, label, theme }: { icon: ComponentType<any>; label: string; theme: any }) {
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
      <Icon {...({} as any)} style={{ width: 13, height: 13 }} />
    </button>
  )
}

function OwnerRow({ asset, theme }: { asset: Asset; theme: any }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px',
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
    }}>
      <AvatarCircle name={asset.owner} size={28} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: theme.typography.fontSizeBase,
          fontWeight: theme.typography.typographyBoldFontWeight,
          color: theme.colors.textPrimary,
        }}>
          {asset.owner}
        </div>
        <div style={{ fontSize: 11, color: theme.colors.textSecondary }}>
          Owner
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, theme, action }: { title: string; theme: any; action?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 10,
    }}>
      <h3 style={{
        fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
        textTransform: 'uppercase', letterSpacing: '0.04em',
        color: theme.colors.textSecondary,
      }}>
        {title}
      </h3>
      {action}
    </div>
  )
}

function MetaRow({ items, theme }: { items: { label: string; value: string; icon?: ComponentType<any>; color?: string }[]; theme: any }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 8, marginBottom: 18,
    }}>
      {items.map((item, idx) => {
        const Icon = item.icon
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
              display: 'flex', alignItems: 'center', gap: 4,
              marginBottom: 4,
            }}>
              {Icon && <Ic icon={Icon} size={11} />}
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

function TablePreview({ asset, theme }: { asset: Asset; theme: any }) {
  const columns = getTableSchema(asset)
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Rows',      value: '847K',           icon: TableIcon },
        { label: 'Size',      value: '2.1 GB' },
        { label: 'Freshness', value: '2 hours ago',    icon: ClockIcon, color: '#0E7C3A' },
        { label: 'Refresh',   value: 'Daily · 06:00 UTC', icon: CalendarIcon },
      ]} />

      <SectionHeader title="Lineage" theme={theme} />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 18,
      }}>
        <LineageChip label="Upstream" count={3} color="#2272B4" theme={theme} />
        <LineageChip label="Downstream" count={12} color="#7849B8" theme={theme} />
      </div>

      <SectionHeader title={`Schema · ${columns.length} columns`} theme={theme} />
      <div style={{
        borderRadius: 8, border: `1px solid ${theme.colors.border}`, overflow: 'hidden',
      }}>
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

function DashboardPreview({ asset, theme }: { asset: Asset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Views · 7d',  value: '147',           icon: VisibleIcon, color: '#E8511D' },
        { label: 'Last update', value: '6 hours ago',   icon: ClockIcon },
        { label: 'Viz count',   value: '12 charts',     icon: DashboardIcon },
        { label: 'Refresh',     value: 'Hourly',        icon: CalendarIcon },
      ]} />
      <SectionHeader title="Data sources" theme={theme} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {['fct_orders_daily', 'dim_users', 'dim_products', 'fct_sessions'].map((t) => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
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
              <polyline
                points="0,11 10,8 20,10 30,5 40,7 50,3 60,4"
                fill="none" stroke="#7849B8" strokeWidth="1.5" strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>
    </>
  )
}

function NotebookPreview({ asset, theme }: { asset: Asset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Language', value: 'Python',            icon: NotebookIcon },
        { label: 'Cells',    value: '24 cells' },
        { label: 'Last run', value: '4 hours ago',       icon: ClockIcon, color: '#0E7C3A' },
        { label: 'Runtime',  value: 'DBR 14.3 ML' },
      ]} />
      <SectionHeader title="Cells" theme={theme} />
      <div style={{
        borderRadius: 8, border: `1px solid ${theme.colors.border}`, overflow: 'hidden',
      }}>
        {[
          { kind: 'markdown', preview: '# Churn Model Training' },
          { kind: 'python',   preview: 'from databricks.feature_store import FeatureStoreClient' },
          { kind: 'python',   preview: 'fs = FeatureStoreClient()' },
          { kind: 'python',   preview: 'training_df = fs.create_training_set(...)' },
          { kind: 'markdown', preview: '## Train XGBoost model' },
          { kind: 'python',   preview: 'import xgboost as xgb; model = xgb.train(...)' },
        ].map((cell, idx) => (
          <div key={idx} style={{
            display: 'flex', gap: 10, padding: '8px 10px',
            borderBottom: idx === 5 ? 'none' : `1px solid ${theme.colors.border}`,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 11, color: cell.kind === 'markdown' ? '#6B36A1' : theme.colors.textPrimary,
          }}>
            <span style={{
              fontSize: 9, color: theme.colors.textSecondary, width: 20, flexShrink: 0, paddingTop: 2,
            }}>
              {idx + 1}
            </span>
            <span style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
            }}>
              {cell.preview}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 8 }}>
        Showing 6 of 24 cells
      </div>
    </>
  )
}

function QueryPreview({ asset, theme }: { asset: Asset; theme: any }) {
  const sql = getSql(asset)
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Last run',    value: '30 min ago',     icon: ClockIcon, color: '#0E7C3A' },
        { label: 'Avg runtime', value: '1.8s',           icon: LightningIcon },
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

function ModelPreview({ asset, theme }: { asset: Asset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Version', value: 'v4.1',           icon: ModelsIcon },
        { label: 'Stage',   value: 'Production',     icon: CheckCircleFillIcon, color: '#0E7C3A' },
        { label: 'Trained', value: 'Mar 19, 2026',   icon: CalendarIcon },
        { label: 'Endpoint', value: 'churn-v4-prod' },
      ]} />
      <SectionHeader title="Metrics" theme={theme} />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18,
      }}>
        {[
          { label: 'AUC',       value: '0.914' },
          { label: 'Precision', value: '0.882' },
          { label: 'Recall',    value: '0.826' },
        ].map((m) => (
          <div key={m.label} style={{
            padding: '10px 12px', borderRadius: 8,
            backgroundColor: '#F0E5FA', border: '1px solid #E0CFF0',
          }}>
            <div style={{ fontSize: 10, color: '#6B36A1', fontWeight: theme.typography.typographyBoldFontWeight, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {m.label}
            </div>
            <div style={{ fontSize: 18, fontWeight: theme.typography.typographyBoldFontWeight, color: '#4B2373', marginTop: 2 }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
      <SectionHeader title="Training data" theme={theme} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['churn_scores_v4', 'dim_users', 'fct_sessions'].map((t) => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
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

function PipelinePreview({ asset, theme }: { asset: Asset; theme: any }) {
  return (
    <>
      <MetaRow theme={theme} items={[
        { label: 'Last run', value: 'Success',          icon: CheckCircleFillIcon, color: '#0E7C3A' },
        { label: 'Duration', value: '4m 12s' },
        { label: 'Schedule', value: 'Daily · 06:00 UTC', icon: CalendarIcon },
        { label: 'Tasks',    value: '7 tasks',           icon: PipelineIcon },
      ]} />
      <SectionHeader title="Task graph" theme={theme} />
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18,
      }}>
        {['ingest_raw_events', 'clean_events', 'enrich_with_dim_users', 'aggregate_daily', 'write_gold_table'].map((task, idx, arr) => (
          <div key={task} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 999,
              backgroundColor: '#DFF7E7', color: '#0E7C3A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 10, fontWeight: theme.typography.typographyBoldFontWeight,
            }}>
              <Ic icon={CheckCircleFillIcon} size={12} />
            </div>
            <div style={{ flex: 1, padding: '8px 12px', borderRadius: 6, backgroundColor: theme.colors.backgroundSecondary, fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
              {task}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function GeniePreview({ asset, theme }: { asset: Asset; theme: any }) {
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
