import type { Application } from "@/app/types";

export async function getApplications(): Promise<Application[]> {
  const res = await fetch("/api/applications", { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return json.applications ?? [];
}

export async function getApplication(id: string): Promise<Application | null> {
  const applications = await getApplications();
  return applications.find((application) => application.id === id) ?? null;
}
