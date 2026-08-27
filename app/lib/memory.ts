import { memwal } from "@/app/lib/memwal";
import type { Application, ApplicationStyle, MemoryUsedItem, ProfileData } from "@/app/types";

const PROFILE_QUERY = "[PROFILE] candidate professional profile";
const APPLICATION_QUERY = "Show me the applications this candidate has created";

function hashString(value: string): string {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash.toString(36);
}

function buildStableId(prefix: string, ...parts: string[]): string {
  const source = parts.filter(Boolean).join("|");
  const safe = source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
  return `${prefix}-${safe.slice(0, 28)}-${hashString(source)}`;
}

function formatProfileMemory(profile: ProfileData): string {
  const style = profile.applicationStyle ?? {
    tone: "professional",
    length: "standard",
    additionalPreferences: "",
    thingsToAvoid: "",
  };

  const skills = (profile.skills ?? []).map((skill) => skill.trim()).filter(Boolean);
  const projects = (profile.projects ?? []).map((project) => [
    "- Name: " + (project.name?.trim() || "Untitled Project"),
    `  Description: ${project.description?.trim() || ""}`,
    `  Technologies: ${project.technologies?.trim() || ""}`,
    `  Contribution: ${project.contribution?.trim() || ""}`,
    `  Achievement: ${project.achievement?.trim() || ""}`,
  ].join("\n")).join("\n");

  return [
    "[PROFILE]",
    `Created: ${profile.createdAt ?? new Date().toISOString()}`,
    `Name: ${profile.fullName || ""}`,
    `Role: ${profile.professionalTitle || ""}`,
    "",
    "[SUMMARY]",
    profile.professionalSummary || "",
    "",
    "[EXPERIENCE]",
    profile.experience || "",
    "",
    "[SKILLS]",
    ...skills,
    "",
    "[PROJECTS]",
    projects || "",
    "",
    "[ACHIEVEMENTS]",
    profile.achievements || "",
    "",
    "[PREFERENCES]",
    `Tone: ${style.tone || "professional"}`,
    `Length: ${style.length || "standard"}`,
    `Professional preferences: ${style.additionalPreferences || ""}`,
    `Avoid: ${style.thingsToAvoid || ""}`,
    "",
    "[CAREER GOALS]",
    profile.careerGoals || "",
  ].join("\n").trim();
}

