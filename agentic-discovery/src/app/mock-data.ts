export type Message = {
  role: "user" | "assistant";
  content: string;
  confidence?: "high" | "medium" | "low";
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
  followUp?: string[];
};

export const mockConversations: Record<string, Message[]> = {
  revenue: [
    {
      role: "assistant",
      content: "I found 3 tables that are likely relevant to analyzing revenue by product line. Here's why each one stands out:",
      confidence: "high",
      assets: [
        {
          name: "finance.marts.revenue_by_product",
          type: "table",
          reason: "Contains product_line, revenue, and transaction_date columns. Referenced in 6 notebooks performing quarterly revenue analysis and product segmentation. Powers the Q1 Revenue by Region dashboard. Updated daily.",
          tags: ["product_line", "revenue", "transaction_date", "region"],
          certified: true,
          freshness: "Updated 2 hours ago",
          popularity: "Queried by 12 analysts this week",
          owner: "Data Engineering",
          actions: ["Open with Genie Code", "Create query", "Open in notebook"],
        },
        {
          name: "finance.staging.order_transactions",
          type: "table",
          reason: "Raw transaction data with product SKU-level granularity. Upstream source for revenue_by_product. Use this if you need more granular breakdowns than the mart provides.",
          tags: ["order_id", "product_sku", "amount", "timestamp"],
          freshness: "Updated 4 hours ago",
          popularity: "Queried by 5 engineers this week",
          owner: "Data Engineering",
          actions: ["Open with Genie Code", "Create query"],
        },
        {
          name: "finance.marts.product_catalog",
          type: "table",
          reason: "Product hierarchy and categorization. You'll likely need to join this with revenue_by_product to get product line names — they share the product_id key.",
          tags: ["product_id", "product_line", "category", "subcategory"],
          certified: true,
          freshness: "Updated daily",
          popularity: "Joined in 80% of revenue queries",
          owner: "Product Analytics",
          actions: ["Open with Genie Code"],
        },
      ],
      followUp: [
        "Tell me more about revenue_by_product",
        "How do these tables relate to each other?",
        "Are there any dashboards using these?",
        "I need EMEA data specifically",
      ],
    },
    {
      role: "assistant",
      content: "revenue_by_product and product_catalog share a product_id key — most analysts join them to get product line names alongside revenue figures.\n\nThe typical query pattern looks like:\n• revenue_by_product JOIN product_catalog ON product_id\n• Filter by transaction_date for your time range\n• Group by product_line\n\nThis is how the Q1 Revenue by Region dashboard is built, and it's the same pattern used in 4 of the 6 notebooks I mentioned.",
      confidence: "high",
      followUp: [
        "Open the Q1 Revenue dashboard",
        "Show me one of those notebooks",
        "Start a Genie Code session with these tables",
      ],
    },
  ],
  churn: [
    {
      role: "assistant",
      content: "I found 2 dashboards related to customer churn:",
      confidence: "medium",
      assets: [
        {
          name: "Customer Churn Analysis - Q1 2026",
          type: "dashboard",
          reason: "Tracks monthly churn rate, cohort retention curves, and churn drivers by segment. Created by the Customer Analytics team. Last viewed by 8 people this week.",
          tags: ["churn_rate", "retention", "cohort", "segment"],
          certified: true,
          freshness: "Data refreshed daily",
          popularity: "Viewed 23 times this week",
          owner: "Customer Analytics",
          actions: ["Open dashboard"],
        },
        {
          name: "Churn Prediction Model Results",
          type: "dashboard",
          reason: "Shows output from the ML churn prediction model — risk scores by customer, feature importance, and model performance over time.",
          tags: ["churn_risk", "prediction", "ml_model", "features"],
          freshness: "Model retrained weekly",
          popularity: "Viewed 11 times this week",
          owner: "ML Engineering",
          actions: ["Open dashboard"],
        },
      ],
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
      content: "Can you tell me more about what kind of pipeline? For example:\n\n• What data does it process? (e.g., customer events, transactions, logs)\n• What's the output? (e.g., a table for analytics, a feature store, a report)\n• Is this extending an existing pipeline or starting fresh?",
      confidence: "low",
      followUp: [
        "It processes customer event data",
        "It's a new ETL pipeline for marketing",
        "I need to replicate what the finance team has",
      ],
    },
    {
      role: "assistant",
      content: "For a customer event data pipeline, here are the data sources you'll likely need:",
      confidence: "high",
      assets: [
        {
          name: "events.raw.customer_events",
          type: "table",
          reason: "Raw customer event stream — page views, clicks, conversions. This is the source table used by 3 existing pipelines in the workspace. Partitioned by event_date.",
          tags: ["event_type", "user_id", "timestamp", "event_properties"],
          freshness: "Streaming — ~5 min latency",
          popularity: "Source for 3 pipelines",
          owner: "Platform Engineering",
          actions: ["Open with Genie Code", "Create query"],
        },
        {
          name: "events.enriched.user_sessions",
          type: "table",
          reason: "Sessionized version of customer_events with session duration, page count, and conversion flags. If you need session-level aggregation, start here instead of raw events.",
          tags: ["session_id", "user_id", "duration", "converted"],
          certified: true,
          freshness: "Updated hourly",
          popularity: "Queried by 7 analysts this week",
          owner: "Data Engineering",
          actions: ["Open with Genie Code"],
        },
      ],
      followUp: [
        "Show me the pipelines that use customer_events",
        "What notebooks process this data?",
        "How is user_sessions derived from customer_events?",
      ],
    },
  ],
};
