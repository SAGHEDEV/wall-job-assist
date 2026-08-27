"use client";

import { useEffect } from "react";
import type { ToastMessage } from "@/app/types";

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

const toastBg: Record<ToastMessage["type"], string> = {
  success: "var(--success)",
  error: "var(--error)",
  info: "var(--accent)",
};

export default function Toast({ messages, onDismiss }: ToastProps) {
  useEffect(() => {
    if (messages.length === 0) return;
    const timers = messages.map((m) =>
      setTimeout(() => onDismiss(m.id), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [messages, onDismiss]);

  if (messages.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 340,
      }}
      aria-live="polite"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="fade-in"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "12px 14px",
            background: "var(--surface-0)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {/* Color bar */}
          <div
            style={{
              width: 3,
              alignSelf: "stretch",
              borderRadius: 2,
              background: toastBg[msg.type],
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {msg.title}
            </p>
            {msg.description && (
              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {msg.description}
              </p>
            )}
          </div>
          <button
            onClick={() => onDismiss(msg.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-tertiary)",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
              fontFamily: "inherit",
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
