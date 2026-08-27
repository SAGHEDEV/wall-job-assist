"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";

interface CoverLetterProps {
  content: string;
  onRegenerate?: () => void;
  onSave?: () => void;
}

export default function CoverLetter({ content, onRegenerate, onSave }: CoverLetterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(isEditing ? editedContent : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-tertiary)",
            margin: 0,
          }}
        >
          Cover Letter
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5l2 2 5-5" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <rect x="3.5" y="3.5" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 7.5V2a1 1 0 011-1h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Copy
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? "Done editing" : "Edit"}
          </Button>
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate}>
              Regenerate
            </Button>
          )}
          {onSave && (
            <Button variant="primary" size="sm" onClick={onSave}>
              Save application
            </Button>
          )}
        </div>
      </div>

      {/* Content area */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          style={{
            width: "100%",
            minHeight: 480,
            padding: "24px",
            fontSize: 14,
            lineHeight: 1.75,
            color: "var(--text-primary)",
            background: "var(--surface-0)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
          }}
        />
      ) : (
        <div
          style={{
            padding: "28px 32px",
            background: "var(--surface-0)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            minHeight: 480,
          }}
        >
          <p className="prose-letter">{isEditing ? editedContent : content}</p>
        </div>
      )}
    </div>
  );
}
