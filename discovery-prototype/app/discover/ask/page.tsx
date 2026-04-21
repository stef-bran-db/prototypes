'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  useDesignSystemTheme,
  SparkleIcon,
  SparkleRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  NotebookIcon,
  TableIcon,
  DashboardIcon,
  QueryIcon,
  ModelsIcon,
  PipelineIcon,
  CertifiedFillIcon,
  LightningIcon,
  VisibleIcon,
  PlayIcon,
  SendIcon,
  CheckCircleIcon,
} from '@databricks/design-system'
import type { ComponentType } from 'react'
import { PreviewPanel } from '@/app/discover/_components/PreviewPanel'

// Sized icon wrapper — antd icons scale via font-size; constrain to prevent overlap with adjacent text
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

type AssetType = 'notebook' | 'table' | 'dashboard' | 'query' | 'model' | 'pipeline' | 'genie'

interface Match {
  id: string
  name: string
  description: string
  type: AssetType
  owner: string
  meta: string
  certified?: boolean
  whyMatches: string
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

// Simple keyword routing so the prototype feels responsive to queries.
// Prose uses [id] markers which render inline as asset chips, and **bold** for emphasis.
const RESPONSE_TEMPLATES: Record<string, {
  prose: string
  matches: Match[]
  tableHint?: { title: string; rows: { label: string; value: string }[] }
  followUps: string[]
}> = {
  revenue: {
    prose: "For revenue, your team has a handful of canonical sources. The board-level source of truth is [r1] — a Finance-certified dashboard tracking **MRR, ARR, net revenue, and deferred revenue**, refreshed daily at 06:00 UTC. The upstream fact table is [r2], an 847K-row gold table partitioned by `order_date` that 38 downstream dashboards read from. For the exec view on growth, teams live in [r3], which layers forecast-vs-actual on top of those metrics. And when the question turns to channel ROI, [r4] runs the multi-touch attribution model that ties revenue back to marketing spend.",
    matches: [
      { id: 'r1', name: 'Revenue Recognition',  description: 'Finance-certified revenue dashboard — MRR, ARR, net revenue',      type: 'dashboard', owner: 'Finance',             meta: 'Updated 2h ago',    certified: true,  whyMatches: '' },
      { id: 'r2', name: 'fct_orders_daily',     description: 'Gold-layer orders fact table — 847K rows',                          type: 'table',     owner: 'Data Platform',       meta: '94 queries today',  certified: true,  whyMatches: '' },
      { id: 'r3', name: 'North Star Metrics',   description: 'Exec-level business metrics with forecast vs actual',                type: 'dashboard', owner: 'Executive Team',      meta: '+212% views',       certified: true,  whyMatches: '' },
      { id: 'r4', name: 'Revenue Attribution',  description: 'Multi-touch attribution across marketing channels',                  type: 'dashboard', owner: 'Marketing Analytics', meta: '+94% views',                           whyMatches: '' },
    ],
    tableHint: {
      title: 'Revenue across the last 4 weeks',
      rows: [
        { label: 'Week of Mar 31', value: '$12.4M  (+4.2%)' },
        { label: 'Week of Mar 24', value: '$11.9M  (+2.1%)' },
        { label: 'Week of Mar 17', value: '$11.7M  (-0.3%)' },
        { label: 'Week of Mar 10', value: '$11.7M  (+3.8%)' },
      ],
    },
    followUps: [
      'Break revenue down by product line',
      'Compare this quarter vs last',
      'Who owns the Revenue Recognition dashboard?',
    ],
  },
  churn: {
    prose: "For churn, the primary scoring table is [c1] — daily-scored churn probabilities for every active user, Gold-certified and joined to `dim_users` on `user_id`. It pairs with [c2], the weekly-scored LTV model used across six production teams, so you can answer both **who&rsquo;s likely to leave** and **how much is at stake**. On the modeling side, [c3] is your own XGBoost training notebook from three days ago, and [c4] is a parameterized cohort query from Analytics that&rsquo;s commonly open next to the scores table.",
    matches: [
      { id: 'c1', name: 'churn_scores_v4',       description: 'Daily-scored churn probabilities, Gold-certified',   type: 'table',    owner: 'ML Platform', meta: '+120% queries',   certified: true, whyMatches: '' },
      { id: 'c2', name: 'Customer LTV Model',    description: 'Weekly-scored LTV predictions, production v4.1',     type: 'model',    owner: 'ML Platform', meta: 'Production v4.1',                   whyMatches: '' },
      { id: 'c3', name: 'Churn Model Training',  description: 'XGBoost training notebook — your last edit 3d ago',  type: 'notebook', owner: 'You',         meta: 'You edited 3d ago',                 whyMatches: '' },
      { id: 'c4', name: 'retention_lookback',    description: 'Parameterized retention cohort query',               type: 'query',    owner: 'Analytics',   meta: '+58% runs',                         whyMatches: '' },
    ],
    followUps: [
      'Show me churn by customer segment',
      'Which features drive the churn score?',
      'Is there a Genie space for this?',
    ],
  },
  default: {
    prose: "Here&rsquo;s what looks most relevant across your workspace. [d1] is the most-viewed dashboard across the org this week — the Exec team&rsquo;s top-line view of **MRR, ARR, and forecast-vs-actual**. Core Data owns [d2], the Gold-certified user dimension that joins to nearly every user-level question. If you&rsquo;d rather ask in plain English, [d3] is a new Genie space your team just published, connected to the browse → engage telemetry. And [d4] is your team&rsquo;s weekly KPI dashboard — twelve teammates viewed it this week.",
    matches: [
      { id: 'd1', name: 'North Star Metrics',    description: 'Exec-level business metrics dashboard',              type: 'dashboard', owner: 'Executive Team', meta: '+212% views',    certified: true, whyMatches: '' },
      { id: 'd2', name: 'dim_users',             description: 'Canonical Gold-certified user dimension',            type: 'table',     owner: 'Core Data',      meta: 'Gold certified', certified: true, whyMatches: '' },
      { id: 'd3', name: 'Browse Funnel Genie',   description: 'New Genie space over browse → engage telemetry',     type: 'genie',     owner: 'Unified Browse', meta: 'New in your team',                 whyMatches: '' },
      { id: 'd4', name: 'Unified Browse Weekly', description: 'Weekly KPI dashboard — 12 teammates viewed',         type: 'dashboard', owner: 'Stef Bran',      meta: '12 teammates',                     whyMatches: '' },
    ],
    followUps: [
      'Filter to just certified assets',
      'Show only what my team has opened',
      'What changed in the last 7 days?',
    ],
  },
}

function pickResponse(q: string) {
  const lower = q.toLowerCase()
  if (/\b(revenue|rev|mrr|arr|sales)\b/.test(lower)) return { key: 'revenue', ...RESPONSE_TEMPLATES.revenue }
  if (/\b(churn|retention|ltv|loss|cancel)\b/.test(lower)) return { key: 'churn', ...RESPONSE_TEMPLATES.churn }
  return { key: 'default', ...RESPONSE_TEMPLATES.default }
}

export default function AskPage() {
  return (
    <Suspense fallback={<div />}>
      <AskInner />
    </Suspense>
  )
}

function AskInner() {
  const router = useRouter()
  const params = useSearchParams()
  const q = params.get('q') ?? ''
  const { theme } = useDesignSystemTheme()

  const response = useMemo(() => pickResponse(q), [q])

  // streaming simulation
  const [phase, setPhase] = useState<'thinking' | 'intro' | 'matches' | 'table' | 'followups' | 'done'>('thinking')
  useEffect(() => {
    setPhase('thinking')
    const t1 = setTimeout(() => setPhase('intro'),      8800)
    const t2 = setTimeout(() => setPhase('matches'),    9500)
    const t3 = setTimeout(() => setPhase('table'),      9950)
    const t4 = setTimeout(() => setPhase('followups'), 10300)
    const t5 = setTimeout(() => setPhase('done'),      10600)
    return () => { [t1, t2, t3, t4, t5].forEach(clearTimeout) }
  }, [q])

  const [followUp, setFollowUp] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)
  const [previewMatch, setPreviewMatch] = useState<Match | null>(null)

