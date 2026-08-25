import React, { useState } from 'react';
import {
  FolderKanban,
  FileCheck2,
  AlertTriangle,
  ClockAlert,
  IndianRupee,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Info,
  Layers,
  CheckCircle2,
  Calendar,
  DollarSign,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { DashboardMetrics } from '../api/client';
import { RiskBadge, StatusBadge } from '../components/ui/Badges';
import { MathTraceModal, MathTopic } from '../components/ui/MathTraceModal';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error?: boolean;
  onSelectClaim: (projectId: number, entitlementId: number) => void;
  onNavigateToUpload: () => void;
  onOpenPitchGuide?: () => void;
  onRetry?: () => void;
  currencyMode?: 'INR' | 'USD';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  loading,
  error,
  onSelectClaim,
  onNavigateToUpload,
  onOpenPitchGuide,
  onRetry,
  currencyMode = 'INR'
}) => {
  const [activeMathTopic, setActiveMathTopic] = useState<MathTopic | null>(null);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[450px]">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold">Loading Construction Claims Intelligence Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const formatCurrency = (valInInr: number) => {
    if (currencyMode === 'USD') {
      const usdVal = valInInr / 85;
      return `$${(usdVal / 1000).toFixed(1)}k`;
    }
    return `₹${(valInInr / 100000).toFixed(1)} Lakh`;
  };

  const steps = [
    { num: '01', title: 'Event', desc: '14 Adverse Rain Days', topic: 'weather_threshold_12_2' as MathTopic },
    { num: '02', title: 'Entitlement', desc: 'Threshold 8.2 + 4.0 = 12.2d', topic: 'weather_threshold_12_2' as MathTopic },
    { num: '03', title: 'Evidence', desc: 'AWS + DPR #218 (8/10)', action: 'project' },
    { num: '04', title: 'Impact', desc: '6d EoT · ₹4.7L Exposure', topic: 'financial_4_7_lakh' as MathTopic },
    { num: '05', title: 'Deadline', desc: '5 Days Remaining', topic: 'deadline_5_days' as MathTopic, urgent: true },
    { num: '06', title: 'PM Approval', desc: 'Human Sign-Off & Notice', action: 'project', cta: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive SaaS Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Portfolio Surveillance
            </span>
            <span className="text-xs text-slate-500 font-mono">August / September 2026 Monitoring Cycle</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Claims Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Continuous contract threshold surveillance across <strong>{metrics.active_projects_count} active EPC packages</strong>. <strong>{formatCurrency(metrics.total_recoverable_value)}</strong> in potential recoverable prolongation exposure identified to safeguard notice compliance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onSelectClaim(1, 1)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-xs flex items-center gap-1.5 hover:scale-[1.01]"
          >
            <span>Review Project #042 Dossier</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Non-Overclaiming Legal Disclaimer Guardrail */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Legal Governance Principle:</strong> EntitlementIQ identifies potential recoverable exposure under contract thresholds (e.g. FIDIC Sub-Clause 8.4/20.1). AI proposes; formal notice determination and approval remain strictly subject to Project Manager review and Engineer sign-off.
          </span>
        </div>
        <button
          onClick={() => setActiveMathTopic('financial_4_7_lakh')}
          className="text-amber-800 hover:underline font-bold font-mono text-[11px] shrink-0 flex items-center gap-1"
        >
          <Calculator className="w-3 h-3" />
          Audit Formula
        </button>
      </div>

      {/* Interactive Core Workflow */}
      <div className="panel-card p-4 bg-white">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Claims Decision Workflow
            </span>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              (Event → Entitlement → Evidence → Impact → Deadline → PM Approval)
            </span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            End-to-End Traceability
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.topic) {
                  setActiveMathTopic(s.topic);
                } else {
                  onSelectClaim(1, 1);
                }
              }}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between group ${
                s.cta
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs font-bold hover:bg-amber-400'
                  : s.urgent
                  ? 'bg-rose-50 border-rose-200 text-rose-950 hover:bg-rose-100'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold ${s.cta ? 'text-slate-950' : 'text-slate-400'}`}>
                  STEP {s.num}
                </span>
                {s.topic ? (
                  <Calculator className={`w-3 h-3 ${s.cta ? 'text-slate-950' : 'text-amber-600'} opacity-80 group-hover:scale-110 transition-transform`} />
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 ${s.cta ? 'text-slate-950' : 'text-slate-400'}`} />
                )}
              </div>
              <div className="mt-1">
                <div className="text-xs font-bold">{s.title}</div>
                <div className={`text-[10px] font-mono ${s.cta ? 'text-slate-900' : 'text-slate-500'} mt-0.5 truncate`}>
                  {s.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Active Packages */}
        <div className="panel-card p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Packages</span>
            <FolderKanban className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-slate-900">
            {metrics.active_projects_count}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Contracts under surveillance
          </div>
        </div>

        {/* Potential Entitlements Detected */}
        <button
          onClick={() => setActiveMathTopic('weather_threshold_12_2')}
          className="panel-card p-4 border-amber-200 bg-amber-50/20 text-left hover:border-amber-400 transition-all group"
        >
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
            <span>Potential Entitlements</span>
            <Calculator className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-amber-900">
            {metrics.potential_entitlements_count} Identified
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium flex items-center justify-between">
            <span>Weather thresholds exceeded</span>
            <span className="text-[10px] font-mono underline font-bold">Why? →</span>
          </div>
        </button>

        {/* Claims At Risk */}
        <div className="panel-card p-4 border-rose-200 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold uppercase tracking-wider">
            <span>Notice Urgency</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-rose-900">
            {metrics.claims_at_risk_count} Urgent
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">
            Notice window closing soon
          </div>
        </div>

        {/* Deadlines Within 7 Days */}
        <button
          onClick={() => setActiveMathTopic('deadline_5_days')}
          className="panel-card p-4 border-orange-200 bg-orange-50/20 text-left hover:border-orange-400 transition-all group"
        >
          <div className="flex items-center justify-between text-orange-800 text-xs font-bold uppercase tracking-wider">
            <span>Deadlines &lt; 7 Days</span>
            <ClockAlert className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-orange-900">
            {metrics.deadlines_within_7_days_count}
          </div>
          <div className="mt-1 text-[11px] text-orange-700 font-medium flex items-center justify-between">
            <span>Statutory 28d clock</span>
            <span className="text-[10px] font-mono underline font-bold">Trace →</span>
          </div>
        </button>

        {/* Potential Recoverable Exposure Identified */}
        <button
          onClick={() => setActiveMathTopic('portfolio_19_7_lakh')}
          className="panel-card p-4 col-span-2 md:col-span-1 border-slate-800 bg-[#0B1120] text-white text-left hover:border-amber-400 transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-300 text-xs font-bold uppercase tracking-wider">
            <span>Potential Exposure</span>
            <Calculator className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-amber-400">
            {formatCurrency(metrics.total_recoverable_value)}
          </div>
          <div className="mt-1 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Across 3 active packages</span>
            <span className="text-[10px] text-amber-400 font-mono underline">Audit →</span>
          </div>
        </button>
      </div>

      {/* Main Grid: Priority Claims (Left) + Entitlement Rule & Deadlines (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Claims Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="panel-card overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Contract Entitlements & Notice Deadlines
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by statutory notice deadline under standard FIDIC Sub-Clause 20.1 provisions.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-semibold">
                {metrics.priority_claims.length} Active Tracks
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Package</th>
                    <th className="table-header">Event / Clause</th>
                    <th className="table-header text-right">Eligible EoT</th>
                    <th className="table-header text-right">Potential Impact</th>
                    <th className="table-header text-center">Evidence</th>
                    <th className="table-header">Notice Clock</th>
                    <th className="table-header">Risk</th>
                    <th className="table-header">Status</th>
                    <th className="table-header text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.priority_claims.map((claim) => {
                    const isTarget = claim.project_code === 'Project #042';
                    return (
                      <tr
                        key={claim.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isTarget ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        <td className="table-cell font-semibold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                              {claim.project_code}
                            </span>
                            <span className="truncate max-w-[130px] text-xs font-bold" title={claim.project_name}>
                              {claim.project_name}
                            </span>
                          </div>
                        </td>

                        <td className="table-cell">
                          <div className="text-xs font-semibold text-slate-800 truncate max-w-[140px]" title={claim.event_name}>
                            {claim.event_name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Clause {claim.clause_number}
                          </div>
                        </td>

                        <td className="table-cell text-right font-mono font-bold text-slate-900 text-xs">
                          {claim.eligible_days > 0 ? (
                            <button
                              onClick={() => setActiveMathTopic('delay_6_days')}
                              className="hover:text-amber-700 hover:underline flex items-center justify-end gap-1 ml-auto"
                              title="Click to view eligible day derivation"
                            >
                              <span>{claim.eligible_days}d</span>
                              <Calculator className="w-2.5 h-2.5 text-slate-400" />
                            </button>
                          ) : (
                            '0d'
                          )}
                        </td>

                        <td className="table-cell text-right font-mono font-bold text-slate-900 text-xs">
                          {claim.estimated_impact > 0 ? (
                            <button
                              onClick={() => setActiveMathTopic(isTarget ? 'financial_4_7_lakh' : 'portfolio_19_7_lakh')}
                              className="hover:text-amber-700 hover:underline flex items-center justify-end gap-1 ml-auto"
                              title="Click to view cost calculation breakdown"
                            >
                              <span>{formatCurrency(claim.estimated_impact)}</span>
                              <Calculator className="w-2.5 h-2.5 text-amber-500" />
                            </button>
                          ) : (
                            <span className="text-slate-400">₹0</span>
                          )}
                        </td>

                        <td className="table-cell text-center font-mono text-xs">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 border border-slate-200 font-bold">
                            {claim.evidence_score}
                          </span>
                        </td>

                        <td className="table-cell font-mono text-xs">
                          {claim.days_remaining > 0 ? (
                            <button
                              onClick={() => setActiveMathTopic('deadline_5_days')}
                              className={`hover:underline flex items-center gap-1 ${
                                claim.days_remaining <= 5 ? 'text-rose-700 font-extrabold' : 'text-slate-700 font-semibold'
                              }`}
                            >
                              <span>{claim.days_remaining}d left</span>
                              <ClockAlert className="w-3 h-3 text-rose-500" />
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-bold">Served</span>
                          )}
                        </td>

                        <td className="table-cell">
                          <RiskBadge level={claim.risk_level} />
                        </td>

                        <td className="table-cell">
                          <StatusBadge status={claim.status} />
                        </td>

                        <td className="table-cell text-center">
                          <button
                            onClick={() => onSelectClaim(claim.project_id, claim.id)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              isTarget
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xs'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {claim.status === 'Needs PM Review' ? 'Review Claim' : 'View Dossier'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Methodology Callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Calculator className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <strong className="text-slate-900">Deterministic Mathematical Auditability:</strong>
              <p className="leading-relaxed">
                Click on any financial figure, day count, or deadline in the table above to view the step-by-step arithmetic derivation. Calculations are derived deterministically from contractual clauses, baseline weather records, and critical path schedules.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Entitlement Rule & Deadlines (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Contract Entitlement Rule */}
          <div className="panel-card p-5 border-amber-200 bg-amber-50/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Active Threshold Rule (Clause 8.4b)
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                #042
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-amber-200 text-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-800">
                Weather Delay Entitlement Calculation:
              </div>
              <div className="font-mono text-xs space-y-1 text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="flex justify-between">
                  <span>10-Yr Historical Baseline:</span>
                  <strong className="text-slate-900">8.2 days</strong>
                </div>
                <div className="flex justify-between">
                  <span>+ Contract Margin (8.4b):</span>
                  <strong className="text-slate-900">+ 4.0 days</strong>
                </div>
                <div className="flex justify-between text-amber-900 font-bold border-t border-slate-200 pt-1">
                  <span>= Entitlement Threshold:</span>
                  <span>12.2 days</span>
                </div>
                <div className="flex justify-between text-slate-950 font-extrabold bg-slate-200/80 px-1.5 py-0.5 rounded">
                  <span>Actual August Rain Days:</span>
                  <span>14.0 days</span>
                </div>
              </div>

              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-900 font-bold flex items-center justify-between">
                <span>14.0 &gt; 12.2d → Triggered</span>
                <span>6.0d EoT (₹4.7L)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMathTopic('financial_4_7_lakh')}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                Audit ₹4.7L Proof
              </button>
              <button
                onClick={() => onSelectClaim(1, 1)}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                Open Workspace <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Section B: Notice Deadline Tracker */}
          <div className="panel-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ClockAlert className="w-4 h-4 text-amber-600" />
                Contract Notice Deadlines
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">28-Day Clock</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200">
                <div className="text-xs font-bold text-rose-900">
                  Critical (&le; 3 Days)
                </div>
                <div className="text-xs font-mono font-bold text-rose-800">
                  {metrics.deadline_risk_breakdown['Critical']} Track(s)
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-xs font-bold text-amber-900">
                  High (&le; 5 Days) — Project #042
                </div>
                <div className="text-xs font-mono font-bold text-amber-800">
                  {metrics.deadline_risk_breakdown['High']} Track(s)
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 border border-slate-200">
                <div className="text-xs font-semibold text-slate-700">
                  Low / Served (&gt; 10 Days)
                </div>
                <div className="text-xs font-mono font-bold text-slate-700">
                  {metrics.deadline_risk_breakdown['Low']} Track(s)
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToUpload}
              className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Parse Contract Clause
            </button>
          </div>
        </div>
      </div>

      {/* Math Proof & Traceability Modal */}
      {activeMathTopic && (
        <MathTraceModal
          isOpen={!!activeMathTopic}
          onClose={() => setActiveMathTopic(null)}
          topic={activeMathTopic}
        />
      )}
    </div>
  );
};
