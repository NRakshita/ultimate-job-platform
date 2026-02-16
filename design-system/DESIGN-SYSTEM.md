# KodNest Premium Build System

A premium SaaS design system for B2C product companies. Calm, intentional, coherent, confident.

## Philosophy

- **Calm** — No gradients, glassmorphism, neon colors, or animation noise
- **Intentional** — Every element serves a purpose
- **Coherent** — One mind designed it; no visual drift
- **Confident** — Serif headlines, generous spacing, clear hierarchy

## File Structure

```
design-system/
├── tokens.css      # Colors, typography, spacing, transitions
├── base.css        # Resets, typography, focus states
├── layout.css      # Top Bar, Context Header, Workspace, Panel, Proof Footer
├── components.css  # Buttons, inputs, cards, badges, error/empty states
├── index.css       # Main entry (imports all)
└── design-system.html  # Reference implementation
```

## Usage

```html
<link rel="stylesheet" href="design-system/index.css">
```

## Layout Structure

Every page follows this order:

1. **Top Bar** — Project name (left), Progress (center), Status badge (right)
2. **Context Header** — Large serif headline + 1-line subtext
3. **Main** — Primary Workspace (70%) + Secondary Panel (30%)
4. **Proof Footer** — Checklist: UI Built, Logic Working, Test Passed, Deployed

## Component Classes

| Component | Classes |
|-----------|---------|
| Primary button | `kn-btn kn-btn--primary` |
| Secondary button | `kn-btn kn-btn--secondary` |
| Input | `kn-input` |
| Card | `kn-card` |
| Error block | `kn-error` |
| Empty state | `kn-empty` |
| Status badge | `kn-topbar__status--not-started` / `--in-progress` / `--shipped` |

## Design Tokens

All tokens are CSS custom properties under `:root`. Override as needed.

| Token | Value |
|-------|-------|
| Background | `#F7F6F3` |
| Primary text | `#111111` |
| Accent | `#8B0000` |
| Success | `#5F7B6F` |
| Warning | `#9A7B4F` |
| Spacing | 8px, 16px, 24px, 40px, 64px |
| Transition | 175ms ease-in-out |
| Border radius | 6px |
