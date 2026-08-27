"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  minHeight?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id, minHeight = 120, style, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {label && (
          <label
            htmlFor={inputId}
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
        <textarea
          ref={ref}
          id={inputId}
          style={{
            minHeight,
            padding: "10px 12px",
            fontSize: 13,
            color: "var(--text-primary)",
            background: "var(--surface-0)",
            border: `1px solid ${error ? "var(--error)" : "var(--border-strong)"}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            width: "100%",
            fontFamily: "inherit",
            resize: "vertical",
            lineHeight: 1.6,
            transition: "border-color 0.15s",
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--text-tertiary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? "var(--error)"
              : "var(--border-strong)";
          }}
          {...props}
        />
        {error && (
          <p style={{ fontSize: 11, color: "var(--error)", margin: 0 }}>{error}</p>
        )}
        {helperText && !error && (
          <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
