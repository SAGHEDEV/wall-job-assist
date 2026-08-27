"use client";

import type { MemoryUsedItem } from "@/app/types";

interface MemoryCardProps {
  memory: MemoryUsedItem;
}

const categoryColors: Record<string, string> = {
  experience: "#3b82f6",
  skills: "#8b5cf6",
  style: "#10b981",
  project: "#f59e0b",
  achievement: "#ef4444",
  goals: "#6366f1",
  default: "var(--text-tertiary)",
};

export default function MemoryCard({ memory }: MemoryCardProps) {
  const color = categoryColors[memory.category] ?? categoryColors.default;

  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--surface-0)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {memory.label}
        </span>
      </div>
      <p
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          margin: 0,
          lineHeight: 1.55,
          paddingLeft: 13,
        }}
      >
        {memory.excerpt}
      </p>
    </div>
  );
}
