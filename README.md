# Kinetic Migrator — Frontend

Next.js UI for Kinetic Migrator: SAP migration staging, validation, comparison reports, and admin rule configuration.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4 (theme tokens in `app/globals.css`)
- Light professional theme (`color-scheme: light`)

The app talks to the Node API at `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`).

## Setup

```bash
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the backend first (see the backend README), then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is taken, Next.js will pick the next free port (for example `3002`).

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Auth and roles

Register at `/register` (User or Admin), accept the Terms of Service, then sign in at `/signin`.

| Role | Home | Screens |
| --- | --- | --- |
| `normal_user` | `/staging` | Upload, Display, Validate, Reports |
| `admin` | `/admin` | Rule hub, Analysis / field mapping |

Unauthenticated visits redirect to `/signin`. The wrong role is sent to that role’s home path.

## Pages

| Path | Who | What |
| --- | --- | --- |
| `/signin`, `/register` | Public | Auth |
| `/legal` | Public | Terms, privacy, GDPR, data security |
| `/staging` | User | Preload / postload upload |
| `/processing` | User | Comparison progress |
| `/preview` | User | Uploaded file preview |
| `/validation` | User + admin | Data cleaning against saved rules |
| `/reports`, `/reports/[batchId]` | User | Comparison history and AI report |
| `/admin` | Admin | Source schema, business object, validation selection, apply rules |
| `/analysis` | Admin | Source-to-SAP field mapping |

Legal copy is linked from registration (`/legal#terms-of-service`, `/legal#privacy-policy`).

## Admin validation selection

On `/admin`, **Validation Selection** lets an admin:

- Toggle predefined checks: trim empty spaces, null keys, duplicate records
- Accept or reject AI-recommended and custom rules (check / X)

**Apply Global Rules** persists the draft (including those toggles and selections) through `POST /api/rules/save`. Cleaning on `/validation` uses that saved set.

## Theme

Color, radius, and shadow tokens live in `app/globals.css` (`@theme inline`). Prefer semantic classes (`bg-surface`, `text-on-surface`, `border-ink/15`) over hardcoded blacks/whites so the light theme stays consistent.
