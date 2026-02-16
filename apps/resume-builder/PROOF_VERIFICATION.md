# Proof & Submission — Verification Steps

## Shipped logic

**Rule:** Status badge shows **"Shipped"** (green) only when all three are true:

1. **All 8 steps marked completed** — Each of steps 1–8 has artifact status `uploaded` (set via Build panel on each step page).
2. **All 10 checklist tests passed** — All 10 verification checkboxes on `/rb/proof` are checked.
3. **All 3 proof links provided** — Lovable Project Link, GitHub Repository Link, and Deployed URL are filled and pass URL validation (valid `http://` or `https://` URL).

**Otherwise:** Status remains **"In Progress"** (default gray badge).

### How to verify shipped logic

1. Open `/rb/proof`. Status should be **In Progress**.
2. Without changing anything: badge stays **In Progress**.
3. Mark all 8 steps as uploaded (go to each step 01–08, use Build panel to mark artifact as uploaded), then return to `/rb/proof`. Status still **In Progress** (checklist and links not done).
4. Check all 10 checklist items. Status still **In Progress** if any of the 3 links is missing or invalid.
5. Fill all 3 links with valid URLs (e.g. `https://lovable.dev/p/xxx`, `https://github.com/org/repo`, `https://myapp.vercel.app`). Status should change to **Shipped** and the calm message **"Project 3 Shipped Successfully."** appears.
6. Clear one checklist item or one link: status returns to **In Progress** and the success message is hidden.

---

## Proof validation

### URL validation

- **Valid:** `https://example.com`, `http://localhost:3000`, `https://github.com/user/repo`, `https://lovable.dev/projects/xxx`.
- **Invalid:** empty, `not-a-url`, `ftp://x.com` (non-http(s)), `example.com` (no protocol). Invalid URLs show a red border and helper text.

### Storage

- **Artifact links** are stored in `localStorage` under key **`rb_final_submission`** as JSON:  
  `{ lovableProjectLink, githubRepositoryLink, deployedUrl }`.
- **Checklist** is stored under **`rb_checklist`** as a JSON array of 10 booleans.

### Copy Final Submission

- Click **"Copy Final Submission"**. Paste into a text editor. Output must match:

```
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: {link}
GitHub Repository: {link}
Live Deployment: {link}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
```

- `{link}` values are the three stored URLs (or empty if not set).

---

## Verification checklist (quick)

- [ ] `/rb/proof` shows **Step Completion Overview** (all 8 steps with status).
- [ ] **Artifact Collection** has 3 inputs with URL validation and inline error when invalid.
- [ ] **Verification Checklist** has 10 items; all must be checked for Shipped.
- [ ] **Copy Final Submission** copies the exact format above.
- [ ] Badge is **Shipped** only when 8 steps completed + 10 checklist + 3 valid links.
- [ ] When Shipped, calm message **"Project 3 Shipped Successfully."** is shown (no confetti/animations).
- [ ] `rb_final_submission` and `rb_checklist` persist after refresh.
