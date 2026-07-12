# ⭐ Ivy's Planner & Reward App

A simple planner and reward app for Ivy (11). Track daily tasks, earn stars, redeem them for real-world rewards, and watch progress over four weeks.

Built by the house: **Finn** briefed it, **Oscar** designed the visual system, **Nathan** wired the logic and shipped it.

## What it does

- **Tasks** — daily checklist (5 presets, up to 10). Check one off, earn a star, get a little burst of celebration.
- **Redeem** — spend stars on rewards. Can't go below zero.
- **History** — every redemption, newest first.
- **Stats** — a 4-week bar chart of stars earned. Best week glows gold.
- **Manage** — add or remove tasks (max 10).

All data lives in the browser (localStorage) and resets every 90 days, with a 7-day heads-up.

## Tech

React + Vite + Tailwind. Design tokens (Oscar's iris/lilac system) are wired as CSS custom properties in `src/index.css` and mapped into Tailwind — so a stricter component layer (shadcn) can slot in later with zero rework.

Hash routing + `base: './'` so it runs as a static site on GitHub Pages. PWA manifest included — add a service worker later to make it installable to the iPad Home Screen.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages automatically. Enable Pages → Source: **GitHub Actions** once, and every push ships.
