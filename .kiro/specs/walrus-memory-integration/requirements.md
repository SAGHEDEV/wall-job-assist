# Requirements Document

## Introduction

WalJob Assist is a Next.js hackathon application with a fully built UI that needs to be wired to a real Walrus Memory persistence backend. The current implementation stores application data in-memory (resetting on server restart) and uses hardcoded demo data. This feature integrates the existing UI with the MemWal SDK so that professional profiles, application history, and recalled memories are all persisted and retrieved through Walrus Memory. The integration preserves the existing visual design and component structure while replacing fake/transient data with real persistent storage.

## Glossary

- **System**: The WalJob Assist Next.js application
- **MemWal_SDK**: The `@mysten-incubation/memwal` package, accessed only through `app/lib/memwal.ts`
- **Memory_Service**: The `app/lib/memory.ts` service boundary module that wraps all MemWal_SDK calls
- **Profile_Service**: The `app/services/profile.ts` client-side service that calls `/api/profile`
- **ProfileData**: The structured object representing a user's professional information (fullName, professionalTitle, professionalSummary, experience, skills, projects, achievements, careerGoals, applicationStyle)
- **ProfileStatus**: An enumerated state with values: `checking` | `no-profile` | `profile-exists` | `error`
- **useProfile**: A shared React hook providing `profile`, `profileStatus`, `hasProfile`, and `refreshProfile()` to any page or component
- **Profile_Memory**: Walrus Memory entries tagged with `[PROFILE]`, `[EXPERIENCE]`, `[SKILLS]`, `[PROJECTS]`, or `[PREFERENCES]`
- **Application_Memory**: A Walrus Memory entry tagged with `[APPLICATION]` containing company, role, creation date, job description, cover letter, and recalled memories
- **Application**: A record of a generated cover letter with associated metadata stored in Walrus Memory
- **Memory_Used_Panel**: The UI panel on the result page showing which memories were retrieved for a given generation
- **Generation_Flow**: The sequence: job description → recall relevant memories → LLM → cover letter → save application
- **Rochester_Font**: A display/script font used selectively for hero headlines, major page headings, and important empty-state headings
- **Profile_Status_Indicator**: A subtle inline indicator in the app shell showing "● Memory ready" or "● Memory not set up"
- **Navbar**: The sticky top navigation component with links: Home | My Memory | New Application | Applications

---

## Requirements

### Requirement 1: Memory Service Layer

**User Story:** As a developer, I want a clean service boundary between UI components and the MemWal SDK, so that components never call the SDK directly and all persistence logic is centralised and testable.

#### Acceptance Criteria

1. THE Memory_Service SHALL export the functions: `getProfile()`, `saveProfile(profile)`, `updateProfile(profile)`, `hasProfile()`, `recallRelevantMemories(query)`, `saveApplication(application)`, `getApplications()`, and `getApplication(id)`.
2. THE System SHALL locate the Memory_Service exclusively at `app/lib/memory.ts`.
3. WHEN a component or API route requires Walrus Memory access, THE System SHALL call Memory_Service functions rather than importing MemWal_SDK directly.
4. THE Memory_Service SHALL import `memwal` only from `app/lib/memwal.ts`.
5. IF a MemWal_SDK call throws an exception, THEN THE Memory_Service SHALL catch the exception and return a typed error result rather than propagating the raw exception to callers.

---

### Requirement 2: Profile Detection on App Load

**User Story:** As a returning user, I want the app to check Walrus Memory for my existing profile on startup, so that I am never shown a blank creation form when my profile already exists.

#### Acceptance Criteria

1. WHEN the System initialises, THE useProfile hook SHALL set `profileStatus` to `checking` and query Walrus Memory for an existing Profile_Memory entry.
2. WHILE `profileStatus` is `checking`, THE System SHALL display "Checking your professional memory…" to the user.
3. WHEN Walrus Memory returns at least one Profile_Memory entry, THE useProfile hook SHALL set `profileStatus` to `profile-exists` and `hasProfile` to `true`.
4. WHEN Walrus Memory returns no Profile_Memory entries, THE useProfile hook SHALL set `profileStatus` to `no-profile` and `hasProfile` to `false`.
5. IF the Walrus Memory query fails, THEN THE useProfile hook SHALL set `profileStatus` to `error` and `hasProfile` to `false`.
6. THE useProfile hook SHALL be usable from the Home page, New Application page, and Profile page without duplicating the fetch logic.

