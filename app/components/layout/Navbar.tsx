"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "@/app/lib/profile-state";

const navLinks = [
  { href: "/profile", label: "My Profile" },
  { href: "/apply", label: "New Application" },
  { href: "/applications", label: "Applications" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { profileStatus } = useProfile();
  const memoryReady = profileStatus === "profile-exists";

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface-0)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            WalJob Assist
          </span>
        </Link>

        {/* Nav links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Link
            href="/profile"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: memoryReady ? "var(--text-primary)" : "var(--text-secondary)",
              textDecoration: "none",
              padding: "5px 8px",
              borderRadius: "var(--radius-sm)",
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              marginRight: 4,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: memoryReady ? "var(--success)" : "var(--text-tertiary)", display: "inline-block" }} />
            {memoryReady ? "Memory ready" : "Memory not set up"}
          </Link>
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  textDecoration: "none",
                  padding: "5px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: isActive ? "var(--surface-1)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.target as HTMLElement).style.background = "var(--surface-1)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
