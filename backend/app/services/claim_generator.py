from datetime import date
from typing import Dict, Any

def generate_claim_notice_document(
    project_code: str,
    project_name: str,
    contract_title: str,
    clause_number: str,
    client_name: str,
    contractor_name: str,
    eligible_days: float,
    financial_amount: float,
    issue_date: date,
    monitoring_period: str,
    adverse_days: float,
    threshold_days: float,
    baseline_days: float,
    margin_days: float,
    evidence_count: int,
    claim_ref: str = "EIQ-CLM-2026-042-01"
) -> Dict[str, Any]:
    """
    Generates formal construction contract claim notice compliant with FIDIC Sub-Clause 20.1 / 8.4.
    """
    subject = f"FORMAL NOTICE OF CONTRACTOR'S CLAIM UNDER SUB-CLAUSE 8.4(b) & SUB-CLAUSE 20.1 — EXTENSION OF TIME & PROLONGATION COSTS (EXCEPTIONALLY ADVERSE CLIMATIC CONDITIONS)"

    formal_body = f"""
Ref: {claim_ref}
Date: {issue_date.strftime('%d %B %Y')}

TO:
The Engineer / Project Representative
{client_name}
Project: {project_code} — {project_name}

FROM:
Contractor's Representative
{contractor_name}

SUBJECT:
{subject}

Dear Sir/Madam,

1. CONTRACTUAL BASIS & INTENT OF NOTICE
Pursuant to Sub-Clause 20.1 [Contractor's Claims] and Sub-Clause 8.4(b) [Extension of Time for Exceptionally Adverse Climatic Conditions] of the General Conditions of Contract ({contract_title}), we hereby submit our formal Notice of Claim for an Extension of the Time for Completion and associated site prolongation costs incurred during the monitoring period of {monitoring_period}.

2. EVENT DESCRIPTION & WEATHER EXTREMES
During {monitoring_period}, the project site experienced severe meteorological conditions that substantially exceeded normal historical patterns. 
- Historical 10-Year Baseline Allowance: {baseline_days} days
- Contractual Buffer Margin: +{margin_days} days
- Contractual Entitlement Threshold: {threshold_days} days
- Actual Recorded Adverse Weather Days: {adverse_days} days

The recorded {adverse_days} adverse weather days decisively surpass the contractual threshold of {threshold_days} days. Consequently, a potential weather entitlement was formally established under Sub-Clause 8.4(b).

3. SCHEDULE & FINANCIAL IMPACTS
In accordance with the verified critical path delay assessment, the exceptionally adverse weather caused direct delay and disruption to critical path activities, including substructure concreting, basement dewatering, and tower crane operations:
- Eligible Extension of Time (EoT) Claimed: {eligible_days:.1f} Calendar Days
- Revised Forecast Completion Adjustment: +{int(eligible_days)} Days
- Estimated Prolongation Costs / Recoverable Value: INR {financial_amount:,.2f} (₹{financial_amount/100000:.1f} Lakhs)

4. CONTEMPORARY EVIDENCE & RECORDS
This claim is substantiated by {evidence_count} contemporary site records maintained in accordance with Sub-Clause 20.1, including:
- Official Weather Station and IMD Gridded Rainfall Records
- Daily Site Progress Reports & Engineer Sign-Off Logs
- Critical Path Schedule Impact Analysis (CPM)
- Site Inundation & HSE Safety Suspension Photographs

5. TIMELINESS & STRICT COMPLIANCE
This formal notice is issued within the mandatory 28-day notice window following our awareness of the event, preserving all rights under the Contract. Detailed particulars and contemporary cost vouchers will follow within the prescribed 42-day period.

Yours faithfully,

_____________________________
Rajesh Sharma
Contract Administrator & Sr. Project Manager
For and on behalf of {contractor_name}
"""
    return {
        "claim_reference": claim_ref,
        "issue_date": issue_date,
        "subject": subject,
        "formal_notice_text": formal_body.strip(),
        "recipient_org": client_name,
        "sender_org": contractor_name,
        "eligible_days": eligible_days,
        "financial_amount": financial_amount
    }
