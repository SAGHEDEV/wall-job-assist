"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/app/components/layout/PageHeader";
import MemoryUsed from "@/app/components/memory/MemoryUsed";
import Button from "@/app/components/ui/Button";
import type { Application } from "@/app/types";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      router.replace("/applications");
      return;
    }

    const controller = new AbortController();

    fetch("/api/applications", { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (controller.signal.aborted) return;
        const found = (json.applications ?? []).find((item: Application) => item.id === id) ?? null;
        setApplication(found);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setApplication(null);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [params, router]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
        <PageHeader eyebrow="Application" title="Loading application..." subtitle="Finding the stored memory-backed draft." />
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <PageHeader eyebrow="Application" title="Application not found" subtitle="This saved application could not be loaded from memory." />
        <Link href="/applications" style={{ textDecoration: "none" }}>
          <Button variant="primary" size="md">Back to applications</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
          Application history
        </p>
        <h1 style={{ margin: "8px 0 0", fontSize: 32, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
          {application.role || "Application"}
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--text-secondary)" }}>
          {application.company || "Unknown company"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32, alignItems: "flex-start" }} className="detail-grid">
        <div style={{ padding: "20px", background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <MemoryUsed memories={application.memoriesUsed ?? []} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ padding: "20px 24px", background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
              Job description
            </p>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.7 }}>
              {application.jobDescription || "No job description stored."}
            </p>
          </div>

          <div style={{ padding: "20px 24px", background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
              Cover letter
            </p>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--text-primary)", lineHeight: 1.8 }}>
              {application.coverLetter || "No cover letter stored."}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/applications" style={{ textDecoration: "none" }}>
          <Button variant="secondary" size="md">← Back to applications</Button>
        </Link>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
