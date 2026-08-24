import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False) # e.g. "Project #042"
    name = Column(String(255), nullable=False) # e.g. "Riverside Commercial Complex"
    client = Column(String(255), nullable=False) # e.g. "Apex Urban Infra Ltd"
    contractor = Column(String(255), nullable=False) # e.g. "BuildCore Engineering JV"
    contract_value = Column(Float, nullable=False) # in Rupees
    location = Column(String(255), nullable=False) # e.g. "Sector 62, Noida, NCR"
    start_date = Column(Date, nullable=False)
    target_completion_date = Column(Date, nullable=False)
    status = Column(String(50), default="Active") # Active, On Hold, Completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    contracts = relationship("Contract", back_populates="project", cascade="all, delete-orphan")
    entitlements = relationship("Entitlement", back_populates="project", cascade="all, delete-orphan")
    weather_observations = relationship("WeatherObservation", back_populates="project", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="project", cascade="all, delete-orphan")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False) # e.g. "General Conditions of Contract (FIDIC Yellow Book Equiv)"
    form_type = Column(String(100), default="FIDIC Red Book")
    governing_law = Column(String(100), default="Indian Contract Act, 1872")
    default_notice_days = Column(Integer, default=28)
    document_filename = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="contracts")
    rules = relationship("ContractRule", back_populates="contract", cascade="all, delete-orphan")


class ContractRule(Base):
    __tablename__ = "contract_rules"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    clause_number = Column(String(50), nullable=False) # e.g. "8.4(b)"
    clause_title = Column(String(255), nullable=False) # e.g. "Extension of Time for Exceptionally Adverse Climatic Conditions"
    raw_clause_text = Column(Text, nullable=False)
    human_explanation = Column(Text, nullable=False)
    event_type = Column(String(100), default="weather_delay")
    
    # Structured calculation inputs:
    monitoring_period = Column(String(100), default="Monthly (August 2026)")
    historical_baseline_days = Column(Float, nullable=False) # 8.2
    contractual_margin_days = Column(Float, nullable=False) # 4.0
    threshold_days = Column(Float, nullable=False) # 12.2 = 8.2 + 4.0
    comparison_operator = Column(String(10), default=">")
    
    # Contractual calculation rule methodology:
    # "contract_excess_over_baseline": Once threshold (12.2) is exceeded, contract awards all days exceeding baseline (14.0 - 8.0 = 6.0 days on critical path)
    eligible_days_formula = Column(String(100), default="contract_excess_over_baseline")
    formula_description = Column(Text, nullable=True)

    # Financial derivation rates
    daily_overhead_cost = Column(Float, default=50000.0) # Fixed site general conditions
    daily_equipment_cost = Column(Float, default=20000.0) # Idle tower crane / excavator standby
    daily_labor_cost = Column(Float, default=8333.33) # Site dewatering & standby team

    is_verified_by_user = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    contract = relationship("Contract", back_populates="rules")
    entitlements = relationship("Entitlement", back_populates="rule")


class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    obs_date = Column(Date, nullable=False)
    rainfall_mm = Column(Float, default=0.0)
    wind_kmh = Column(Float, default=0.0)
    max_temp_c = Column(Float, default=32.0)
    is_adverse = Column(Boolean, default=False)
    adverse_trigger_reason = Column(String(255), nullable=True)
    site_impact_logged = Column(String(255), nullable=True)

    project = relationship("Project", back_populates="weather_observations")


