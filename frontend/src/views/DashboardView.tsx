import React from 'react';
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
  Info
} from 'lucide-react';
import { DashboardMetrics } from '../api/client';
import { RiskBadge, StatusBadge } from '../components/ui/Badges';

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
  onSelectClaim: (projectId: number, entitlementId: number) => void;
  onNavigateToUpload: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  loading,
  onSelectClaim,
  onNavigateToUpload
}) => {
  if (loading || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-slate-500 text-sm">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Construction Claims Intelligence Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg p-5 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 rounded">
              Construction Claims Sentinel
            </span>
            <span className="text-xs text-slate-400 font-mono">August/September 2026 Monitoring Cycle</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Where are we leaving contractual money on the table?
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time weather threshold audits across active contracts. <strong>₹{(metrics.total_recoverable_value / 100000).toFixed(1)} Lakh</strong> in potential recoverable time & prolongation value identified.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectClaim(1, 1)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition-colors shadow-xs flex items-center gap-1.5"
          >
            Review Project #042 Delay
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 5 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Active Projects */}
        <div className="panel-card p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Active Projects</span>
            <FolderKanban className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {metrics.active_projects_count}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            100% contracts monitored
          </div>
        </div>

        {/* Potential Entitlements */}
        <div className="panel-card p-4 border-amber-200/80 bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <span>Potential Entitlements</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-900">
            {metrics.potential_entitlements_count}
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">
            Weather thresholds passed
          </div>
        </div>

        {/* Claims At Risk */}
        <div className="panel-card p-4 border-rose-200/80 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold uppercase tracking-wider">
            <span>Claims At Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-900">
            {metrics.claims_at_risk_count}
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">
            High / Critical risk status
          </div>
        </div>

        {/* Deadlines Within 7 Days */}
        <div className="panel-card p-4 border-orange-200/80 bg-orange-50/20">
          <div className="flex items-center justify-between text-orange-700 text-xs font-semibold uppercase tracking-wider">
            <span>Deadlines &lt; 7 Days</span>
            <ClockAlert className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-orange-900">
            {metrics.deadlines_within_7_days_count}
          </div>
          <div className="mt-1 text-[11px] text-orange-700 font-medium">
            Notice window closing
          </div>
        </div>

        {/* Estimated Recoverable Value */}
        <div className="panel-card p-4 col-span-2 md:col-span-1 border-slate-300 bg-slate-900 text-white">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span>Recoverable Value</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            ₹{(metrics.total_recoverable_value / 100000).toFixed(1)} Lakh
          </div>
          <div className="mt-1 text-[11px] text-slate-300">
            Across 3 eligible packages
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Claims (Left) + Portfolio & Deadline Sentinel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Priority Claims Table (Span 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="panel-card overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  A. Priority Entitlements & Claims
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Contractually triggered delay events sorted by notice deadline urgency.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                {metrics.priority_claims.length} Packages Monitored
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header">Project</th>
                    <th className="table-header">Event / Clause</th>
                    <th className="table-header text-right">Eligible Days</th>
                    <th className="table-header text-right">Est. Impact</th>
                    <th className="table-header text-center">Evidence</th>
                    <th className="table-header">Deadline</th>
                    <th className="table-header">Risk</th>
                    <th className="table-header">Status</th>
                    <th className="table-header text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.priority_claims.map((claim) => (
                    <tr
                      key={claim.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        claim.project_code === 'Project #042' ? 'bg-amber-50/30 font-medium' : ''
                      }`}
                    >
                      <td className="table-cell font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {claim.project_code}
                          </span>
                          <span className="truncate max-w-[140px] text-xs" title={claim.project_name}>
                            {claim.project_name}
                          </span>
                        </div>
                      </td>

                      <td className="table-cell">
                        <div className="text-xs font-medium text-slate-800 truncate max-w-[150px]" title={claim.event_name}>
                          {claim.event_name}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Clause {claim.clause_number}
                        </div>
                      </td>

                      <td className="table-cell text-right font-mono font-bold text-slate-900 text-xs">
                        {claim.eligible_days > 0 ? `${claim.eligible_days} days` : '0 days'}
                      </td>

                      <td className="table-cell text-right font-mono font-bold text-slate-900 text-xs">
                        {claim.estimated_impact > 0 ? (
                          `₹${(claim.estimated_impact / 100000).toFixed(1)}L`
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                      </td>

                      <td className="table-cell text-center font-mono text-xs">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 border border-slate-200">
                          {claim.evidence_score}
                        </span>
                      </td>

                      <td className="table-cell font-mono text-xs">
                        {claim.days_remaining > 0 ? (
                          <span className={claim.days_remaining <= 5 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                            {claim.days_remaining}d left
                          </span>
                        ) : (
                          <span className="text-slate-400">Served</span>
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
                          className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                            claim.project_code === 'Project #042'
                              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs'
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          }`}
                        >
                          {claim.status === 'Needs PM Review' ? 'Review' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational / Methodology Callout */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800">Deterministic Entitlement Methodology:</strong>
              <p>
                Calculations execute through verified backend algorithms strictly derived from contractual clauses (e.g. FIDIC 8.4(b) Baseline + Margin threshold). AI performs semantic contract reading and evidence matching; all mathematical derivations, dates, and financial metrics are deterministic.
              </p>
            </div>
          </div>
        </div>

        {/* Section B & C: Deadline Risk & Portfolio Overview (Right Col) */}
        <div className="space-y-6">
          {/* Section B: Deadline Risk Sentinel */}
          <div className="panel-card p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ClockAlert className="w-4 h-4 text-amber-600" />
                B. Deadline Risk Sentinel
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">28-Day Notice Rule</span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded bg-rose-50 border border-rose-200">
                <div className="text-xs font-semibold text-rose-900">
                  Critical (&le; 3 Days)
                </div>
                <div className="text-xs font-mono font-bold text-rose-800">
                  {metrics.deadline_risk_breakdown['Critical']} Claim(s)
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200">
                <div className="text-xs font-semibold text-amber-900">
                  High (&le; 5 Days) — Project #042
                </div>
                <div className="text-xs font-mono font-bold text-amber-800">
                  {metrics.deadline_risk_breakdown['High']} Claim(s)
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-blue-50 border border-blue-200">
                <div className="text-xs font-semibold text-blue-900">
                  Medium (&le; 10 Days)
                </div>
                <div className="text-xs font-mono font-bold text-blue-800">
                  {metrics.deadline_risk_breakdown['Medium']} Claim(s)
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-100 border border-slate-200">
                <div className="text-xs font-semibold text-slate-700">
                  Low / Served (&gt; 10 Days)
                </div>
                <div className="text-xs font-mono font-bold text-slate-700">
                  {metrics.deadline_risk_breakdown['Low']} Claim(s)
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Portfolio Status Funnel */}
          <div className="panel-card p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                C. Portfolio Pipeline
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Conversion Funnel</span>
            </div>

            <div className="mt-3 space-y-3">
              {Object.entries(metrics.portfolio_status_funnel).map(([label, count], idx) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{label}</span>
                    <span className="font-mono font-bold text-slate-900">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0
                          ? 'bg-slate-400 w-full'
                          : idx === 1
                          ? 'bg-amber-500 w-3/4'
                          : idx === 2
                          ? 'bg-orange-500 w-3/4'
                          : 'bg-emerald-600 w-1/4'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={onNavigateToUpload}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Upload New Contract for AI Clause Extraction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
