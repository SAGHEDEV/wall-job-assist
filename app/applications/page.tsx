"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/components/layout/PageHeader";
import ApplicationCard from "@/app/components/applications/ApplicationCard";
import EmptyState from "@/app/components/shared/EmptyState";
import type { Application } from "@/app/types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/applications", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!controller.signal.aborted) {
          setApplications(d.applications ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <PageHeader
        eyebrow="History"
        title="Applications"
        subtitle="Your recent applications — with the memories WalJob used to write them."
      />

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 68,
                background: "var(--surface-1)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                opacity: 1 - i * 0.2,
              }}
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Create your first application by pasting a job description. WalJob will use your professional memory to tailor it."
          action={{ label: "Create an application", href: "/apply" }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
