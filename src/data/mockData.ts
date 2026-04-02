export type AssetType =
  | "table"
  | "view"
  | "volume"
  | "notebook"
  | "dashboard"
  | "model"
  | "folder"
  | "file"
  | "catalog"
  | "schema"
  | "directory"
  | "app"
  | "job"
  | "query"
  | "alert";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  path: string;
  reason?: string;
  lastAccessed?: string;
  popularity?: number;
}

export interface HierarchyNode {
  id: string;
  name: string;
  type: AssetType;
  children?: HierarchyNode[];
  selectable?: boolean;
}

const tableNames = [
  "revenue_daily", "orders_fact", "customer_dim", "marketing_spend", "user_sessions",
  "product_catalog", "clickstream_events", "inventory_snapshot", "campaign_performance",
  "support_tickets", "user_attributes", "ad_impressions", "payment_transactions",
  "shipping_events", "employee_directory", "error_logs", "feature_flags",
  "subscription_events", "conversion_funnel", "warehouse_costs", "session_events",
  "page_views", "cart_abandonment", "refund_requests", "vendor_payments",
  "login_attempts", "api_requests", "job_runs", "cluster_usage", "model_predictions",
  "experiment_results", "alert_history", "notification_log", "audit_trail",
  "file_access_log", "query_history", "dashboard_views", "team_activity",
  "workspace_usage", "billing_records", "license_allocations", "data_lineage",
  "schema_changes", "pipeline_runs", "dbt_models", "source_freshness",
  "test_results", "deployment_log", "incident_timeline", "sla_metrics",
];
const schemas = ["analytics.finance", "analytics.product", "analytics.marketing", "warehouse.sales", "warehouse.inventory", "warehouse.payments", "warehouse.logistics", "operations.support", "operations.engineering", "operations.hr", "ml_platform.features", "ml_platform.training", "external.vendor_data"];
const reasons = [
  "Queried 12 times this week", "Queried by 8 teammates", "Used in 3 of your dashboards",
  "Frequently joined with orders_fact", "Queried 5 times this week", "Popular in your workspace",
  "Queried 3 times this week", "Queried yesterday", "Used in 2 of your dashboards",
  "Queried by 4 teammates", "Recently created", "Queried 2 times this week",
  "Queried by 6 teammates", "Used in 1 of your dashboards", "Queried last week",
  "Popular among similar users", "Frequently queried", "Referenced in 2 dashboards",
];

function generateAssets(type: AssetType, names: string[], count: number): Asset[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `gen-${type}-${i}`,
    name: names[i % names.length] + (i >= names.length ? `_${Math.floor(i / names.length) + 1}` : ""),
    type,
    path: schemas[i % schemas.length],
    reason: reasons[i % reasons.length],
    popularity: Math.max(10, 95 - i * 1.5),
  }));
}

const viewNames = [
  "revenue_summary_v", "active_users_v", "order_summary_v", "daily_revenue_v",
  "customer_360_v", "campaign_roi_v", "product_usage_v", "inventory_status_v",
  "support_metrics_v", "churn_risk_v", "monthly_arr_v", "pipeline_health_v",
  "cost_per_query_v", "team_productivity_v", "data_quality_v", "feature_coverage_v",
  "experiment_summary_v", "alert_frequency_v", "onboarding_funnel_v", "retention_cohort_v",
  "ltv_estimate_v", "nps_trend_v", "incident_rate_v", "deployment_frequency_v",
  "error_budget_v", "sla_compliance_v", "utilization_v", "forecast_accuracy_v",
];

