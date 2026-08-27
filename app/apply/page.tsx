"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";
import Toast from "@/app/components/shared/Toast";
import { useProfile } from "@/app/lib/profile-state";
import type { ToastMessage } from "@/app/types";

export default function ApplyPage() {
  const router = useRouter();
  const { profileStatus, hasProfile } = useProfile();
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((t: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [...prev, { ...t, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleGenerate = async () => {
    if (!hasProfile) {
      router.push("/profile");
      return;
    }

    if (!jobDescription.trim()) {
      addToast({ type: "error", title: "Job description required", description: "Paste the full job description to continue." });
      return;
    }

    setLoading(true);

    sessionStorage.setItem("waljob_generating", JSON.stringify({ jobDescription, company, role, jobUrl }));
    router.push("/apply/result");
  };

  if (profileStatus === "checking") {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <PageHeader eyebrow="New Application" title="Checking your professional memory..." subtitle="We’re verifying whether your profile is ready for personalization." />
      </div>
    );
  }

  if (profileStatus === "error") {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <PageHeader
          eyebrow="New Application"
          title="Your professional memory is unavailable."
          subtitle="We could not reach your saved profile. Please try again in a moment."
        />
        <div style={{ marginTop: 20, padding: "16px 18px", border: "1px solid var(--border)", background: "var(--surface-0)", borderRadius: "var(--radius-md)", color: "var(--error)" }}>
          We could not load your memory. Please refresh or return to your profile page and save it again.
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <PageHeader
          eyebrow="New Application"
          title="Your professional memory isn’t ready yet."
          subtitle="Before WalJob can personalize an application, tell us about your experience and preferences."
        />

        <div style={{ padding: "24px 20px", background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <Button variant="primary" size="lg">Build my profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <PageHeader
        eyebrow="New Application"
        title="Create a new application"
        subtitle="Give WalJob the job description. We'll find the experience that matters."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Main input */}
        <Textarea
          label="Job description"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          minHeight={280}
          id="job-description"
        />

        {/* Optional fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="apply-grid">
          <Input label="Company" placeholder="e.g. Acme" value={company} onChange={(e) => setCompany(e.target.value)} id="company" />
          <Input label="Role" placeholder="e.g. Frontend Engineer" value={role} onChange={(e) => setRole(e.target.value)} id="role" />
        </div>

        <Input label="Job URL (optional)" placeholder="https://..." value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} id="job-url" />

        {/* Memory context hint */}
        <div
          style={{
            padding: "14px 16px",
            background: "var(--surface-0)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "var(--surface-1)",
              border: "1px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <circle cx="4.5" cy="4.5" r="3.5" stroke="var(--text-tertiary)" strokeWidth="1.2" />
              <circle cx="4.5" cy="4.5" r="1.3" fill="var(--text-tertiary)" />
            </svg>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            WalJob will search your professional memory for experience relevant to this role — then use what it finds to write your application.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            loadingText="Generating…"
            onClick={handleGenerate}
            id="generate-btn"
          >
            Generate application
          </Button>
        </div>
      </div>

      <Toast messages={toasts} onDismiss={dismissToast} />

      <style>{`
        @media (max-width: 600px) {
          .apply-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
