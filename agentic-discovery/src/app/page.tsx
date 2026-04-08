"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, ArrowUp, Sparkles, ChevronRight, Home, FolderOpen, Database,
  LayoutDashboard, FileCode, Briefcase, Settings, HelpCircle, Plus,
  Table2, Clock, Users, Star, ExternalLink, ChevronDown, Zap, Box
} from "lucide-react";
import { mockConversations, type Message } from "./mock-data";

function DatabricksShell({ children }: { children: React.ReactNode }) {
  const navItems = [
    { icon: Home, label: "Home", active: false },
    { icon: FolderOpen, label: "Workspace", active: false },
    { icon: Database, label: "Catalog", active: false },
    { icon: Sparkles, label: "Discovery", active: true },
    { icon: FileCode, label: "Editor", active: false },
    { icon: LayoutDashboard, label: "Dashboards", active: false },
    { icon: Briefcase, label: "Jobs", active: false },
    { icon: Zap, label: "Compute", active: false },
  ];

  return (
    <div className="h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left nav */}
      <div
        className="flex flex-col items-center shrink-0"
        style={{
          width: 48,
          background: "var(--bg-primary)",
          borderRight: "1px solid var(--border)",
          paddingTop: "var(--spacing-sm)",
          paddingBottom: "var(--spacing-sm)",
        }}
      >
        {/* Databricks logo */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            marginBottom: "var(--spacing-md)",
          }}
        >
          <Box size={20} style={{ color: "var(--accent)" }} />
        </div>

        {/* Nav items */}
        <div className="flex flex-col items-center flex-1" style={{ gap: "2px", width: "100%" }}>
          {navItems.map((item, i) => (
            <button
              key={i}
              className="flex flex-col items-center justify-center transition-colors"
              style={{
                width: 44,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: item.active ? "var(--bg-secondary)" : "transparent",
                color: item.active ? "var(--text-primary)" : "var(--text-disabled)",
                border: "none",
                cursor: "pointer",
                gap: "1px",
              }}
            >
              <item.icon size={16} />
              <span style={{ fontSize: "9px" }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="flex flex-col items-center" style={{ gap: "2px" }}>
          <button
            className="flex items-center justify-center"
            style={{
              width: 44, height: 36, borderRadius: "var(--radius-md)",
              color: "var(--text-disabled)", background: "transparent", border: "none", cursor: "pointer",
            }}
          >
            <Settings size={16} />
          </button>
          <button
            className="flex items-center justify-center"
            style={{
              width: 44, height: 36, borderRadius: "var(--radius-md)",
              color: "var(--text-disabled)", background: "transparent", border: "none", cursor: "pointer",
            }}
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function InlineAsset({ name, type, certified }: { name: string; type: "table" | "dashboard" | "notebook"; certified?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const iconMap = {
    table: <Table2 size={12} style={{ color: "var(--accent)" }} />,
    dashboard: <LayoutDashboard size={12} style={{ color: "#A78BFA" }} />,
    notebook: <FileCode size={12} style={{ color: "var(--success)" }} />,
  };

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="inline-flex items-center transition-colors"
      style={{
        gap: "var(--spacing-xs)",
        padding: "1px var(--spacing-sm)",
        borderRadius: "var(--radius-md)",
        background: "rgba(66, 153, 224, 0.08)",
        border: "1px solid rgba(66, 153, 224, 0.15)",
        color: "var(--accent-hover)",
        fontSize: "var(--font-size-base)",
        fontWeight: 600,
        cursor: "pointer",
        verticalAlign: "baseline",
      }}
    >
      {iconMap[type]}
      {name}
      {certified && <Star size={9} fill="var(--warning)" style={{ color: "var(--warning)" }} />}
    </button>
  );
}

function ActionBar({ actions }: { actions: string[] }) {
  return (
    <div className="flex flex-wrap" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-mid)" }}>
      {actions.map((action, i) => (
        <button
          key={i}
          className="flex items-center transition-colors"
          style={{
            gap: "var(--spacing-xs)",
            fontSize: "var(--font-size-sm)",
            padding: "var(--spacing-xs) var(--spacing-mid)",
            borderRadius: "var(--radius-md)",
            background: "rgba(66, 153, 224, 0.1)",
            border: "1px solid rgba(66, 153, 224, 0.2)",
            color: "var(--accent)",
            cursor: "pointer",
          }}
        >
          {action === "Open with Genie Code" && <Sparkles size={11} />}
          {action === "Create query" && <Plus size={11} />}
          {action === "Open dashboard" && <LayoutDashboard size={11} />}
          {action === "Open in notebook" && <FileCode size={11} />}
          {action}
        </button>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center" style={{ gap: "var(--spacing-xs)", paddingLeft: 40, marginBottom: "var(--spacing-lg)" }}>
      <div className="typing-dot rounded-full" style={{ width: 5, height: 5, background: "var(--accent)" }} />
      <div className="typing-dot rounded-full" style={{ width: 5, height: 5, background: "var(--accent)" }} />
      <div className="typing-dot rounded-full" style={{ width: 5, height: 5, background: "var(--accent)" }} />
    </div>
  );
}

function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end" style={{ marginBottom: "var(--spacing-lg)" }}>
        <div style={{
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-full)",
          padding: "var(--spacing-sm) var(--spacing-md)",
          maxWidth: "75%",
          fontSize: "var(--font-size-base)",
          lineHeight: "var(--line-height-base)",
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={isLatest ? "animate-fade-in" : ""} style={{ marginBottom: "var(--spacing-lg)" }}>
      {/* AI header */}
      <div className="flex items-center" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-sm)" }}>
        <div className="flex items-center justify-center" style={{
          width: 24, height: 24, borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, var(--accent), #7C3AED)",
        }}>
          <Sparkles size={12} color="white" />
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

      {/* Content */}
      <div style={{ paddingLeft: 40 }}>
        {/* Render content with inline assets */}
        <div style={{
          fontSize: "var(--font-size-base)",
          lineHeight: "1.7",
          color: "var(--text-secondary)",
        }}>
          {message.richContent ? (
            message.richContent.map((block, i) => {
              if (block.type === "text") {
                return <span key={i}>{block.value}</span>;
              }
              if (block.type === "asset") {
                return (
                  <InlineAsset
                    key={i}
                    name={block.name!}
                    type={block.assetType as "table" | "dashboard" | "notebook"}
                    certified={block.certified}
                  />
                );
              }
              if (block.type === "break") {
                return <br key={i} />;
              }
              if (block.type === "detail") {
                return (
                  <div
                    key={i}
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--text-disabled)",
                      marginTop: "var(--spacing-xs)",
                      marginBottom: "var(--spacing-xs)",
                      paddingLeft: "var(--spacing-md)",
                      borderLeft: "2px solid var(--border)",
                    }}
                  >
                    {block.value}
                  </div>
                );
              }
              return null;
            })
          ) : (
            <p style={{ whiteSpace: "pre-line" }}>{message.content}</p>
          )}
        </div>

        {/* Action buttons */}
        {message.actions && <ActionBar actions={message.actions} />}

        {/* Follow-up suggestions */}
        {message.followUp && (
          <div className="flex flex-wrap" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-md)" }}>
            {message.followUp.map((q, i) => (
              <button
                key={i}
                className="transition-colors"
                style={{
                  fontSize: "var(--font-size-sm)",
                  padding: "var(--spacing-xs) var(--spacing-mid)",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--bg-code)",
                  color: "var(--text-secondary)",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--text-disabled)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--bg-code)"; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgenticDiscovery() {
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

  const handleSubmit = () => {
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

  const scenarios = [
    "What tables should I use to analyze revenue by product line?",
    "Find dashboards about customer churn",
    "I need the data sources for our nightly pipeline",
  ];

  return (
    <DatabricksShell>
      {/* Thread sidebar */}
      <div
        className="flex flex-col shrink-0"
        style={{
          width: 220,
          background: "var(--bg-primary)",
          borderRight: "1px solid var(--border)",
          padding: "var(--spacing-md) var(--spacing-sm)",
        }}
      >
        <button
          className="flex items-center w-full transition-colors"
          style={{
            gap: "var(--spacing-sm)", padding: "var(--spacing-sm) var(--spacing-sm)",
            fontSize: "var(--font-size-base)", color: "var(--accent)",
            background: "transparent", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
          }}
        >
          <Plus size={14} /> New conversation
        </button>

        <div style={{ marginTop: "var(--spacing-lg)" }}>
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--text-disabled)", padding: "0 var(--spacing-sm)", display: "block", marginBottom: "var(--spacing-xs)" }}>
            Recent
          </span>
          <div
            className="transition-colors"
            style={{
              padding: "var(--spacing-sm)",
              fontSize: "var(--font-size-base)",
              color: "var(--text-primary)",
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
            }}
          >
            Revenue by product line
          </div>
          <div
            className="transition-colors"
            style={{
              padding: "var(--spacing-sm)",
              fontSize: "var(--font-size-base)",
              color: "var(--text-secondary)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              marginTop: "1px",
            }}
          >
            Churn dashboards
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center" style={{ maxWidth: 520, margin: "0 auto" }}>
              <div className="flex items-center justify-center" style={{
                width: 44, height: 44, borderRadius: "var(--radius-lg)",
                background: "linear-gradient(135deg, var(--accent), #7C3AED)",
                marginBottom: "var(--spacing-md)",
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <h2 className="font-semibold" style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--spacing-xs)" }}>
                What are you looking for?
              </h2>
              <p style={{ fontSize: "var(--font-size-base)", color: "var(--text-secondary)", textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
                Describe what you need and I'll find the right assets in your workspace.
              </p>
              <div className="flex flex-col w-full" style={{ gap: "var(--spacing-sm)" }}>
                {scenarios.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    className="flex items-center text-left transition-colors"
                    style={{
                      gap: "var(--spacing-mid)", fontSize: "var(--font-size-base)",
                      padding: "var(--spacing-mid) var(--spacing-md)",
                      borderRadius: "var(--radius-lg)", border: "1px solid var(--border)",
                      background: "var(--bg-secondary)", color: "var(--text-secondary)", cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--bg-code)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    <ChevronRight size={13} style={{ color: "var(--text-disabled)" }} />
                    {s}
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

        {/* Input */}
        <div style={{ padding: "var(--spacing-md) var(--spacing-lg)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="flex items-center" style={{
              gap: "var(--spacing-mid)", background: "var(--bg-secondary)",
              border: "1px solid var(--border)", borderRadius: 24,
              padding: "var(--spacing-mid) var(--spacing-md)",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
            }}>
              <Search size={15} style={{ color: "var(--text-placeholder)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Describe what you're looking for..."
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: "var(--font-size-base)", lineHeight: "var(--line-height-base)", color: "var(--text-primary)" }}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  width: 26, height: 26, borderRadius: "var(--radius-full)",
                  background: "var(--accent)", border: "none", flexShrink: 0, cursor: "pointer",
                }}
              >
                <ArrowUp size={13} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DatabricksShell>
  );
}
