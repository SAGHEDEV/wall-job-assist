"use client";

import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export default function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  helperText,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: "8px 10px",
          background: "var(--surface-0)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-md)",
          minHeight: 44,
          alignItems: "center",
          cursor: "text",
        }}
        onClick={(e) => {
          const input = (e.currentTarget as HTMLElement).querySelector("input");
          input?.focus();
        }}
      >
        {value.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-primary)",
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "3px 8px",
            }}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                color: "var(--text-tertiary)",
                fontSize: 14,
                lineHeight: 1,
              }}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          style={{
            flex: 1,
            minWidth: 120,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13,
            color: "var(--text-primary)",
            fontFamily: "inherit",
          }}
          aria-label={label ?? "Add tag"}
        />
      </div>
      {helperText && (
        <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>{helperText}</p>
      )}
    </div>
  );
}