function parseProfileMemory(text: string): ProfileData | null {
  const normalized = text.replace(/\r/g, "").trim();
  if (!normalized || !normalized.startsWith("[PROFILE]")) return null;

  const lines = normalized.split("\n");
  const parsedStyle: Partial<ApplicationStyle> = {
    tone: "professional",
    length: "standard",
    additionalPreferences: "",
    thingsToAvoid: "",
  };
  const profile: Partial<ProfileData> = {
    skills: [],
    projects: [],
    applicationStyle: { ...parsedStyle } as ApplicationStyle,
  };

  let section: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("[PROFILE]")) {
      section = "profile";
      continue;
    }

    if (line.startsWith("[SUMMARY]")) {
      section = "summary";
      continue;
    }

    if (line.startsWith("[EXPERIENCE]")) {
      section = "experience";
      continue;
    }

    if (line.startsWith("[SKILLS]")) {
      section = "skills";
      continue;
    }

    if (line.startsWith("[PROJECTS]")) {
      section = "projects";
      continue;
    }

    if (line.startsWith("[ACHIEVEMENTS]")) {
      section = "achievements";
      continue;
    }

    if (line.startsWith("[PREFERENCES]")) {
      section = "preferences";
      continue;
    }

    if (line.startsWith("[CAREER GOALS]")) {
      section = "goals";
      continue;
    }

    if (line.startsWith("Created:")) {
      profile.createdAt = line.replace("Created:", "").trim();
      continue;
    }

    if (line.startsWith("Name:")) {
      profile.fullName = line.replace("Name:", "").trim();
      continue;
    }

    if (line.startsWith("Role:")) {
      profile.professionalTitle = line.replace("Role:", "").trim();
      continue;
    }

    if (section === "summary") {
      profile.professionalSummary = (profile.professionalSummary ? `${profile.professionalSummary}\n` : "") + line;
      continue;
    }

    if (section === "experience") {
      profile.experience = (profile.experience ? `${profile.experience}\n` : "") + line;
      continue;
    }

    if (section === "skills") {
      const skill = line.replace(/^[-*]\s*/, "").trim();
      if (skill) profile.skills = [...(profile.skills ?? []), skill];
      continue;
    }

    if (section === "projects") {
      const stripped = line.replace(/^[-*]\s*/, "").trim();

      if (stripped.startsWith("Name:")) {
        const projectName = stripped.replace("Name:", "").trim();
        const existing = profile.projects ?? [];
        const nextProject = {
          id: buildStableId("project", projectName, String(existing.length)),
          name: projectName,
          description: "",
          technologies: "",
          contribution: "",
          achievement: "",
        };
        profile.projects = [...existing, nextProject];
        continue;
      }

      if (stripped.startsWith("Description:")) {
        const current = (profile.projects ?? []).at(-1);
        if (current) current.description = stripped.replace("Description:", "").trim();
        continue;
      }

      if (stripped.startsWith("Technologies:")) {
        const current = (profile.projects ?? []).at(-1);
        if (current) current.technologies = stripped.replace("Technologies:", "").trim();
        continue;
      }

      if (stripped.startsWith("Contribution:")) {
        const current = (profile.projects ?? []).at(-1);
        if (current) current.contribution = stripped.replace("Contribution:", "").trim();
        continue;
      }

      if (stripped.startsWith("Achievement:")) {
        const current = (profile.projects ?? []).at(-1);
        if (current) current.achievement = stripped.replace("Achievement:", "").trim();
        continue;
      }

      if (stripped && !stripped.includes(":")) {
        profile.projects = [...(profile.projects ?? []), {
          id: buildStableId("project", stripped, String((profile.projects ?? []).length)),
          name: stripped,
          description: "",
          technologies: "",
          contribution: "",
          achievement: "",
        }];
      }
      continue;
    }

    if (section === "achievements") {
      profile.achievements = (profile.achievements ? `${profile.achievements}\n` : "") + line;
      continue;
    }

    if (section === "preferences") {
      if (line.startsWith("Tone:")) {
        const toneValue = line.replace("Tone:", "").trim();
        profile.applicationStyle = {
          ...(profile.applicationStyle ?? { tone: "professional", length: "standard", additionalPreferences: "", thingsToAvoid: "" }),
          tone: (toneValue === "professional" || toneValue === "confident" || toneValue === "conversational" || toneValue === "technical" ? toneValue : "professional") as ApplicationStyle["tone"],
        };
      }
      if (line.startsWith("Length:")) {
        const lengthValue = line.replace("Length:", "").trim();
        profile.applicationStyle = {
          ...(profile.applicationStyle ?? { tone: "professional", length: "standard", additionalPreferences: "", thingsToAvoid: "" }),
          length: (lengthValue === "concise" || lengthValue === "standard" || lengthValue === "detailed" ? lengthValue : "standard") as ApplicationStyle["length"],
        };
      }
      if (line.startsWith("Professional preferences:")) {
        profile.applicationStyle = { ...(profile.applicationStyle ?? { tone: "professional", length: "standard", additionalPreferences: "", thingsToAvoid: "" }), additionalPreferences: line.replace("Professional preferences:", "").trim() };
      }
      if (line.startsWith("Avoid:")) {
        profile.applicationStyle = { ...(profile.applicationStyle ?? { tone: "professional", length: "standard", additionalPreferences: "", thingsToAvoid: "" }), thingsToAvoid: line.replace("Avoid:", "").trim() };
      }
      continue;
    }

    if (section === "goals") {
      profile.careerGoals = (profile.careerGoals ? `${profile.careerGoals}\n` : "") + line;
    }
  }

  if (!profile.fullName && !profile.professionalTitle && !profile.experience && !profile.skills?.length) {
    return null;
  }

  return {
    createdAt: profile.createdAt ?? new Date().toISOString(),
    fullName: profile.fullName ?? "",
    professionalTitle: profile.professionalTitle ?? "",
    professionalSummary: profile.professionalSummary ?? "",
    experience: profile.experience ?? "",
    skills: profile.skills ?? [],
    projects: profile.projects ?? [],
    achievements: profile.achievements ?? "",
    careerGoals: profile.careerGoals ?? "",
    applicationStyle: {
      tone: profile.applicationStyle?.tone ?? "professional",
      length: profile.applicationStyle?.length ?? "standard",
      additionalPreferences: profile.applicationStyle?.additionalPreferences ?? "",
      thingsToAvoid: profile.applicationStyle?.thingsToAvoid ?? "",
    },
  };
}

function parseApplicationMemory(text: string): Partial<Application> | null {
  const normalized = text.replace(/\r/g, "").trim();
  if (!normalized.startsWith("[APPLICATION]")) return null;

  const lines = normalized.split("\n");
  const application: Partial<Application> = { memoriesUsed: [] };
  let inJobDescription = false;
  let inCoverLetter = false;
  let inMemories = false;
  const jobDescriptionLines: string[] = [];
  const coverLetterLines: string[] = [];
  const memoryLines: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("[APPLICATION]")) continue;
    if (line.startsWith("ID:")) {
      application.id = line.replace("ID:", "").trim();
      continue;
    }
    if (line.startsWith("Company:")) {
      application.company = line.replace("Company:", "").trim();
      continue;
    }
    if (line.startsWith("Role:")) {
      application.role = line.replace("Role:", "").trim();
      continue;
    }
    if (line.startsWith("Date:")) {
      application.date = line.replace("Date:", "").trim();
      continue;
    }
    if (line.startsWith("Created:")) {
      application.date = line.replace("Created:", "").trim();
      continue;
    }
    if (line === "JOB DESCRIPTION:") {
      inJobDescription = true;
      inCoverLetter = false;
      inMemories = false;
      continue;
    }
    if (line === "COVER LETTER:") {
      inJobDescription = false;
      inCoverLetter = true;
      inMemories = false;
      continue;
    }
    if (line === "MEMORIES USED:") {
      inJobDescription = false;
      inCoverLetter = false;
      inMemories = true;
      continue;
    }
    if (inJobDescription) {
      jobDescriptionLines.push(line);
      continue;
    }
    if (inCoverLetter) {
      coverLetterLines.push(line);
      continue;
    }
    if (inMemories && line.startsWith("- ")) {
      memoryLines.push(line.replace("- ", "").trim());
    }
  }

  application.jobDescription = jobDescriptionLines.join("\n").trim();
  application.coverLetter = coverLetterLines.join("\n").trim();
  application.memoriesUsed = memoryLines.map((excerpt, index) => ({
    id: `memory-${index}`,
    label: index === 0 ? "Relevant memory" : "Memory",
    excerpt,
    category: "memory",
  }));

  if (!application.company || !application.role) return null;

  const fallbackId = buildStableId("application", application.company, application.role, application.date ?? "");
  return {
    ...application,
    id: application.id ?? fallbackId,
  };
}

