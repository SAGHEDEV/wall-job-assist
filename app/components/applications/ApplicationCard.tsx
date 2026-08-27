import Link from "next/link";
import type { Application, ApplicationStatus } from "@/app/types";

interface ApplicationCardProps {
  application: Application;
}

const statusLabel: Record<ApplicationStatus, string> = {
  generated: "Generated",
  submitted: "Submitted",
  interviewing: "Interviewing",
  rejected: "Rejected",
  offer: "Offer",
};

const statusColor: Record<ApplicationStatus, string> = {
  generated: "var(--text-tertiary)",
  submitted: "#3b82f6",
  interviewing: "#f59e0b",
  rejected: "var(--error)",
  offer: "var(--success)",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link
      href={`/applications/${application.id}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: "var(--surface-0)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        textDecoration: "none",
        gap: 12,
        flexWrap: "wrap",
        transition: "border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLElement).style.background = "var(--surface-1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.background = "var(--surface-0)";
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          {application.company || "—"}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          {application.role || "—"}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
          {formatDate(application.date)}
        </p>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: statusColor[application.status],
            background: `${statusColor[application.status]}14`,
            border: `1px solid ${statusColor[application.status]}30`,
            borderRadius: 20,
            padding: "2px 10px",
          }}
        >
          {statusLabel[application.status]}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <path d="M5 3l4 4-4 4" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