  const submitFollowUp = () => {
    if (!followUp.trim()) return
    router.push(`/discover/ask?q=${encodeURIComponent(followUp.trim())}`)
    setFollowUp('')
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', backgroundColor: theme.colors.backgroundPrimary,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 24px',
        borderBottom: `1px solid ${theme.colors.border}`,
        flexShrink: 0,
      }}>
        <button
          onClick={() => router.push('/discover')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 28, padding: '0 10px', borderRadius: 6,
            border: 'none', backgroundColor: 'transparent',
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizeSm,
            fontWeight: theme.typography.typographyBoldFontWeight,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <Ic icon={ChevronLeftIcon} size={13} />
          Back to Discover
        </button>
      </div>

      {/* Thread */}
      <div ref={threadRef} style={{
        flex: 1, overflowY: 'auto', width: '100%',
      }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px 48px' }}>
          {/* User question */}
          <UserQuestion q={q} theme={theme} />

          {/* Assistant message (thinking trace + response) */}
          <AssistantMessage theme={theme}>
            <ThinkingSteps theme={theme} query={q} phase={phase} />

            {/* Intro */}
            {phase !== 'thinking' && (
              <FadeIn visible>
                <div style={{ marginTop: 14 }}>
                  <ProseWithChips prose={response.prose} matches={response.matches} theme={theme} />
                </div>
              </FadeIn>
            )}

              {/* Matches list */}
              {['matches', 'table', 'followups', 'done'].includes(phase) && (
                <FadeIn visible>
                  <SectionHeading theme={theme}>Matches</SectionHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {response.matches.map((m, idx) => <MatchRow key={m.id} m={m} idx={idx} theme={theme} onPreview={setPreviewMatch} />)}
                  </div>
                </FadeIn>
              )}

              {/* Table hint (for queries that warrant data) */}
              {['table', 'followups', 'done'].includes(phase) && response.tableHint && (
                <FadeIn visible>
                  <SectionHeading theme={theme}>{response.tableHint.title}</SectionHeading>
                  <DataPreviewTable rows={response.tableHint.rows} theme={theme} />
                </FadeIn>
              )}

            {/* Follow-ups */}
            {['followups', 'done'].includes(phase) && (
                <FadeIn visible>
                  <SectionHeading theme={theme}>Continue exploring</SectionHeading>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {response.followUps.map((f, idx) => (
                      <button
                        key={idx}
                        onClick={() => router.push(`/discover/ask?q=${encodeURIComponent(f)}`)}
                        style={{
                          height: 32, padding: '0 14px', borderRadius: 999,
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.backgroundPrimary,
                          color: theme.colors.textPrimary,
                          fontSize: theme.typography.fontSizeSm,
                          fontWeight: theme.typography.typographyBoldFontWeight,
                          cursor: 'pointer', transition: 'all 0.15s',
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#8C4BC9'
                          e.currentTarget.style.color = '#6B36A1'
                          e.currentTarget.style.backgroundColor = '#F0E5FA'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = theme.colors.border
                          e.currentTarget.style.color = theme.colors.textPrimary
                          e.currentTarget.style.backgroundColor = theme.colors.backgroundPrimary
                        }}
                      >
                        <Ic icon={SparkleIcon} size={12} color="#8C4BC9" />
                        {f}
                      </button>
                    ))}
                  </div>
                </FadeIn>
            )}
          </AssistantMessage>
        </div>
      </div>

      {/* Follow-up input */}
      <div style={{
        padding: '16px 24px 20px',
        borderTop: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.backgroundPrimary,
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: 820, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 6px 6px 14px',
          borderRadius: 12, height: 48,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}>
          <Ic icon={SparkleIcon} size={16} color="#FF4949" />
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
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitFollowUp() }}
            placeholder="Ask a follow-up..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: theme.typography.fontSizeBase,
              color: theme.colors.textPrimary,
            }}
          />
          <button
            onClick={submitFollowUp}
            aria-label="Send"
            style={{
              width: 36, height: 36, borderRadius: 8, border: 'none',
              backgroundColor: followUp.trim() ? '#FF4949' : theme.colors.backgroundSecondary,
              color: followUp.trim() ? '#fff' : theme.colors.textSecondary,
              cursor: followUp.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <Ic icon={SendIcon} size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseDot { 0%, 100% { transform: scale(0.7); opacity: 0.5; } 50% { transform: scale(1); opacity: 1; } }
      `}</style>

      <PreviewPanel asset={previewMatch} onClose={() => setPreviewMatch(null)} theme={theme} />
    </div>
  )
}

function UserQuestion({ q, theme }: { q: string; theme: any }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end', marginBottom: 24,
    }}>
      <div style={{
        maxWidth: 640,
        padding: '12px 16px',
        borderRadius: 14,
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.textPrimary,
        fontSize: 15, lineHeight: '22px',
      }}>
        {q}
      </div>
    </div>
  )
}

function ThinkingChip({ theme }: { theme: any }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', marginBottom: 16,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8,
        background: 'linear-gradient(135deg, #8C4BC9 0%, #FF4949 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
      }}>
        <Ic icon={SparkleIcon} size={13} />
      </div>
      <span style={{
        fontSize: theme.typography.fontSizeSm,
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.typographyBoldFontWeight,
      }}>
        Searching across your workspace
      </span>
      <span style={{ display: 'flex', gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 5, height: 5, borderRadius: 999,
            backgroundColor: '#8C4BC9',
            animation: `pulseDot 1.1s ${i * 0.12}s infinite`,
          }} />
        ))}
      </span>
    </div>
  )
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function ThinkingSteps({ theme, query, phase }: { theme: any; query: string; phase: string }) {
  // Step details adapt to the query domain so the reasoning feels grounded
  const domain = useMemo(() => {
    const l = query.toLowerCase()
    if (/\b(revenue|rev|mrr|arr|sales)\b/.test(l))       return 'revenue'
    if (/\b(churn|retention|ltv|loss|cancel)\b/.test(l)) return 'churn'
    return 'default'
  }, [query])

  const reasoning: Record<string, Array<{ label: string; detail: string }>> = {
    revenue: [
      { label: 'Understanding the intent behind your question',   detail: `Revenue & financial reporting — "${truncate(query, 80)}"` },
      { label: 'Scoping catalogs relevant to this domain',        detail: 'main, finance_gold, marketing_dw · 38 candidate assets' },
      { label: 'Mapping relationships between candidates',         detail: 'Tracing lineage: fct_orders_daily → 12 dashboards · 4 dependency clusters' },
      { label: 'Evaluating certification, freshness, and ownership', detail: '14 Gold-certified assets · Finance and Data Platform as primary owners' },
      { label: 'Weighing team usage and your personal context',    detail: 'Your team opened 3 of these this week · you have not queried any yet' },
      { label: 'Synthesizing the shortest useful answer',          detail: 'Prioritizing 4 assets that cover source-of-truth, upstream data, and analysis' },
    ],
    churn: [
      { label: 'Understanding the intent behind your question',   detail: `Churn & retention analysis — "${truncate(query, 80)}"` },
      { label: 'Scoping catalogs relevant to this domain',        detail: 'main, ml_gold, analytics · 22 candidate assets' },
      { label: 'Mapping relationships between candidates',         detail: 'Tracing lineage: churn_scores_v4 → dim_users → fct_sessions · 3 dependency clusters' },
      { label: 'Evaluating certification, freshness, and ownership', detail: '8 Gold-certified · ML Platform and Analytics as primary owners · all refreshed within 24h' },
      { label: 'Weighing team usage and your personal context',    detail: 'You edited Churn Model Training 3 days ago · your team runs retention_lookback daily' },
      { label: 'Synthesizing the shortest useful answer',          detail: 'Prioritizing 4 assets that span scoring, modeling, and cohort analysis' },
    ],
    default: [
      { label: 'Understanding the intent behind your question',   detail: `"${truncate(query, 80)}"` },
      { label: 'Scoping catalogs relevant to this domain',        detail: 'main, analytics, finance_gold, ml_gold · 47 candidate assets' },
      { label: 'Mapping relationships between candidates',         detail: 'Resolving cross-catalog joins · 5 dependency clusters' },
      { label: 'Evaluating certification, freshness, and ownership', detail: '19 Gold-certified · 12 active owners across 4 domains' },
      { label: 'Weighing team usage and your personal context',    detail: '3 matches in your recent activity · 8 in your team’s top 50' },
      { label: 'Synthesizing the shortest useful answer',          detail: 'Prioritizing assets that maximize coverage with minimum overlap' },
    ],
  }

  const steps = reasoning[domain]
  const durations = [1100, 1500, 1800, 1400, 1400, 900] // ~8.1s total, gives time to read each step

  const [completed, setCompleted] = useState<number>(-1)

  useEffect(() => {
    let elapsed = 250
    const timers: ReturnType<typeof setTimeout>[] = []
    durations.forEach((d, i) => {
      timers.push(setTimeout(() => setCompleted(i), elapsed + d))
      elapsed += d
    })
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const activeIndex = completed + 1 < steps.length ? completed + 1 : steps.length - 1
  const allDone = phase !== 'thinking'

  return (
    <div style={{ marginBottom: allDone ? 6 : 4 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: theme.typography.fontSizeSm,
        fontWeight: theme.typography.typographyBoldFontWeight,
        color: allDone ? theme.colors.textSecondary : theme.colors.textPrimary,
        marginBottom: 10,
        transition: 'color 0.2s ease',
      }}>
        {allDone ? (
          <>
            <Ic icon={CheckCircleIcon} size={12} color={theme.colors.textSecondary} />
            <span>Thought for 0.8s</span>
            <span style={{
              color: theme.colors.textSecondary, margin: '0 4px', opacity: 0.6,
            }}>·</span>
            <Ic icon={VisibleIcon} size={12} color={theme.colors.textSecondary} />
            <span>Searched 1,247 assets</span>
          </>
        ) : (
          <>
            <span>Thinking</span>
            <span style={{ display: 'inline-flex', gap: 3, marginLeft: 2 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: 4, height: 4, borderRadius: 999,
                  backgroundColor: '#8C4BC9',
                  animation: `pulseDot 1.1s ${i * 0.12}s infinite`,
                }} />
              ))}
            </span>
          </>
        )}
      </div>

      {!allDone && (
        <div style={{
          position: 'relative',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* vertical thread line — sits behind markers, covered by marker bg */}
          <div style={{
            position: 'absolute', left: 6, top: 12, bottom: 12,
            width: 1, backgroundColor: theme.colors.border,
            zIndex: 0,
          }} />

          {steps.map((step, i) => {
            const isDone = i <= completed
            const isActive = i === activeIndex && !isDone
            const isPending = i > activeIndex
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  opacity: isPending ? 0 : 1,
                  animation: isPending ? 'none' : `fadeInUp 0.28s ease backwards`,
                  transition: 'opacity 0.2s ease',
                  position: 'relative',
                }}
              >
                <span style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 13, height: 13, borderRadius: 999,
                  marginTop: 3,
                  flexShrink: 0,
                  backgroundColor: isDone ? '#1B7F80' : theme.colors.backgroundPrimary,
                  border: `2px solid ${isDone ? '#1B7F80' : isActive ? '#8C4BC9' : theme.colors.border}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isActive ? '0 0 0 4px rgba(140, 75, 201, 0.18)' : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  {isDone ? (
                    <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5.5L4 8L8.5 2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isActive ? (
                    <span style={{
                      width: 4, height: 4, borderRadius: 999,
                      backgroundColor: '#8C4BC9',
                      animation: 'pulseDot 0.9s infinite',
                    }} />
                  ) : null}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, lineHeight: '18px',
                    color: isPending ? theme.colors.textSecondary : theme.colors.textPrimary,
                    fontWeight: isActive ? theme.typography.typographyBoldFontWeight : 400,
                  }}>
                    {step.label}
                    {isActive && <span style={{ color: theme.colors.textSecondary }}> …</span>}
                  </div>
                  {(isActive || isDone) && step.detail && (
                    <div style={{
                      fontSize: 12, lineHeight: '16px',
                      color: theme.colors.textSecondary,
                      marginTop: 2,
                      fontFamily: step.detail.startsWith('"') ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined,
                    }}>
                      {step.detail}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function AssistantMessage({ theme, children }: { theme: any; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'linear-gradient(135deg, #8C4BC9 0%, #FF4949 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', flexShrink: 0, marginTop: 2,
      }}>
        <Ic icon={SparkleIcon} size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}

function FadeIn({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      animation: visible ? 'fadeInUp 0.4s ease forwards' : 'none',
    }}>
      {children}
    </div>
  )
}

