"use client";

import type { Project } from "@/app/types";

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}

export default function ProjectCard({ project, index, onEdit, onRemove }: ProjectCardProps) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "var(--surface-0)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-tertiary)",
              margin: "0 0 2px 0",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Project {index + 1}
          </p>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {project.name || "Untitled Project"}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={onEdit}
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onRemove}
            style={{
              fontSize: 12,
              color: "var(--error)",
              background: "transparent",
              border: "1px solid rgba(220,38,38,0.15)",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Remove
          </button>
        </div>
      </div>

      {project.description && (
        <p
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {project.description}
        </p>
      )}

      {project.technologies && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {project.technologies.split(",").map((t) => (
            <span
              key={t.trim()}
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "2px 6px",
              }}
            >
              {t.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
