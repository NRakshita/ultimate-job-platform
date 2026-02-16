# Resume Builder — Test Checklist

Use this checklist to verify all features. Run the app with `npm run dev` and test manually.

## Automated tests (ATS score)

```bash
npm run test
```

- ATS score calculation (all rules and bands) is covered by `src/lib/atsScore.test.ts`.

---

## Manual test checklist (10 items)

### 1. All form sections save to localStorage

- [ ] Fill **Personal Info** (name, email, phone, location) → refresh page → values persist.
- [ ] Fill **Summary** → refresh → persists.
- [ ] Add **Education** entry and fill fields → refresh → entry and values persist.
- [ ] Add **Experience** entry with description → refresh → persists.
- [ ] Add **Skills** (Technical / Soft / Tools) → refresh → all categories persist.
- [ ] Add **Projects** (title, description, tech stack, URLs) → refresh → persists.
- [ ] Add **Links** (GitHub, LinkedIn) → refresh → persist.

### 2. Live preview updates in real-time

- [ ] On **Builder** page, type in any field and confirm the right-hand preview updates immediately (name, summary, experience, projects, skills, etc.).
- [ ] Add/remove education, experience, projects, skills and confirm preview reflects changes without refresh.

### 3. Template switching preserves data

- [ ] On Builder or Preview, select **Classic**, then **Modern**, then **Minimal**.
- [ ] Confirm resume content (name, summary, experience, etc.) is unchanged; only layout/typography change.

### 4. Color theme persists after refresh

- [ ] On Builder or Preview, choose a color (e.g. Navy or Burgundy).
- [ ] Refresh the page.
- [ ] Confirm the same color is still selected and applied (headings, borders, sidebar in Modern).

### 5. ATS score calculates correctly

- [ ] Start with empty resume → score 0, "Needs Work" (red).
- [ ] Add **name** → +10.
- [ ] Add **email** → +10.
- [ ] Add **summary** > 50 chars → +10.
- [ ] Add **one experience** with at least one bullet → +15.
- [ ] Add **one education** → +10.
- [ ] Add **5+ skills** → +10.
- [ ] Add **one project** → +10.
- [ ] Add **phone** → +5.
- [ ] Add **LinkedIn** → +5.
- [ ] Add **GitHub** → +5.
- [ ] Add action verbs in summary (e.g. "built", "led", "designed") → +10.
- [ ] Confirm total can reach 100 and band becomes "Strong Resume" (green).

### 6. Score updates live on edit

- [ ] On **Builder**, open ATS meter; note current score.
- [ ] Add or remove name, summary, experience, skills, etc.
- [ ] Confirm score and suggestions update immediately (no refresh).

### 7. Export buttons work (copy / download)

- [ ] **Preview** page: click **Copy Resume as Text** → paste in notepad → resume text is present.
- [ ] **Preview** page: click **Download PDF** → toast appears: "PDF export ready! Check your downloads."
- [ ] **Preview** page: click **Print** → browser print dialog opens (or print to PDF from there).

### 8. Empty states handled gracefully

- [ ] With no data, preview shows placeholders (e.g. "Your Name", "Email · Phone · Location").
- [ ] With no projects/skills/education/experience, those sections are hidden or empty without errors.
- [ ] ATS suggestions list missing items with point values; no console errors.

### 9. Mobile responsive layout works

- [ ] Resize to narrow width (or use device toolbar): form stacks, preview remains usable.
- [ ] Template picker and color circles wrap or stack on small screens.
- [ ] Buttons and inputs remain tappable; no horizontal overflow.

### 10. No console errors on any page

- [ ] Open DevTools → Console.
- [ ] Visit **Home**, **Builder**, **Preview**; perform edits, template/color changes, copy, download.
- [ ] Confirm no red errors in console.

---

## Quick smoke test

1. Load sample data (Builder → "Load Sample Data").
2. Switch templates and colors.
3. Go to Preview → check ATS score (should be high, green band).
4. Click Copy, Download PDF, Print.
5. Refresh → confirm template, color, and data persist.