// UC assets for Dashboards "Add Data" flow
export const ucForYouAssets: Asset[] = [
  { id: "1", name: "revenue_daily", type: "table", path: "analytics.finance", reason: "Queried 12 times this week", popularity: 95 },
  { id: "2", name: "user_sessions", type: "table", path: "analytics.product", reason: "Queried by 8 teammates", popularity: 88 },
  { id: "3", name: "orders_fact", type: "table", path: "warehouse.sales", reason: "Used in 3 of your dashboards", popularity: 82 },
  { id: "4", name: "customer_dim", type: "table", path: "warehouse.sales", reason: "Frequently joined with orders_fact", popularity: 78 },
  { id: "5", name: "marketing_spend", type: "table", path: "analytics.marketing", reason: "Queried 5 times this week", popularity: 65 },
  { id: "6", name: "product_catalog", type: "table", path: "warehouse.inventory", reason: "Popular in your workspace", popularity: 72 },
  { id: "fy7", name: "clickstream_events", type: "table", path: "analytics.product", reason: "Queried 3 times this week", popularity: 60 },
  { id: "fy8", name: "subscription_events", type: "table", path: "analytics.finance", reason: "Queried 4 times this week", popularity: 55 },
  { id: "fy9", name: "active_users_v", type: "view", path: "analytics.product", reason: "Used in 2 of your dashboards", popularity: 70 },
  { id: "fy10", name: "revenue_summary_v", type: "view", path: "analytics.finance", reason: "Used in 1 of your dashboards", popularity: 68 },
];

export const ucTablesAssets: Asset[] = generateAssets("table", tableNames, 50);

export const ucViewsAssets: Asset[] = generateAssets("view", viewNames, 28);

export const ucHierarchy: HierarchyNode[] = [
  {
    id: "c1", name: "analytics", type: "catalog", children: [
      {
        id: "s1", name: "finance", type: "schema", children: [
          { id: "t1", name: "revenue_daily", type: "table", selectable: true },
          { id: "t2", name: "expenses_monthly", type: "table", selectable: true },
          { id: "t3", name: "budget_forecast", type: "table", selectable: true },
          { id: "t3b", name: "subscription_events", type: "table", selectable: true },
          { id: "t3c", name: "warehouse_costs", type: "table", selectable: true },
        ]
      },
      {
        id: "s2", name: "product", type: "schema", children: [
          { id: "t4", name: "user_sessions", type: "table", selectable: true },
          { id: "t5", name: "clickstream_events", type: "table", selectable: true },
          { id: "t6", name: "feature_usage", type: "table", selectable: true },
          { id: "t6b", name: "user_attributes", type: "table", selectable: true },
          { id: "t6c", name: "conversion_funnel", type: "table", selectable: true },
        ]
      },
      {
        id: "s3", name: "marketing", type: "schema", children: [
          { id: "t7", name: "marketing_spend", type: "table", selectable: true },
          { id: "t8", name: "campaign_performance", type: "table", selectable: true },
          { id: "t8b", name: "ad_impressions", type: "table", selectable: true },
        ]
      },
    ]
  },
  {
    id: "c2", name: "warehouse", type: "catalog", children: [
      {
        id: "s4", name: "sales", type: "schema", children: [
          { id: "t9", name: "orders_fact", type: "table", selectable: true },
          { id: "t10", name: "customer_dim", type: "table", selectable: true },
          { id: "t11", name: "returns_fact", type: "table", selectable: true },
        ]
      },
      {
        id: "s5", name: "inventory", type: "schema", children: [
          { id: "t12", name: "product_catalog", type: "table", selectable: true },
          { id: "t13", name: "inventory_snapshot", type: "table", selectable: true },
        ]
      },
      {
        id: "s5b", name: "payments", type: "schema", children: [
          { id: "t13b", name: "payment_transactions", type: "table", selectable: true },
          { id: "t13c", name: "refunds", type: "table", selectable: true },
        ]
      },
      {
        id: "s5c", name: "logistics", type: "schema", children: [
          { id: "t13d", name: "shipping_events", type: "table", selectable: true },
          { id: "t13e", name: "delivery_tracking", type: "table", selectable: true },
        ]
      },
    ]
  },
  {
    id: "c3", name: "operations", type: "catalog", children: [
      {
        id: "s6", name: "support", type: "schema", children: [
          { id: "t14", name: "support_tickets", type: "table", selectable: true },
          { id: "t15", name: "agent_performance", type: "table", selectable: true },
        ]
      },
      {
        id: "s6b", name: "engineering", type: "schema", children: [
          { id: "t15b", name: "error_logs", type: "table", selectable: true },
          { id: "t15c", name: "feature_flags", type: "table", selectable: true },
          { id: "t15d", name: "build_metrics", type: "table", selectable: true },
        ]
      },
      {
        id: "s6c", name: "hr", type: "schema", children: [
          { id: "t15e", name: "employee_directory", type: "table", selectable: true },
          { id: "t15f", name: "org_chart", type: "table", selectable: true },
        ]
      },
    ]
  },
  {
    id: "c4", name: "ml_platform", type: "catalog", children: [
      {
        id: "s7", name: "features", type: "schema", children: [
          { id: "t16", name: "user_embeddings", type: "table", selectable: true },
          { id: "t17", name: "product_embeddings", type: "table", selectable: true },
        ]
      },
      {
        id: "s8", name: "training", type: "schema", children: [
          { id: "t18", name: "experiment_runs", type: "table", selectable: true },
          { id: "t19", name: "model_metrics", type: "table", selectable: true },
        ]
      },
    ]
  },
  {
    id: "c5", name: "external", type: "catalog", children: [
      {
        id: "s9", name: "vendor_data", type: "schema", children: [
          { id: "t20", name: "market_prices", type: "table", selectable: true },
          { id: "t21", name: "competitor_analysis", type: "table", selectable: true },
        ]
      },
    ]
  },
];