class Entitlement(Base):
    __tablename__ = "entitlements"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    rule_id = Column(Integer, ForeignKey("contract_rules.id"), nullable=False)
    
    event_name = Column(String(255), default="Exceptionally Adverse Monsoon Precipitation")
    status = Column(String(50), default="Needs PM Review") # Needs PM Review, Approved, Edited, Rejected, Claim Generated
    
    # Calculation Results:
    historical_baseline_days = Column(Float, default=8.2)
    contractual_margin_days = Column(Float, default=4.0)
    threshold_days = Column(Float, default=12.2)
    actual_adverse_days = Column(Float, default=14.0)
    is_triggered = Column(Boolean, default=True)
    eligible_days = Column(Float, default=6.0)
    
    # Financial Impact Breakdown:
    daily_rate = Column(Float, default=78333.33)
    estimated_financial_impact = Column(Float, default=470000.0) # ₹4.7 Lakh
    financial_breakdown_json = Column(JSON, nullable=True)
    
    # Deadlines:
    event_start_date = Column(Date, nullable=False)
    event_end_date = Column(Date, nullable=False)
    detection_date = Column(Date, nullable=False)
    notice_window_days = Column(Integer, default=28)
    notice_deadline_date = Column(Date, nullable=False)
    days_remaining = Column(Integer, default=5)
    risk_level = Column(String(20), default="High") # Low, Medium, High, Critical
    
    # Evidence Metrics:
    evidence_score = Column(Integer, default=8)
    evidence_total = Column(Integer, default=10)
    confidence_score = Column(Float, default=0.92)

    notes = Column(Text, nullable=True)
    pm_decision = Column(String(50), nullable=True)
    pm_decision_notes = Column(Text, nullable=True)
    pm_reviewed_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="entitlements")
    rule = relationship("ContractRule", back_populates="entitlements")
    evidence_items = relationship("Evidence", back_populates="entitlement", cascade="all, delete-orphan")
    decisions = relationship("ReviewDecision", back_populates="entitlement", cascade="all, delete-orphan")
    claim_notices = relationship("ClaimNotice", back_populates="entitlement", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    entitlement_id = Column(Integer, ForeignKey("entitlements.id"), nullable=False)
    type = Column(String(100), nullable=False) # Weather Record, Site Report, Project Schedule, RFI, Site Photos
    title = Column(String(255), nullable=False)
    date = Column(Date, nullable=False)
    source = Column(String(100), nullable=False) # Weather API, Site Team, Planning Team, Consultant
    relevance = Column(Text, nullable=False)
    verification_status = Column(String(50), default="Verified") # Verified, Pending, Missing
    weight = Column(Integer, default=2)
    is_missing = Column(Boolean, default=False)
    file_attachment = Column(String(255), nullable=True)

    entitlement = relationship("Entitlement", back_populates="evidence_items")


class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(Integer, primary_key=True, index=True)
    entitlement_id = Column(Integer, ForeignKey("entitlements.id"), nullable=False)
    decision = Column(String(50), nullable=False) # Approve, Edit, Reject
    original_eligible_days = Column(Float, nullable=False)
    final_eligible_days = Column(Float, nullable=False)
    original_financial_impact = Column(Float, nullable=False)
    final_financial_impact = Column(Float, nullable=False)
    reviewer_name = Column(String(100), default="Rajesh Sharma (Sr. Project Manager)")
    reviewer_role = Column(String(100), default="Project Manager / Contract Administrator")
    rationale = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    entitlement = relationship("Entitlement", back_populates="decisions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    entitlement_id = Column(Integer, ForeignKey("entitlements.id"), nullable=True)
    action = Column(String(100), nullable=False) # CONTRACT_UPLOADED, RULE_EXTRACTED, THRESHOLD_CROSSED, PM_REVIEW_APPROVED, CLAIM_GENERATED
    actor = Column(String(100), default="System Engine")
    details = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="audit_logs")


class ClaimNotice(Base):
    __tablename__ = "claim_notices"

    id = Column(Integer, primary_key=True, index=True)
    entitlement_id = Column(Integer, ForeignKey("entitlements.id"), nullable=False)
    notice_reference = Column(String(100), unique=True, nullable=False) # e.g. "EIQ-CLM-2026-042-01"
    issue_date = Column(Date, nullable=False)
    recipient_name = Column(String(255), nullable=False)
    recipient_org = Column(String(255), nullable=False)
    sender_name = Column(String(255), nullable=False)
    sender_org = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    formal_notice_text = Column(Text, nullable=False)
    eligible_days_claimed = Column(Float, nullable=False)
    financial_claim_amount = Column(Float, nullable=False)
    pdf_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    entitlement = relationship("Entitlement", back_populates="claim_notices")
