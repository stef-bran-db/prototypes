"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, ArrowUp, Sparkles, ChevronRight, Home, FolderOpen, Database,
  LayoutDashboard, FileCode, Briefcase, Settings, HelpCircle, Plus,
  Table2, Clock, Users, Star, ExternalLink, Zap, Box, Filter,
  ChevronDown, X, MessageSquare, List
} from "lucide-react";
import { mockConversations, type Message } from "./mock-data";

/* ─── Databricks Shell ─── */
function DatabricksShell({ children }: { children: React.ReactNode }) {
  const navItems = [
    { icon: Home, label: "Home" },
    { icon: FolderOpen, label: "Workspace" },
    { icon: Database, label: "Catalog" },
    { icon: Search, label: "Search", active: true },
    { icon: FileCode, label: "Editor" },
    { icon: LayoutDashboard, label: "SQL" },
    { icon: Briefcase, label: "Jobs" },
    { icon: Zap, label: "Compute" },
  ];

  return (
    <div className="h-screen flex" style={{ background: "var(--bg-primary)" }}>
      <div
        className="flex flex-col items-center shrink-0"
        style={{ width: 48, background: "var(--bg-primary)", borderRight: "1px solid var(--border)", paddingTop: 6, paddingBottom: 8 }}
      >
        <div className="flex items-center justify-center" style={{ width: 32, height: 32, marginBottom: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4299E0" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex flex-col items-center flex-1" style={{ gap: 1, width: "100%" }}>
          {navItems.map((item, i) => (
            <button
              key={i}
              className="flex flex-col items-center justify-center"
              style={{
                width: 44, height: 38, borderRadius: "var(--radius-md)",
                background: item.active ? "var(--bg-secondary)" : "transparent",
                color: item.active ? "var(--text-primary)" : "var(--text-disabled)",
                border: "none", cursor: "pointer", gap: 1,
              }}
            >
              <item.icon size={15} />
              <span style={{ fontSize: 9, lineHeight: "11px" }}>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center" style={{ gap: 1 }}>
          {[Settings, HelpCircle].map((Icon, i) => (
            <button key={i} className="flex items-center justify-center" style={{
              width: 44, height: 34, borderRadius: "var(--radius-md)",
              color: "var(--text-disabled)", background: "transparent", border: "none", cursor: "pointer",
            }}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  );
}

/* ─── Inline Asset Chip ─── */
function InlineAsset({ name, type, certified }: { name: string; type: "table" | "dashboard" | "notebook"; certified?: boolean }) {
  const iconMap = {
    table: <Table2 size={11} style={{ color: "var(--accent)" }} />,
    dashboard: <LayoutDashboard size={11} style={{ color: "#A78BFA" }} />,
    notebook: <FileCode size={11} style={{ color: "var(--success)" }} />,
  };
  return (
    <span
      className="inline-flex items-center"
      style={{
        gap: 3, padding: "0 6px", borderRadius: "var(--radius-md)",
        background: "rgba(66,153,224,0.08)", border: "1px solid rgba(66,153,224,0.15)",
        color: "var(--accent-hover)", fontSize: "var(--font-size-base)", fontWeight: 600,
        cursor: "pointer", whiteSpace: "nowrap",
      }}
    >
      {iconMap[type]}{name}{certified && <Star size={8} fill="var(--warning)" style={{ color: "var(--warning)" }} />}
    </span>
  );
}

/* ─── Typing Indicator ─── */
function TypingIndicator() {
  return (
    <div className="flex items-center" style={{ gap: 4, paddingLeft: 36, marginBottom: "var(--spacing-lg)" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="typing-dot rounded-full" style={{ width: 5, height: 5, background: "var(--accent)" }} />
      ))}
    </div>
  );
}

/* ─── Message Bubble ─── */
function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end" style={{ marginBottom: "var(--spacing-lg)" }}>
        <div style={{
          background: "var(--bg-secondary)", borderRadius: "var(--radius-full)",
          padding: "6px var(--spacing-md)", maxWidth: "75%",
          fontSize: "var(--font-size-base)", lineHeight: "var(--line-height-base)",
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={isLatest ? "animate-fade-in" : ""} style={{ marginBottom: "var(--spacing-lg)" }}>
      <div className="flex items-center" style={{ gap: "var(--spacing-sm)", marginBottom: 6 }}>
        <div className="flex items-center justify-center" style={{
          width: 22, height: 22, borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, var(--accent), #7C3AED)",
        }}>
          <Sparkles size={11} color="white" />
        </div>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>Discovery</span>
        {message.confidence && (
          <span style={{
            fontSize: "var(--font-size-sm)",
            color: message.confidence === "high" ? "var(--success)" : message.confidence === "medium" ? "var(--warning)" : "var(--text-disabled)",
          }}>
            · {message.confidence} confidence
          </span>
        )}
      </div>
      <div style={{ paddingLeft: 36 }}>
        <div style={{ fontSize: "var(--font-size-base)", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          {message.richContent ? message.richContent.map((block, i) => {
            if (block.type === "text") return <span key={i}>{block.value}</span>;
            if (block.type === "asset") return <InlineAsset key={i} name={block.name!} type={block.assetType as "table"|"dashboard"|"notebook"} certified={block.certified} />;
            if (block.type === "break") return <br key={i} />;
            if (block.type === "detail") return (
              <div key={i} style={{
                fontSize: "var(--font-size-sm)", color: "var(--text-disabled)",
                margin: "4px 0", paddingLeft: "var(--spacing-md)",
                borderLeft: "2px solid var(--border)", fontFamily: "monospace",
              }}>
                {block.value}
              </div>
            );
            return null;
          }) : <p style={{ whiteSpace: "pre-line" }}>{message.content}</p>}
        </div>

        {message.actions && (
          <div className="flex flex-wrap" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-mid)" }}>
            {message.actions.map((a, i) => (
              <button key={i} className="flex items-center" style={{
                gap: 4, fontSize: "var(--font-size-sm)", padding: "3px 10px",
                borderRadius: "var(--radius-md)", background: "rgba(66,153,224,0.1)",
                border: "1px solid rgba(66,153,224,0.2)", color: "var(--accent)", cursor: "pointer",
              }}>
                {a.includes("Genie") && <Sparkles size={11} />}
                {a.includes("query") && <Plus size={11} />}
                {a.includes("dashboard") && <LayoutDashboard size={11} />}
                {a.includes("notebook") && <FileCode size={11} />}
                {a}
              </button>
            ))}
          </div>
        )}

        {message.followUp && (
          <div className="flex flex-wrap" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-md)" }}>
            {message.followUp.map((q, i) => (
              <button key={i} style={{
                fontSize: "var(--font-size-sm)", padding: "3px 10px",
                borderRadius: "var(--radius-full)", border: "1px solid var(--bg-code)",
                color: "var(--text-secondary)", background: "transparent", cursor: "pointer",
              }}>{q}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Mock Search Results (traditional view) ─── */
function MockSearchResults() {
  const results = [
    { type: "table" as const, name: "finance.marts.revenue_by_product", desc: "Product-level revenue aggregation for financial reporting", owner: "Data Engineering", updated: "2h ago" },
    { type: "dashboard" as const, name: "Q1 Revenue by Region", desc: "Quarterly revenue breakdown by geography and product line", owner: "Finance Analytics", updated: "1d ago" },
    { type: "table" as const, name: "finance.staging.order_transactions", desc: "Raw transaction data with SKU-level granularity", owner: "Data Engineering", updated: "4h ago" },
    { type: "notebook" as const, name: "Revenue Analysis Q1 2026", desc: "Quarterly revenue deep-dive with product segmentation", owner: "sarah.chen", updated: "3d ago" },
    { type: "table" as const, name: "finance.marts.product_catalog", desc: "Product hierarchy and categorization reference table", owner: "Product Analytics", updated: "1d ago" },
    { type: "table" as const, name: "marketing.revenue_attribution", desc: "Marketing channel attribution for revenue events", owner: "Marketing Analytics", updated: "6h ago" },
  ];

  const iconMap = {
    table: <Table2 size={14} style={{ color: "var(--accent)" }} />,
    dashboard: <LayoutDashboard size={14} style={{ color: "#A78BFA" }} />,
    notebook: <FileCode size={14} style={{ color: "var(--success)" }} />,
  };

  return (
    <div style={{ flex: 1, overflow: "auto" }}>
      <div style={{ padding: "0 var(--spacing-xl)" }}>
        <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-disabled)", marginBottom: "var(--spacing-md)" }}>
          42 results
        </div>
        <div className="flex flex-col" style={{ gap: 1 }}>
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center transition-colors cursor-pointer"
              style={{
                padding: "var(--spacing-mid) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                gap: "var(--spacing-md)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(189,205,219,0.04)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ flexShrink: 0 }}>{iconMap[r.type]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "var(--font-size-base)", color: "var(--accent-hover)", fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", marginTop: 1 }}>{r.desc}</div>
              </div>
              <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-disabled)", flexShrink: 0, textAlign: "right" }}>
                <div>{r.owner}</div>
                <div style={{ marginTop: 1 }}>{r.updated}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AgenticDiscovery() {
  const [mode, setMode] = useState<"search" | "discovery">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setHasSearched(true);
  };

  const switchToDiscovery = () => {
    setMode("discovery");
    if (searchQuery.trim()) {
      setInput(searchQuery);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleDiscoverySubmit = () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (!currentScenario) {
      const scenario = Object.keys(mockConversations).find((key) =>
        input.toLowerCase().includes(key.toLowerCase())
      );
      if (scenario) {
        setCurrentScenario(scenario);
        setMessageIndex(0);
        simulateResponse(mockConversations[scenario][0]);
      } else {
        simulateResponse({
          role: "assistant",
          content: "I can help you find assets in your workspace. Try describing what you're looking for — for example, \"what tables should I use to analyze revenue by product line?\"",
          confidence: "low" as const,
        });
      }
    } else {
      const conversation = mockConversations[currentScenario];
      const nextIndex = messageIndex + 1;
      if (nextIndex < conversation.length) {
        setMessageIndex(nextIndex);
        simulateResponse(conversation[nextIndex]);
      }
    }
  };

  const simulateResponse = (response: Message) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 1500 + Math.random() * 1000);
  };

  const filterChips = ["Tables", "Dashboards", "Notebooks", "Queries", "Jobs"];

  return (
    <DatabricksShell>
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Search header area */}
        <div style={{ padding: "var(--spacing-lg) var(--spacing-xl) 0", flexShrink: 0 }}>
          {/* Mode toggle + Search bar */}
          <div className="flex items-center" style={{ gap: "var(--spacing-md)", maxWidth: 900 }}>
            <div className="flex-1 flex items-center" style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: mode === "discovery" ? 24 : "var(--radius-md)",
              padding: mode === "discovery" ? "8px var(--spacing-md)" : "6px var(--spacing-mid)",
              transition: "all 0.2s ease",
            }}>
              {mode === "search" ? (
                <>
                  <Search size={15} style={{ color: "var(--text-placeholder)", flexShrink: 0, marginRight: 8 }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search assets, tables, dashboards..."
                    className="flex-1 bg-transparent outline-none"
                    style={{ fontSize: "var(--font-size-base)", color: "var(--text-primary)" }}
                  />
                </>
              ) : (
                <>
                  <Sparkles size={15} style={{ color: "var(--accent)", flexShrink: 0, marginRight: 8 }} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleDiscoverySubmit()}
                    placeholder="Describe what you're looking for..."
                    className="flex-1 bg-transparent outline-none"
                    style={{ fontSize: "var(--font-size-base)", color: "var(--text-primary)" }}
                  />
                  <button
                    onClick={handleDiscoverySubmit}
                    disabled={!input.trim()}
                    className="flex items-center justify-center disabled:opacity-30"
                    style={{
                      width: 24, height: 24, borderRadius: "var(--radius-full)",
                      background: "var(--accent)", border: "none", cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    <ArrowUp size={12} color="white" />
                  </button>
                </>
              )}
            </div>

            {/* Mode toggle button */}
            <button
              onClick={() => mode === "search" ? switchToDiscovery() : setMode("search")}
              className="flex items-center shrink-0 transition-colors"
              style={{
                gap: 6, padding: "6px 12px",
                borderRadius: "var(--radius-md)",
                border: mode === "discovery" ? "1px solid var(--accent)" : "1px solid var(--border)",
                background: mode === "discovery" ? "rgba(66,153,224,0.1)" : "var(--bg-secondary)",
                color: mode === "discovery" ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "var(--font-size-base)", cursor: "pointer", fontWeight: 500,
              }}
            >
              {mode === "discovery" ? (
                <><Sparkles size={13} /> AI Discovery</>
              ) : (
                <><Sparkles size={13} /> AI Discovery</>
              )}
            </button>
          </div>

          {/* Filter chips — only in search mode */}
          {mode === "search" && (
            <div className="flex items-center flex-wrap" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-mid)", paddingBottom: "var(--spacing-md)" }}>
              {filterChips.map((chip, i) => (
                <button key={i} style={{
                  fontSize: "var(--font-size-sm)", padding: "2px 10px",
                  borderRadius: "var(--radius-full)", border: "1px solid var(--border)",
                  background: "transparent", color: "var(--text-secondary)", cursor: "pointer",
                }}>{chip}</button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{ borderBottom: "1px solid var(--border)", margin: "0" }} />
        </div>

        {/* Content area */}
        {mode === "search" ? (
          /* Traditional search results */
          hasSearched ? (
            <MockSearchResults />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center" style={{ padding: "var(--spacing-xl)" }}>
              <div style={{ fontSize: "var(--font-size-lg)", color: "var(--text-primary)", fontWeight: 600, marginBottom: "var(--spacing-sm)" }}>
                Search & Discover
              </div>
              <div style={{ fontSize: "var(--font-size-base)", color: "var(--text-secondary)", marginBottom: "var(--spacing-lg)", textAlign: "center", maxWidth: 400 }}>
                Search for assets by name, or try <button onClick={switchToDiscovery} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "inherit" }}>AI Discovery</button> to describe what you need.
              </div>
              <div className="flex flex-col" style={{ gap: "var(--spacing-sm)", width: "100%", maxWidth: 480 }}>
                {["Suggested for you", "Popular this week", "Recently updated"].map((section, i) => (
                  <div key={i} style={{
                    padding: "var(--spacing-mid) var(--spacing-md)", borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)", background: "var(--bg-secondary)",
                  }}>
                    <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-disabled)", marginBottom: "var(--spacing-sm)" }}>{section}</div>
                    <div className="flex flex-col" style={{ gap: 4 }}>
                      {[1, 2].map((j) => (
                        <div key={j} className="rounded" style={{ height: 12, background: "rgba(144,164,181,0.08)", borderRadius: "var(--radius-md)" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          /* AI Discovery chat */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ padding: "var(--spacing-md) var(--spacing-xl)" }}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center" style={{ maxWidth: 480, margin: "0 auto" }}>
                  <div className="flex items-center justify-center" style={{
                    width: 40, height: 40, borderRadius: "var(--radius-lg)",
                    background: "linear-gradient(135deg, var(--accent), #7C3AED)", marginBottom: "var(--spacing-md)",
                  }}>
                    <Sparkles size={18} color="white" />
                  </div>
                  <div style={{ fontSize: "var(--font-size-lg)", fontWeight: 600, marginBottom: 4 }}>AI Discovery</div>
                  <div style={{ fontSize: "var(--font-size-base)", color: "var(--text-secondary)", textAlign: "center", marginBottom: "var(--spacing-lg)" }}>
                    Describe what you need and I'll find the right assets in your workspace.
                  </div>
                  <div className="flex flex-col w-full" style={{ gap: "var(--spacing-sm)" }}>
                    {[
                      "What tables should I use to analyze revenue by product line?",
                      "Find dashboards about customer churn",
                      "I need the data sources for our nightly pipeline",
                    ].map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(s); inputRef.current?.focus(); }}
                        className="flex items-center text-left transition-colors"
                        style={{
                          gap: 8, fontSize: "var(--font-size-base)", padding: "10px var(--spacing-md)",
                          borderRadius: "var(--radius-lg)", border: "1px solid var(--border)",
                          background: "var(--bg-secondary)", color: "var(--text-secondary)", cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--bg-code)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                      >
                        <ChevronRight size={12} style={{ color: "var(--text-disabled)", flexShrink: 0 }} />{s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                  {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} isLatest={i === messages.length - 1 && msg.role === "assistant"} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DatabricksShell>
  );
}
