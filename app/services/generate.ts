import type { GenerateRequest, GenerateResult } from "@/app/types";

export async function generateApplication(data: GenerateRequest): Promise<GenerateResult> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    return {
      success: false,
      coverLetter: "",
      memoriesUsed: [],
      error: json.error ?? "Failed to generate application",
    };
  }

  return res.json();
}
