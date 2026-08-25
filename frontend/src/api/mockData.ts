/**
 * mockData.ts — Static demo data mirroring the backend seed exactly.
 * Used as an automatic fallback when the backend API is unreachable.
 */
import type {
  DashboardMetrics,
  Project,
  Entitlement,
  AuditLog,
  WeatherObservation,
  ClaimNotice,
} from './client';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    code: 'Project #042',
    name: 'Riverside Commercial Complex',
    client: 'Apex Urban Infrastructure Ltd.',
    contractor: 'BuildCore Engineering JV',
    contract_value: 185000000,
    location: 'Sector 62, Noida, NCR',
    start_date: '2025-11-01',
    target_completion_date: '2027-04-30',
    status: 'Active',
    created_at: '2025-11-01T00:00:00',
  },
  {
    id: 2,
    code: 'Project #017',
    name: 'Metro Elevated Corridor Package 3',
    client: 'Delhi Metro Rail Corporation (DMRC)',
    contractor: 'Afcons-L&T Joint Venture',
    contract_value: 640000000,
    location: 'Line 8 Extension, Janakpuri - RK Ashram',
    start_date: '2025-04-01',
    target_completion_date: '2027-09-30',
    status: 'Active',
    created_at: '2025-04-01T00:00:00',
  },
  {
    id: 3,
    code: 'Project #031',
    name: 'Industrial Manufacturing Plant Expansion',
    client: 'Bharat Heavy Tech Industries Ltd',
    contractor: 'Tata Projects Industrial Division',
    contract_value: 320000000,
    location: 'Sanand Industrial Estate, Gujarat',
    start_date: '2025-09-01',
    target_completion_date: '2027-02-28',
    status: 'Active',
    created_at: '2025-09-01T00:00:00',
  },
  {
    id: 4,
    code: 'Project #056',
    name: 'Skyline Vista Residential Towers (Phase II)',
    client: 'Sobha Developers Ltd',
    contractor: 'Shapoorji Pallonji EPC',
    contract_value: 210000000,
    location: 'Whitefield, Bengaluru, Karnataka',
    start_date: '2026-01-15',
    target_completion_date: '2028-06-30',
    status: 'Active',
    created_at: '2026-01-15T00:00:00',
  },
];