// Workspace assets for Editor "Open Existing" flow
export const wsForYouAssets: Asset[] = [
  { id: "w1", name: "Revenue Analysis.py", type: "notebook", path: "/Users/stef.bran/Projects", reason: "Opened 2 hours ago" },
  { id: "w2", name: "ETL Pipeline.py", type: "notebook", path: "/Users/stef.bran/Projects", reason: "Opened yesterday" },
  { id: "w3", name: "Data Quality Checks.sql", type: "notebook", path: "/Repos/analytics", reason: "Opened 3 days ago" },
  { id: "w4", name: "Model Training.py", type: "notebook", path: "/Users/stef.bran/ML", reason: "Favorited" },
  { id: "w5", name: "Dashboard Queries.sql", type: "notebook", path: "/Shared/Team", reason: "Favorited" },
];

export const wsHierarchy: HierarchyNode[] = [
  {
    id: "wh1", name: "Users", type: "folder", children: [
      {
        id: "wh2", name: "stef.bran", type: "folder", children: [
          {
            id: "wh3", name: "Projects", type: "folder", children: [
              { id: "wh4", name: "Revenue Analysis.py", type: "notebook", selectable: true },
              { id: "wh5", name: "ETL Pipeline.py", type: "notebook", selectable: true },
              { id: "wh6", name: "Cleanup Script.py", type: "notebook", selectable: true },
            ]
          },
          {
            id: "wh7", name: "ML", type: "folder", children: [
              { id: "wh8", name: "Model Training.py", type: "notebook", selectable: true },
              { id: "wh9", name: "Feature Engineering.py", type: "notebook", selectable: true },
            ]
          },
        ]
      },
    ]
  },
  {
    id: "wh10", name: "Repos", type: "folder", children: [
      {
        id: "wh11", name: "analytics", type: "folder", children: [
          { id: "wh12", name: "Data Quality Checks.sql", type: "notebook", selectable: true },
          { id: "wh13", name: "Metrics Pipeline.py", type: "notebook", selectable: true },
        ]
      },
    ]
  },
  {
    id: "wh14", name: "Shared", type: "folder", children: [
      {
        id: "wh15", name: "Team", type: "folder", children: [
          { id: "wh16", name: "Dashboard Queries.sql", type: "notebook", selectable: true },
          { id: "wh17", name: "Onboarding.py", type: "notebook", selectable: true },
        ]
      },
    ]
  },
];

