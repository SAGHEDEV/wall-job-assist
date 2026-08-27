"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/layout/PageHeader";
import GenerationProgress from "@/app/components/apply/GenerationProgress";
import CoverLetter from "@/app/components/result/CoverLetter";
import MemoryUsed from "@/app/components/memory/MemoryUsed";
import Button from "@/app/components/ui/Button";
import Toast from "@/app/components/shared/Toast";
import { generateApplication } from "@/app/services/generate";
import type { GenerateResult, ToastMessage } from "@/app/types";

type Phase = "generating" | "done" | "error";

export default function ResultPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("generating");
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [saved, setSaved] = useState(false);

  const addToast = useCallback((t: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [...prev, { ...t, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("waljob_generating");
    if (!raw) {
      router.replace("/apply");
      return;
    }

    const formData = JSON.parse(raw) as {
      jobDescription: string;
      company: string;
      role: string;
      jobUrl: string;
    };

    setCompany(formData.company);
    setRole(formData.role);

    // Minimum progress display: wait at least 5.5s so all 4 steps animate
    const minDelay = new Promise<void>((r) => setTimeout(r, 5500));

    const fetchResult = generateApplication(formData);

    Promise.all([fetchResult, minDelay]).then(([res]) => {
      if (res.success) {
        setResult(res);
        setPhase("done");
      } else {
        setPhase("error");
        addToast({ type: "error", title: "Generation failed", description: res.error ?? "Something went wrong." });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegenerate = () => {
    sessionStorage.removeItem("waljob_generating");
    router.push("/apply");
  };

  const handleSave = async () => {
    const raw = sessionStorage.getItem("waljob_generating");
    if (!raw || !result) {
      return;
    }

    const formData = JSON.parse(raw) as {
      jobDescription: string;
      company: string;
      role: string;
      jobUrl: string;
    };

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: formData.company || company || "Not specified",
        role: formData.role || role || "Not specified",
        jobDescription: formData.jobDescription,
        coverLetter: result.coverLetter,
        memoriesUsed: result.memoriesUsed,
        createdAt: new Date().toISOString(),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      addToast({ type: "error", title: "Couldn't save application", description: payload.error ?? "Try again in a moment." });
      return;
    }

    setSaved(true);
    addToast({ type: "success", title: "Application saved", description: "Stored in your application history." });
  };

  if (phase === "generating") {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <PageHeader
          eyebrow="New Application"
          title="Generating your application…"
          subtitle="WalJob is searching your professional memory and writing your cover letter."
        />
        <GenerationProgress />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <PageHeader title="Something went wrong" subtitle="We couldn't generate your application. Please try again." />
        <Button variant="primary" size="md" onClick={handleRegenerate} style={{ alignSelf: "flex-start" }}>
          ← Back to apply
        </Button>
        <Toast messages={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
          Your application
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            {role || "Cover Letter"}
          </h1>
          {company && (
            <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 400 }}>at {company}</span>
          )}
        </div>
      </div>

      {/* Memory flow visual */}
      <div
        style={{
          marginBottom: 32,
          padding: "12px 16px",
          background: "var(--surface-0)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          fontSize: 11,
          color: "var(--text-tertiary)",
          fontWeight: 500,
          letterSpacing: "0.04em",
        }}
      >
        <span style={{ color: "var(--text-secondary)" }}>Job requirements</span>
        <span>+</span>
        <span style={{ color: "var(--text-secondary)" }}>Your professional memory</span>
        <span>=</span>
        <span
          style={{
            color: "var(--text-primary)",
            fontWeight: 600,
            background: "var(--surface-1)",
            border: "1px solid var(--border-strong)",
            borderRadius: 4,
            padding: "2px 8px",
          }}
        >
          Tailored application
        </span>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 32,
          alignItems: "flex-start",
        }}
        className="result-grid"
      >
        {/* Left — Memory Used */}
        <div
          style={{
            position: "sticky",
            top: 80,
            padding: "20px",
            background: "var(--surface-0)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
          }}
          className="memory-panel"
        >
          <MemoryUsed memories={result.memoriesUsed} />
        </div>

        {/* Right — Cover Letter */}
        <div>
          <CoverLetter
            content={result.coverLetter}
            onRegenerate={handleRegenerate}
            onSave={saved ? undefined : handleSave}
          />
        </div>
      </div>

      <Toast messages={toasts} onDismiss={dismissToast} />

      <style>{`
        @media (max-width: 860px) {
          .result-grid { grid-template-columns: 1fr !important; }
          .memory-panel { position: static !important; }
        }
      `}</style>
    </div>
  );
}
