# Project Overview

Living document for this project. Update this file as features, decisions, and architecture change.

**Last updated:** 2026-08-13  
**Status:** Frontend wired to backend APIs; mapping hub still mock  
**Package name:** `cursor-final`  
**Product:** Kinetic Migrator (SAP Migration Smart Validator)  
**Repo:** [Mirai-Minds-Kinetic-Migrator-Frontend-](https://github.com/Aisha-02/Mirai-Minds-Kinetic-Migrator-Frontend-.git)

---

## Summary

This folder is the **Next.js App Router frontend**. The API lives in a sibling repo (`../backend/`, [Mirai-Minds-Kinetic-Migrator-Backend](https://github.com/Aisha-02/Mirai-Minds-Kinetic-Migrator-Backend.git)). Local workspace layout:

- `frontend/` — this app (Stitch Remix is UI source of truth)
- `backend/` — Express API (auth, comparisons, validation cleanup, rules)

**User routes:** `/register`, `/signin`, `/staging`, `/processing`, `/preview`, `/validation`, `/reports`  
**Admin routes:** `/admin` (Admin Configuration Hub), `/analysis` (AI Analysis & Mapping Hub)

**Roles:** `admin` | `normal_user`. After login, admin goes to `/admin`, users go to `/staging`.

**User flow:** Staging uploads preload + postload → stores `active_batch` → `/processing` runs comparison API → `/reports` (live metrics + PDF).

---

## Goals

- [x] Bootstrap Next.js + TypeScript + Tailwind (App Router, no `src/`)
- [x] Connect Stitch MCP and use it as UI source of truth
- [x] Implement "Kinetic Migrator - Register (Perfect Sync)"
- [x] Implement "Kinetic Migrator - Sign In (Dark Mode)"
- [x] Implement "Data Staging Center (High Contrast)"
- [x] Implement "Data Preview - Horizontal Table View"
- [x] Implement "Data Validation Center - Cleaned Header"
- [x] Implement "Data Validation Center - AI Closed"
- [x] Implement "Migration Pipeline Results (High Contrast)"
- [x] Implement "Processing Data - Loading State"
- [x] Implement "Admin Rule Hub - Optimized Layout"
- [x] Implement "Admin Rule Hub - Final Branding Sync" (AI chat)
- [x] Split into separate frontend + backend GitHub repos
- [x] Implement "AI Analysis & Mapping Hub - AI Closed"
- [x] Implement "AI Analysis & Mapping Hub" (Analyze opens AI chat)
- [x] Wire auth (register / login / `/api/auth/me`) and persist JWT in localStorage
- [x] Gate admin vs user via `RequireAuth` + backend roles
- [x] Wire staging, processing, reports, validation, admin rules to backend
- [ ] Finish preview ALV grid (Stage B) from `fetchBatchFileData`
- [ ] Wrap `/preview` and `/analysis` in `RequireAuth`
- [ ] Wire mapping hub (`/analysis`) to backend
- [x] Implement "Kinetic Migrator - Legal Center (Terms & Privacy)"
- [ ] Implement remaining Stitch screens
- [ ] Ship production-ready migration validator

---

## Tech Stack

| Area | Choice | Notes |
|------|--------|--------|
| Frontend | Next.js `16.3.0` | App Router + Turbopack (`npm run dev` in `frontend/`) |
| Language | TypeScript `^5` | Strict typing via `tsconfig.json` |
| UI | React `19.2.8` / `react-dom` `19.2.8` | |
| Styling | Tailwind CSS `^4` + `@tailwindcss/postcss` | Tokens in `app/globals.css` |
| Fonts | IBM Plex Sans, IBM Plex Mono | `next/font/google` in `app/layout.tsx` |
| Icons | Material Symbols Outlined | Loaded in root layout; `Icon` wrapper |
| Linting | ESLint `^9` + `eslint-config-next` `16.3.0` | |
| Package manager | npm | `package-lock.json` in this repo |
| Design source | Stitch MCP | Remix of SAP Migration Smart Validator |
| Backend | Separate Node/Express repo | Auth, comparisons, validation, rules |
| API base | `NEXT_PUBLIC_API_URL` | Defaults to `http://localhost:4000` |

---

## Stitch Source of Truth

| Item | Value |
|------|--------|
| Project title | Remix of SAP Migration Smart Validator |
| Project ID | `1119174885132838804` |
| Design system | Kinetic Enterprise |
| Primary brand | `#008fd3` (brand blue) / UI primary `#90cdff` |
| Register | `3733955811636019108` — Perfect Sync (current; USER/ADMIN toggle) |
| Register (prior) | `1ccd50df681a476c869065b8a2231fb7` — Perfect Sync (hidden instance) |
| Sign In | `3166d45c07c9428a98efe1e086f42967` — Dark Mode |
| Staging | `14324518032497741044` — High Contrast |
| Preview | `fed1d1f289a040c8970f0472bd3b4ae6` — Horizontal Table View |
| Validation | `7c9bd36a84f044e19748431f90bd9fac` — Cleaned Header (current; no AI) |
| Validation (prior) | `6e7ea4a050254afab8f3a107f6d66d2d` — AI Closed |
| Pipeline Results | `aa1559614bba47afb8fb4705fc95d2e7` — High Contrast |
| Processing Loading | `c1aeb12b3ae34741b513a332c1323bd2` — Loading State |
| Admin Rule Hub | `e489784146424ff6a68af939e47a1fa2` — Final Branding Sync (current; AI chat) |
| Admin Rule Hub (prior) | `ee124e3b0db44b29a6785c7fb053c427` — Optimized Layout |
| Mapping Hub | `71b3a5a4fb024b67b4f7d1bdb97cbab8` — AI Analysis & Mapping Hub (current; Analyze opens chat) |
| Mapping Hub (prior) | `fab3a5cb41cd47ffade8d08b7e95f3d2` — AI Closed |
| Legal Center | `574d102ebb5a42ad840ab16915eac393` — Terms & Privacy (current) |
| Typical canvas | Desktop ~2560×2048 |

### Design theme notes

- **Auth:** dark glass card, ambient primary/secondary blur orbs
- **Workspace:** fixed `260px` sidebar + `64px` top bar
- **Typography:** IBM Plex Sans (UI); IBM Plex Mono (data / status)
- **Register inputs:** underline glow `#008fd3` (`.glow-input`)
- **Sign In inputs:** underline glow `#90cdff` (`.glow-input-primary`)
- **Register CTA:** `brand-blue`; **Sign In CTA:** `primary-container` + arrow
- **CSS utilities:** `.glass-panel` (auth), `.surface-glass` / `.legal-content` (Legal Center), `.workspace-glass`, `.upload-zone`, `.drop-zone`, `.assistant-panel`, `.mapping-glass` / `.table-row-border` / `.input-glass` (mapping hub)
- **Validation Cleaned Header:** shared SideNav; top bar is product name + system status + avatar (no notif/settings); **no Suggest via AI / chatbot**
- **Processing flow:** Staging Process Data → `/processing` (run comparison) → `/reports`
- **Admin surface:** separate `AdminSideNav` (Admin / Analysis)
- **Mapping Hub:** closed by default (AI Closed); **Analyze** opens `MappingAiAssistantPanel` (400px); top bar / main shrink when open

---

## Routes

| Path | Screen | Auth | Notes |
|------|--------|------|--------|
| `/` | Redirect | Public | → `/register` |
| `/register` | Register | Public | Creates account (email, password, role) → `/signin`; TOS/Privacy → `/legal` |
| `/signin` | Sign In | Public | JWT session; redirect by role |
| `/legal` | Legal Center | Public | Terms, Privacy, GDPR, Data Security (hash sections) |
| `/staging` | Data Staging Center | `normal_user` | Upload preload/postload; Process Data → `/processing` |
| `/processing` | Processing Data | `normal_user` | `runComparison(batchId)` then `/reports` |
| `/preview` | Data Preview | **Not gated yet** | Lists files for `active_batch` |
| `/validation` | Data Validation Center | `normal_user` + `admin` | Cleaned Header mock UI; no AI rail |
| `/reports` | Comparison Report | `normal_user` | Live report + PDF download |
| `/admin` | Admin Configuration Hub | `admin` | Generate/save validation rules |
| `/analysis` | AI Analysis & Mapping Hub | **Not gated yet** | Still mock UI |

**Workspace nav wiring** (`lib/mock/workspace.ts`):

| Nav item | Href |
|----------|------|
| Upload | `/staging` |
| Display | `/preview` |
| Validate | `/validation` |
| Reports | `/reports` |
| Help / Logs | `#` (not implemented) |

---

## Project Structure

```
frontend/                           # This GitHub repo
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                    # Redirect → /register
│   ├── register/page.tsx
│   ├── signin/page.tsx
│   ├── legal/page.tsx              # public Legal Center
│   ├── staging/page.tsx            # RequireAuth normal_user
│   ├── processing/page.tsx         # RequireAuth normal_user
│   ├── preview/page.tsx            # no RequireAuth yet
│   ├── validation/page.tsx         # RequireAuth normal_user + admin
│   ├── reports/page.tsx            # RequireAuth normal_user
│   ├── admin/page.tsx              # RequireAuth admin
│   └── analysis/page.tsx           # no RequireAuth yet
├── components/
│   ├── auth/                       # + RequireAuth, RegisterRoleToggle
│   ├── layout/                     # SideNav, TopAppBar
│   ├── staging/
│   ├── processing/
│   ├── preview/                    # + PreviewFileList
│   ├── validation/                 # Cleaned Header; no AI panel
│   ├── pipeline/
│   ├── admin/
│   ├── mapping/
│   ├── legal/                      # Legal Center (Terms & Privacy)
│   └── ui/                         # + AlvDataGrid
├── lib/
│   ├── api/
│   │   ├── config.ts               # API_BASE, storage keys
│   │   ├── http.ts                 # apiFetch + Bearer token
│   │   ├── auth.ts
│   │   ├── comparisons.ts
│   │   ├── validation.ts
│   │   └── rules.ts
│   ├── session/batch.ts            # sessionStorage active_batch
│   └── mock/                       # Screen copy + leftover fixtures
├── public/
├── .env.local.example              # backend URL (use .env.local locally)
├── project.md
└── package.json

../backend/                         # Separate GitHub repo
../.cursor/mcp.json                 # Stitch MCP (workspace root; do not commit secrets)
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend dev server (http://localhost:3000) |
| `npm run build` | Frontend production build |
| `npm run lint` | Frontend ESLint |
| `cd ../backend && npm run dev` | Backend API (http://localhost:4000) |

---

## Architecture & Conventions

- **Routing:** Next.js App Router; thin `page.tsx` shells compose screen components
- **Path alias:** `@/*` → frontend project root
- **No `src/` directory**
- **Stitch is UI source of truth** — match layout, typography, colors, spacing, dimensions; do not invent extra UI
- **Shared workspace chrome:** one `SideNav`; `TopAppBar` variants per screen
- **Auth:** JWT in `localStorage` (`auth_token`, `auth_user`); `RequireAuth` calls `/api/auth/me`
- **Batch session:** `sessionStorage` key `active_batch` (`lib/session/batch.ts`) after staging upload
- **API client:** `lib/api/http.ts` `apiFetch` prefixes `NEXT_PUBLIC_API_URL` and sends `Authorization: Bearer`
- **Mock files:** still used for Stitch copy/labels; live data comes from API on staging/processing/preview/reports/validation/admin
- **Auth vs workspace surfaces:** `.glass-panel` for auth; `.workspace-glass` / `.drop-zone` / `.assistant-panel` for validation workspace
- Keep this file current when adding screens or structural changes

---

## Backend API used by this frontend

Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`).

| Client | Endpoints |
|--------|-----------|
| `lib/api/auth.ts` | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| `lib/api/comparisons.ts` | `POST /api/comparisons/upload-preload`, `POST /api/comparisons/upload-postload`, `POST /api/comparisons/:batchId/run`, `GET .../report`, `GET .../report/download`, `GET .../files`, `GET .../files/:uploadId` |
| `lib/api/validation.ts` | `POST /api/validation/execute-cleanup` |
| `lib/api/rules.ts` | `GET /api/rules/business-objects`, `POST /api/rules/generate`, `POST /api/rules/save`, `GET /api/rules` |

If auto-detect fails, staging/validation prompt for a business object (`needs_business_object`).

---

## Features

| Feature | Status | Notes |
|---------|--------|--------|
| Next.js + TS + Tailwind scaffold | Done | |
| Stitch MCP as UI source | Done | Project `1119174885132838804` |
| Register (`/register`) | Done | Perfect Sync `3733955811636019108`; USER/ADMIN segmented toggle; TOS/Privacy → `/legal` |
| Legal Center (`/legal`) | Done | Terms, Privacy, GDPR, Data Security from Stitch mock copy |
| Sign In (`/signin`) | Done | Dark Mode; JWT + `homePathForRole` |
| Role gating | Partial | Staging/processing/reports/admin/validation gated; preview + analysis not yet |
| Staging (`/staging`) | Done | Live preload/postload upload |
| Processing (`/processing`) | Done | Runs comparison, then `/reports` |
| Preview (`/preview`) | Partial | Lists batch files; ALV grid Stage B not wired |
| Validation (`/validation`) | Done | Cleaned Header mock report; AI button/chat removed |
| Pipeline Results (`/reports`) | Done | Live summary metrics, issues table (`AlvDataGrid`), PDF download |
| Admin Rule Hub (`/admin`) | Done | Generate + save rules from Excel metadata |
| Mapping Hub (`/analysis`) | UI only | Still mock; Analyze opens MappingAiAssistantPanel |
| Auth API | Done | Register/login/me |
| Workspace API integration | Mostly done | Mapping hub remaining |

---

## Screen component maps

### Register

```
RegisterScreen
├── AuthBackground
└── RegisterCard (GlassPanel)
    ├── RegisterHeader (logo h-36)
    ├── RegisterForm
    │   ├── RegisterRoleToggle (USER | ADMIN)
    │   ├── TextField ×4 (name, email, password, confirm)
    │   ├── Checkbox (Terms & Privacy links)
    │   └── Button brand
    └── RegisterFooter → /signin
```

Copy: `lib/mock/register.ts`  
Stitch: **Kinetic Migrator - Register (Perfect Sync)** (`3733955811636019108`)  
API: existing `registerAccount` (visual source is Stitch; submit still uses the auth client)

### Legal Center

```
LegalScreen (client: hash → active nav)
├── LegalTopBar (product name + Sign In → /signin)
├── LegalSideNav (Terms / Privacy / GDPR / Data Security)
├── LegalContent (surface-glass article + sections)
└── LegalFooter
```

Copy: `lib/mock/legal.ts`  
Stitch: **Kinetic Migrator - Legal Center (Terms & Privacy)** (`574d102ebb5a42ad840ab16915eac393`)  
Entry: Register TOS → `/legal#terms-of-service`; Privacy → `/legal#privacy-policy`

### Sign In

```
SignInScreen
├── AuthBackground
└── SignInCard (GlassPanel)
    ├── SignInHeader
    ├── SignInForm (email, password + visibility + forgot, Button primary)
    └── SignInFooter → /register
```

Copy: `lib/mock/signin.ts`  
API: `loginAccount` → store session → `/admin` or `/staging`

### Staging

```
StagingScreen
├── SideNav (active: upload)
├── TopAppBar (variant: staging, pageTitle)
└── main
    ├── StagingPageHeader
    ├── UploadZoneCard × 2
    ├── ValidationPipeline
    └── TransformationDocuments
```

Copy: `lib/mock/staging.ts`  
API: `uploadPreload` / `uploadPostload`; `storeActiveBatch`; then `/processing`

### Preview

```
PreviewScreen (client)
├── SideNav (active: display)
├── TopAppBar (variant: preview)
└── main
    ├── empty state if no active_batch
    └── PreviewFileList (files from GET .../files)
        └── selection placeholder (“ALV-style grid view comes in Stage B”)
```

Copy: `lib/mock/preview.ts`  
API: `fetchBatchFiles` via `getActiveBatch()`  
`AlvDataGrid` exists in `components/ui/` (used on reports; not yet on preview)

### Validation

```
ValidationScreen
├── SideNav (active: validate)
├── TopAppBar (variant: validation — product name, System Healthy, Status Online, avatar)
└── main (full width beside sidebar; no AI rail)
    ├── ValidationPageHeader ("Data Cleaning Results")
    ├── SourceDataUpload + ActiveRulesetCard + ExecuteCleaningButton
    └── CleaningReport (metrics + mock issues table + Download)
```

Copy: `lib/mock/validation.ts`  
Stitch: **Data Validation Center - Cleaned Header** (`7c9bd36a84f044e19748431f90bd9fac`)  
Note: Suggest via AI and chatbot are **not** implemented (explicitly removed).

### Pipeline Results (Reports)

```
PipelineResultsScreen
├── SideNav (active: reports)
├── TopAppBar (variant: reports)
└── main
    ├── PipelineResultsHeader
    ├── PipelineMetricsRow (from comparison summary)
    └── PipelineIssuesTable (AlvDataGrid + PDF download)
```

Copy types: `lib/mock/pipeline.ts`  
API: `fetchComparisonReport` (polls while processing), `downloadComparisonPdf`  
Stitch: **Migration Pipeline Results (High Contrast)** (`aa1559614bba47afb8fb4705fc95d2e7`)

### Processing Data (Loading State)

```
ProcessingScreen (client: runComparison → /reports)
├── SideNav (active: upload) + staging backdrop
├── TopAppBar (variant: staging)
├── StagingPageHeader / UploadZoneCard / ValidationPipeline / TransformationDocuments
└── ProcessingOverlay
```

If no `active_batch`, redirects to `/staging`. On API error, still navigates to `/reports` after ~2.5s.  
Stitch: **Processing Data - Loading State** (`c1aeb12b3ae34741b513a332c1323bd2`)

### Admin Rule Hub

```
AdminRuleHubScreen (client: assistantOpen)
├── AdminSideNav (Admin / Analysis + Help / Logs)
├── TopAppBar (variant: admin)
├── AdminAiAssistantPanel (closed by default; opens via Suggest via AI)
└── main
    ├── AdminPageHeader (Apply Global Rules)
    └── grid
        ├── SourceDataRulesCard
        ├── BusinessObjectCard
        └── ValidationSelectionCard (Suggest via AI)
```

Copy: `lib/mock/admin.ts`  
API: `generateValidationRules`, `saveValidationRules`  
Stitch: **Admin Rule Hub - Final Branding Sync** (`e489784146424ff6a68af939e47a1fa2`)

### AI Analysis & Mapping Hub

```
MappingHubScreen (client: assistantOpen, default false)
├── AdminSideNav (active: analysis)
├── TopAppBar (variant: analysis)
├── MappingAiAssistantPanel (closed by default; opens via Analyze)
└── main
    ├── MappingConfidenceCard + MigrationProgressCard
    └── FieldMappingTable (search / filter / Analyze)
```

Mock: `lib/mock/mapping.ts` (not wired to API)  
Stitch closed: **AI Analysis & Mapping Hub - AI Closed** (`fab3a5cb41cd47ffade8d08b7e95f3d2`)  
Stitch open: **AI Analysis & Mapping Hub** (`71b3a5a4fb024b67b4f7d1bdb97cbab8`)

---

## Environment & Tooling

### Cursor / MCP

- Stitch MCP configured in workspace `.cursor/mcp.json` (not inside this frontend repo)
- Do **not** commit or paste API keys into this document
- Local Stitch HTML exports may live under ignored paths (e.g. `/stitch-assets`)

### Frontend env

- File: `.env.local` (template: `.env.local.example`)
- Variable: `NEXT_PUBLIC_API_URL` (browser-visible; default `http://localhost:4000`)
- Do not put JWT secrets, DB, Groq, or SAP credentials here — those belong in `backend/.env`

### Local notes

- Frontend: port **3000**
- Backend: port **4000**
- `/` → `/register`
- Prefer absolute imports via `@/`

---

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-08-12 | Next.js App Router, TypeScript, Tailwind 4 | Initial stack |
| 2026-08-12 | No `src/` directory | Flat `app/` + `components/` |
| 2026-08-12 | Maintain `project.md` as living doc | Project context |
| 2026-08-12 | Stitch is UI source of truth | Match generated designs |
| 2026-08-12 | Thin pages + feature folders + `components/ui` | Reuse without bloating `page.tsx` |
| 2026-08-12 | Dark Stitch tokens for auth | Screen HTML is dark |
| 2026-08-12 | Shared `SideNav` / `TopAppBar` | Avoid chrome duplication |
| 2026-08-12 | Button/TextField variants | Sign In needs primary glow/CTA without breaking Register |
| 2026-08-12 | Auth `.glass-panel` ≠ `.workspace-glass` | Different Stitch glass recipes |
| 2026-08-12 | Preview tabs = client state | Matches Stitch preload/postload switcher |
| 2026-08-12 | Validation shell uses padding, not `flex-1`+`ml-*` | Fixed sidebar caused overflow / “magnified” feel |
| 2026-08-12 | Validation Cleaned Header uses default SideNav | Stitch removed K badge, New Migration, search, notif/settings |
| 2026-08-12 | Validation AI Closed is default UI | Stitch screen `6e7ea4a050254afab8f3a107f6d66d2d`; assistant hidden until Suggest via AI |
| 2026-08-12 | Validation top bar / main pad follow assistantOpen | Avoid empty 400px gutter when rail is closed |
| 2026-08-12 | Pipeline Results at `/reports` | Matches SideNav Reports active state in Stitch |
| 2026-08-12 | Reports TopAppBar uses logo + mono status (no avatar) | Match Pipeline Results Stitch chrome |
| 2026-08-12 | Process Data → `/processing` → `/reports` | Stitch loading overlay before pipeline results |
| 2026-08-13 | Admin Rule Hub uses dedicated AdminSideNav | Stitch admin chrome differs from user workspace nav |
| 2026-08-13 | Admin Suggest via AI opens AdminAiAssistantPanel | Final Branding Sync chat rail; closed until clicked |
| 2026-08-13 | Mapping Hub at `/analysis` with AdminSideNav Analysis active | Matches Stitch admin Analysis chrome |
| 2026-08-13 | Mapping Hub Analyze opens MappingAiAssistantPanel | Open hub chat differs from admin rule suggestions |
| 2026-08-13 | Mapping hub uses `.mapping-glass` not auth `.glass-panel` | Stitch mapping glass recipe differs from auth |
| 2026-08-13 | Frontend and backend are separate GitHub repos | Independent deploys and history |
| 2026-08-13 | JWT in localStorage; `RequireAuth` verifies `/api/auth/me` | Gate workspace/admin screens |
| 2026-08-13 | `active_batch` in sessionStorage | Staging → processing → reports/preview share one batch |
| 2026-08-13 | `AlvDataGrid` for pipeline issues | Filterable/sortable table; preview grid deferred to Stage B |
| 2026-08-13 | Register Perfect Sync uses screen `3733955811636019108` | Visible Stitch instance; prior `1ccd50df…` is hidden |
| 2026-08-13 | Validation uses Cleaned Header without AI | Stitch `7c9bd36a84f044e19748431f90bd9fac`; no Suggest via AI / chatbot |

---

## Changelog

### 2026-08-13 (Validation Cleaned Header)

- Synced `/validation` to **Data Validation Center - Cleaned Header** (`7c9bd36a84f044e19748431f90bd9fac`)
- Removed **Suggest via AI** and `AiAssistantPanel` chatbot
- Top bar: System Healthy + Status Online + avatar (no notif/settings)
- Cleaning report uses mock metrics/issues table + Download

### 2026-08-13 (Legal Center)

- Implemented **Kinetic Migrator - Legal Center (Terms & Privacy)** at `/legal` from Stitch `574d102ebb5a42ad840ab16915eac393`
- Wired Register **Terms of Service** → `/legal#terms-of-service` and **Privacy Policy** → `/legal#privacy-policy`
- Added `.surface-glass` / `.legal-content` tokens from Stitch; mock copy in `lib/mock/legal.ts`

### 2026-08-13 (Register Perfect Sync resync)

- Inspected Stitch project **Remix of SAP Migration Smart Validator** (`1119174885132838804`)
- Synced `/register` to current **Kinetic Migrator - Register (Perfect Sync)** (`3733955811636019108`)
- Replaced role radio cards with Stitch USER/ADMIN segmented toggle (`RegisterRoleToggle`)
- Terms of Service / Privacy Policy are brand-blue links; logo saved to `public/kinetic-logo.png`
- Register page stays a thin shell; layout/copy/components unchanged on other screens

### 2026-08-13 (current frontend vs older project.md)

- Synced this document to the **current `frontend/` tree** (separate GitHub repo, not a single monorepo root `project.md`)
- Auth: register/login with roles; `RequireAuth`; JWT + stored user
- Staging/processing/reports wired to comparison APIs; `active_batch` session
- Preview lists uploaded batch files (`PreviewFileList`); ALV grid Stage B still pending
- Validation wired to `executeCleanup`
- Admin wired to generate/save rules
- Added `lib/api/{config,http,auth,comparisons,validation,rules}.ts`, `lib/session/batch.ts`, `AlvDataGrid`, `RequireAuth`
- Mapping hub remains mock UI

### 2026-08-13 (earlier UI)

- Implemented **AI Analysis & Mapping Hub** open chat: **Analyze** opens `MappingAiAssistantPanel`
- Implemented **AI Analysis & Mapping Hub - AI Closed** at `/analysis`
- Implemented **Admin Rule Hub** at `/admin` and Final Branding Sync AI chat

### 2026-08-12

- Scaffolded Next.js + TypeScript + Tailwind; added living `project.md`
- Implemented Register, Sign In, Staging, Preview, Validation, Reports, Processing from Stitch

---

## Open Questions / TODO

- [ ] Add `RequireAuth` to `/preview` and `/analysis`
- [ ] Preview Stage B: load `fetchBatchFileData` into `AlvDataGrid`
- [ ] Wire mapping hub to backend
- [ ] Help / Logs nav targets
- [ ] Deployment target (e.g. Vercel + API host)?

---

## How to update this file

When making meaningful progress: bump **Last updated**, adjust **Features** / **Routes** / **Structure**, add a **Changelog** line and any **Decisions Log** entries. Keep secrets out of this file.
