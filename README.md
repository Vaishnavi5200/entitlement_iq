# EntitlementIQ — Construction Claims Sentinel

<div align="center">

![EntitlementIQ Logo](frontend/public/logo.svg)

### Detecting Recoverable Construction Claims Before the Contractual Deadline Closes
**byteBuilt 1.0 Hackathon · Problem Statement PS #13 · Change Order Claims Desk**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVaishnavi5200%2FEntitlementIQ)
[![Live Demo](https://img.shields.io/badge/Live_Demo-HTTPS_Tunnel-amber.svg)](https://0a07a1e75a2b59.lhr.life)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Vaishnavi5200%2FEntitlementIQ-blue.svg)](https://github.com/Vaishnavi5200/EntitlementIQ)

</div>

---

## ⚡ 1-Click Vercel Deployment Link

Click the button below to immediately deploy your own instance of EntitlementIQ on Vercel with zero configuration:

👉 **[Deploy on Vercel (Direct Link)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVaishnavi5200%2FEntitlementIQ)**

---

## 🎯 Executive Overview (PS #13)

Construction projects generate floods of fragmented data across site reports, RFIs, P6 schedules, AWS weather logs, photos, and executed contracts. When a delay happens:
1. Nobody correlates the evidence fast enough.
2. The **strict 28-day statutory notice clock** (FIDIC Sub-Clause 20.1) keeps running.
3. The contractor **forfeits 100% of delay compensation** if notice is not served in time.

### Core Motto
> *"Detect the delay. Prove the entitlement. Beat the deadline."*

---

## 🔁 The Core 6-Step Loop

```
[01. Event]       14 Adverse Rainy Days Recorded (Station AWS-NCR-042)
      ↓
[02. Entitlement] Contract Clause 8.4(b): Baseline (8.2d) + Margin (4.0d) = 12.2d Threshold
                  14.0 > 12.2 → Potential Entitlement Detected
      ↓
[03. Evidence]    Contemporary Records Collated: AWS Log + DPR #218 + P6 TIA (8/10 Score)
      ↓
[04. Impact]      6.0 Eligible Days EoT × ₹78,333.33/day = ₹4.70 Lakh Estimated Exposure
      ↓
[05. Deadline]    Statutory 28-Day Clock from 10 Aug Detection → 5 Days Left (Expires 07 Sep)
      ↓
[06. Action]      PM Human Review Gate (Approve / Edit / Reject) → Formal Claim Notice Issued
```

---

## 🧮 "Where Did This Number Come From?" (Deterministic Math)

Every single number in EntitlementIQ has a visible mathematical proof:

### 1. How ₹4.70 Lakh is Derived
- **Daily Site Overheads:** ₹50,000.00 / day
- **Plant & Equipment Standby:** ₹20,000.00 / day
- **Indirect Core Labour:** ₹8,333.33 / day
- **Combined Daily Prolongation Rate ($R$):** ₹78,333.33 / day
- **Eligible Critical Path Delay ($D_{EoT}$):** 14.0 Actual Days - 8.0 Scheduled Baseline = 6.0 Days
- **Total Prolongation Exposure:** $6.0 \times ₹78,333.33 = \mathbf{₹4,69,999.98 \approx ₹4.70\text{ Lakh}}$

### 2. How 14.0 > 12.2 Days is Derived
- **10-Year Historical Climatological Baseline:** 8.2 Days
- **Negotiated Contract Buffer Margin (Clause 8.4b):** +4.0 Days
- **Contractual Threshold:** $8.2 + 4.0 = \mathbf{12.2\text{ Days}}$
- **Actual Weather Observations:** $\mathbf{14.0\text{ Days}}$ ($\Delta = +1.8\text{ Days}$ threshold excess)

---

## 🛡️ Legal Defensibility & Non-Overclaiming

- ❌ **We do NOT claim:** *"Claim guaranteed"* or *"AI makes legal determinations"*
- ✅ **We DO provide:** *"Potential recoverable exposure identified to safeguard contractors from statutory notice forfeiture under FIDIC Sub-Clause 20.1"*
- **Governance Principle:** *"AI Proposes. A Human Approves. Engineer Determines. ALWAYS."*

---

## 🏗️ Architecture: Multi-Agent Division of Labor

1. **Contract Agent (AI / Claude):** Reads GCC PDF/OCR → extracts structured threshold parameters.
2. **Weather Agent (Data Pipeline):** Ingests IMD / AWS station observations.
3. **Entitlement Engine (Deterministic Python):** Pure mathematical evaluation ($14 > 12.2 = \text{TRUE}$).
4. **Evidence Agent (Correlator):** Matches daily reports & P6 critical path schedules.
5. **Impact Calculator (Deterministic Cost Model):** Multiplies daily burn rate by delay days.
6. **Deadline Sentinel (Temporal Clock):** Tracks 28-day notice countdown to avoid forfeiture.
7. **Validator (System Auditor):** Verifies integrity and logs to immutable ledger.
8. **Human Gate (PM Rajesh Sharma):** Human approval required before claim dispatch.

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Vaishnavi5200/EntitlementIQ.git
cd EntitlementIQ

# 2. Start Frontend
cd frontend
npm install
npm run dev

# 3. Start Backend
cd ../backend
uv run entitlementiq-backend
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **Swagger Docs:** `http://localhost:8000/docs`