function toMemoryUsedItems(results: Array<{ text?: string }>): MemoryUsedItem[] {
  const seen = new Set<string>();
  const memories: MemoryUsedItem[] = [];

  results.forEach((entry, index) => {
    const text = entry?.text?.trim();
    if (!text || seen.has(text)) return;
    seen.add(text);

    memories.push({
      id: `mem-${Date.now()}-${index}`,
      label: index === 0 ? "Relevant experience" : "Professional memory",
      excerpt: text.length > 140 ? `${text.slice(0, 140)}…` : text,
      category: index === 0 ? "experience" : "memory",
    });
  });

  return memories;
}

export async function getProfile(): Promise<ProfileData | null> {
  try {
    const result = await memwal.recall({ query: PROFILE_QUERY, limit: 10 });
    const parsed = (result?.results ?? [])
      .map((entry) => entry?.text ?? "")
      .filter((text) => text.includes("[PROFILE]"))
      .map((text) => parseProfileMemory(text))
      .filter((profile): profile is ProfileData => Boolean(profile));

    if (parsed.length === 0) return null;

    parsed.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return parsed[0];
  } catch {
    return null;
  }
}

export async function saveProfile(profile: ProfileData): Promise<{ success: boolean; savedSections: string[]; error?: string }> {
  try {
    const memory = formatProfileMemory(profile);
    const job = await memwal.remember(memory);
    await memwal.waitForRememberJob(job.job_id);

    return {
      success: true,
      savedSections: ["about", "experience", "skills", "projects", "preferences", "goals"],
    };
  } catch (error) {
    return {
      success: false,
      savedSections: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function recallRelevantMemories(query: string, limit = 5): Promise<MemoryUsedItem[]> {
  try {
    const result = await memwal.recall({ query, limit });
    return toMemoryUsedItems(result?.results ?? []);
  } catch {
    return [];
  }
}

export async function saveApplication(application: {
  company: string;
  role: string;
  jobDescription: string;
  coverLetter: string;
  memoriesUsed: MemoryUsedItem[];
  createdAt?: string;
}): Promise<void> {
  const createdAt = application.createdAt ?? new Date().toISOString();
  const applicationId = buildStableId("application", application.company || "Not specified", application.role || "Not specified", createdAt);
  const memory = [
    "[APPLICATION]",
    `ID: ${applicationId}`,
    `Company: ${application.company || "Not specified"}`,
    `Role: ${application.role || "Not specified"}`,
    `Created: ${createdAt}`,
    "",
    "JOB DESCRIPTION:",
    application.jobDescription.trim(),
    "",
    "COVER LETTER:",
    application.coverLetter.trim(),
    "",
    "MEMORIES USED:",
    ...application.memoriesUsed.map((memoryItem) => `- ${memoryItem.excerpt}`),
  ].join("\n");

  const job = await memwal.remember(memory);
  await memwal.waitForRememberJob(job.job_id);
}

export async function getApplications(): Promise<Application[]> {
  try {
    const result = await memwal.recall({ query: APPLICATION_QUERY, limit: 20 });

    return (result?.results ?? [])
      .map((entry) => parseApplicationMemory(entry?.text ?? ""))
      .filter((app): app is Application => Boolean(app && app.company && app.role))
      .map((app) => ({
        id: app.id ?? buildStableId("application", app.company ?? "", app.role ?? "", app.date ?? ""),
        company: app.company ?? "",
        role: app.role ?? "",
        date: app.date ?? new Date().toISOString(),
        status: app.status ?? "generated",
        jobDescription: app.jobDescription ?? "",
        coverLetter: app.coverLetter ?? "",
        memoriesUsed: app.memoriesUsed ?? [],
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getApplication(id: string): Promise<Application | null> {
  try {
    const applications = await getApplications();
    return applications.find((application) => application.id === id) ?? null;
  } catch {
    return null;
  }
}
