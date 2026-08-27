// ─────────────────────────────────────────────
// Profile / Memory types
// ─────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  contribution: string;
  achievement?: string;
}

export type Tone = "professional" | "confident" | "conversational" | "technical";
export type Length = "concise" | "standard" | "detailed";

export interface ApplicationStyle {
  tone: Tone;
  length: Length;
  additionalPreferences: string;
  thingsToAvoid: string;
}

export interface ProfileData {
  fullName: string;
  professionalTitle: string;
  professionalSummary: string;
  experience: string;
  skills: string[];
  projects: Project[];
  achievements: string;
  careerGoals: string;
  applicationStyle: ApplicationStyle;
}

export interface SaveProfileResult {
  success: boolean;
  savedSections: string[];
  error?: string;
}

// ─────────────────────────────────────────────
// Application / Generation types
// ─────────────────────────────────────────────

export interface GenerateRequest {
  jobDescription: string;
  company?: string;
  role?: string;
  jobUrl?: string;
}

export interface MemoryUsedItem {
  id: string;
  label: string;
  excerpt: string;
  category: string;
}

export interface GenerateResult {
  success: boolean;
  coverLetter: string;
  memoriesUsed: MemoryUsedItem[];
  role?: string;
  company?: string;
  error?: string;
}

// ─────────────────────────────────────────────
// Application history types
// ─────────────────────────────────────────────

export type ApplicationStatus = "generated" | "submitted" | "interviewing" | "rejected" | "offer";

export interface Application {
  id: string;
  company: string;
  role: string;
  date: string; // ISO date string
  status: ApplicationStatus;
  jobDescription?: string;
  coverLetter?: string;
  memoriesUsed?: MemoryUsedItem[];
}

// ─────────────────────────────────────────────
// UI state types
// ─────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}
