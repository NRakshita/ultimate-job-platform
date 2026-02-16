# Placement Readiness Platform — Verification Guide

## Skill Extraction

Skill extraction runs client-side from the JD text. Keywords are matched case-insensitively:

- **Core CS:** DSA, OOP, DBMS, OS, Networks
- **Languages:** Java, Python, JavaScript, TypeScript, C, C++, C#, Go
- **Web:** React, Next.js, Node.js, Express, REST, GraphQL
- **Data:** SQL, MongoDB, PostgreSQL, MySQL, Redis
- **Cloud/DevOps:** AWS, Azure, GCP, Docker, Kubernetes, CI/CD, Linux
- **Testing:** Selenium, Cypress, Playwright, JUnit, PyTest

If none match, the UI shows "General fresher stack".

## History Persistence

All analyses are stored in `localStorage` under key `placement_jd_history`. Data survives:

- Page refresh
- Browser restart
- Offline use (no network required)

## Steps to Verify with Sample JD

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Navigate to JD Analyzer**
   - Go to `/dashboard/analyze` or click "Analyze Job Description" on the Dashboard.

3. **Paste this sample JD** (or any JD containing the keywords):

   ```
   We are hiring a Full Stack Developer for our team.

   Requirements:
   - Strong knowledge of DSA and algorithms
   - Experience with React, Node.js, and Express
   - Proficient in JavaScript/TypeScript
   - Database: SQL, MongoDB, PostgreSQL
   - Familiarity with AWS, Docker, Kubernetes
   - Knowledge of REST APIs and GraphQL
   - OOP, DBMS, OS fundamentals
   - Python or Java for backend services
   - Testing: JUnit, PyTest, Cypress

   Nice to have: CI/CD, Linux, Redis
   ```

4. **Optional:** Enter Company (e.g. "TechCorp") and Role (e.g. "Full Stack Developer").

5. **Click "Analyze"**

6. **Verify Results page shows:**
   - Readiness score (expect 85–100 with company, role, and long JD)
   - Key skills grouped by category (Core CS, Languages, Web, Data, Cloud/DevOps, Testing)
   - Round-wise checklist (4 rounds)
   - 7-day plan
   - 10 likely interview questions

7. **Verify History:**
   - Go to **History** in the sidebar
   - Entry should appear with company, role, score, date
   - Click the entry → should open Results with that analysis

8. **Verify persistence:**
   - Refresh the page (F5)
   - Go to History again
   - Entry should still be there
   - Click it → Results should load

## Interactive Features (Results Page)

### Live readiness score

- Base score comes from JD analysis.
- Each skill has a toggle: **"I know this"** or **"Need practice"** (default).
- Score updates in real time: +2 per "know", -2 per "practice".
- Clamped to 0–100.

### Skill confidence persistence

- Toggle states are stored in `skillConfidenceMap` in the history entry.
- Refresh the page and reopen from History → toggles remain.

### Export tools

- **Copy 7-day plan** — plain text to clipboard
- **Copy round checklist** — plain text to clipboard
- **Copy 10 questions** — plain text to clipboard
- **Download as TXT** — combined export of all sections

### Action Next box

- Shows top 3 weak skills (marked "Need practice").
- Suggests next action: "Start Day 1 plan now."

## Verification: Interactive Features

1. **Live score:**
   - Open Results for an analysis with skills.
   - Toggle some skills to "I know this" → score increases by +2 each.
   - Toggle some to "Need practice" → score decreases by -2 each.
   - Confirm score updates immediately and stays within 0–100.

2. **Toggles persist after refresh:**
   - Change several skill toggles.
   - Refresh the page (F5).
   - Go to History → click the same entry.
   - Confirm all toggles match your last changes.

3. **Export:**
   - Click "Copy 7-day plan" → paste in notepad to verify.
   - Click "Download as TXT" → confirm the file includes all sections.

## Company Intel + Round Mapping

### Company Intel (when company provided)

- Company name, industry (heuristic from JD), size category (Startup/Mid-size/Enterprise).
- Known companies (Amazon, Infosys, TCS, etc.) → Enterprise; unknown → Startup.
- "Typical Hiring Focus" — Enterprise: structured DSA + core CS; Startup: practical problem-solving + stack depth.

### Round Mapping

- Dynamic rounds based on company size + detected skills.
- Enterprise + DSA → Online Test, Technical (DSA+CS), Tech+Projects, HR.
- Startup + React/Node → Practical Coding, System Discussion, Culture Fit.
- Each round shows "Why this round matters."

### Persistence

- `companyIntel` and `roundMapping` saved in history entry.

