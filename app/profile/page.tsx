"use client";

import { useState, useCallback, useEffect } from "react";
import PageHeader from "@/app/components/layout/PageHeader";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import TagInput from "@/app/components/ui/TagInput";
import Button from "@/app/components/ui/Button";
import ProjectCard from "@/app/components/profile/ProjectCard";
import ProjectForm from "@/app/components/profile/ProjectForm";
import Toast from "@/app/components/shared/Toast";
import { useProfile } from "@/app/lib/profile-state";
import { saveProfile } from "@/app/services/profile";
import type { ProfileData, Project, ApplicationStyle, ToastMessage } from "@/app/types";

type SaveState = "idle" | "loading" | "success" | "error";

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40, borderBottom: "1px solid var(--border)" }}>
      <div>
        <h2 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const defaultStyle: ApplicationStyle = { tone: "professional", length: "standard", additionalPreferences: "", thingsToAvoid: "" };

export default function ProfilePage() {
  const { profile, profileStatus, refreshProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [professionalSummary, setProfessionalSummary] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [achievements, setAchievements] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [appStyle, setAppStyle] = useState<ApplicationStyle>(defaultStyle);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedSections, setSavedSections] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.fullName ?? "");
    setProfessionalTitle(profile.professionalTitle ?? "");
    setProfessionalSummary(profile.professionalSummary ?? "");
    setExperience(profile.experience ?? "");
    setSkills(profile.skills ?? []);
    setProjects(profile.projects ?? []);
    setAchievements(profile.achievements ?? "");
    setCareerGoals(profile.careerGoals ?? "");
    setAppStyle(profile.applicationStyle ?? defaultStyle);
  }, [profile]);

  const addToast = useCallback((t: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [...prev, { ...t, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
      setEditingProject(null);
    } else {
      setProjects((prev) => [...prev, project]);
      setShowProjectForm(false);
    }
  };

  const handleRemoveProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = async () => {
    if (!fullName.trim() || !professionalTitle.trim() || !experience.trim() || skills.length === 0 || !careerGoals.trim()) {
      addToast({ type: "error", title: "Complete the required profile details", description: "Full name, role, experience, skills, and career goals are required." });
      return;
    }

    setSaveState("loading");
    const data: ProfileData = {
      fullName, professionalTitle, professionalSummary,
      experience, skills, projects, achievements, careerGoals,
      applicationStyle: appStyle,
    };
    const result = await saveProfile(data);
    if (result.success) {
      setSaveState("success");
      setSavedSections(result.savedSections);
      setIsEditing(false);
      await refreshProfile();
      addToast({ type: "success", title: "Profile saved to memory", description: `${result.savedSections.length} sections stored in Walrus Memory.` });
    } else {
      setSaveState("error");
      addToast({ type: "error", title: "Couldn't save your profile", description: result.error ?? "Try again." });
    }
  };

  const sectionLabels: Record<string, string> = {
    about: "Profile", experience: "Experience", skills: "Skills",
    project: "Projects", achievements: "Achievements", goals: "Career goals", style: "Preferences",
  };

  if (profileStatus === "checking") {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <PageHeader
          eyebrow="Professional Memory"
          title="Checking your professional memory..."
          subtitle="We’re looking for your saved profile in Walrus Memory."
        />
      </div>
    );
  }

  const showExistingProfile = profileStatus === "profile-exists" && !isEditing;

  if (showExistingProfile && profile) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <PageHeader
          eyebrow="Professional Memory"
          title="Your professional memory"
          subtitle="WalJob already knows your professional context."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button variant="primary" size="md" onClick={() => setIsEditing(true)}>Edit profile</Button>
            <Button variant="secondary" size="md" onClick={() => refreshProfile()}>Refresh memory</Button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>About</p>
            <h3 style={{ margin: 0, fontSize: 24, letterSpacing: "-0.03em" }}>{profile.fullName || "Your name"}</h3>
            <p style={{ margin: "8px 0 0", color: "var(--text-secondary)" }}>{profile.professionalTitle || "Your role"}</p>
            {profile.professionalSummary && <p style={{ margin: "12px 0 0", color: "var(--text-secondary)", lineHeight: 1.6 }}>{profile.professionalSummary}</p>}
          </div>

          <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Experience</p>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--text-secondary)", lineHeight: 1.7 }}>{profile.experience || "No experience details saved yet."}</p>
          </div>

          <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Skills</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(profile.skills ?? []).map((skill) => (
                <span key={skill} style={{ display: "inline-flex", padding: "6px 10px", background: "var(--surface-1)", borderRadius: 999, border: "1px solid var(--border)", fontSize: 12, color: "var(--text-primary)" }}>{skill}</span>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Projects</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(profile.projects ?? []).map((project) => (
                <div key={project.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 12, background: "var(--surface-1)" }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{project.name}</p>
                  {project.description && <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.6 }}>{project.description}</p>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Preferences</p>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>{profile.applicationStyle?.additionalPreferences || "No specific preferences saved."}</p>
          </div>

          <div style={{ background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 20 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>Career goals</p>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>{profile.careerGoals || "No career goals saved yet."}</p>
          </div>
        </div>

        <Toast messages={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <PageHeader
        eyebrow="Professional Memory"
        title={profileStatus === "no-profile" ? "Build your professional memory" : "Your professional memory"}
        subtitle={profileStatus === "no-profile" ? "Tell WalJob about yourself once. We'll remember it for future applications." : "Update your professional context and save it back to Walrus Memory."}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {/* Section 1 — About */}
        <Section title="About you">
          <Input label="Full name" placeholder="e.g. Adekola Abdulhakeem" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Professional title" placeholder="e.g. Frontend Developer" value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} />
          <Textarea label="Professional summary" placeholder="Tell us briefly about your professional background..." value={professionalSummary} onChange={(e) => setProfessionalSummary(e.target.value)} minHeight={100} />
        </Section>

        {/* Section 2 — Experience */}
        <Section title="Experience" subtitle="Focus on what you've actually done, not what you think sounds impressive.">
          <Textarea label="Professional experience" placeholder="Describe your professional experience — roles, companies, what you built and owned..." value={experience} onChange={(e) => setExperience(e.target.value)} minHeight={160} />
        </Section>

        {/* Section 3 — Skills */}
        <Section title="Skills">
          <TagInput label="Technical skills" value={skills} onChange={setSkills} placeholder="Type a skill and press Enter (e.g. React, TypeScript...)" helperText="Press Enter or comma after each skill. Backspace to remove." />
        </Section>

        {/* Section 4 — Projects */}
        <Section title="Projects" subtitle="Add the projects you're most proud of. Be specific about your contribution.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((p, i) =>
              editingProject?.id === p.id ? (
                <ProjectForm key={p.id} initial={p} onSave={handleSaveProject} onCancel={() => setEditingProject(null)} />
              ) : (
                <ProjectCard key={p.id} project={p} index={i} onEdit={() => setEditingProject(p)} onRemove={() => handleRemoveProject(p.id)} />
              )
            )}
            {showProjectForm && !editingProject && (
              <ProjectForm onSave={handleSaveProject} onCancel={() => setShowProjectForm(false)} />
            )}
            {!showProjectForm && !editingProject && (
              <Button variant="secondary" size="sm" style={{ alignSelf: "flex-start" }} onClick={() => setShowProjectForm(true)}>
                + Add project
              </Button>
            )}
          </div>
        </Section>

        {/* Section 5 — Achievements */}
        <Section title="Achievements">
          <Textarea label="Notable achievements" placeholder="Describe notable achievements, impact, leadership, awards, or results..." value={achievements} onChange={(e) => setAchievements(e.target.value)} minHeight={100} />
        </Section>

        {/* Section 6 — Career Goals */}
        <Section title="Career goals">
          <Textarea label="What kinds of roles are you looking for?" placeholder='e.g. "Frontend engineering roles involving React, Next.js, TypeScript and modern web applications."' value={careerGoals} onChange={(e) => setCareerGoals(e.target.value)} minHeight={80} />
        </Section>

        {/* Section 7 — Application Style */}
        <Section title="Application style" subtitle="WalJob uses this to write applications that sound like you.">
          {/* Tone */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>Tone</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(["professional", "confident", "conversational", "technical"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setAppStyle((s) => ({ ...s, tone: t }))}
                  style={{ fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid", cursor: "pointer", fontFamily: "inherit", background: appStyle.tone === t ? "var(--accent)" : "var(--surface-0)", color: appStyle.tone === t ? "var(--accent-fg)" : "var(--text-secondary)", borderColor: appStyle.tone === t ? "transparent" : "var(--border-strong)" }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {/* Length */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>Length</label>
            <div style={{ display: "flex", gap: 6 }}>
              {(["concise", "standard", "detailed"] as const).map((l) => (
                <button key={l} type="button" onClick={() => setAppStyle((s) => ({ ...s, length: l }))}
                  style={{ fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid", cursor: "pointer", fontFamily: "inherit", background: appStyle.length === l ? "var(--accent)" : "var(--surface-0)", color: appStyle.length === l ? "var(--accent-fg)" : "var(--text-secondary)", borderColor: appStyle.length === l ? "transparent" : "var(--border-strong)" }}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <Textarea label="Additional preferences" placeholder='How should WalJob write your applications? e.g. "Keep applications professional but human. Avoid exaggerated claims and generic corporate language."' value={appStyle.additionalPreferences} onChange={(e) => setAppStyle((s) => ({ ...s, additionalPreferences: e.target.value }))} minHeight={80} />
          <Textarea label="Things to avoid" placeholder={"e.g. \"Do not claim experience I don't have. Avoid buzzwords.\""} value={appStyle.thingsToAvoid} onChange={(e) => setAppStyle((s) => ({ ...s, thingsToAvoid: e.target.value }))} minHeight={80} />
        </Section>

        {/* Save button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Button variant="primary" size="lg" loading={saveState === "loading"} loadingText="Saving to memory…" onClick={handleSubmit} style={{ alignSelf: "flex-start" }}>
            {saveState === "success" ? "Saved to memory ✓" : "Save to memory"}
          </Button>

          {/* Success indicator */}
          {saveState === "success" && savedSections.length > 0 && (
            <div style={{ padding: "16px 20px", background: "var(--surface-0)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Your professional memory is ready.</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>WalJob now has your professional context available for future applications.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {savedSections.map((s) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--success)", fontWeight: 600 }}>✓</span>
                    {sectionLabels[s] ?? s} saved
                  </div>
                ))}
              </div>
            </div>
          )}

          {saveState === "error" && (
            <p style={{ margin: 0, fontSize: 13, color: "var(--error)" }}>Couldn't save your profile. Try again.</p>
          )}
        </div>
      </div>

      <Toast messages={toasts} onDismiss={dismissToast} />
    </div>
  );
}
