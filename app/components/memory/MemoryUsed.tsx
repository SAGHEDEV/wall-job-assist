import type { MemoryUsedItem } from "@/app/types";
import MemoryCard from "./MemoryCard";

interface MemoryUsedProps {
  memories: MemoryUsedItem[];
}

export default function MemoryUsed({ memories }: MemoryUsedProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: 6,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="var(--text-secondary)" strokeWidth="1.3" />
            <circle cx="5.5" cy="5.5" r="1.5" fill="var(--text-secondary)" />
          </svg>
        </div>
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Memory Used
          </p>
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "var(--text-tertiary)",
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "2px 8px",
          }}
        >
          {memories.length} {memories.length === 1 ? "memory" : "memories"}
        </span>
      </div>

      {/* Memory cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {memories.map((m) => (
          <MemoryCard key={m.id} memory={m} />
        ))}
      </div>

      {/* Footer note */}
      <p
        style={{
          fontSize: 11,
          color: "var(--text-tertiary)",
          margin: 0,
          lineHeight: 1.5,
          paddingTop: 4,
          borderTop: "1px solid var(--border)",
        }}
      >
        These memories were retrieved from your professional memory for this application.
      </p>
    </div>
  );
}