---

### Requirement 3: Profile Page — No Profile State

**User Story:** As a first-time user with no profile, I want to see a creation form with a clear call to action, so that I know what to do to get started.

#### Acceptance Criteria

1. WHEN `profileStatus` is `no-profile`, THE Profile page SHALL display the creation form with an empty-state heading that reads "Nothing to remember — yet."
2. WHEN `profileStatus` is `no-profile`, THE Profile page SHALL display a primary call-to-action button labelled "Save to Memory".
3. THE Profile page creation form SHALL include fields for: full name, professional title, professional summary, experience, skills (tag input), projects (add/edit/remove), achievements, career goals, and application style preferences.
4. WHEN a user submits the creation form with at least one required field empty, THE System SHALL display a validation error identifying the missing field before submitting to the API.
5. WHEN `profileStatus` is `checking`, THE Profile page SHALL display a loading state rather than the creation form or profile summary.

---

### Requirement 4: Profile Page — Profile Exists State

**User Story:** As a returning user with an existing profile, I want to see a readable summary of my saved profile, so that I can verify what WalJob remembers about me.

#### Acceptance Criteria

1. WHEN `profileStatus` is `profile-exists`, THE Profile page SHALL display a readable profile summary and SHALL NOT display the empty creation form.
2. THE profile summary SHALL present content organised into sections: ABOUT, EXPERIENCE, SKILLS, PROJECTS, PREFERENCES, and CAREER GOALS.
3. WHEN `profileStatus` is `profile-exists`, THE Profile page SHALL display an "Edit profile" action and a "Refresh memory" action.
4. WHEN the user activates "Refresh memory", THE System SHALL re-query Walrus Memory and update the displayed profile summary with the latest data.

---

### Requirement 5: Profile Update Flow

**User Story:** As a user who wants to update my profile, I want the edit form to be pre-populated with my existing data, so that I only change what needs changing rather than retyping everything.

#### Acceptance Criteria

1. WHEN the user activates "Edit profile", THE Profile page SHALL display the creation form pre-populated with the currently loaded ProfileData values.
2. WHEN the user saves an updated profile, THE System SHALL store the new profile data in Walrus Memory as a new entry and treat the newest entry as the authoritative profile.
3. WHEN the profile update save succeeds, THE System SHALL display a success confirmation and return `profileStatus` to `profile-exists` with the updated data.
4. IF the profile update save fails, THEN THE System SHALL display a human-readable error message without exposing stack traces or technical details.

---

### Requirement 6: Shared Profile State

**User Story:** As a developer, I want a single shared profile hook used across all pages, so that profile status is consistent across the entire app without redundant fetches.

#### Acceptance Criteria

1. THE useProfile hook SHALL provide the fields: `profile` (ProfileData or null), `profileStatus` (ProfileStatus), `hasProfile` (boolean), and `refreshProfile()` (function).
2. THE useProfile hook SHALL be the sole mechanism through which the Home page, New Application page, and Profile page access profile state.
3. WHEN `refreshProfile()` is called, THE System SHALL re-query Walrus Memory and update all consumers of useProfile with the refreshed data.
4. THE useProfile hook SHALL not require authentication, login, or wallet connection from the user.

---

### Requirement 7: New Application Requires Profile

**User Story:** As a user without a profile trying to create an application, I want to be guided to set up my profile first, so that my generated cover letter is personalised rather than generic.

#### Acceptance Criteria

1. WHEN the New Application page loads and `hasProfile` is `false`, THE System SHALL display an inline empty state guiding the user to `/profile` to set up their professional memory.
2. WHEN `hasProfile` is `false`, THE System SHALL disable the "Generate application" button on the New Application page.
3. WHEN `hasProfile` is `true`, THE New Application page SHALL display the job description form in its normal active state.
4. WHEN the user navigates to New Application via the Navbar and `hasProfile` is `false`, THE Navbar SHALL allow navigation to `/profile` and THE System SHALL show the inline empty state on the New Application page.
5. WHEN the user completes profile creation and returns to `/apply`, THE System SHALL display the New Application form in its active state reflecting the newly created profile.

---