export const MOCK_ENTITLEMENTS: Entitlement[] = [
  {
    id: 1,
    project_id: 1,
    rule_id: 1,
    event_name: 'Exceptionally Adverse Monsoon Precipitation & Inundation',
    status: 'Needs PM Review',
    historical_baseline_days: 8.2,
    contractual_margin_days: 4.0,
    threshold_days: 12.2,
    actual_adverse_days: 14.0,
    is_triggered: true,
    eligible_days: 6.0,
    daily_rate: 78333.33,
    estimated_financial_impact: 470000.0,
    financial_breakdown_json: [
      { category: 'Site General Conditions', description: 'Site office, supervisory staff, utilities, site security & insurance', daily_rate: 50000, days: 6, total: 300000 },
      { category: 'Plant & Equipment Standby', description: 'Idle tower crane, hydraulic excavator & batching plant standby charges', daily_rate: 20000, days: 6, total: 120000 },
      { category: 'Labor & Dewatering Impact', description: 'Site dewatering crew, storm drain pump fuel, idle gang standby', daily_rate: 8333.33, days: 6, total: 49999.98 },
    ],
    event_start_date: '2026-08-02',
    event_end_date: '2026-08-27',
    detection_date: '2026-08-10',
    notice_window_days: 28,
    notice_deadline_date: '2026-09-07',
    days_remaining: 5,
    risk_level: 'High',
    evidence_score: 8,
    evidence_total: 10,
    confidence_score: 0.94,
    notes: 'Automated trigger: 14 adverse rain days recorded vs 12.2-day threshold. Critical path substructure concreting disrupted.',
    project: undefined,
    evidence_items: [
      { id: 1, entitlement_id: 1, type: 'Weather Record', title: 'IMD Gridded Rainfall & Station Anemometer Log', date: '2026-08-14', source: 'IMD API & Site AWS', relevance: 'Certified 44.0mm downpour and wind speeds exceeding tower crane safe operation limits.', verification_status: 'Verified', weight: 2, is_missing: false },
      { id: 2, entitlement_id: 1, type: 'Site Report', title: 'Daily Site Progress Report (DPR) #218 — Flooding Sign-Off', date: '2026-08-15', source: 'Resident Engineer & Contractor Site Agent', relevance: 'Countersigned site shutdown due to 67mm cloudburst; raft reinforcement completely flooded.', verification_status: 'Verified', weight: 2, is_missing: false },
      { id: 3, entitlement_id: 1, type: 'Project Schedule', title: 'Primavera P6 Critical Path Delay Impact Analysis (TIA)', date: '2026-08-15', source: 'Lead Planning & Controls Engineer', relevance: 'Demonstrates 6-day direct delay to Critical Path Activity CP-1042.', verification_status: 'Verified', weight: 2, is_missing: false },
      { id: 4, entitlement_id: 1, type: 'Site Photos', title: 'Geotagged Inundation & Dewatering Photo Record', date: '2026-08-16', source: 'HSE Officer / Drone Survey', relevance: '18 high-resolution geotagged photos confirming 1.2m standing water in basement excavation.', verification_status: 'Verified', weight: 2, is_missing: false },
      { id: 5, entitlement_id: 1, type: 'Material Test Log', title: 'Third-Party Ready-Mix Slump & Moisture Rejection Slips', date: '2026-08-18', source: 'QC / Batching Plant Lab', relevance: 'Moisture content deviation certificates for rejected concrete batches.', verification_status: 'Missing', weight: 2, is_missing: true },
    ],
  },
  {
    id: 2,
    project_id: 2,
    rule_id: 2,
    event_name: 'High Velocity Gale & Monsoon Gusts (Girder Launch Halt)',
    status: 'Needs PM Review',
    historical_baseline_days: 5.0,
    contractual_margin_days: 2.0,
    threshold_days: 7.0,
    actual_adverse_days: 9.5,
    is_triggered: true,
    eligible_days: 4.5,
    daily_rate: 190000.0,
    estimated_financial_impact: 855000.0,
    financial_breakdown_json: [],
    event_start_date: '2026-08-01',
    event_end_date: '2026-08-20',
    detection_date: '2026-08-08',
    notice_window_days: 28,
    notice_deadline_date: '2026-09-05',
    days_remaining: 3,
    risk_level: 'Critical',
    evidence_score: 9,
    evidence_total: 10,
    confidence_score: 0.97,
    notes: 'Launching gantry LG-02 locked out due to continuous wind gusts > 54km/h.',
    project: undefined,
    evidence_items: [],
  },
  {
    id: 3,
    project_id: 3,
    rule_id: 3,
    event_name: 'Torrential Inundation & Heavy Plant Saturation',
    status: 'Claim Generated',
    historical_baseline_days: 6.0,
    contractual_margin_days: 3.0,
    threshold_days: 9.0,
    actual_adverse_days: 11.0,
    is_triggered: true,
    eligible_days: 5.0,
    daily_rate: 130000.0,
    estimated_financial_impact: 650000.0,
    financial_breakdown_json: [],
    event_start_date: '2026-07-10',
    event_end_date: '2026-07-28',
    detection_date: '2026-07-18',
    notice_window_days: 21,
    notice_deadline_date: '2026-08-08',
    days_remaining: 0,
    risk_level: 'Low',
    evidence_score: 10,
    evidence_total: 10,
    confidence_score: 0.99,
    pm_decision: 'Approved',
    pm_decision_notes: 'Claim notice served and acknowledged by Employer. Formal particulars under preparation.',
    pm_reviewed_at: '2026-08-02T16:45:00',
    notes: 'Notice delivered on 03 Aug 2026.',
    project: undefined,
    evidence_items: [],
  },
  {
    id: 4,
    project_id: 4,
    rule_id: 4,
    event_name: 'Monsoon Squall & Crane Lockout',
    status: 'Needs PM Review',
    historical_baseline_days: 4.0,
    contractual_margin_days: 3.0,
    threshold_days: 7.0,
    actual_adverse_days: 7.0,
    is_triggered: false,
    eligible_days: 0.0,
    daily_rate: 125000.0,
    estimated_financial_impact: 0.0,
    financial_breakdown_json: [],
    event_start_date: '2026-08-12',
    event_end_date: '2026-08-24',
    detection_date: '2026-08-20',
    notice_window_days: 28,
    notice_deadline_date: '2026-09-17',
    days_remaining: 15,
    risk_level: 'Low',
    evidence_score: 6,
    evidence_total: 10,
    confidence_score: 0.88,
    notes: 'Actual days (7.0) reached threshold but did not exceed it. No entitlement currently triggered.',
    project: undefined,
    evidence_items: [],
  },
];

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  active_projects_count: 4,
  potential_entitlements_count: 3,
  claims_at_risk_count: 2,
  deadlines_within_7_days_count: 2,
  total_recoverable_value: 1975000.0,
  priority_claims: [
    { id: 2, project_id: 2, project_code: 'Project #017', project_name: 'Metro Elevated Corridor Package 3', event_name: 'High Velocity Gale & Monsoon Gusts (Girder Launch Halt)', clause_number: '44.1', eligible_days: 4.5, estimated_impact: 855000.0, evidence_score: '9/10', days_remaining: 3, risk_level: 'Critical', status: 'Needs PM Review' },
    { id: 1, project_id: 1, project_code: 'Project #042', project_name: 'Riverside Commercial Complex', event_name: 'Exceptionally Adverse Monsoon Precipitation & Inundation', clause_number: '8.4(b)', eligible_days: 6.0, estimated_impact: 470000.0, evidence_score: '8/10', days_remaining: 5, risk_level: 'High', status: 'Needs PM Review' },
    { id: 3, project_id: 3, project_code: 'Project #031', project_name: 'Industrial Manufacturing Plant Expansion', event_name: 'Torrential Inundation & Heavy Plant Saturation', clause_number: '8.4', eligible_days: 5.0, estimated_impact: 650000.0, evidence_score: '10/10', days_remaining: 0, risk_level: 'Low', status: 'Claim Generated' },
  ],
  deadline_risk_breakdown: { Critical: 1, High: 1, Medium: 0, Low: 2 },
  portfolio_status_funnel: { 'Needs PM Review': 3, Approved: 0, 'Claim Generated': 1, Rejected: 0 },
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 1, project_id: 1, entitlement_id: 1, action: 'CONTRACT_UPLOADED', actor: 'Rajesh Sharma (PM)', details: 'Uploaded GCC_Riverside_Complex_Executed_Final.pdf for Clause onboarding.', timestamp: '2026-08-01T10:30:00' },
  { id: 2, project_id: 1, entitlement_id: 1, action: 'RULE_EXTRACTED', actor: 'Claude Contract Agent', details: 'Extracted Clause 8.4(b): Baseline 8.2d + Margin 4.0d = Threshold 12.2d. Notice Window: 28 days.', timestamp: '2026-08-01T10:32:00' },
  { id: 3, project_id: 1, entitlement_id: 1, action: 'RULE_CONFIRMED', actor: 'Rajesh Sharma (PM)', details: 'Confirmed and verified structured calculation parameters for August monitoring period.', timestamp: '2026-08-01T11:15:00' },
  { id: 4, project_id: 1, entitlement_id: 1, action: 'WEATHER_EVENT_DETECTED', actor: 'Weather Monitoring Engine', details: 'Detection Date: 10 Aug 2026. Cumulative adverse days reached 14.0 days, exceeding 12.2 threshold.', timestamp: '2026-08-10T18:00:00' },
  { id: 5, project_id: 1, entitlement_id: 1, action: 'ENTITLEMENT_CALCULATED', actor: 'Deterministic Calculation Engine', details: 'Calculated 6.0 eligible delay days, Rs.4,70,000 financial impact. Notice deadline set to 07 Sep 2026 (5 days remaining).', timestamp: '2026-08-10T18:05:00' },
  { id: 6, project_id: 1, entitlement_id: 1, action: 'EVIDENCE_ATTACHED', actor: 'Site QA/QC & Planning Engine', details: 'Attached 4 verified records (AWS logs, DPR #218, P6 TIA, Drone Photos). Evidence Completeness: 8/10.', timestamp: '2026-08-17T14:20:00' },
];

