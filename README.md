# SmartSpend AI

A personal finance web app for university students, young professionals, and families.

## Features (Phase 1)
- 📊 **Dashboard** — income/expense/balance summary + spending-by-category chart
- 💸 **Transactions** — add, list, and delete income/expense entries
- 🎯 **Budgets** — monthly category limits with 80%/100% alerts
- 🏦 **Savings Goals** — create goals and track progress
- 💡 **Insights** — rule-based financial tips (not AI)
- 📽️ **About** — project presentation slides

## Tech Stack
React 19, Vite, React Router, Recharts, Tailwind CSS v4, Vitest

## Getting Started
```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm test` | Run unit tests |
| `npm run preview` | Preview production build |

## Project Structure
```
src/
├── pages/          # Route-level page components
├── components/     # Reusable UI components
├── context/        # Global state (React Context + useReducer)
├── hooks/          # Custom hooks
├── utils/          # Pure business logic functions
└── data/           # Static data and seed data
tests/              # Vitest unit tests
```

## Data Persistence
State is persisted to `localStorage` under the key `smartspend:v1`. On first load, seed data is pre-populated so the demo is never empty.

## GitHub Workflow
- Branch per feature: `feature/<issue#>-<short-name>`
- Conventional commits: `feat:`, `fix:`, `test:`, `docs:`
- CI runs lint + test + build on every push and PR