// Workspace list view assets
export const wsNotebooksAssets: Asset[] = [
  { id: "wn1", name: "Revenue Analysis.py", type: "notebook", path: "/Users/stef.bran/Projects", reason: "Opened 2 hours ago", popularity: 95 },
  { id: "wn2", name: "ETL Pipeline.py", type: "notebook", path: "/Users/stef.bran/Projects", reason: "Opened yesterday", popularity: 90 },
  { id: "wn3", name: "Data Quality Checks.sql", type: "notebook", path: "/Repos/analytics", reason: "Opened 3 days ago", popularity: 80 },
  { id: "wn4", name: "Model Training.py", type: "notebook", path: "/Users/stef.bran/ML", reason: "Favorited", popularity: 85 },
  { id: "wn5", name: "Dashboard Queries.sql", type: "notebook", path: "/Shared/Team", reason: "Favorited", popularity: 82 },
  { id: "wn6", name: "Feature Engineering.py", type: "notebook", path: "/Users/stef.bran/ML", reason: "Opened last week", popularity: 70 },
  { id: "wn7", name: "Cleanup Script.py", type: "notebook", path: "/Users/stef.bran/Projects", reason: "Opened 2 weeks ago", popularity: 45 },
  { id: "wn8", name: "Metrics Pipeline.py", type: "notebook", path: "/Repos/analytics", reason: "Opened last week", popularity: 65 },
  { id: "wn9", name: "Onboarding.py", type: "notebook", path: "/Shared/Team", reason: "Popular in your workspace", popularity: 55 },
  { id: "wn10", name: "A/B Test Analysis.py", type: "notebook", path: "/Users/stef.bran/Projects", reason: "Opened 3 weeks ago", popularity: 40 },
  { id: "wn11", name: "Data Migration.sql", type: "notebook", path: "/Repos/infrastructure", reason: "Opened last month", popularity: 30 },
  { id: "wn12", name: "Churn Analysis.py", type: "notebook", path: "/Shared/Data Science", reason: "Popular in your workspace", popularity: 60 },
];

export const wsFilesAssets: Asset[] = [
  { id: "wf1", name: "config.yaml", type: "file", path: "/Users/stef.bran/Projects", reason: "Opened yesterday", popularity: 75 },
  { id: "wf2", name: "requirements.txt", type: "file", path: "/Repos/analytics", reason: "Opened 3 days ago", popularity: 70 },
  { id: "wf3", name: "schema.json", type: "file", path: "/Users/stef.bran/Projects", reason: "Opened last week", popularity: 55 },
  { id: "wf4", name: "README.md", type: "file", path: "/Repos/analytics", reason: "Popular in your workspace", popularity: 60 },
  { id: "wf5", name: "init_script.sh", type: "file", path: "/Shared/Team", reason: "Opened 2 weeks ago", popularity: 40 },
  { id: "wf6", name: ".env.production", type: "file", path: "/Users/stef.bran/Projects", reason: "Opened last month", popularity: 30 },
  { id: "wf7", name: "data_dictionary.csv", type: "file", path: "/Shared/Team", reason: "Popular in your workspace", popularity: 50 },
  { id: "wf8", name: "pipeline_params.json", type: "file", path: "/Repos/infrastructure", reason: "Opened 3 weeks ago", popularity: 35 },
];

