import type { ProfileData, SaveProfileResult } from "@/app/types";

export async function saveProfile(data: ProfileData): Promise<SaveProfileResult> {
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    return {
      success: false,
      savedSections: [],
      error: json.error ?? "Failed to save profile",
    };
  }

  return res.json();
}
