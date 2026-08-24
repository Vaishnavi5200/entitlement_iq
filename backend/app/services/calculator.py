from datetime import date, timedelta
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class CalculationTrace(BaseModel):
    step_name: str
    formula: str
    inputs: Dict[str, Any]
    output: Any
    explanation: str

class FinancialLineItem(BaseModel):
    category: str
    description: str
    daily_rate: float
    days: float
    total: float

class EntitlementCalculationResult(BaseModel):
    baseline_days: float
    margin_days: float
    threshold_days: float
    actual_adverse_days: float
    is_triggered: bool
    formula_used: str
    eligible_days: float
    
    # Financial breakdown
    daily_overhead_cost: float
    daily_equipment_cost: float
    daily_labor_cost: float
    combined_daily_rate: float
    estimated_financial_impact: float
    financial_breakdown: List[FinancialLineItem]
    
    # Deadline breakdown
    event_start_date: date
    event_end_date: date
    detection_date: date
    notice_window_days: int
    notice_deadline_date: date
    current_date: date
    days_remaining: int
    risk_level: str
    
    # Audit Trace
    traces: List[CalculationTrace]


def run_deterministic_entitlement_calculation(
    baseline_days: float, # 8.2
    margin_days: float, # 4.0
    actual_adverse_days: float, # 14.0
    formula_type: str = "contract_excess_over_baseline", # rule-driven formula
    daily_overhead: float = 50000.0,
    daily_equipment: float = 20000.0,
    daily_labor: float = 8333.33,
    event_start_date: date = date(2026, 8, 1),
    event_end_date: date = date(2026, 8, 16),
    detection_date: date = date(2026, 8, 10),
    notice_window_days: int = 28,
    current_date: Optional[date] = None,
    critical_path_affected_days: Optional[float] = 6.0
) -> EntitlementCalculationResult:
    """
    Deterministic Calculation Engine for Weather Entitlements.
    All mathematical threshold comparisons, eligible day derivations, 
    financial impact breakdowns, and deadline countdowns are computed here.
    """
    if current_date is None:
        # Default demo date matching Project #042 active timeline
        current_date = date(2026, 9, 2)

    traces: List[CalculationTrace] = []

    # Step 1: Compute Entitlement Threshold
    threshold_days = round(baseline_days + margin_days, 2)
    traces.append(CalculationTrace(
        step_name="1. Entitlement Threshold Derivation",
        formula="Threshold = Historical Baseline (8.2) + Contract Margin (4.0)",
        inputs={"historical_baseline_days": baseline_days, "contractual_margin_days": margin_days},
        output=threshold_days,
        explanation=f"Under Clause 8.4(b), adverse weather qualifies as exceptional only when total adverse days exceed {threshold_days} days."
    ))

    # Step 2: Deterministic Trigger Check
    is_triggered = actual_adverse_days > threshold_days
    traces.append(CalculationTrace(
        step_name="2. Threshold Evaluation",
        formula=f"Actual Adverse Days ({actual_adverse_days}) > Threshold ({threshold_days})",
        inputs={"actual_adverse_days": actual_adverse_days, "threshold_days": threshold_days},
        output=is_triggered,
        explanation="Threshold passed. Potential weather entitlement is legally triggered." if is_triggered else "Threshold not passed. No contractual entitlement."
    ))

    # Step 3: Rule-Driven Eligible Days Derivation
    # In standard FIDIC / EPC contracts, the contract schedule incorporates an 8-day baseline allowance.
    # When actual days (14.0) cross the threshold (12.2), the contractor is entitled to claim
    # all adverse weather days exceeding the allocated baseline schedule allowance (14 - 8 = 6 days on critical path).
    if not is_triggered:
        eligible_days = 0.0
        formula_desc = "No threshold breach -> 0 eligible days"
    else:
        if formula_type == "contract_excess_over_baseline":
            # Contractual schedule allowance is 8 whole days baseline.
            allocated_baseline_allowance = round(baseline_days) # 8 days
            eligible_days = max(0.0, float(actual_adverse_days - allocated_baseline_allowance))
            formula_desc = f"Eligible Days = Actual Adverse Days ({actual_adverse_days}) - Scheduled Baseline Allowance ({allocated_baseline_allowance}) = {eligible_days} days"
        elif formula_type == "excess_over_threshold":
            eligible_days = round(max(0.0, actual_adverse_days - threshold_days), 1)
            formula_desc = f"Eligible Days = Actual Adverse Days ({actual_adverse_days}) - Threshold ({threshold_days}) = {eligible_days} days"
        else:
            eligible_days = float(critical_path_affected_days or 6.0)
            formula_desc = f"Direct Critical Path Delay Assessment = {eligible_days} days"

    traces.append(CalculationTrace(
        step_name="3. Contract-Rule-Driven Eligible Days Calculation",
        formula=formula_desc,
        inputs={
            "actual_adverse_days": actual_adverse_days,
            "baseline_days": baseline_days,
            "threshold_days": threshold_days,
            "formula_type": formula_type
        },
        output=eligible_days,
        explanation=f"Clause 8.4(b) rule awards {eligible_days} days of Extension of Time (EoT) for critical path delay."
    ))

    # Step 4: Transparent Financial Impact Calculation
    combined_daily_rate = round(daily_overhead + daily_equipment + daily_labor, 2) # ~78,333.33
    total_financial_impact = round(eligible_days * combined_daily_rate, 2) # ~470,000 (4.7 Lakh)

    financial_breakdown = [
        FinancialLineItem(
            category="Site General Conditions",
            description="Site office, supervisory staff, utilities, site security & insurance",
            daily_rate=daily_overhead,
            days=eligible_days,
            total=round(daily_overhead * eligible_days, 2)
        ),
        FinancialLineItem(
            category="Plant & Equipment Standby",
            description="Idle tower crane, hydraulic excavator & batching plant standby charges",
            daily_rate=daily_equipment,
            days=eligible_days,
            total=round(daily_equipment * eligible_days, 2)
        ),
        FinancialLineItem(
            category="Labor & Dewatering Impact",
            description="Site dewatering crew, storm drain pump fuel, idle gang standby",
            daily_rate=daily_labor,
            days=eligible_days,
            total=round(daily_labor * eligible_days, 2)
        )
    ]

    traces.append(CalculationTrace(
        step_name="4. Financial Impact Calculation",
        formula=f"Impact = Eligible Days ({eligible_days}) × Daily Rate (₹{combined_daily_rate:,.2f})",
        inputs={
            "eligible_days": eligible_days,
            "daily_overhead": daily_overhead,
            "daily_equipment": daily_equipment,
            "daily_labor": daily_labor,
            "combined_daily_rate": combined_daily_rate
        },
        output=total_financial_impact,
        explanation=f"Total estimated recoverable delay damages: ₹{total_financial_impact:,.2f} (₹{total_financial_impact/100000:.1f} Lakh)."
    ))

    # Step 5: Contractual Notice Deadline Countdown
    notice_deadline_date = detection_date + timedelta(days=notice_window_days)
    days_remaining = (notice_deadline_date - current_date).days

    if days_remaining <= 2:
        risk_level = "Critical"
    elif days_remaining <= 5:
        risk_level = "High"
    elif days_remaining <= 10:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    traces.append(CalculationTrace(
        step_name="5. Contractual Notice Deadline Sentinel",
        formula=f"Deadline Date = Detection Date ({detection_date}) + Notice Window ({notice_window_days} days) = {notice_deadline_date}",
        inputs={
            "detection_date": str(detection_date),
            "notice_window_days": notice_window_days,
            "current_date": str(current_date),
            "days_remaining": days_remaining
        },
        output={"notice_deadline_date": str(notice_deadline_date), "days_remaining": days_remaining, "risk_level": risk_level},
        explanation=f"Strict compliance window: {days_remaining} calendar days remaining before right to claim is barred."
    ))

    return EntitlementCalculationResult(
        baseline_days=baseline_days,
        margin_days=margin_days,
        threshold_days=threshold_days,
        actual_adverse_days=actual_adverse_days,
        is_triggered=is_triggered,
        formula_used=formula_type,
        eligible_days=eligible_days,
        daily_overhead_cost=daily_overhead,
        daily_equipment_cost=daily_equipment,
        daily_labor_cost=daily_labor,
        combined_daily_rate=combined_daily_rate,
        estimated_financial_impact=total_financial_impact,
        financial_breakdown=financial_breakdown,
        event_start_date=event_start_date,
        event_end_date=event_end_date,
        detection_date=detection_date,
        notice_window_days=notice_window_days,
        notice_deadline_date=notice_deadline_date,
        current_date=current_date,
        days_remaining=days_remaining,
        risk_level=risk_level,
        traces=traces
    )
