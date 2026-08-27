"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import type { ButtonVariant, ButtonSize } from "@/app/types";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      fullWidth = false,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
      sm: { fontSize: 12, padding: "6px 12px", height: 30 },
      md: { fontSize: 13, padding: "8px 16px", height: 36 },
      lg: { fontSize: 14, padding: "10px 20px", height: 42 },
    };

    const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        background: "var(--accent)",
        color: "var(--accent-fg)",
        border: "1px solid transparent",
      },
      secondary: {
        background: "var(--surface-0)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-strong)",
      },
      ghost: {
        background: "transparent",
        color: "var(--text-secondary)",
        border: "1px solid transparent",
      },
      danger: {
        background: "transparent",
        color: "var(--error)",
        border: "1px solid rgba(220,38,38,0.2)",
      },
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontWeight: 500,
          borderRadius: "var(--radius-md)",
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? "100%" : undefined,
          fontFamily: "inherit",
          lineHeight: 1,
          letterSpacing: "-0.01em",
          transition: "background 0.15s, opacity 0.15s, border-color 0.15s",
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isDisabled && variant === "primary") {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-hover)";
          }
          if (!isDisabled && variant === "secondary") {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-1)";
          }
          if (!isDisabled && variant === "ghost") {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-1)";
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          if (variant === "primary") el.style.background = "var(--accent)";
          if (variant === "secondary") el.style.background = "var(--surface-0)";
          if (variant === "ghost") el.style.background = "transparent";
        }}
        {...props}
      >
        {loading && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ animation: "spin 0.8s linear infinite" }}
          >
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="10" />
          </svg>
        )}
        {loading && loadingText ? loadingText : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