function SectionHeading({ theme, children }: { theme: any; children: React.ReactNode }) {
  return (
    <h3 style={{
      fontSize: 11, lineHeight: '14px',
      fontWeight: theme.typography.typographyBoldFontWeight,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      marginTop: 22, marginBottom: 10,
    }}>
      {children}
    </h3>
  )
}

function MetaPill({ icon: Icon, text, color, theme }: { icon: ComponentType<any>; text: string; color: string; theme: any }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 22, padding: '0 8px', borderRadius: 999,
      backgroundColor: theme.colors.backgroundSecondary,
      color: color,
      fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
    }}>
      <Ic icon={Icon} size={11} />
      {text}
    </span>
  )
}

function ProseWithChips({ prose, matches, theme }: { prose: string; matches: Match[]; theme: any }) {
  const byId: Record<string, Match> = {}
  matches.forEach((m) => { byId[m.id] = m })

  // First split on [id] to pull out asset chip markers, then render remaining text with ** and `code`
  const segments = prose.split(/\[([^\]]+)\]/g)

  return (
    <p style={{
      fontSize: 15, lineHeight: '26px',
      color: theme.colors.textPrimary,
      marginBottom: 0,
    }}>
      {segments.map((segment, i) => {
        if (i % 2 === 1) {
          const match = byId[segment]
          if (!match) return `[${segment}]`
          return <AssetChip key={i} match={match} theme={theme} />
        }
        return <TextSegment key={i} text={segment} theme={theme} />
      })}
    </p>
  )
}

