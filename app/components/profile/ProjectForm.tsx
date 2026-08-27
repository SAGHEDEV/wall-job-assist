"use client";

import { useState } from "react";
import type { Project } from "@/app/types";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Button from "@/app/components/ui/Button";

interface ProjectFormProps {
  initial?: Partial<Project>;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<Project>({
    id: initial?.id ?? generateId(),
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    technologies: initial?.technologies ?? "",
    contribution: initial?.contribution ?? "",
    achievement: initial?.achievement ?? "",
  });

  const set = (key: keyof Project, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--surface-1)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <Input
        label="Project name"
        placeholder="e.g. AI-powered booking platform"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
      />
      <Textarea
        label="Description"
        placeholder="What is this project? What problem does it solve?"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        minHeight={80}
      />
      <Input
        label="Technologies"
        placeholder="e.g. React, Next.js, TypeScript, Stripe"
        helperText="Comma-separated"
        value={form.technologies}
        onChange={(e) => set("technologies", e.target.value)}
      />
      <Textarea
        label="Your contribution"
        placeholder="What specifically did you build or own on this project?"
        value={form.contribution}
        onChange={(e) => set("contribution", e.target.value)}
        minHeight={80}
      />
      <Textarea
        label="Achievement / result (optional)"
        placeholder="e.g. Reduced load time by 40%, shipped to 10k users"
        value={form.achievement}
        onChange={(e) => set("achievement", e.target.value)}
        minHeight={60}
      />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={!form.name.trim()}
        >
          Save project
        </Button>
      </div>
    </div>
  );
}