export const wsQueriesAssets: Asset[] = [
  { id: "wq1", name: "Daily Revenue Summary", type: "query", path: "Saved Queries", reason: "Run 8 times this week", popularity: 92 },
  { id: "wq2", name: "Active Users Last 30d", type: "query", path: "Saved Queries", reason: "Run 5 times this week", popularity: 85 },
  { id: "wq3", name: "Order Funnel Metrics", type: "query", path: "Saved Queries", reason: "Run 3 times this week", popularity: 78 },
  { id: "wq4", name: "Support Ticket Trends", type: "query", path: "Shared Queries", reason: "Popular in your workspace", popularity: 70 },
  { id: "wq5", name: "Campaign Attribution", type: "query", path: "Saved Queries", reason: "Run yesterday", popularity: 65 },
  { id: "wq6", name: "Warehouse Cost Breakdown", type: "query", path: "Saved Queries", reason: "Run 2 times this week", popularity: 72 },
  { id: "wq7", name: "Customer Retention Cohorts", type: "query", path: "Shared Queries", reason: "Popular in your workspace", popularity: 60 },
  { id: "wq8", name: "Data Freshness Check", type: "query", path: "Saved Queries", reason: "Scheduled daily", popularity: 55 },
  { id: "wq9", name: "Product Usage by Tier", type: "query", path: "Saved Queries", reason: "Run last week", popularity: 45 },
  { id: "wq10", name: "Monthly Churn Report", type: "query", path: "Shared Queries", reason: "Run 4 times this month", popularity: 50 },
];

export const wsAlertsAssets: Asset[] = [
  { id: "wa1", name: "Revenue Drop > 10%", type: "alert", path: "My Alerts", reason: "Triggered 2 days ago", popularity: 90 },
  { id: "wa2", name: "Pipeline Failure", type: "alert", path: "My Alerts", reason: "Triggered yesterday", popularity: 88 },
  { id: "wa3", name: "Data Freshness SLA Breach", type: "alert", path: "Team Alerts", reason: "Triggered 5 days ago", popularity: 75 },
  { id: "wa4", name: "Warehouse Cost Spike", type: "alert", path: "My Alerts", reason: "Triggered last week", popularity: 65 },
  { id: "wa5", name: "Error Rate > 5%", type: "alert", path: "Team Alerts", reason: "Popular in your workspace", popularity: 70 },
  { id: "wa6", name: "New User Signup Drop", type: "alert", path: "Team Alerts", reason: "Triggered 2 weeks ago", popularity: 50 },
];

// Multi-select assets for Domain Curation flow
export const domainForYouAssets: Asset[] = [
  { id: "d1", name: "revenue_daily", type: "table", path: "analytics.finance", reason: "Queried alongside 4 other Finance tables", popularity: 95 },
  { id: "d2", name: "expenses_monthly", type: "table", path: "analytics.finance", reason: "Used in 4 Finance dashboards", popularity: 90 },
  { id: "d3", name: "budget_forecast", type: "table", path: "analytics.finance", reason: "Used in 3 Finance dashboards", popularity: 85 },
  { id: "d4", name: "Revenue Overview", type: "dashboard", path: "Dashboards/Finance", reason: "References 4 Finance tables", popularity: 88 },
  { id: "d5", name: "orders_fact", type: "table", path: "warehouse.sales", reason: "Joined with revenue_daily in 6 queries", popularity: 80 },
  { id: "d6", name: "Quarterly Report", type: "dashboard", path: "Dashboards/Finance", reason: "References 3 Finance tables", popularity: 82 },
  { id: "d7", name: "revenue_model_v2", type: "model", path: "ml.finance", reason: "Trained on revenue_daily, expenses_monthly", popularity: 75 },
  { id: "d8", name: "subscription_events", type: "table", path: "analytics.finance", reason: "Queried alongside budget_forecast", popularity: 70 },
  { id: "d9", name: "Budget Tracker", type: "dashboard", path: "Dashboards/Finance", reason: "References budget_forecast, expenses_monthly", popularity: 72 },
  { id: "d10", name: "warehouse_costs", type: "table", path: "analytics.finance", reason: "Used in 2 Finance dashboards", popularity: 65 },
  { id: "d11", name: "churn_predictor", type: "model", path: "ml.finance", reason: "Trained on subscription_events", popularity: 60 },
  { id: "d12", name: "payment_transactions", type: "table", path: "warehouse.payments", reason: "Joined with orders_fact in 3 queries", popularity: 58 },
];

