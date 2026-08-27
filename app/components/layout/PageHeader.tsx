interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 40 }}>
      {eyebrow && (
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 10,
          }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          margin: "0 0 8px 0",
          lineHeight: 1.25,
          fontFamily: "var(--font-rochester), Georgia, serif",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 540,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
