const API_BASE = "http://127.0.0.1:8000/api";

export interface Project {
  id: number;
  code: string;
  name: string;
  client: string;
  contractor: string;
  contract_value: number;
  location: string;
  start_date: string;
  target_completion_date: string;
  status: string;
  created_at: string;
}

export interface ContractRule {
  id: number;
  contract_id: number;
  clause_number: string;
  clause_title: string;
  raw_clause_text: string;
  human_explanation: string;
  event_type: string;
  monitoring_period: string;
  historical_baseline_days: number;
  contractual_margin_days: number;
  threshold_days: number;
  comparison_operator: string;
  eligible_days_formula: string;
  formula_description?: string;
  daily_overhead_cost: number;
  daily_equipment_cost: number;
  daily_labor_cost: number;
  is_verified_by_user: boolean;
}

export interface Contract {
  id: number;
  project_id: number;
  title: string;
  form_type: string;
  governing_law: string;
  default_notice_days: number;
  rules: ContractRule[];
}

export interface EvidenceItem {
  id: number;
  entitlement_id: number;
  type: string;
  title: string;
  date: string;
  source: string;
  relevance: string;
  verification_status: 'Verified' | 'Pending' | 'Missing';
  weight: number;
  is_missing: boolean;
  file_attachment?: string;
}

export interface FinancialLineItem {
  category: string;
  description: string;
  daily_rate: number;
  days: number;
  total: number;
}

export interface CalculationTrace {
  step_name: string;
  formula: string;
  inputs: Record<string, any>;
  output: any;
  explanation: string;
}

export interface Entitlement {
  id: number;
  project_id: number;
  rule_id: number;
  event_name: string;
  status: 'Needs PM Review' | 'Approved' | 'Edited' | 'Rejected' | 'Claim Generated';
  historical_baseline_days: number;
  contractual_margin_days: number;
  threshold_days: number;
  actual_adverse_days: number;
  is_triggered: boolean;
  eligible_days: number;
  daily_rate: number;
  estimated_financial_impact: number;
  financial_breakdown_json?: FinancialLineItem[];
  event_start_date: string;
  event_end_date: string;
  detection_date: string;
  notice_window_days: number;
  notice_deadline_date: string;
  days_remaining: number;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low';
  evidence_score: number;
  evidence_total: number;
  confidence_score: number;
  notes?: string;
  pm_decision?: string;
  pm_decision_notes?: string;
  pm_reviewed_at?: string;
  project?: Project;
  rule?: ContractRule;
  evidence_items: EvidenceItem[];
}

export interface DashboardMetrics {
  active_projects_count: number;
  potential_entitlements_count: number;
  claims_at_risk_count: number;
  deadlines_within_7_days_count: number;
  total_recoverable_value: number;
  priority_claims: Array<{
    id: number;
    project_id: number;
    project_code: string;
    project_name: string;
    event_name: string;
    clause_number: string;
    eligible_days: number;
    estimated_impact: number;
    evidence_score: string;
    days_remaining: number;
    risk_level: string;
    status: string;
  }>;
  deadline_risk_breakdown: Record<string, number>;
  portfolio_status_funnel: Record<string, number>;
}

export interface WeatherObservation {
  id: number;
  project_id: number;
  obs_date: string;
  rainfall_mm: number;
  wind_kmh: number;
  max_temp_c: number;
  is_adverse: boolean;
  adverse_trigger_reason?: string;
  site_impact_logged?: string;
}

export interface AuditLog {
  id: number;
  project_id?: number;
  entitlement_id?: number;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

export interface ClaimNotice {
  id?: number;
  entitlement_id?: number;
  claim_reference?: string;
  notice_reference?: string;
  issue_date: string;
  recipient_name?: string;
  recipient_org: string;
  sender_name?: string;
  sender_org: string;
  subject: string;
  formal_notice_text: string;
  eligible_days?: number;
  eligible_days_claimed?: number;
  financial_amount?: number;
  financial_claim_amount?: number;
}

export const api = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const res = await fetch(`${API_BASE}/dashboard/metrics`);
    if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
    return res.json();
  },

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  },

  async getProjectDetails(id: number): Promise<{ project: Project; contracts: Contract[]; entitlements: Entitlement[] }> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error("Failed to fetch project details");
    return res.json();
  },

  async getEntitlement(id: number): Promise<Entitlement> {
    const res = await fetch(`${API_BASE}/entitlements/${id}`);
    if (!res.ok) throw new Error("Failed to fetch entitlement");
    return res.json();
  },

  async recalculateEntitlement(id: number, params?: {
    custom_baseline?: number;
    custom_margin?: number;
    custom_actual_days?: number;
    custom_formula_type?: string;
  }): Promise<{ entitlement: Entitlement; calculation_result: any }> {
    const query = new URLSearchParams();
    if (params?.custom_baseline !== undefined) query.append('custom_baseline', String(params.custom_baseline));
    if (params?.custom_margin !== undefined) query.append('custom_margin', String(params.custom_margin));
    if (params?.custom_actual_days !== undefined) query.append('custom_actual_days', String(params.custom_actual_days));
    if (params?.custom_formula_type !== undefined) query.append('custom_formula_type', params.custom_formula_type);

    const res = await fetch(`${API_BASE}/entitlements/${id}/recalculate?${query.toString()}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to recalculate entitlement");
    return res.json();
  },

  async submitPMReview(id: number, data: {
    decision: string;
    eligible_days: number;
    financial_impact: number;
    reviewer_name?: string;
    reviewer_role?: string;
    rationale: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/entitlements/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to submit PM review");
    return res.json();
  },

  async getClaimNotice(id: number): Promise<ClaimNotice> {
    const res = await fetch(`${API_BASE}/entitlements/${id}/claim-notice`);
    if (!res.ok) throw new Error("Failed to fetch claim notice");
    return res.json();
  },

  async parseContractClause(data: {
    project_id: number;
    contract_title: string;
    form_type?: string;
    contract_text: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/contracts/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to parse contract clause");
    return res.json();
  },

  async updateContractRule(ruleId: number, data: Partial<ContractRule>): Promise<ContractRule> {
    const res = await fetch(`${API_BASE}/contract-rules/${ruleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update rule");
    return res.json();
  },

  async getAuditLogs(projectId?: number): Promise<AuditLog[]> {
    const url = projectId ? `${API_BASE}/audit-logs?project_id=${projectId}` : `${API_BASE}/audit-logs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch audit logs");
    return res.json();
  },

  async getWeatherData(projectId: number): Promise<{
    project_code: string;
    monitoring_period: string;
    baseline_info: any;
    observations: WeatherObservation[];
    total_adverse_days_recorded: number;
  }> {
    const res = await fetch(`${API_BASE}/weather/${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    return res.json();
  }
};
