"use client";

import { useEffect, useState } from "react";

type StepStatus = "pending" | "active" | "done";

interface Step {
  label: string;
  status: StepStatus;
}

const STEPS = [
  "Understanding the role",
  "Searching professional memory",
  "Matching relevant experience",
  "Writing your application",
];

const STEP_DELAYS = [0, 1400, 2900, 4400];

export default function GenerationProgress() {
  const [steps, setSteps] = useState<Step[]>(
    STEPS.map((label, i) => ({
      label,
      status: i === 0 ? "active" : "pending",
    }))
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((_, i) => {
      // Mark step as done after delay + 1.2s
      timers.push(
        setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, idx) => {
              if (idx < i) return { ...s, status: "done" };
              if (idx === i) return { ...s, status: "active" };
              if (idx === i + 1) return { ...s, status: "active" };
              return s;
            })
          );
        }, STEP_DELAYS[i] + 1200)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        alignItems: "center",
      }}
    >
      {/* Flow hint */}
      <div
        style={{
          fontSize: 11,
          color: "var(--text-tertiary)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 2,
        }}
      >
        Job Description → Memory → Matching → Generation
      </div>

      {/* Steps */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {steps.map((step, i) => (
          <div key={step.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {/* Connector column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 20,
                flexShrink: 0,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    step.status === "done"
                      ? "var(--success)"
                      : step.status === "active"
                      ? "var(--accent)"
                      : "var(--surface-2)",
                  transition: "background 0.4s",
                  flexShrink: 0,
                }}
              >
                {step.status === "done" ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.status === "active" ? (
                  <span
                    className="dot-pulse"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent-fg)",
                      display: "block",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--text-tertiary)",
                      display: "block",
                    }}
                  />
                )}
              </div>
              {/* Vertical line */}
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    minHeight: 28,
                    background: step.status === "done" ? "var(--success)" : "var(--border-strong)",
                    opacity: 0.4,
                    transition: "background 0.4s",
                    margin: "3px 0",
                  }}
                />
              )}
            </div>

            {/* Label */}
            <div style={{ paddingBottom: i < steps.length - 1 ? 20 : 0, paddingTop: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: step.status === "active" ? 500 : 400,
                  color:
                    step.status === "done"
                      ? "var(--text-secondary)"
                      : step.status === "active"
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                  transition: "color 0.4s",
                  letterSpacing: "-0.01em",
                }}
              >
                {step.label}
                {step.status === "done" && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 11,
                      color: "var(--success)",
                      fontWeight: 500,
                    }}
                  >
                    ✓
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: 12,
          color: "var(--text-tertiary)",
          margin: 0,
          textAlign: "center",
        }}
      >
        Retrieving your professional memory…
      </p>
    </div>
  );
}