### Requirement 8: Persistent Application History

**User Story:** As a user, I want my generated applications stored in Walrus Memory, so that they persist across sessions and browser refreshes.

#### Acceptance Criteria

1. WHEN cover letter generation succeeds, THE System SHALL save the application as an Application_Memory entry containing: company, role, creation date (ISO 8601), job description, cover letter text, and the list of recalled MemoryUsedItems.
2. THE Application_Memory entry SHALL be tagged with `[APPLICATION]` to distinguish it from Profile_Memory entries.
3. THE System SHALL NOT use hardcoded demo application data in production pages; THE Applications page SHALL show only real persisted data retrieved from Walrus Memory.
4. THE Applications page SHALL NOT expose internal storage identifiers (blob IDs, wallet addresses) to the user.
5. WHEN no applications exist in Walrus Memory, THE Applications page SHALL display an empty state with a link to `/apply`.

---

### Requirement 9: Application History Retrieval

**User Story:** As a user, I want to see my application history loaded from Walrus Memory, so that my list of past applications reflects real persisted data.

#### Acceptance Criteria

1. WHEN the Applications page loads, THE System SHALL query Walrus Memory for all Application_Memory entries and display the results.
2. THE Applications list SHALL present each application with: company name, role, and formatted creation date.
3. WHEN an application entry is clicked, THE System SHALL navigate to the application detail view.
4. IF the Walrus Memory query for applications fails, THEN THE System SHALL display a human-readable error message on the Applications page rather than an empty list or a crash.

---

### Requirement 10: Application Detail View

**User Story:** As a user, I want to view the full detail of a past application, so that I can review, copy, or act on it.

#### Acceptance Criteria

1. WHEN the user navigates to an application detail, THE System SHALL display: company, role, creation date, job description, memories used, and cover letter.
2. THE application detail SHALL provide a "Copy" action that copies the cover letter text to the clipboard.
3. THE application detail SHALL provide an "Edit" action that allows the user to modify the cover letter inline.
4. THE application detail SHALL provide a "Regenerate" action that navigates the user back to `/apply` with the original job description pre-filled.
5. THE application detail SHALL NOT display blob IDs, wallet addresses, or any internal storage identifiers.

---

### Requirement 11: Generation Flow UI

**User Story:** As a user waiting for my application to be generated, I want to see meaningful progress steps, so that I understand what the system is doing and that it is using my memory.

#### Acceptance Criteria

1. WHEN generation starts, THE GenerationProgress component SHALL display the steps in order: "Understanding the role", "Searching your professional memory", "Matching your experience", "Writing your application", "Saving application".
2. THE GenerationProgress component SHALL mark each step with the appropriate state indicator: ✓ (done), ● (active), or ○ (pending).
3. WHEN the "Saving application" step completes, THE System SHALL have persisted the application to Walrus Memory before transitioning to the result view.

---

### Requirement 12: Memory Used Panel

**User Story:** As a user viewing my generated cover letter, I want to see which memories were actually used, so that I can verify my profile data is being recalled correctly.

#### Acceptance Criteria

1. THE Memory_Used_Panel SHALL display the memories returned by `recallRelevantMemories()` for the job description.
2. THE Memory_Used_Panel SHALL display the count of recalled memories using the format: "N memories" (or "1 memory" for singular).
3. THE Memory_Used_Panel SHALL NOT display hardcoded or placeholder memory excerpts; all content SHALL come from real Walrus Memory recall results.
4. IF no memories are recalled, THEN THE Memory_Used_Panel SHALL display a message indicating no relevant memories were found rather than showing an empty panel silently.

---

### Requirement 13: Profile Status Indicator

**User Story:** As a user, I want a subtle status indicator in the app shell showing whether my professional memory is set up, so that I can always see my memory state at a glance.

#### Acceptance Criteria

1. THE Navbar SHALL display a Profile_Status_Indicator that shows "● Memory ready" when `hasProfile` is `true`.
2. THE Navbar SHALL display a Profile_Status_Indicator that shows "● Memory not set up" when `hasProfile` is `false`.
3. WHEN the Profile_Status_Indicator is clicked, THE System SHALL navigate the user to `/profile`.
4. THE Profile_Status_Indicator SHALL NOT display blob IDs, wallet addresses, account IDs, or any other technical storage details.
5. WHILE `profileStatus` is `checking`, THE Profile_Status_Indicator SHALL show a neutral loading state rather than either ready or not-set-up.

