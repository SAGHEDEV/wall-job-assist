"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, id, style, ...props }, ref) => {
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
        <input
          ref={ref}
          id={inputId}
          style={{
            height: 36,
            padding: "0 12px",
            fontSize: 13,
            color: "var(--text-primary)",
            background: "var(--surface-0)",
            border: `1px solid ${error ? "var(--error)" : "var(--border-strong)"}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            width: "100%",
            fontFamily: "inherit",
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

Input.displayName = "Input";

export default Input;