export const domainTablesAssets: Asset[] = [
  { id: "d1", name: "revenue_daily", type: "table", path: "analytics.finance", reason: "Queried alongside 4 other Finance tables", popularity: 95 },
  { id: "d2", name: "expenses_monthly", type: "table", path: "analytics.finance", reason: "Used in 4 Finance dashboards", popularity: 90 },
  { id: "d3", name: "budget_forecast", type: "table", path: "analytics.finance", reason: "Used in 3 Finance dashboards", popularity: 85 },
  { id: "d5", name: "orders_fact", type: "table", path: "warehouse.sales", reason: "Joined with revenue_daily in 6 queries", popularity: 80 },
  { id: "dt1", name: "customer_dim", type: "table", path: "warehouse.sales", reason: "Referenced in 2 Finance dashboards", popularity: 75 },
  { id: "dt2", name: "marketing_spend", type: "table", path: "analytics.marketing", reason: "Queried alongside budget_forecast", popularity: 55 },
  { id: "dt3", name: "subscription_events", type: "table", path: "analytics.finance", reason: "Queried alongside budget_forecast", popularity: 70 },
  { id: "dt4", name: "payment_transactions", type: "table", path: "warehouse.payments", reason: "Joined with orders_fact in 3 queries", popularity: 58 },
  { id: "dt5", name: "warehouse_costs", type: "table", path: "analytics.finance", reason: "Used in 2 Finance dashboards", popularity: 65 },
  { id: "dt6", name: "conversion_funnel", type: "table", path: "analytics.product", reason: "Referenced in Quarterly Report", popularity: 50 },
  { id: "dt7", name: "returns_fact", type: "table", path: "warehouse.sales", reason: "Joined with orders_fact", popularity: 45 },
  { id: "dt8", name: "product_catalog", type: "table", path: "warehouse.inventory", reason: "Referenced in Revenue Overview", popularity: 42 },
  { id: "dt9", name: "ad_impressions", type: "table", path: "analytics.marketing", reason: "Queried alongside marketing_spend", popularity: 35 },
  { id: "dt10", name: "user_attributes", type: "table", path: "analytics.product", reason: "Co-queried with revenue_daily", popularity: 30 },
];

export const domainDashboardsAssets: Asset[] = [
  { id: "d4", name: "Revenue Overview", type: "dashboard", path: "Dashboards/Finance", reason: "References 4 Finance tables", popularity: 92 },
  { id: "d6", name: "Quarterly Report", type: "dashboard", path: "Dashboards/Finance", reason: "References 3 Finance tables", popularity: 88 },
  { id: "dd1", name: "Sales Performance", type: "dashboard", path: "Dashboards/Sales", reason: "References orders_fact, customer_dim", popularity: 75 },
  { id: "dd2", name: "Budget Tracker", type: "dashboard", path: "Dashboards/Finance", reason: "References budget_forecast, expenses_monthly", popularity: 80 },
  { id: "dd3", name: "Cost Analysis", type: "dashboard", path: "Dashboards/Finance", reason: "References warehouse_costs", popularity: 65 },
  { id: "dd4", name: "Marketing ROI", type: "dashboard", path: "Dashboards/Marketing", reason: "References marketing_spend", popularity: 55 },
  { id: "dd5", name: "Subscription Metrics", type: "dashboard", path: "Dashboards/Finance", reason: "References subscription_events", popularity: 60 },
  { id: "dd6", name: "Executive Summary", type: "dashboard", path: "Dashboards/Finance", reason: "References 6 Finance tables", popularity: 85 },
];

