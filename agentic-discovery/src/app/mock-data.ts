type RichBlock =
  | { type: "text"; value: string }
  | { type: "asset"; name: string; assetType: "table" | "dashboard" | "notebook"; certified?: boolean }
  | { type: "break" }
  | { type: "detail"; value: string };

export type Message = {
  role: "user" | "assistant";
  content: string;
  confidence?: "high" | "medium" | "low";
  richContent?: RichBlock[];
  actions?: string[];
  followUp?: string[];
  // Legacy — kept for compatibility
  assets?: {
    name: string;
    type: "table" | "dashboard" | "notebook";
    reason: string;
    tags: string[];
    certified?: boolean;
    freshness?: string;
    popularity?: string;
    owner?: string;
    actions?: string[];
  }[];
};

export const mockConversations: Record<string, Message[]> = {
  revenue: [
    {
      role: "assistant",
      content: "",
      confidence: "high",
      richContent: [
        { type: "text", value: "For revenue by product line, you'll want " },
        { type: "asset", name: "finance.marts.revenue_by_product", assetType: "table", certified: true },
        { type: "text", value: " — it's the table the finance team uses for quarterly reporting. Has " },
        { type: "text", value: "product_line, revenue, and transaction_date columns. Updated daily, powers the Q1 Revenue by Region dashboard, and queried by 12 analysts this week." },
        { type: "break" },
        { type: "break" },
        { type: "text", value: "You'll likely need to join it with " },
        { type: "asset", name: "finance.marts.product_catalog", assetType: "table", certified: true },
        { type: "text", value: " to get product line names — they share a product_id key. This is how ~80% of revenue queries in the workspace are structured." },
        { type: "break" },
        { type: "break" },
        { type: "text", value: "If you need more granular breakdowns at the SKU level, " },
        { type: "asset", name: "finance.staging.order_transactions", assetType: "table" },
        { type: "text", value: " is the upstream source — raw transaction data with product SKU-level detail." },
      ],
      actions: ["Open with Genie Code", "Create query"],
      followUp: [
        "Tell me more about revenue_by_product",
        "How are these tables related?",
        "Are there dashboards using these?",
        "I need EMEA data specifically",
      ],
    },
    {
      role: "assistant",
      content: "",
      confidence: "high",
      richContent: [
        { type: "asset", name: "revenue_by_product", assetType: "table", certified: true },
        { type: "text", value: " and " },
        { type: "asset", name: "product_catalog", assetType: "table", certified: true },
        { type: "text", value: " share a product_id key — most analysts join them to get product line names alongside revenue figures." },
        { type: "break" },
        { type: "break" },
        { type: "text", value: "The typical query pattern:" },
        { type: "break" },
        { type: "detail", value: "revenue_by_product JOIN product_catalog ON product_id → filter by transaction_date → group by product_line" },
        { type: "break" },
        { type: "text", value: "This is how the " },
        { type: "asset", name: "Q1 Revenue by Region", assetType: "dashboard" },
        { type: "text", value: " dashboard is built, and the same pattern used in 4 of the 6 notebooks that reference these tables." },
      ],
      actions: ["Open Q1 Revenue dashboard", "Start Genie Code session with these tables"],
      followUp: [
        "Show me one of those notebooks",
        "I need this for EMEA only",
      ],
    },
  ],
  churn: [
    {
      role: "assistant",
      content: "",
      confidence: "medium",
      richContent: [
        { type: "text", value: "I found two dashboards that cover customer churn:" },
        { type: "break" },
        { type: "break" },
        { type: "asset", name: "Customer Churn Analysis - Q1 2026", assetType: "dashboard", certified: true },
        { type: "text", value: " — tracks monthly churn rate, cohort retention curves, and churn drivers by segment. Owned by Customer Analytics, viewed by 23 people this week. Data refreshes daily." },
        { type: "break" },
        { type: "break" },
        { type: "asset", name: "Churn Prediction Model Results", assetType: "dashboard" },
        { type: "text", value: " — shows output from the ML churn prediction model: risk scores by customer, feature importance, and model performance over time. Owned by ML Engineering, retrained weekly." },
        { type: "break" },
        { type: "break" },
        { type: "text", value: "The first one is probably what you want if you're looking at historical churn patterns. The second is more relevant if you're trying to identify at-risk customers going forward." },
      ],
      actions: ["Open Churn Analysis dashboard", "Open Prediction Results"],
      followUp: [
        "What tables power these dashboards?",
        "Are there notebooks with churn analysis?",
        "I need churn data for a specific segment",
      ],
    },
  ],
  pipeline: [
    {
      role: "assistant",
      content: "Can you tell me a bit more about the pipeline? For example:\n\n• What kind of data does it process? (customer events, transactions, logs)\n• What's the expected output? (a table for analytics, a feature store, a report)\n• Is this extending an existing pipeline or starting fresh?\n\nThis will help me find the right source tables.",
      confidence: "low",
      followUp: [
        "It processes customer event data",
        "It's a new ETL pipeline for marketing",
        "I need to replicate what the finance team has",
      ],
    },
    {
      role: "assistant",
      content: "",
      confidence: "high",
      richContent: [
        { type: "text", value: "For a customer event data pipeline, you'll likely want to start with " },
        { type: "asset", name: "events.raw.customer_events", assetType: "table" },
        { type: "text", value: " — that's the raw event stream (page views, clicks, conversions). It's the source table for 3 existing pipelines in the workspace, partitioned by event_date, with ~5 minute streaming latency." },
        { type: "break" },
        { type: "break" },
        { type: "text", value: "If you need session-level aggregation rather than raw events, consider starting from " },
        { type: "asset", name: "events.enriched.user_sessions", assetType: "table", certified: true },
        { type: "text", value: " instead — it's the sessionized version with duration, page count, and conversion flags. Updated hourly, queried by 7 analysts this week. It's derived from customer_events, so you'd skip the sessionization step." },
        { type: "break" },
        { type: "break" },
        { type: "text", value: "There's also a notebook that documents how user_sessions is built from customer_events, if you want to understand the transformation logic: " },
        { type: "asset", name: "Session Enrichment Pipeline", assetType: "notebook" },
      ],
      actions: ["Open with Genie Code", "View Session Enrichment notebook"],
      followUp: [
        "Show me the pipelines that use customer_events",
        "How is user_sessions derived?",
        "I need a different granularity",
      ],
    },
  ],
};