## Test Scenarios

**Scenario 1: Enterprise + DSA**

- Company: **Amazon** or **Infosys**
- JD: Include "DSA", "algorithms", "OOP", "DBMS"
- Expected: Company Intel shows Enterprise, Industry: Technology Services; Round flow: Online Test → Technical (DSA+CS) → Tech+Projects → HR

**Scenario 2: Startup + Web stack**

- Company: **AcmeLabs** (unknown)
- JD: Include "React", "Node.js", "Express"
- Expected: Company Intel shows Startup; Round flow: Practical Coding → System Discussion → Culture Fit

**Scenario 3: No company**

- Company: (leave blank)
- Expected: No Company Intel card; Round Mapping uses default (Startup + skills)

## Schema & Validation

### Standard Entry Schema

Every history entry conforms to:

```
id, createdAt, company, role, jdText,
extractedSkills: { coreCS[], languages[], web[], data[], cloud[], testing[], other[] },
roundMapping: [{ roundTitle, focusAreas[], whyItMatters }],
checklist: [{ roundTitle, items[] }],
plan7Days: [{ day, focus, tasks[] }],
questions: string[],
baseScore, skillConfidenceMap, finalScore, updatedAt
```

### Input Validation (JD Analyzer)

- JD required, min 200 characters.
- If JD < 200 chars: "This JD is too short to analyze deeply. Paste full JD for better output."
- Company and Role optional.

### Score Rules

- **baseScore**: Computed once at analyze, never changed by toggles.
- **finalScore**: baseScore + skill toggle delta (+2 know, -2 practice), bounds 0–100.
- On skill toggle: update skillConfidenceMap, finalScore, updatedAt; persist to history.

### History Robustness

- Corrupted entries are skipped when loading.
- If any skipped: "One saved entry couldn't be loaded. Create a new analysis."

### Empty Skills Default

When no JD keywords detected, `other` is populated with:
`["Communication", "Problem solving", "Basic coding", "Projects"]`

## Verification: Edge Cases

1. **JD < 200 chars**: Paste 50 chars → warning shown, Analyze disabled.
2. **JD ≥ 200 chars**: Paste 250 chars → Analyze enabled, warning hidden.
3. **No skills detected**: Use JD with no keywords → "other" shows Communication, Problem solving, etc.
4. **Skill toggles**: Toggle skills → finalScore updates, refresh → toggles persist.
5. **Corrupted entry**: In DevTools, corrupt one localStorage entry (e.g. set `jdText` to number) → History skips it, shows message.

## Test Checklist & Ship Lock

### Routes

- `/prp/07-test` — Test Checklist (10 items, persisted in localStorage)
- `/prp/08-ship` — Ship page (locked until all 10 tests passed)

### Checklist Storage

- Key: `prp_test_checklist`
- Persists across refresh and browser restart

### Ship Lock

- When &lt; 10 tests passed: Ship page shows locked state with link to Test Checklist
- When all 10 passed: Ship page shows "Ready to Ship"

### Verification Steps

1. **Checklist persists**: Go to `/prp/07-test`, check 3 items, refresh → checks remain.
2. **Ship locked**: With 0–9 items checked, go to `/prp/08-ship` → locked message, no content.
3. **Ship unlocks**: Check all 10 items, go to `/prp/08-ship` → "Ready to Ship" shown.
4. **Reset**: Click "Reset checklist" → all checkboxes clear, Ship locks again.

## Proof & Shipped Status

### Proof Page (/prp/proof)

- **Step Completion Overview**: 8 steps with Completed/Pending checkboxes
- **Artifact Inputs**: Lovable Project Link, GitHub Repo Link, Deployed URL (URL validation)
- **Copy Final Submission**: Copies formatted text to clipboard

### Shipped Status

- **Shipped** only when: 8 steps completed + 10 checklist passed + 3 valid proof links
- **In Progress** otherwise
- Completion message when Shipped: "You built a real product..."

### Verification

1. **URL validation**: Enter "foo" in any link → error "Enter a valid URL"
2. **Shipped conditions**: With 10 checklist + 8 steps + 3 valid URLs → status becomes Shipped
3. **Copy export**: Click Copy Final Submission → paste → format matches template

## Readiness Score Formula

**Base score (from JD):**

- Base: 35
- +5 per detected skill category (max 30)
- +10 if company provided
- +10 if role provided
- +10 if JD length > 800 characters
- Cap: 100

**Self-assessment (live on Results):**

- +2 per skill marked "I know this"
- -2 per skill marked "Need practice"
- Bounds: 0–100
