import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
        gap: 12,
      }}
    >
      {icon ?? (
        <div
          style={{
            width: 40,
            height: 40,
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="5" width="12" height="10" rx="1.5" stroke="var(--text-tertiary)" strokeWidth="1.3" />
            <path d="M6 5V4a3 3 0 016 0v1" stroke="var(--text-tertiary)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 500,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </p>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--text-secondary)",
            maxWidth: 320,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          style={{
            marginTop: 8,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
            background: "var(--surface-1)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            padding: "8px 16px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
