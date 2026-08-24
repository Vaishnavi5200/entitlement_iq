import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.database import get_db
from app.models.entities import (
    Project, Contract, ContractRule, WeatherObservation,
    Entitlement, Evidence, ReviewDecision, AuditLog, ClaimNotice
)
from app.schemas.schemas import (
    ProjectOut, ContractOut, ContractRuleOut, ContractRuleUpdate,
    EntitlementOut, EvidenceOut, WeatherObservationOut,
    ReviewDecisionCreate, ClaimNoticeOut, AuditLogOut,
    ContractParseRequest, DashboardMetrics
)
from app.services.calculator import run_deterministic_entitlement_calculation
from app.services.contract_agent import parse_contract_clause_with_ai
from app.services.weather_service import WeatherService
from app.services.claim_generator import generate_claim_notice_document
from app.repositories.repo import ProjectRepository, EntitlementRepository, ContractRepository, AuditRepository

router = APIRouter(prefix="/api")

# ==========================================
# 1. DASHBOARD METRICS
# ==========================================
@router.get("/dashboard/metrics", response_model=DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    entitlements = db.query(Entitlement).all()

    active_projects_count = len(projects)
    potential_entitlements_count = sum(1 for e in entitlements if e.is_triggered)
    claims_at_risk_count = sum(1 for e in entitlements if e.risk_level in ["High", "Critical"] and e.status == "Needs PM Review")
    deadlines_within_7_days_count = sum(1 for e in entitlements if e.days_remaining <= 7 and e.days_remaining > 0 and e.status == "Needs PM Review")
    total_recoverable_value = sum(e.estimated_financial_impact for e in entitlements if e.is_triggered)

    # Priority Claims Table Rows
    priority_claims = []
    for e in entitlements:
        project = db.query(Project).filter(Project.id == e.project_id).first()
        rule = db.query(ContractRule).filter(ContractRule.id == e.rule_id).first()
        priority_claims.append({
            "id": e.id,
            "project_id": e.project_id,
            "project_code": project.code if project else "#000",
            "project_name": project.name if project else "Unknown Project",
            "event_name": e.event_name,
            "clause_number": rule.clause_number if rule else "8.4(b)",
            "eligible_days": e.eligible_days,
            "estimated_impact": e.estimated_financial_impact,
            "evidence_score": f"{e.evidence_score}/{e.evidence_total}",
            "days_remaining": e.days_remaining,
            "risk_level": e.risk_level,
            "status": e.status
        })

    # Sort priority claims by urgency (least days remaining first)
    priority_claims.sort(key=lambda x: (x["status"] != "Needs PM Review", x["days_remaining"]))

    deadline_risk_breakdown = {
        "Critical": sum(1 for e in entitlements if e.risk_level == "Critical"),
        "High": sum(1 for e in entitlements if e.risk_level == "High"),
        "Medium": sum(1 for e in entitlements if e.risk_level == "Medium"),
        "Low": sum(1 for e in entitlements if e.risk_level == "Low"),
    }

    portfolio_status_funnel = {
        "Monitored": len(projects),
        "Potential Entitlement Detected": potential_entitlements_count,
        "Needs PM Review": sum(1 for e in entitlements if e.status == "Needs PM Review"),
        "Approved / Claim Issued": sum(1 for e in entitlements if e.status in ["Approved", "Claim Generated"])
    }

    return DashboardMetrics(
        active_projects_count=active_projects_count,
        potential_entitlements_count=potential_entitlements_count,
        claims_at_risk_count=claims_at_risk_count,
        deadlines_within_7_days_count=deadlines_within_7_days_count,
        total_recoverable_value=total_recoverable_value,
        priority_claims=priority_claims,
        deadline_risk_breakdown=deadline_risk_breakdown,
        portfolio_status_funnel=portfolio_status_funnel
    )


# ==========================================
# 2. PROJECTS
# ==========================================
@router.get("/projects", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.get("/projects/{project_id}")
def get_project_details(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    contracts = db.query(Contract).filter(Contract.project_id == project_id).all()
    entitlements = db.query(Entitlement).filter(Entitlement.project_id == project_id).all()
    
    return {
        "project": project,
        "contracts": contracts,
        "entitlements": entitlements
    }


# ==========================================
# 3. ENTITLEMENT DETAILS & CALCULATION ENGINE
# ==========================================
@router.get("/entitlements/{entitlement_id}", response_model=EntitlementOut)
def get_entitlement(entitlement_id: int, db: Session = Depends(get_db)):
    entitlement = db.query(Entitlement).filter(Entitlement.id == entitlement_id).first()
    if not entitlement:
        raise HTTPException(status_code=404, detail="Entitlement not found")
    return entitlement

@router.post("/entitlements/{entitlement_id}/recalculate")
def recalculate_entitlement(
    entitlement_id: int,
    custom_baseline: Optional[float] = None,
    custom_margin: Optional[float] = None,
    custom_actual_days: Optional[float] = None,
    custom_formula_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Executes the deterministic calculation engine with verified audit tracing.
    """
    entitlement = db.query(Entitlement).filter(Entitlement.id == entitlement_id).first()
    if not entitlement:
        raise HTTPException(status_code=404, detail="Entitlement not found")

    rule = db.query(ContractRule).filter(ContractRule.id == entitlement.rule_id).first()
    
    baseline = custom_baseline if custom_baseline is not None else (rule.historical_baseline_days if rule else 8.2)
    margin = custom_margin if custom_margin is not None else (rule.contractual_margin_days if rule else 4.0)
    actual_days = custom_actual_days if custom_actual_days is not None else entitlement.actual_adverse_days
    formula_type = custom_formula_type or (rule.eligible_days_formula if rule else "contract_excess_over_baseline")

    calc_res = run_deterministic_entitlement_calculation(
        baseline_days=baseline,
        margin_days=margin,
        actual_adverse_days=actual_days,
        formula_type=formula_type,
        daily_overhead=rule.daily_overhead_cost if rule else 50000.0,
        daily_equipment=rule.daily_equipment_cost if rule else 20000.0,
        daily_labor=rule.daily_labor_cost if rule else 8333.33,
        event_start_date=entitlement.event_start_date,
        event_end_date=entitlement.event_end_date,
        detection_date=entitlement.detection_date,
        notice_window_days=entitlement.notice_window_days,
        current_date=datetime.date(2026, 9, 2)
    )

    # Update database record
    entitlement.historical_baseline_days = calc_res.baseline_days
    entitlement.contractual_margin_days = calc_res.margin_days
    entitlement.threshold_days = calc_res.threshold_days
    entitlement.actual_adverse_days = calc_res.actual_adverse_days
    entitlement.is_triggered = calc_res.is_triggered
    entitlement.eligible_days = calc_res.eligible_days
    entitlement.daily_rate = calc_res.combined_daily_rate
    entitlement.estimated_financial_impact = calc_res.estimated_financial_impact
    entitlement.financial_breakdown_json = [item.model_dump() for item in calc_res.financial_breakdown]
    entitlement.days_remaining = calc_res.days_remaining
    entitlement.risk_level = calc_res.risk_level
    db.commit()
    db.refresh(entitlement)

    # Log recalculation audit
    audit_repo = AuditRepository(db)
    audit_repo.log(
        action="ENTITLEMENT_RECALCULATED",
        details=f"Deterministic engine executed. Baseline: {baseline}, Margin: {margin}, Actual Days: {actual_days} -> {calc_res.eligible_days} eligible days, ₹{calc_res.estimated_financial_impact:,.2f} impact.",
        actor="Calculation Engine",
        project_id=entitlement.project_id,
        entitlement_id=entitlement.id
    )

    return {
        "entitlement": entitlement,
        "calculation_result": calc_res
    }


# ==========================================
# 4. PM REVIEW & DECISION WORKSPACE
# ==========================================
@router.post("/entitlements/{entitlement_id}/review")
def submit_pm_review(
    entitlement_id: int,
    payload: ReviewDecisionCreate,
    db: Session = Depends(get_db)
):
    entitlement = db.query(Entitlement).filter(Entitlement.id == entitlement_id).first()
    if not entitlement:
        raise HTTPException(status_code=404, detail="Entitlement not found")

    project = db.query(Project).filter(Project.id == entitlement.project_id).first()
    rule = db.query(ContractRule).filter(ContractRule.id == entitlement.rule_id).first()

    orig_days = entitlement.eligible_days
    orig_impact = entitlement.estimated_financial_impact

    # Record Review Decision
    decision_entry = ReviewDecision(
        entitlement_id=entitlement.id,
        decision=payload.decision,
        original_eligible_days=orig_days,
        final_eligible_days=payload.eligible_days,
        original_financial_impact=orig_impact,
        final_financial_impact=payload.financial_impact,
        reviewer_name=payload.reviewer_name,
        reviewer_role=payload.reviewer_role,
        rationale=payload.rationale
    )
    db.add(decision_entry)

    # Update Entitlement Status
    if payload.decision == "Approve":
        entitlement.status = "Approved"
        entitlement.eligible_days = payload.eligible_days
        entitlement.estimated_financial_impact = payload.financial_impact
        entitlement.pm_decision = "Approved"
        entitlement.pm_decision_notes = payload.rationale
        entitlement.pm_reviewed_at = datetime.datetime.utcnow()

        # Auto-generate formal Claim Notice document
        contract = db.query(Contract).filter(Contract.id == (rule.contract_id if rule else 1)).first()
        doc_data = generate_claim_notice_document(
            project_code=project.code if project else "#042",
            project_name=project.name if project else "Project",
            contract_title=contract.title if contract else "FIDIC General Conditions",
            clause_number=rule.clause_number if rule else "8.4(b)",
            client_name=project.client if project else "Client",
            contractor_name=project.contractor if project else "Contractor",
            eligible_days=payload.eligible_days,
            financial_amount=payload.financial_impact,
            issue_date=datetime.date(2026, 9, 2),
            monitoring_period=rule.monitoring_period if rule else "August 2026",
            adverse_days=entitlement.actual_adverse_days,
            threshold_days=entitlement.threshold_days,
            baseline_days=entitlement.historical_baseline_days,
            margin_days=entitlement.contractual_margin_days,
            evidence_count=len(entitlement.evidence_items)
        )

        claim_notice = ClaimNotice(
            entitlement_id=entitlement.id,
            notice_reference=doc_data["claim_reference"],
            issue_date=doc_data["issue_date"],
            recipient_name=project.client if project else "Client Rep",
            recipient_org=project.client if project else "Employer",
            sender_name=payload.reviewer_name,
            sender_org=project.contractor if project else "Contractor",
            subject=doc_data["subject"],
            formal_notice_text=doc_data["formal_notice_text"],
            eligible_days_claimed=doc_data["eligible_days"],
            financial_claim_amount=doc_data["financial_amount"]
        )
        db.add(claim_notice)
        entitlement.status = "Claim Generated"

    elif payload.decision == "Edit":
        entitlement.status = "Needs PM Review"
        entitlement.eligible_days = payload.eligible_days
        entitlement.estimated_financial_impact = payload.financial_impact
        entitlement.pm_decision = "Edited"
        entitlement.pm_decision_notes = payload.rationale
        entitlement.pm_reviewed_at = datetime.datetime.utcnow()

    elif payload.decision == "Reject":
        entitlement.status = "Rejected"
        entitlement.pm_decision = "Rejected"
        entitlement.pm_decision_notes = payload.rationale
        entitlement.pm_reviewed_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(entitlement)

    # Log Audit
    audit_repo = AuditRepository(db)
    audit_repo.log(
        action=f"PM_REVIEW_{payload.decision.upper()}",
        details=f"PM {payload.reviewer_name} recorded decision '{payload.decision}'. Eligible Days: {payload.eligible_days}, Value: ₹{payload.financial_impact:,.2f}. Rationale: {payload.rationale}",
        actor=payload.reviewer_name,
        project_id=entitlement.project_id,
        entitlement_id=entitlement.id
    )

    return {
        "success": True,
        "entitlement": EntitlementOut.model_validate(entitlement),
        "status": entitlement.status
    }


# ==========================================
# 5. CLAIM NOTICE PREVIEW & EXPORT
# ==========================================
@router.get("/entitlements/{entitlement_id}/claim-notice")
def get_claim_notice(entitlement_id: int, db: Session = Depends(get_db)):
    claim = db.query(ClaimNotice).filter(ClaimNotice.entitlement_id == entitlement_id).order_by(ClaimNotice.id.desc()).first()
    if claim:
        return claim
    
    # If not yet generated, build preview on-the-fly
    entitlement = db.query(Entitlement).filter(Entitlement.id == entitlement_id).first()
    if not entitlement:
        raise HTTPException(status_code=404, detail="Entitlement not found")

    project = db.query(Project).filter(Project.id == entitlement.project_id).first()
    rule = db.query(ContractRule).filter(ContractRule.id == entitlement.rule_id).first()
    contract = db.query(Contract).filter(Contract.id == (rule.contract_id if rule else 1)).first()

    preview = generate_claim_notice_document(
        project_code=project.code if project else "#042",
        project_name=project.name if project else "Project",
        contract_title=contract.title if contract else "FIDIC General Conditions",
        clause_number=rule.clause_number if rule else "8.4(b)",
        client_name=project.client if project else "Client",
        contractor_name=project.contractor if project else "Contractor",
        eligible_days=entitlement.eligible_days,
        financial_amount=entitlement.estimated_financial_impact,
        issue_date=datetime.date(2026, 9, 2),
        monitoring_period=rule.monitoring_period if rule else "August 2026",
        adverse_days=entitlement.actual_adverse_days,
        threshold_days=entitlement.threshold_days,
        baseline_days=entitlement.historical_baseline_days,
        margin_days=entitlement.contractual_margin_days,
        evidence_count=len(entitlement.evidence_items)
    )
    return preview


# ==========================================
# 6. CONTRACT ONBOARDING & CLAUSE EXTRACTION
# ==========================================
@router.post("/contracts/parse")
async def parse_contract_clause(payload: ContractParseRequest, db: Session = Depends(get_db)):
    extracted = await parse_contract_clause_with_ai(payload.contract_text)
    
    # Audit log extraction
    audit_repo = AuditRepository(db)
    audit_repo.log(
        action="RULE_EXTRACTED_AI",
        details=f"Contract Agent extracted Clause {extracted.get('clause', '8.4(b)')}: Baseline {extracted.get('baseline_days')}d + Margin {extracted.get('margin_days')}d = Threshold {extracted.get('threshold_days')}d.",
        actor=extracted.get("extracted_by", "AI Agent"),
        project_id=payload.project_id
    )
    return extracted

@router.put("/contract-rules/{rule_id}", response_model=ContractRuleOut)
def update_contract_rule(rule_id: int, payload: ContractRuleUpdate, db: Session = Depends(get_db)):
    rule = db.query(ContractRule).filter(ContractRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(rule, k, v)

    # Recompute threshold if baseline or margin changed
    rule.threshold_days = round(rule.historical_baseline_days + rule.contractual_margin_days, 2)
    db.commit()
    db.refresh(rule)

    audit_repo = AuditRepository(db)
    audit_repo.log(
        action="RULE_UPDATED_BY_USER",
        details=f"Contract Rule #{rule_id} updated. Baseline: {rule.historical_baseline_days}d, Margin: {rule.contractual_margin_days}d, Threshold: {rule.threshold_days}d.",
        actor="Rajesh Sharma (PM)"
    )
    return rule


# ==========================================
# 7. AUDIT LOGS & TRACEABILITY
# ==========================================
@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(project_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(AuditLog)
    if project_id:
        query = query.filter(AuditLog.project_id == project_id)
    return query.order_by(AuditLog.timestamp.desc()).all()


# ==========================================
# 8. WEATHER DATA
# ==========================================
@router.get("/weather/{project_id}")
def get_weather_data(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    observations = db.query(WeatherObservation).filter(WeatherObservation.project_id == project_id).order_by(WeatherObservation.obs_date.asc()).all()
    baseline = WeatherService.get_historical_baseline(project.code if project else "#042")

    return {
        "project_code": project.code if project else "#042",
        "monitoring_period": "August 2026",
        "baseline_info": baseline,
        "observations": observations,
        "total_adverse_days_recorded": sum(1 for o in observations if o.is_adverse)
    }
