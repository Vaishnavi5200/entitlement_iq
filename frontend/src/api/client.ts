const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "http://127.0.0.1:8000/api";

/** Wraps fetch with a timeout so the app fails fast when the backend is unreachable. */
async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}


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
    try {
      const res = await fetchWithTimeout(`${API_BASE}/dashboard/metrics`);
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_DASHBOARD_METRICS } = await import('./mockData');
      return MOCK_DASHBOARD_METRICS;
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_PROJECTS } = await import('./mockData');
      return MOCK_PROJECTS;
    }
  },

  async getProjectDetails(id: number): Promise<{ project: Project; contracts: Contract[]; entitlements: Entitlement[] }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/projects/${id}`);
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_PROJECTS, MOCK_ENTITLEMENTS } = await import('./mockData');
      const project = MOCK_PROJECTS.find(p => p.id === id) ?? MOCK_PROJECTS[0];
      const entitlements = MOCK_ENTITLEMENTS.filter(e => e.project_id === project.id);
      return { project, contracts: [], entitlements };
    }
  },

  async getEntitlement(id: number): Promise<Entitlement> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/entitlements/${id}`);
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_ENTITLEMENTS } = await import('./mockData');
      return MOCK_ENTITLEMENTS.find(e => e.id === id) ?? MOCK_ENTITLEMENTS[0];
    }
  },

  async recalculateEntitlement(id: number, params?: {
    custom_baseline?: number;
    custom_margin?: number;
    custom_actual_days?: number;
    custom_formula_type?: string;
  }): Promise<{ entitlement: Entitlement; calculation_result: any }> {
    try {
      const query = new URLSearchParams();
      if (params?.custom_baseline !== undefined) query.append('custom_baseline', String(params.custom_baseline));
      if (params?.custom_margin !== undefined) query.append('custom_margin', String(params.custom_margin));
      if (params?.custom_actual_days !== undefined) query.append('custom_actual_days', String(params.custom_actual_days));
      if (params?.custom_formula_type !== undefined) query.append('custom_formula_type', params.custom_formula_type);
      const res = await fetchWithTimeout(`${API_BASE}/entitlements/${id}/recalculate?${query.toString()}`, { method: 'POST' });
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_ENTITLEMENTS } = await import('./mockData');
      return { entitlement: MOCK_ENTITLEMENTS.find(e => e.id === id) ?? MOCK_ENTITLEMENTS[0], calculation_result: null };
    }
  },

  async submitPMReview(id: number, data: {
    decision: string;
    eligible_days: number;
    financial_impact: number;
    reviewer_name?: string;
    reviewer_role?: string;
    rationale: string;
  }): Promise<any> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/entitlements/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      return { status: 'ok', decision: data.decision, demo_mode: true };
    }
  },

  async getClaimNotice(id: number): Promise<ClaimNotice> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/entitlements/${id}/claim-notice`);
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_CLAIM_NOTICE } = await import('./mockData');
      return MOCK_CLAIM_NOTICE;
    }
  },

  async parseContractClause(data: {
    project_id: number;
    contract_title: string;
    form_type?: string;
    contract_text: string;
  }): Promise<any> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/contracts/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      return { clause: '8.4(b)', clause_title: 'Extension of Time for Exceptionally Adverse Climatic Conditions', baseline_days: 8.2, margin_days: 4.0, threshold_days: 12.2, notice_window_days: 28, confidence: 0.96, extracted_by: 'Demo Mode (offline)', demo_mode: true };
    }
  },

  async updateContractRule(ruleId: number, data: Partial<ContractRule>): Promise<ContractRule> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/contract-rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      return data as ContractRule;
    }
  },

  async getAuditLogs(projectId?: number): Promise<AuditLog[]> {
    try {
      const url = projectId ? `${API_BASE}/audit-logs?project_id=${projectId}` : `${API_BASE}/audit-logs`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_AUDIT_LOGS } = await import('./mockData');
      return projectId ? MOCK_AUDIT_LOGS.filter(l => l.project_id === projectId) : MOCK_AUDIT_LOGS;
    }
  },

  async getWeatherData(projectId: number): Promise<{
    project_code: string;
    monitoring_period: string;
    baseline_info: any;
    observations: WeatherObservation[];
    total_adverse_days_recorded: number;
  }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/weather/${projectId}`);
      if (!res.ok) throw new Error('not ok');
      return res.json();
    } catch {
      const { MOCK_WEATHER_DATA } = await import('./mockData');
      return { project_code: 'Project #042', monitoring_period: 'August 2026', baseline_info: { source: 'IMD 10-Year Gridded Dataset (Demo Mode)', historical_baseline_adverse_days: 8.2, criteria: 'Daily rainfall > 25.0mm OR sustained wind > 45km/h' }, observations: MOCK_WEATHER_DATA, total_adverse_days_recorded: 14 };
    }
  },
};