const ADVERSE_DAYS: Record<number, { rain: number; wind: number; reason: string; impact: string }> = {
  2:  { rain: 42.5, wind: 38, reason: 'Torrential monsoon downpour (42.5mm); excavation flooded', impact: 'Substructure foundation works stopped' },
  3:  { rain: 58.0, wind: 48, reason: 'Severe rainfall (58mm) & high gusts; safety halt', impact: 'Tower crane shut down, site dewatering active' },
  4:  { rain: 34.0, wind: 30, reason: 'Continuous rain (34mm); waterlogged haul roads', impact: 'Ready-mix concrete trucks unable to access' },
  8:  { rain: 62.5, wind: 52, reason: 'Cloudburst event (62.5mm); severe site inundation', impact: 'Basement raft reinforcement submerged' },
  9:  { rain: 45.0, wind: 40, reason: 'Heavy precipitation (45mm); electrical safety trip', impact: 'Site power cut for safety protocols' },
  10: { rain: 38.5, wind: 32, reason: 'Adverse rainfall (38.5mm); mud accumulation', impact: 'Critical path podium slab casting cancelled (Detection Date)' },
  13: { rain: 51.0, wind: 45, reason: 'Monsoon surge (51mm); tower crane wind trip', impact: 'Structural steel erection suspended' },
  14: { rain: 44.0, wind: 36, reason: 'Persistent rain (44mm); slip hazard', impact: 'All external work prohibited by HSE' },
  15: { rain: 67.0, wind: 55, reason: 'Extreme gale & downpour (67mm); squall line', impact: 'Full site evacuation to muster points' },
  16: { rain: 31.0, wind: 28, reason: 'Post-storm saturation (31mm); standing water', impact: 'Dewatering pumps running at capacity' },
  21: { rain: 49.0, wind: 50, reason: 'High windstorm & rainfall (49mm)', impact: 'Tower crane operational limit exceeded' },
  22: { rain: 36.5, wind: 34, reason: 'Heavy rainfall (36.5mm); access disruption', impact: 'Precast delivery delayed at security gate' },
  26: { rain: 41.0, wind: 42, reason: 'Severe convective storm (41mm)', impact: 'Facade panel installation halted' },
  27: { rain: 35.0, wind: 30, reason: 'Unseasonal downpour (35mm); basement leakage', impact: 'Waterproofing team unable to proceed' },
};

