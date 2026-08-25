# EntitlementIQ — Construction Claims Intelligence

<div align="center">

![EntitlementIQ Logo](frontend/public/logo.svg)

**Detecting recoverable construction claims before the contractual deadline closes.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-amber.svg)](https://0a07a1e75a2b59.lhr.life)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Vaishnavi5200%2FEntitlementIQ-blue.svg)](https://github.com/Vaishnavi5200/EntitlementIQ)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVaishnavi5200%2FEntitlementIQ)

</div>

---

## Problem

Construction projects generate fragmented data across site reports, RFIs, schedules, weather logs, and contracts. When a delay event occurs:

- Evidence is scattered and not correlated quickly enough.
- The **28-day statutory notice clock** (FIDIC Sub-Clause 20.1) keeps running from the moment of awareness.
- If formal notice is not served in time, the contractor **forfeits all rights to delay compensation** — regardless of how valid the underlying claim is.

Most projects miss recoverable entitlements not because the claim doesn't exist, but because no one connected the evidence fast enough.

---

## Solution

EntitlementIQ is a construction claims intelligence platform that automates the detection, calculation, and documentation of weather-related delay entitlements under FIDIC-style contracts.

It combines an **AI contract parsing agent** (Claude) with a **deterministic entitlement engine** to evaluate threshold breaches, compute financial exposure, track statutory deadlines, and generate draft claim notices — all with a fully transparent audit trail.

> *"AI proposes. A human approves. The engineer determines. Always."*

---

## Key Features

- **Contract Upload & AI Parsing** — Upload a contract clause (PDF or text); Claude extracts the entitlement rule (baseline days, margin, threshold, notice window) as structured parameters. Falls back to a high-precision regex parser when no API key is configured.
- **Deterministic Entitlement Engine** — Pure mathematical evaluation of whether actual adverse weather days exceed the contractual threshold, with every step traceable.
- **Weather Data Ingestion** — Daily site weather observations (rainfall mm, wind km/h) mapped against the IMD 10-year historical baseline.
- **Financial Impact Calculation** — Transparent cost breakdown across site overheads, plant & equipment standby, and labour — multiplied by eligible delay days.
- **Deadline Sentinel** — Countdown tracker for the 28-day FIDIC Sub-Clause 20.1 notice window, with risk-level classification (Low / Medium / High / Critical).
- **Evidence Correlation** — Links daily site progress reports, weather records, and schedule data to the detected event.
- **Claim Notice Generation** — Produces a draft formal notice of claim (FIDIC Sub-Clause 8.4(b) / 20.1 compliant) ready for human review.
- **Human Approval Gate** — No claim is dispatched without explicit project manager sign-off.
- **Immutable Audit Log** — Every calculation step, agent action, and approval decision is logged for legal defensibility.

---

## How It Works

```
[01. Event]       Adverse weather days recorded against project site
      ↓
[02. Entitlement] Contract clause parsed → threshold derived (baseline + margin)
                  Actual days vs. threshold → entitlement triggered or not
      ↓
[03. Evidence]    Contemporary records correlated: weather logs, DPRs, schedule
      ↓
[04. Impact]      Eligible EoT days × combined daily prolongation rate = financial exposure
      ↓
[05. Deadline]    28-day notice clock tracked from detection date → risk level assigned
      ↓
[06. Action]      Human review gate → draft claim notice generated and dispatched
```

---

## Architecture

| Component | Role |
|---|---|
| **Contract Agent** (Claude / regex fallback) | Reads contract clause text → extracts structured entitlement parameters |
| **Weather Service** | Ingests daily site observations; retrieves IMD historical baseline |
| **Entitlement Engine** (Deterministic Python) | Evaluates threshold, computes eligible days, validates entitlement trigger |
| **Impact Calculator** (Deterministic) | Breaks down prolongation costs across overhead, equipment, and labour |
| **Claim Generator** | Produces FIDIC-compliant draft formal notice document |
| **Deadline Sentinel** | Tracks 28-day countdown and classifies risk level |
| **Audit Logger** | Logs all steps to an immutable ledger |
| **Human Gate** | PM approval required before claim is finalised or dispatched |

---

## AI + Deterministic Engine

EntitlementIQ uses a hybrid approach:

**AI (Claude 3.5 Sonnet)** handles the unstructured part — reading a contract clause in plain language and extracting the entitlement rule as structured parameters (baseline days, margin, threshold, notice window).

**Deterministic Python** handles everything numerical. Once the parameters are extracted, all threshold comparisons, eligible day derivations, financial calculations, and deadline countdowns are pure arithmetic — no inference, no hallucination risk.

If no Anthropic API key is configured, the platform falls back to a high-precision regex-based parser that achieves the same structured extraction from standard FIDIC clause language.

**Legal guardrail:** EntitlementIQ surfaces potential recoverable exposure and generates draft notices. It does not make legal determinations. All outputs pass through a mandatory human review gate before any action is taken.

---

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3
- Lucide React (icons)

**Backend**
- Python 3.14
- FastAPI + Uvicorn
- SQLAlchemy 2 + SQLite
- Pydantic v2 + pydantic-settings
- httpx (Claude API calls)
- uv (package & build tool)

**AI**
- Anthropic Claude 3.5 Sonnet (optional; regex fallback included)

**Deployment**
- Vercel (frontend)
- Backend served via uv

---

## Project Structure

```
EntitlementIQ/
├── frontend/                  # React + TypeScript UI
│   ├── src/
│   │   ├── views/             # Page-level views
│   │   │   ├── DashboardView.tsx
│   │   │   ├── ProjectDetailView.tsx
│   │   │   ├── ContractUploadView.tsx
│   │   │   ├── ClaimsView.tsx
│   │   │   ├── DeadlinesView.tsx
│   │   │   ├── EvidenceView.tsx
│   │   │   ├── AuditLogView.tsx
│   │   │   └── ProjectsListView.tsx
│   │   ├── components/        # Shared UI components
│   │   └── api/               # API client
│   └── package.json
├── backend/                   # FastAPI backend
│   └── app/
│       ├── main.py            # App entry point, CORS, routing
│       ├── config.py          # Settings (env vars, DB URL, API key)
│       ├── database.py        # SQLAlchemy setup
│       ├── models/            # ORM models
│       ├── schemas/           # Pydantic request/response schemas
│       ├── repositories/      # Database access layer
│       ├── services/
│       │   ├── contract_agent.py    # Claude + regex contract parser
│       │   ├── calculator.py        # Deterministic entitlement engine
│       │   ├── weather_service.py   # Weather data + historical baseline
│       │   └── claim_generator.py   # Formal notice document generator
│       ├── api/routes.py      # All API endpoints
│       └── seed/              # Demo seed data
└── vercel.json
```

---

## Local Setup

**Prerequisites:** Node.js, Python 3.14+, [uv](https://github.com/astral-sh/uv)

```bash
# 1. Clone the repository
git clone https://github.com/Vaishnavi5200/entitlement_iq.git
cd entitlement_iq

# 2. Start the frontend
cd frontend
npm install
npm run dev

# 3. Start the backend (new terminal)
cd backend
uv run entitlementiq-backend
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

**Optional:** Set `ANTHROPIC_API_KEY` in `backend/.env` to enable live Claude contract parsing. Without it, the built-in regex parser is used automatically.

---

## Disclaimer

EntitlementIQ surfaces potential recoverable delay entitlements and generates draft formal notices to assist project teams. It does not constitute legal advice and does not make binding contractual or legal determinations. All outputs must be reviewed, verified, and approved by a qualified contract administrator or legal professional before submission.

---

## Project

Built by [Vaishnavi Dwivedi](https://github.com/Vaishnavi5200).

GitHub: [github.com/Vaishnavi5200/EntitlementIQ](https://github.com/Vaishnavi5200/EntitlementIQ)
