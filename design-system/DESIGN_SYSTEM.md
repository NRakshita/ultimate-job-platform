# KodNest Premium Build System

Design system for a serious B2C product. Calm, intentional, coherent, confident. One mind designed it.

---

## Design philosophy

- **Calm, intentional, coherent, confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise
- Everything must feel like one mind designed it. No visual drift.

---

## Color system

| Token | Value | Use |
|-------|--------|-----|
| Background | `#F7F6F3` | Page and surfaces |
| Primary text | `#111111` | Body and headings |
| Accent | `#8B0000` | CTAs, links, focus, status |
| Success | `#4A5D4A` | Shipped, success states |
| Warning | `#8B7355` | Warnings, caution |

Maximum 4 colors in use across the system. Success and warning are muted and used sparingly.

---

## Typography

- **Headings:** Serif (`Source Serif 4`), large, confident, generous spacing. Letter-spacing `0.02em`.
- **Body:** Sans-serif (`Source Sans 3`), 16–18px, line-height 1.6–1.8. Max width for text blocks: **720px**.
- No decorative fonts, no random sizes.

---

## Spacing scale

Only these values: **8px, 16px, 24px, 40px, 64px**

| Token | Value |
|-------|--------|
| `--kn-space-xs` | 8px |
| `--kn-space-sm` | 16px |
| `--kn-space-md` | 24px |
| `--kn-space-lg` | 40px |
| `--kn-space-xl` | 64px |

Never use arbitrary spacing (e.g. 13px, 27px). Whitespace is part of the design.

---

## Global layout structure

Every page follows this order:

1. **Top Bar** — Project name (left), Progress indicator Step X / Y (center), Status badge (right)
2. **Context Header** — Large serif headline, one-line subtext, clear purpose, no hype language
3. **Primary Workspace (70%)** — Main product interaction; clean cards, predictable components, no crowding
4. **Secondary Panel (30%)** — Step explanation, copyable prompt box, actions (Copy, Build in Lovable, It Worked, Error, Add Screenshot). Calm styling.
5. **Proof Footer** — Persistent bottom section. Checklist: □ UI Built, □ Logic Working, □ Test Passed, □ Deployed. Each checkbox requires user proof input.

---

## Component rules

- **Primary button:** Solid deep red (`--kn-accent`). Secondary: outlined, transparent fill.
- Same hover effect and border radius (`6px`) everywhere.
- **Inputs:** Clean borders, no heavy shadows, clear focus state (accent border).
- **Cards:** Subtle border, no drop shadows, balanced padding (24px).

---

## Interaction rules

- **Transitions:** 150–200ms, ease-in-out only. No bounce, no parallax.

---

## Error and empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user. Use `.kn-error`, `.kn-error__title`, `.kn-error__message`, `.kn-error__fix`.
- **Empty states:** Provide the next action. Never feel dead. Use `.kn-empty`, `.kn-empty__title`, `.kn-empty__message`, `.kn-empty__action`.

---

## File structure

```
design-system/
  tokens.css         — Colors, spacing, typography, transitions
  base.css           — Reset, body, headings, text block, links
  layout.css         — Top bar, context header, main, workspace, panel, proof footer
  components.css     — Buttons, inputs, cards, badges, prompt box, error, empty
  kodnest-design-system.css — Single import for all
  DESIGN_SYSTEM.md   — This document
```

Use by linking or importing `kodnest-design-system.css` and applying the layout classes (e.g. `.kn-app`, `.kn-topbar`, `.kn-context-header`, `.kn-main`, `.kn-workspace`, `.kn-panel`, `.kn-proof-footer`) and component classes as needed.