---

### Requirement 14: Human-Readable Error Handling

**User Story:** As a user who encounters an error, I want to see a plain-language description of what went wrong, so that I can understand the problem and take action without seeing technical internals.

#### Acceptance Criteria

1. IF the profile check fails, THEN THE System SHALL display: "Couldn't check your memory. Please try again."
2. IF profile save fails, THEN THE System SHALL display: "Couldn't save your profile. Please try again."
3. IF memory retrieval fails during generation, THEN THE System SHALL display: "Couldn't retrieve your memories. Check your connection and try again."
4. IF cover letter generation fails, THEN THE System SHALL display: "Generation failed. Please try again."
5. IF application save fails, THEN THE System SHALL display: "Your cover letter was generated but couldn't be saved to history."
6. THE System SHALL NOT expose stack traces, SDK error messages, blob IDs, or wallet addresses in any user-facing error message.

---

### Requirement 15: Form Validation

**User Story:** As a user filling in forms, I want clear validation feedback before submission, so that I know what is required before the system attempts to save or generate.

#### Acceptance Criteria

1. WHEN the profile creation form is submitted with `fullName` empty, THE System SHALL display a validation error on the full name field before making any API call.
2. WHEN the profile creation form is submitted with `experience` empty, THE System SHALL display a validation error on the experience field before making any API call.
3. WHEN the New Application form is submitted with `jobDescription` empty, THE System SHALL display a validation error on the job description field before making any API call.
4. WHEN a project is added via ProjectForm with the `name` field empty, THE System SHALL display a validation error on the project name field before saving the project.
5. THE System SHALL display all validation errors inline adjacent to the relevant field rather than in a modal or toast-only notification.

---

### Requirement 16: Navigation Logic

**User Story:** As a user navigating the app, I want the navigation to guide me appropriately based on my profile state, so that I always end up in the right place.

#### Acceptance Criteria

1. THE Navbar SHALL contain links labelled: "Home", "My Memory", "New Application", and "Applications", navigating to `/`, `/profile`, `/apply`, and `/applications` respectively.
2. WHEN the user activates "New Application" in the Navbar and `hasProfile` is `false`, THE System SHALL navigate to `/apply` and display the no-profile inline empty state (not redirect to `/profile` automatically).
3. WHEN the user completes profile creation on `/profile` and `profileStatus` transitions to `profile-exists`, THE System SHALL display a confirmation that the user can now create applications, with a link or button to `/apply`.

---

### Requirement 17: Rochester Font Usage

**User Story:** As a designer, I want a display/script font applied selectively to key headings, so that the app has typographic character without compromising readability.

#### Acceptance Criteria

1. THE System SHALL load and apply the Rochester font (or equivalent display/script font) to: hero headlines on the Home page, major page headings (h1) on the Profile and Applications pages, and important empty-state headings such as "Nothing to remember — yet."
2. THE System SHALL NOT apply the Rochester font to: body text, form labels, button text, Navbar links, or technical/data display content.
3. THE System SHALL fall back to the existing Geist Sans font if the Rochester font fails to load.

---

### Requirement 18: Demo Flow Completeness

**User Story:** As a demo evaluator, I want to be able to complete two distinct user journeys end-to-end without encountering broken states, so that the integration can be demonstrated reliably.

#### Acceptance Criteria

1. WHEN a first-time user visits the Home page, THE System SHALL detect no profile and guide the user through: Home → no profile indication → `/profile` creation form → save → "Memory ready" indicator → `/apply` → generate → save → `/applications` history — all using real Walrus Memory.
2. WHEN a returning user visits the Home page with an existing profile, THE System SHALL detect the existing profile, display the Profile_Status_Indicator as "● Memory ready", and allow immediate navigation to `/apply` without showing a profile creation form.
3. WHEN a user visits `/profile` with an existing profile and activates "Edit profile", THE System SHALL pre-populate the form, allow editing, save the update to Walrus Memory, and treat the newest entry as authoritative.
4. THE System SHALL NOT display hardcoded fake application data (such as "Acme Corp" or "Vercel" demo entries) on the Applications page during any demo flow.
