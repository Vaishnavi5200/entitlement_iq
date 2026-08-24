import datetime
from sqlalchemy.orm import Session
from app.models.entities import (
    Project, Contract, ContractRule, WeatherObservation,
    Entitlement, Evidence, ReviewDecision, AuditLog, ClaimNotice
)
from app.services.calculator import run_deterministic_entitlement_calculation
from app.services.weather_service import WeatherService

def seed_database(db: Session):
    # Check if database already has seed data
    if db.query(Project).count() > 0:
        return

    print("Seeding EntitlementIQ database with realistic multi-project data...")

    # 1. Project #042 — Riverside Commercial Complex
    p1 = Project(
        code="Project #042",
        name="Riverside Commercial Complex",
        client="Apex Urban Infrastructure Ltd.",
        contractor="BuildCore Engineering JV",
        contract_value=185000000.0, # ₹18.5 Cr
        location="Sector 62, Noida, NCR",
        start_date=datetime.date(2025, 11, 1),
        target_completion_date=datetime.date(2027, 4, 30),
        status="Active"
    )
    db.add(p1)
    db.flush()

    c1 = Contract(
        project_id=p1.id,
        title="General Conditions of Contract (FIDIC Red Book 2017 Harmonized)",
        form_type="FIDIC Red Book (EPC / Design-Build)",
        governing_law="Indian Contract Act, 1872 & Arbitration Act, 1996",
        default_notice_days=28,
        document_filename="GCC_Riverside_Complex_Executed_Final.pdf"
    )
    db.add(c1)
    db.flush()

    raw_clause_84b = """Sub-Clause 8.4 [Extension of Time for Completion]:
The Contractor shall be entitled subject to Sub-Clause 20.1 [Contractor's Claims] to an extension of the Time for Completion if and to the extent that completion for the purposes of Sub-Clause 10.1 is delayed by exceptionally adverse climatic conditions.
For the purposes of this Sub-Clause, exceptionally adverse climatic conditions are defined as meteorological events occurring during any calendar month that exceed the 10-year historical baseline of 8.2 days by a contractual margin buffer of 4.0 days (Entitlement Threshold: 12.2 days). When actual adverse days exceed the threshold, Extension of Time shall be determined based on adverse critical path days exceeding the scheduled baseline allowance. Notice of claim must be served to the Engineer within 28 days of detection."""

    r1 = ContractRule(
        contract_id=c1.id,
        clause_number="8.4(b)",
        clause_title="Extension of Time for Exceptionally Adverse Climatic Conditions",
        raw_clause_text=raw_clause_84b,
        human_explanation="Under Clause 8.4(b), adverse weather qualifies as an entitlement when total recorded adverse days in August exceed the 10-year historical baseline (8.2 days) plus the 4.0-day contract margin, giving a threshold of 12.2 days. Eligible extension days are calculated from days exceeding the 8.0-day scheduled baseline allowance on the critical path.",
        event_type="weather_delay",
        monitoring_period="August 2026",
        historical_baseline_days=8.2,
        contractual_margin_days=4.0,
        threshold_days=12.2,
        comparison_operator=">",
        eligible_days_formula="contract_excess_over_baseline",
        formula_description="Entitlement Triggered = Actual Adverse Days (14.0) > Threshold (12.2). Eligible Days = Actual Adverse Days (14.0) - Scheduled Baseline Allowance (8.0) = 6.0 Days.",
        daily_overhead_cost=50000.0,
        daily_equipment_cost=20000.0,
        daily_labor_cost=8333.33,
        is_verified_by_user=True
    )
    db.add(r1)
    db.flush()

    # Seed 31 daily observations for August 2026 for Project #042
    weather_logs = WeatherService.get_daily_weather_observations(p1.id)
    for obs in weather_logs:
        w_item = WeatherObservation(
            project_id=p1.id,
            obs_date=obs["obs_date"],
            rainfall_mm=obs["rainfall_mm"],
            wind_kmh=obs["wind_kmh"],
            max_temp_c=obs["max_temp_c"],
            is_adverse=obs["is_adverse"],
            adverse_trigger_reason=obs["adverse_trigger_reason"],
            site_impact_logged=obs["site_impact_logged"]
        )
        db.add(w_item)

    # Run deterministic calculation for Project #042
    calc_res_1 = run_deterministic_entitlement_calculation(
        baseline_days=8.2,
        margin_days=4.0,
        actual_adverse_days=14.0,
        formula_type="contract_excess_over_baseline",
        daily_overhead=50000.0,
        daily_equipment=20000.0,
        daily_labor=8333.33,
        event_start_date=datetime.date(2026, 8, 2),
        event_end_date=datetime.date(2026, 8, 27),
        detection_date=datetime.date(2026, 8, 10),
        notice_window_days=28,
        current_date=datetime.date(2026, 9, 2)
    )

    e1 = Entitlement(
        project_id=p1.id,
        rule_id=r1.id,
        event_name="Exceptionally Adverse Monsoon Precipitation & Inundation",
        status="Needs PM Review",
        historical_baseline_days=calc_res_1.baseline_days,
        contractual_margin_days=calc_res_1.margin_days,
        threshold_days=calc_res_1.threshold_days,
        actual_adverse_days=calc_res_1.actual_adverse_days,
        is_triggered=calc_res_1.is_triggered,
        eligible_days=calc_res_1.eligible_days, # 6.0 days
        daily_rate=calc_res_1.combined_daily_rate, # 78,333.33
        estimated_financial_impact=calc_res_1.estimated_financial_impact, # 470,000.0 (₹4.7 Lakh)
        financial_breakdown_json=[item.model_dump() for item in calc_res_1.financial_breakdown],
        event_start_date=calc_res_1.event_start_date,
        event_end_date=calc_res_1.event_end_date,
        detection_date=calc_res_1.detection_date,
        notice_window_days=calc_res_1.notice_window_days,
        notice_deadline_date=calc_res_1.notice_deadline_date,
        days_remaining=calc_res_1.days_remaining, # 5 days
        risk_level=calc_res_1.risk_level, # High
        evidence_score=8,
        evidence_total=10,
        confidence_score=0.94,
        notes="Automated trigger: 14 adverse rain days recorded vs 12.2-day threshold. Critical path substructure concreting disrupted."
    )
    db.add(e1)
    db.flush()

    # Evidence items for Project #042 (8/10 score with 4 verified + 1 missing)
    evidence_items = [
        Evidence(
            entitlement_id=e1.id,
            type="Weather Record",
            title="IMD Gridded Rainfall & Station Anemometer Log",
            date=datetime.date(2026, 8, 14),
            source="IMD API & Site Automatic Weather Station (AWS)",
            relevance="Certified 44.0mm downpour and wind speeds exceeding tower crane safe operation limits (45 km/h).",
            verification_status="Verified",
            weight=2,
            is_missing=False,
            file_attachment="AWS_Weather_Station_Aug2026_Certified.pdf"
        ),
        Evidence(
            entitlement_id=e1.id,
            type="Site Report",
            title="Daily Site Progress Report (DPR) #218 — Flooding Sign-Off",
            date=datetime.date(2026, 8, 15),
            source="Resident Engineer & Contractor Site Agent",
            relevance="Countersigned site shutdown due to 67mm cloudburst; raft reinforcement completely flooded.",
            verification_status="Verified",
            weight=2,
            is_missing=False,
            file_attachment="DPR_218_Aug15_Engineer_Signed.pdf"
        ),
        Evidence(
            entitlement_id=e1.id,
            type="Project Schedule",
            title="Primavera P6 Critical Path Delay Impact Analysis (TIA)",
            date=datetime.date(2026, 8, 15),
            source="Lead Planning & Controls Engineer",
            relevance="Demonstrates 6-day direct delay to Critical Path Activity CP-1042 (Basement B2 Slab Casting).",
            verification_status="Verified",
            weight=2,
            is_missing=False,
            file_attachment="P6_Critical_Path_TIA_Aug2026.xer"
        ),
        Evidence(
            entitlement_id=e1.id,
            type="Site Photos",
            title="Geotagged Inundation & Dewatering Photo Record",
            date=datetime.date(2026, 8, 16),
            source="HSE Officer / Drone Survey",
            relevance="18 high-resolution geotagged photos confirming 1.2m standing water in basement excavation.",
            verification_status="Verified",
            weight=2,
            is_missing=False,
            file_attachment="HSE_Site_Inundation_Photos_Aug16.zip"
        ),
        Evidence(
            entitlement_id=e1.id,
            type="Material Test Log",
            title="Third-Party Ready-Mix Slump & Moisture Rejection Slips",
            date=datetime.date(2026, 8, 18),
            source="Quality Control / Batching Plant Lab",
            relevance="Moisture content deviation certificates for rejected concrete batches during heavy downpour.",
            verification_status="Missing",
            weight=2,
            is_missing=True,
            file_attachment=None
        )
    ]
    for ev in evidence_items:
        db.add(ev)

    # Initial Audit Trail for Project #042
    audit_entries = [
        AuditLog(
            project_id=p1.id,
            entitlement_id=e1.id,
            action="CONTRACT_UPLOADED",
            actor="Rajesh Sharma (PM)",
            details="Uploaded GCC_Riverside_Complex_Executed_Final.pdf for Clause onboarding.",
            timestamp=datetime.datetime(2026, 8, 1, 10, 30)
        ),
        AuditLog(
            project_id=p1.id,
            entitlement_id=e1.id,
            action="RULE_EXTRACTED",
            actor="Claude Contract Agent",
            details="Extracted Clause 8.4(b): Baseline 8.2d + Margin 4.0d = Threshold 12.2d. Notice Window: 28 days.",
            timestamp=datetime.datetime(2026, 8, 1, 10, 32)
        ),
        AuditLog(
            project_id=p1.id,
            entitlement_id=e1.id,
            action="RULE_CONFIRMED",
            actor="Rajesh Sharma (PM)",
            details="Confirmed and verified structured calculation parameters for August monitoring period.",
            timestamp=datetime.datetime(2026, 8, 1, 11, 15)
        ),
        AuditLog(
            project_id=p1.id,
            entitlement_id=e1.id,
            action="WEATHER_EVENT_DETECTED",
            actor="Weather Monitoring Engine",
            details="Detection Date: 10 Aug 2026. Cumulative adverse days reached 14.0 days, exceeding 12.2 threshold.",
            timestamp=datetime.datetime(2026, 8, 10, 18, 0)
        ),
        AuditLog(
            project_id=p1.id,
            entitlement_id=e1.id,
            action="ENTITLEMENT_CALCULATED",
            actor="Deterministic Calculation Engine",
            details="Calculated 6.0 eligible delay days, ₹4,70,000 financial impact. Notice deadline set to 07 Sep 2026 (5 days remaining).",
            timestamp=datetime.datetime(2026, 8, 10, 18, 5)
        ),
        AuditLog(
            project_id=p1.id,
            entitlement_id=e1.id,
            action="EVIDENCE_ATTACHED",
            actor="Site QA/QC & Planning Engine",
            details="Attached 4 verified records (AWS logs, DPR #218, P6 TIA, Drone Photos). Evidence Completeness: 8/10.",
            timestamp=datetime.datetime(2026, 8, 17, 14, 20)
        )
    ]
    for a in audit_entries:
        db.add(a)

    # -------------------------------------------------------------
    # 2. Project #017 — Metro Infrastructure Package
    # -------------------------------------------------------------
    p2 = Project(
        code="Project #017",
        name="Metro Elevated Corridor Package 3",
        client="Delhi Metro Rail Corporation (DMRC)",
        contractor="Afcons-L&T Joint Venture",
        contract_value=640000000.0,
        location="Line 8 Extension, Janakpuri - RK Ashram",
        start_date=datetime.date(2025, 4, 1),
        target_completion_date=datetime.date(2027, 9, 30),
        status="Active"
    )
    db.add(p2)
    db.flush()

    c2 = Contract(
        project_id=p2.id,
        title="DMRC Conditions of Contract for Civil Works (FIDIC Based)",
        form_type="FIDIC Silver Book Equiv",
        governing_law="Indian Contract Act, 1872",
        default_notice_days=28,
        document_filename="DMRC_CC_Pkg3.pdf"
    )
    db.add(c2)
    db.flush()

    r2 = ContractRule(
        contract_id=c2.id,
        clause_number="44.1",
        clause_title="Extension of Time for High Wind & Monsoon Storm",
        raw_clause_text="High wind exceeding 50 km/h prohibiting viaduct girder launching...",
        human_explanation="Under Clause 44.1, high wind events exceeding 50 km/h that halt launching gantry operations qualify for EoT when exceeding the monthly baseline of 5.0 days + 2.0 days margin (Threshold: 7.0 days).",
        event_type="weather_delay",
        monitoring_period="August 2026",
        historical_baseline_days=5.0,
        contractual_margin_days=2.0,
        threshold_days=7.0,
        comparison_operator=">",
        eligible_days_formula="contract_excess_over_baseline",
        formula_description="Actual Adverse Wind Days (9.5) > Threshold (7.0) -> Eligible Days: 4.5 days.",
        daily_overhead_cost=120000.0,
        daily_equipment_cost=55000.0,
        daily_labor_cost=15000.0,
        is_verified_by_user=True
    )
    db.add(r2)
    db.flush()

    calc_res_2 = run_deterministic_entitlement_calculation(
        baseline_days=5.0,
        margin_days=2.0,
        actual_adverse_days=9.5,
        daily_overhead=120000.0,
        daily_equipment=55000.0,
        daily_labor=15000.0,
        detection_date=datetime.date(2026, 8, 8),
        notice_window_days=28,
        current_date=datetime.date(2026, 9, 2),
        critical_path_affected_days=4.5
    )

    e2 = Entitlement(
        project_id=p2.id,
        rule_id=r2.id,
        event_name="High Velocity Gale & Monsoon Gusts (Girder Launch Halt)",
        status="Needs PM Review",
        historical_baseline_days=calc_res_2.baseline_days,
        contractual_margin_days=calc_res_2.margin_days,
        threshold_days=calc_res_2.threshold_days,
        actual_adverse_days=calc_res_2.actual_adverse_days,
        is_triggered=True,
        eligible_days=4.5,
        daily_rate=calc_res_2.combined_daily_rate,
        estimated_financial_impact=855000.0, # ₹8.55 Lakh
        financial_breakdown_json=[item.model_dump() for item in calc_res_2.financial_breakdown],
        event_start_date=datetime.date(2026, 8, 1),
        event_end_date=datetime.date(2026, 8, 20),
        detection_date=datetime.date(2026, 8, 8),
        notice_window_days=28,
        notice_deadline_date=datetime.date(2026, 9, 5),
        days_remaining=3,
        risk_level="Critical",
        evidence_score=9,
        evidence_total=10,
        confidence_score=0.97,
        notes="Launching gantry LG-02 locked out due to continuous wind gusts > 54km/h."
    )
    db.add(e2)

    # -------------------------------------------------------------
    # 3. Project #031 — Industrial Expansion Facility
    # -------------------------------------------------------------
    p3 = Project(
        code="Project #031",
        name="Industrial Manufacturing Plant Expansion",
        client="Bharat Heavy Tech Industries Ltd",
        contractor="Tata Projects Industrial Division",
        contract_value=320000000.0,
        location="Sanand Industrial Estate, Gujarat",
        start_date=datetime.date(2025, 9, 1),
        target_completion_date=datetime.date(2027, 2, 28),
        status="Active"
    )
    db.add(p3)
    db.flush()

    c3 = Contract(
        project_id=p3.id,
        title="EPC Turnkey Contract — Industrial Works",
        form_type="EPC Standard Form",
        governing_law="Indian Contract Act, 1872",
        default_notice_days=21,
        document_filename="EPC_Sanand_Executed.pdf"
    )
    db.add(c3)
    db.flush()

    r3 = ContractRule(
        contract_id=c3.id,
        clause_number="8.4",
        clause_title="Weather Delay Entitlement",
        raw_clause_text="Unprecedented ground saturation halting heavy equipment...",
        human_explanation="Monsoon rainfall exceeding baseline 6.0 days + 3.0 days margin (Threshold: 9.0 days).",
        event_type="weather_delay",
        monitoring_period="July 2026",
        historical_baseline_days=6.0,
        contractual_margin_days=3.0,
        threshold_days=9.0,
        comparison_operator=">",
        eligible_days_formula="contract_excess_over_baseline",
        formula_description="Actual Adverse Days (11.0) > Threshold (9.0) -> 5.0 Days Claimed.",
        daily_overhead_cost=75000.0,
        daily_equipment_cost=35000.0,
        daily_labor_cost=20000.0,
        is_verified_by_user=True
    )
    db.add(r3)
    db.flush()

    e3 = Entitlement(
        project_id=p3.id,
        rule_id=r3.id,
        event_name="Torrential Inundation & Heavy Plant Saturation",
        status="Claim Generated",
        historical_baseline_days=6.0,
        contractual_margin_days=3.0,
        threshold_days=9.0,
        actual_adverse_days=11.0,
        is_triggered=True,
        eligible_days=5.0,
        daily_rate=130000.0,
        estimated_financial_impact=650000.0,
        event_start_date=datetime.date(2026, 7, 10),
        event_end_date=datetime.date(2026, 7, 28),
        detection_date=datetime.date(2026, 7, 18),
        notice_window_days=21,
        notice_deadline_date=datetime.date(2026, 8, 8),
        days_remaining=0,
        risk_level="Low",
        evidence_score=10,
        evidence_total=10,
        confidence_score=0.99,
        pm_decision="Approved",
        pm_decision_notes="Claim notice served and acknowledged by Employer. Formal particulars under preparation.",
        pm_reviewed_at=datetime.datetime(2026, 8, 2, 16, 45),
        notes="Notice delivered on 03 Aug 2026."
    )
    db.add(e3)

    # -------------------------------------------------------------
    # 4. Project #056 — Residential Tower Phase II
    # -------------------------------------------------------------
    p4 = Project(
        code="Project #056",
        name="Skyline Vista Residential Towers (Phase II)",
        client="Sobha Developers Ltd",
        contractor="Shapoorji Pallonji EPC",
        contract_value=210000000.0,
        location="Whitefield, Bengaluru, Karnataka",
        start_date=datetime.date(2026, 1, 15),
        target_completion_date=datetime.date(2028, 6, 30),
        status="Active"
    )
    db.add(p4)
    db.flush()

    c4 = Contract(
        project_id=p4.id,
        title="Standard Construction Agreement (FIDIC Red Book Equiv)",
        form_type="FIDIC Red Book",
        governing_law="Indian Contract Act, 1872",
        default_notice_days=28,
        document_filename="Sobha_Skyline_Contract.pdf"
    )
    db.add(c4)
    db.flush()

    r4 = ContractRule(
        contract_id=c4.id,
        clause_number="14.2",
        clause_title="Climatic Conditions Delay Relief",
        raw_clause_text="High gust wind halting high-rise crane lifts above 100m...",
        human_explanation="Wind speed > 40 km/h at 30th floor level exceeding baseline 4.0d + 3.0d margin (Threshold: 7.0d).",
        event_type="weather_delay",
        monitoring_period="August 2026",
        historical_baseline_days=4.0,
        contractual_margin_days=3.0,
        threshold_days=7.0,
        comparison_operator=">",
        eligible_days_formula="contract_excess_over_baseline",
        formula_description="Actual Adverse Days (7.0) = Threshold (7.0) -> Marginal trigger under review.",
        daily_overhead_cost=65000.0,
        daily_equipment_cost=40000.0,
        daily_labor_cost=20000.0,
        is_verified_by_user=True
    )
    db.add(r4)
    db.flush()

    e4 = Entitlement(
        project_id=p4.id,
        rule_id=r4.id,
        event_name="Monsoon Squall & Crane Lockout",
        status="Needs PM Review",
        historical_baseline_days=4.0,
        contractual_margin_days=3.0,
        threshold_days=7.0,
        actual_adverse_days=7.0,
        is_triggered=False,
        eligible_days=0.0,
        daily_rate=125000.0,
        estimated_financial_impact=0.0,
        event_start_date=datetime.date(2026, 8, 12),
        event_end_date=datetime.date(2026, 8, 24),
        detection_date=datetime.date(2026, 8, 20),
        notice_window_days=28,
        notice_deadline_date=datetime.date(2026, 9, 17),
        days_remaining=15,
        risk_level="Low",
        evidence_score=6,
        evidence_total=10,
        confidence_score=0.88,
        notes="Actual days (7.0) reached threshold but did not exceed it. No entitlement currently triggered."
    )
    db.add(e4)

    db.commit()
    print("Database seeding completed successfully.")