export const MOCK_WEATHER_DATA: WeatherObservation[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const info = ADVERSE_DAYS[day];
  return {
    id: day,
    project_id: 1,
    obs_date: `2026-08-${String(day).padStart(2, '0')}`,
    rainfall_mm: info ? info.rain : parseFloat(((day * 3.7) % 12.0).toFixed(1)),
    wind_kmh: info ? info.wind : parseFloat((15.0 + (day % 10)).toFixed(1)),
    max_temp_c: info ? 29.5 : 33.0,
    is_adverse: !!info,
    adverse_trigger_reason: info ? info.reason : undefined,
    site_impact_logged: info ? info.impact : 'Normal operations proceeding as scheduled',
  };
});

export const MOCK_CLAIM_NOTICE: ClaimNotice = {
  claim_reference: 'EIQ-CLM-2026-042-01',
  issue_date: '2026-09-02',
  recipient_org: 'Apex Urban Infrastructure Ltd.',
  sender_org: 'BuildCore Engineering JV',
  subject: "FORMAL NOTICE OF CONTRACTOR'S CLAIM UNDER SUB-CLAUSE 8.4(b) & SUB-CLAUSE 20.1",
  formal_notice_text: `Ref: EIQ-CLM-2026-042-01
Date: 02 September 2026

TO: The Engineer / Project Representative
Apex Urban Infrastructure Ltd.
Project: Project #042 - Riverside Commercial Complex

FROM: Contractor's Representative
BuildCore Engineering JV

Dear Sir/Madam,

Pursuant to Sub-Clause 20.1 and Sub-Clause 8.4(b), we hereby submit our formal Notice of Claim for Extension of Time and prolongation costs for August 2026.

- Historical Baseline: 8.2 days | Margin: 4.0 days | Threshold: 12.2 days
- Actual Adverse Days Recorded: 14.0 days
- Eligible EoT: 6.0 Calendar Days
- Estimated Prolongation Cost: Rs. 4,70,000.00

This notice is issued within the mandatory 28-day window, preserving all contractual rights.

Yours faithfully,
Rajesh Sharma
Contract Administrator & Sr. Project Manager
BuildCore Engineering JV`,
  eligible_days: 6.0,
  financial_amount: 470000.0,
};