export const domainModelsAssets: Asset[] = [
  { id: "d7", name: "revenue_model_v2", type: "model", path: "ml.finance", reason: "Trained on revenue_daily, expenses_monthly", popularity: 82 },
  { id: "dm1", name: "churn_predictor", type: "model", path: "ml.finance", reason: "Trained on subscription_events", popularity: 75 },
  { id: "dm2", name: "forecast_ensemble", type: "model", path: "ml.finance", reason: "Trained on budget_forecast, revenue_daily", popularity: 70 },
  { id: "dm3", name: "anomaly_detector", type: "model", path: "ml.finance", reason: "Monitors payment_transactions", popularity: 60 },
];

// Volume selection flow
export const volumeForYouAssets: Asset[] = [
  { id: "vr1", name: "landing_zone", type: "volume", path: "analytics.raw_data", reason: "Used in this pipeline" },
  { id: "vr2", name: "exports", type: "volume", path: "analytics.raw_data", reason: "Recently accessed" },
  { id: "vr3", name: "checkpoints", type: "volume", path: "ml_artifacts.models", reason: "Recently accessed" },
  { id: "vr4", name: "2025/Q1", type: "directory", path: "analytics.raw_data.landing_zone", reason: "Last written to 2 days ago" },
  { id: "vr5", name: "reports", type: "directory", path: "analytics.raw_data.exports", reason: "Last written to 1 week ago" },
  { id: "vr6", name: "v2", type: "directory", path: "ml_artifacts.models.checkpoints", reason: "Last written to 3 days ago" },
];

export const volumeHierarchy: HierarchyNode[] = [
  {
    id: "vc1", name: "analytics", type: "catalog", children: [
      {
        id: "vs1", name: "raw_data", type: "schema", children: [
          {
            id: "vv1", name: "landing_zone", type: "volume", children: [
              {
                id: "vd1", name: "2024", type: "directory", children: [
                  { id: "vd2", name: "Q1", type: "directory", children: [] },
                  { id: "vd3", name: "Q2", type: "directory", children: [] },
                  { id: "vd4", name: "Q3", type: "directory", children: [] },
                  { id: "vd5", name: "Q4", type: "directory", children: [] },
                ]
              },
              {
                id: "vd6", name: "2025", type: "directory", children: [
                  { id: "vd7", name: "Q1", type: "directory", children: [] },
                ]
              },
            ]
          },
          {
            id: "vv2", name: "exports", type: "volume", children: [
              { id: "vd8", name: "reports", type: "directory", children: [] },
              { id: "vd9", name: "snapshots", type: "directory", children: [] },
            ]
          },
        ]
      },
    ]
  },
  {
    id: "vc2", name: "ml_artifacts", type: "catalog", children: [
      {
        id: "vs2", name: "models", type: "schema", children: [
          {
            id: "vv3", name: "checkpoints", type: "volume", children: [
              { id: "vd10", name: "v1", type: "directory", children: [] },
              { id: "vd11", name: "v2", type: "directory", children: [] },
            ]
          },
        ]
      },
    ]
  },
];

export const scenarioConfigs = {
  uc: {
    title: "Dashboards — Add Data",
    description: "UC object selection with improved For You and asset-type list views",
    selectableTypes: ["table", "view"] as AssetType[],
    multiSelect: false,
  },
  workspace: {
    title: "Editor — Open Existing",
    description: "Workspace asset selection with recents and hierarchy",
    selectableTypes: ["notebook", "file", "query", "alert"] as AssetType[],
    multiSelect: false,
  },
  multiSelect: {
    title: "Domain Curation — Add Assets",
    description: "Multi-select with domain-affinity recommendations",
    selectableTypes: ["table", "dashboard", "model", "view"] as AssetType[],
    multiSelect: true,
  },
  volume: {
    title: "Knowledge Assistant — Select Volume",
    description: "Volume/folder selection with clear select vs. navigate",
    selectableTypes: ["volume", "directory"] as AssetType[],
    multiSelect: false,
  },
};
