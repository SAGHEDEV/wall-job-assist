import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Tell us about yourself",
    body: "Save your professional context once — experience, skills, projects, and preferences.",
  },
  {
    n: "02",
    title: "Paste a job description",
    body: "Give WalJob the opportunity you're applying for.",
  },
  {
    n: "03",
    title: "Let memory do the matching",
    body: "WalJob recalls the experience most relevant to the role from your persistent memory.",
  },
  {
    n: "04",
    title: "Get a personalized application",
    body: "Generate a cover letter based on your real experience — not a generic template.",
  },
];

const flowSteps = [
  "YOUR PROFILE",
  "WALRUS MEMORY",
  "NEW JOB",
  "RELEVANT EXPERIENCE",
  "PERSONALIZED APPLICATION",
];

export default function Home() {
  return (
    <div style={{ background: "var(--background)" }}>
      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "96px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="home-hero"
      >
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: 0,
            }}
          >
            Your career, remembered
          </p>

          <h1
            style={{
              fontSize: 52,
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              color: "var(--text-primary)",
              margin: 0,
              fontFamily: "var(--font-rochester), Georgia, serif",
            }}
          >
            Stop rewriting who you are for every job.
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 440,
            }}
          >
            WalJob Assist remembers your experience, skills, projects, and
            preferences — then uses the right context to tailor every
            application.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <Link
              href="/profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 40,
                padding: "0 20px",
                fontSize: 13,
                fontWeight: 500,
                background: "var(--accent)",
                color: "var(--accent-fg)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              Build my profile
            </Link>
            <Link
              href="/apply"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 40,
                padding: "0 20px",
                fontSize: 13,
                fontWeight: 500,
                background: "var(--surface-0)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              Create an application
            </Link>
          </div>
        </div>

        {/* Right — memory flow */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            padding: "32px",
            background: "var(--surface-0)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          {flowSteps.map((step, i) => (
            <div
              key={step}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
              }}
            >
              <div
                style={{
                  padding: "8px 16px",
                  background: i === 0 || i === flowSteps.length - 1 ? "var(--accent)" : "var(--surface-1)",
                  color: i === 0 || i === flowSteps.length - 1 ? "var(--accent-fg)" : "var(--text-primary)",
                  border: `1px solid ${i === 0 || i === flowSteps.length - 1 ? "transparent" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                {step}
              </div>
              {i < flowSteps.length - 1 && (
                <div
                  style={{
                    fontSize: 18,
                    color: "var(--text-tertiary)",
                    lineHeight: 1,
                    padding: "6px 0",
                    userSelect: "none",
                  }}
                >
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* ── How it works ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "72px 24px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 12,
          }}
        >
          How it works
        </p>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: 48,
          }}
        >
          Four steps. One persistent memory.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
          className="how-it-works-grid"
        >
          {steps.map((s) => (
            <div
              key={s.n}
              style={{
                padding: "28px 24px",
                background: "var(--surface-0)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.06em",
                }}
              >
                {s.n}
              </span>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                {s.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 80px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            padding: "40px 48px",
            background: "var(--surface-0)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              Tell WalJob who you are once.
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
              Let it remember for every application.
            </p>
          </div>
          <Link
            href="/profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: 40,
              padding: "0 20px",
              fontSize: 13,
              fontWeight: 500,
              background: "var(--accent)",
              color: "var(--accent-fg)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Get started →
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .home-hero { grid-template-columns: 1fr !important; gap: 40px !important; padding: 48px 20px !important; }
          .how-it-works-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .how-it-works-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
