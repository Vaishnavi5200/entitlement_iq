from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional, Any, Dict

# Project Schemas
class ProjectBase(BaseModel):
    code: str
    name: str
    client: str
    contractor: str
    contract_value: float
    location: str
    start_date: date
    target_completion_date: date
    status: str

class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Contract & Rule Schemas
class ContractRuleBase(BaseModel):
    clause_number: str
    clause_title: str
    raw_clause_text: str
    human_explanation: str
    event_type: str
    monitoring_period: str
    historical_baseline_days: float
    contractual_margin_days: float
    threshold_days: float
    comparison_operator: str
    eligible_days_formula: str
    formula_description: Optional[str] = None
    daily_overhead_cost: float
    daily_equipment_cost: float
    daily_labor_cost: float
    is_verified_by_user: bool = True

class ContractRuleUpdate(BaseModel):
    clause_number: Optional[str] = None
    clause_title: Optional[str] = None
    raw_clause_text: Optional[str] = None
    human_explanation: Optional[str] = None
    historical_baseline_days: Optional[float] = None
    contractual_margin_days: Optional[float] = None
    threshold_days: Optional[float] = None
    eligible_days_formula: Optional[str] = None
    daily_overhead_cost: Optional[float] = None
    daily_equipment_cost: Optional[float] = None
    daily_labor_cost: Optional[float] = None

class ContractRuleOut(ContractRuleBase):
    id: int
    contract_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ContractOut(BaseModel):
    id: int
    project_id: int
    title: str
    form_type: str
    governing_law: str
    default_notice_days: int
    uploaded_at: datetime
    rules: List[ContractRuleOut] = []
    class Config:
        from_attributes = True

# Evidence Schemas
class EvidenceBase(BaseModel):
    type: str
    title: str
    date: date
    source: str
    relevance: str
    verification_status: str
    weight: int
    is_missing: bool
    file_attachment: Optional[str] = None

class EvidenceOut(EvidenceBase):
    id: int
    entitlement_id: int
    class Config:
        from_attributes = True

# Weather Observation Schemas
class WeatherObservationOut(BaseModel):
    id: int
    project_id: int
    obs_date: date
    rainfall_mm: float
    wind_kmh: float
    max_temp_c: float
    is_adverse: bool
    adverse_trigger_reason: Optional[str] = None
    site_impact_logged: Optional[str] = None
    class Config:
        from_attributes = True

# Entitlement Schemas
class EntitlementOut(BaseModel):
    id: int
    project_id: int
    rule_id: int
    event_name: str
    status: str
    historical_baseline_days: float
    contractual_margin_days: float
    threshold_days: float
    actual_adverse_days: float
    is_triggered: bool
    eligible_days: float
    daily_rate: float
    estimated_financial_impact: float
    financial_breakdown_json: Optional[Any] = None
    event_start_date: date
    event_end_date: date
    detection_date: date
    notice_window_days: int
    notice_deadline_date: date
    days_remaining: int
    risk_level: str
    evidence_score: int
    evidence_total: int
    confidence_score: float
    pm_decision: Optional[str] = None
    pm_decision_notes: Optional[str] = None
    pm_reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    project: Optional[ProjectOut] = None
    rule: Optional[ContractRuleOut] = None
    evidence_items: List[EvidenceOut] = []

    class Config:
        from_attributes = True

# PM Review Request
class ReviewDecisionCreate(BaseModel):
    decision: str # "Approve", "Edit", "Reject"
    eligible_days: float
    financial_impact: float
    reviewer_name: str = "Rajesh Sharma (Sr. Project Manager)"
    reviewer_role: str = "Contract Administrator & PM"
    rationale: str

# Claim Notice Out
class ClaimNoticeOut(BaseModel):
    id: int
    entitlement_id: int
    notice_reference: str
    issue_date: date
    recipient_name: str
    recipient_org: str
    sender_name: str
    sender_org: str
    subject: str
    formal_notice_text: str
    eligible_days_claimed: float
    financial_claim_amount: float
    created_at: datetime
    class Config:
        from_attributes = True

# Audit Log Out
class AuditLogOut(BaseModel):
    id: int
    project_id: Optional[int] = None
    entitlement_id: Optional[int] = None
    action: str
    actor: str
    details: str
    timestamp: datetime
    class Config:
        from_attributes = True

# Contract Upload Request
class ContractParseRequest(BaseModel):
    project_id: int
    contract_title: str
    form_type: str = "FIDIC Red Book (Clause 8.4(b))"
    governing_law: str = "Indian Contract Act, 1872"
    contract_text: str

# Dashboard Summary
class DashboardMetrics(BaseModel):
    active_projects_count: int
    potential_entitlements_count: int
    claims_at_risk_count: int
    deadlines_within_7_days_count: int
    total_recoverable_value: float
    priority_claims: List[Dict[str, Any]]
    deadline_risk_breakdown: Dict[str, int]
    portfolio_status_funnel: Dict[str, int]