function TextSegment({ text, theme }: { text: string; theme: any }) {
  // Handle **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: part.slice(2, -2) }} />
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={idx} style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 13,
              padding: '1px 5px',
              borderRadius: 4,
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.textPrimary,
            }}>
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={idx} dangerouslySetInnerHTML={{ __html: part }} />
      })}
    </>
  )
}

function AssetChip({ match, theme }: { match: Match; theme: any }) {
  const [hovered, setHovered] = useState(false)
  const cfg = TYPE_CFG[match.type]
  const Icon = cfg.icon
  return (
    <a
      href={`#match-${match.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.preventDefault()
        const el = document.getElementById(`match-${match.id}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.style.transition = 'box-shadow 0.2s ease'
          el.style.boxShadow = `0 0 0 3px ${theme.colors.borderDecorative}`
          setTimeout(() => { el.style.boxShadow = '' }, 900)
        }
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '1px 7px 1px 5px', borderRadius: 5,
        margin: '0 1px',
        backgroundColor: hovered ? theme.colors.backgroundSecondary : 'transparent',
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.typographyBoldFontWeight,
        textDecoration: 'none',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        verticalAlign: 'baseline',
        fontSize: 14,
        lineHeight: '20px',
      }}
    >
      <Ic icon={Icon} size={11} color={theme.colors.textSecondary} />
      {match.name}
    </a>
  )
}

