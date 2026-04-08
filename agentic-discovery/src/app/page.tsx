"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowUp, Table2, LayoutDashboard, FileCode, Sparkles, ExternalLink, Plus, ChevronRight, Shield, Clock, Users, Star } from "lucide-react";
import { mockConversations, type Message } from "./mock-data";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 pl-10" style={{ marginBottom: "var(--spacing-lg)" }}>
      <div className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
      <div className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
      <div className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
    </div>
  );
}

function AssetCard({ asset }: { asset: NonNullable<Message["assets"]>[number] }) {
  const iconMap = {
    table: <Table2 size={14} style={{ color: "var(--accent)" }} />,
    dashboard: <LayoutDashboard size={14} style={{ color: "#A78BFA" }} />,
    notebook: <FileCode size={14} style={{ color: "var(--success)" }} />,
  };

  return (
    <div
      className="rounded-lg group transition-colors cursor-pointer"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        padding: "var(--spacing-mid) var(--spacing-md)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--bg-code)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div className="flex items-start justify-between" style={{ marginBottom: "var(--spacing-sm)" }}>
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
          {iconMap[asset.type]}
          <span className="font-semibold" style={{ fontSize: "var(--font-size-base)", color: "var(--text-primary)" }}>
            {asset.name}
          </span>
          {asset.certified && (
            <span className="flex items-center" style={{ gap: "2px", fontSize: "var(--font-size-sm)", color: "var(--warning)" }}>
              <Star size={10} fill="currentColor" />
              Certified
            </span>
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-secondary)" }}>
          <ExternalLink size={13} />
        </button>
      </div>

      <p style={{ fontSize: "var(--font-size-base)", lineHeight: "var(--line-height-base)", color: "var(--text-secondary)", marginBottom: "var(--spacing-mid)" }}>
        {asset.reason}
      </p>

      <div className="flex flex-wrap" style={{ gap: "var(--spacing-xs)", marginBottom: "var(--spacing-mid)" }}>
        {asset.tags.map((tag, i) => (
          <span
            key={i}
            className="rounded"
            style={{
              fontSize: "var(--font-size-sm)",
              padding: "1px var(--spacing-sm)",
              background: "var(--bg-primary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center" style={{ gap: "var(--spacing-md)", fontSize: "var(--font-size-sm)", color: "var(--text-disabled)" }}>
        {asset.freshness && (
          <span className="flex items-center" style={{ gap: "var(--spacing-xs)" }}>
            <Clock size={11} /> {asset.freshness}
          </span>
        )}
        {asset.popularity && (
          <span className="flex items-center" style={{ gap: "var(--spacing-xs)" }}>
            <Users size={11} /> {asset.popularity}
          </span>
        )}
        {asset.owner && (
          <span className="flex items-center" style={{ gap: "var(--spacing-xs)" }}>
            <Shield size={11} /> {asset.owner}
          </span>
        )}
      </div>

      {asset.actions && asset.actions.length > 0 && (
        <div
          className="flex"
          style={{
            gap: "var(--spacing-sm)",
            marginTop: "var(--spacing-mid)",
            paddingTop: "var(--spacing-mid)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {asset.actions.map((action, i) => (
            <button
              key={i}
              className="flex items-center rounded transition-colors"
              style={{
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-sm)",
                padding: "var(--spacing-xs) var(--spacing-mid)",
                background: "rgba(66, 153, 224, 0.12)",
                color: "var(--accent)",
                border: "1px solid rgba(66, 153, 224, 0.2)",
                borderRadius: "var(--radius-md)",
              }}
            >
              {action === "Open in notebook" && <FileCode size={11} />}
              {action === "Create query" && <Plus size={11} />}
              {action === "Open dashboard" && <LayoutDashboard size={11} />}
              {action === "Open with Genie Code" && <Sparkles size={11} />}
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfidenceIndicator({ level }: { level: "high" | "medium" | "low" }) {
  const config = {
    high: { label: "High confidence", color: "var(--success)" },
    medium: { label: "Medium confidence", color: "var(--warning)" },
    low: { label: "Low confidence", color: "var(--text-disabled)" },
  };
  const c = config[level];
  const dots = level === "high" ? 3 : level === "medium" ? 2 : 1;

  return (
    <div className="flex items-center" style={{ gap: "var(--spacing-sm)", fontSize: "var(--font-size-sm)", color: c.color, marginBottom: "var(--spacing-sm)", paddingLeft: "40px" }}>
      <div className="flex" style={{ gap: "2px" }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{ width: 5, height: 5, background: i <= dots ? "currentColor" : "var(--bg-code)" }}
          />
        ))}
      </div>
      {c.label}
    </div>
  );
}

function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end" style={{ marginBottom: "var(--spacing-lg)" }}>
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-full)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            maxWidth: "80%",
            fontSize: "var(--font-size-base)",
            lineHeight: "var(--line-height-base)",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={isLatest ? "animate-fade-in" : ""} style={{ marginBottom: "var(--spacing-lg)" }}>
      <div className="flex items-center" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-sm)" }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, var(--accent), #7C3AED)",
          }}
        >
          <Sparkles size={13} color="white" />
        </div>
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)" }}>Discovery</span>
      </div>

      {message.confidence && <ConfidenceIndicator level={message.confidence} />}

      <div style={{ paddingLeft: "40px" }}>
        <p style={{
          fontSize: "var(--font-size-base)",
          lineHeight: "1.6",
          color: "var(--text-secondary)",
          whiteSpace: "pre-line",
          marginBottom: "var(--spacing-mid)",
        }}>
          {message.content}
        </p>

        {message.assets && message.assets.length > 0 && (
          <div className="flex flex-col" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-mid)" }}>
            {message.assets.map((asset, i) => (
              <AssetCard key={i} asset={asset} />
            ))}
          </div>
        )}

        {message.followUp && (
          <div className="flex flex-wrap" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-mid)" }}>
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-primary)";
                  e.currentTarget.style.borderColor = "var(--text-disabled)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.borderColor = "var(--bg-code)";
                }}
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
          content: "I can help you find assets in your workspace. Try describing what you're looking for — for example:\n\n• \"What tables should I use to analyze revenue by product line?\"\n• \"Find dashboards about customer churn\"\n• \"I need data sources for a new pipeline\"",
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
    }, 1200 + Math.random() * 800);
  };

  const scenarios = [
    "What tables should I use to analyze revenue by product line?",
    "Find dashboards about customer churn",
    "I need the data sources for our nightly pipeline",
  ];

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className="flex flex-col"
        style={{
          width: 240,
          background: "var(--bg-primary)",
          borderRight: "1px solid var(--border)",
          padding: "var(--spacing-md) var(--spacing-sm)",
        }}
      >
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)", padding: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--accent), #7C3AED)",
            }}
          >
            <Sparkles size={14} color="white" />
          </div>
          <span className="font-semibold" style={{ fontSize: "var(--font-size-base)" }}>Discovery</span>
        </div>

        <button
          className="flex items-center w-full transition-colors rounded"
          style={{
            gap: "var(--spacing-sm)",
            padding: "var(--spacing-sm)",
            fontSize: "var(--font-size-base)",
            color: "var(--accent)",
            background: "transparent",
            border: "none",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Plus size={14} /> New conversation
        </button>

        <div style={{ marginTop: "var(--spacing-lg)" }}>
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--text-disabled)", padding: "var(--spacing-sm)", display: "block" }}>Recent</span>
          <div
            className="rounded transition-colors"
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
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col" style={{ background: "var(--bg-primary)" }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center" style={{ maxWidth: 560, margin: "0 auto" }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-lg)",
                  background: "linear-gradient(135deg, var(--accent), #7C3AED)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <Sparkles size={22} color="white" />
              </div>
              <h2 className="font-semibold" style={{ fontSize: "var(--font-size-lg)", marginBottom: "var(--spacing-sm)" }}>
                What are you looking for?
              </h2>
              <p style={{ fontSize: "var(--font-size-base)", color: "var(--text-secondary)", textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
                Describe what you need and I'll find the right assets in your workspace.
              </p>
              <div className="flex flex-col w-full" style={{ gap: "var(--spacing-sm)" }}>
                {scenarios.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                    className="flex items-center text-left transition-colors group"
                    style={{
                      gap: "var(--spacing-mid)",
                      fontSize: "var(--font-size-base)",
                      padding: "var(--spacing-mid) var(--spacing-md)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--bg-code)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
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
            <div
              className="flex items-center transition-colors"
              style={{
                gap: "var(--spacing-mid)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 24,
                padding: "var(--spacing-mid) var(--spacing-md)",
                boxShadow: "0px 4px 16px rgba(0,0,0,0.12)",
              }}
            >
              <Search size={16} style={{ color: "var(--text-placeholder)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Describe what you're looking for..."
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontSize: "var(--font-size-base)",
                  lineHeight: "var(--line-height-base)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-full)",
                  background: "var(--accent)",
                  border: "none",
                  flexShrink: 0,
                }}
              >
                <ArrowUp size={14} color="white" />
              </button>
            </div>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-disabled)", textAlign: "center", marginTop: "var(--spacing-sm)" }}>
              Reasons over metadata, lineage, and usage patterns to find what you need
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