function MatchRow({ m, idx, theme, onPreview }: { m: Match; idx: number; theme: any; onPreview: (m: Match) => void }) {
  const [hovered, setHovered] = useState(false)
  const cfg = TYPE_CFG[m.type]
  const Icon = cfg.icon
  return (
    <div
      id={`match-${m.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        borderRadius: 8,
        border: `1px solid ${hovered ? theme.colors.borderDecorative : theme.colors.border}`,
        backgroundColor: hovered ? theme.colors.backgroundSecondary : theme.colors.backgroundPrimary,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        animation: `fadeInUp 0.3s ${idx * 0.04}s ease backwards`,
      }}
    >
      <span style={{
        width: 26, height: 26, borderRadius: 7,
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.textSecondary,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon {...({} as any)} style={{ fontSize: 13 }} />
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontWeight: theme.typography.typographyBoldFontWeight,
            color: theme.colors.textPrimary,
            fontSize: theme.typography.fontSizeBase,
          }}>
            {m.name}
          </span>
          {m.certified && <Ic icon={CertifiedFillIcon} size={12} color="#1B7F80" />}
          <span style={{
            fontSize: 10, fontWeight: theme.typography.typographyBoldFontWeight,
            textTransform: 'uppercase', letterSpacing: '0.04em',
            color: theme.colors.textSecondary,
            marginLeft: 2,
          }}>
            {cfg.label}
          </span>
        </div>
        <div style={{
          fontSize: 12, lineHeight: '16px',
          color: theme.colors.textSecondary,
          marginTop: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {m.description}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPreview(m) }}
        aria-label="Preview"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 10px', borderRadius: 6,
          border: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundPrimary,
          color: theme.colors.textPrimary,
          fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
          lineHeight: 1,
          cursor: 'pointer', transition: 'all 0.15s',
          opacity: hovered ? 1 : 0,
          flexShrink: 0,
        }}
      >
        <Ic icon={VisibleIcon} size={12} />
        <span>Preview</span>
      </button>

      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', gap: 2,
        fontSize: 11, color: theme.colors.textSecondary,
        flexShrink: 0,
      }}>
        <span style={{ color: theme.colors.textPrimary, fontWeight: theme.typography.typographyBoldFontWeight }}>
          {m.owner}
        </span>
        <span style={{ opacity: 0.85 }}>{m.meta}</span>
      </div>
    </div>
  )
}

function MatchCard_unused({ m, idx, theme }: { m: Match; idx: number; theme: any }) {
  const [hovered, setHovered] = useState(false)
  const cfg = TYPE_CFG[m.type]
  const Icon = cfg.icon
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 14, borderRadius: 10,
        border: `1px solid ${hovered ? cfg.color : theme.colors.border}`,
        backgroundColor: theme.colors.backgroundPrimary,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: hovered ? `0 4px 14px ${cfg.color}22` : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
        animation: `fadeInUp 0.3s ${idx * 0.05}s ease backwards`,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 22, height: 22, borderRadius: 6,
          backgroundColor: `${cfg.color}14`, color: cfg.color,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon {...({} as any)} style={{ fontSize: 11 }} />
        </span>
        <span style={{
          fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
          textTransform: 'uppercase', letterSpacing: '0.03em',
          color: theme.colors.textSecondary, flex: 1,
        }}>
          {cfg.label}
        </span>
        {m.certified && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: '#1B7F80', fontSize: 11, fontWeight: theme.typography.typographyBoldFontWeight,
          }}>
            <span style={{ width: 12, height: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CertifiedFillIcon {...({} as any)} style={{ fontSize: 12 }} />
            </span>
            Certified
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{
        fontSize: 15,
        fontWeight: theme.typography.typographyBoldFontWeight,
        color: theme.colors.textPrimary,
        lineHeight: '20px',
      }}>
        {m.name}
      </div>

      {/* Explanation — describes the asset and why it matches */}
      <p style={{
        paddingLeft: 14,
        borderLeft: `3px solid ${cfg.color}`,
        fontSize: 14, lineHeight: '22px',
        color: theme.colors.textPrimary,
      }}>
        {m.whyMatches}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 6, paddingTop: 6,
        borderTop: `1px solid ${theme.colors.border}`,
        fontSize: theme.typography.fontSizeSm, color: theme.colors.textSecondary,
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {m.owner}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ width: 11, height: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LightningIcon {...({} as any)} style={{ fontSize: 11 }} />
          </span>
          {m.meta}
        </span>
      </div>
    </div>
  )
}

function DataPreviewTable({ rows, theme }: { rows: { label: string; value: string }[]; theme: any }) {
  return (
    <div style={{
      borderRadius: 10, border: `1px solid ${theme.colors.border}`,
      overflow: 'hidden', backgroundColor: theme.colors.backgroundPrimary,
    }}>
      {rows.map((r, idx) => (
        <div key={r.label} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px',
          borderBottom: idx === rows.length - 1 ? 'none' : `1px solid ${theme.colors.border}`,
          fontSize: theme.typography.fontSizeBase,
        }}>
          <span style={{ color: theme.colors.textSecondary }}>{r.label}</span>
          <span style={{
            color: theme.colors.textPrimary,
            fontWeight: theme.typography.typographyBoldFontWeight,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  )
}
