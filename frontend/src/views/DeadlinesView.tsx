import React from 'react';
import { ClockAlert, AlertTriangle, ShieldCheck, ArrowUpRight, Calendar } from 'lucide-react';
import { DashboardMetrics } from '../api/client';
import { RiskBadge, StatusBadge } from '../components/ui/Badges';

interface DeadlinesViewProps {
  metrics: DashboardMetrics | null;
  onSelectClaim: (projectId: number, entitlementId: number) => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({
  metrics,
  onSelectClaim
}) => {
  if (!metrics) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="panel-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <ClockAlert className="w-4 h-4 text-amber-600" />
              Contractual Notice Period Sentinel
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Notice Deadlines & Forfeiture Risk Monitor
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict 28-day statutory notice countdowns under FIDIC Sub-Clause 20.1 and EPC General Conditions.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Today: 02 Sep 2026</span>
          </div>
        </div>
      </div>

      <div className="panel-card overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Notice Countdown Status (Ranked by Urgency)
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {metrics.priority_claims.length} Active Notice Tracks
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {metrics.priority_claims.map((claim) => (
            <div
              key={claim.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                claim.days_remaining <= 5 && claim.status === 'Needs PM Review' ? 'bg-amber-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                    {claim.project_code}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{claim.project_name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-mono text-slate-500">Clause {claim.clause_number}</span>
                </div>
                <div className="text-xs text-slate-600">{claim.event_name}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Impact: <strong>₹{(claim.estimated_impact / 100000).toFixed(1)} Lakh</strong> ({claim.eligible_days} days)
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="font-mono text-sm font-extrabold text-slate-900">
                    {claim.days_remaining > 0 ? (
                      <span className={claim.days_remaining <= 5 ? 'text-rose-700' : 'text-slate-900'}>
                        {claim.days_remaining} Days Remaining
                      </span>
                    ) : (
                      <span className="text-emerald-700">Notice Served</span>
                    )}
                  </div>
                  <div className="mt-0.5">
                    <RiskBadge level={claim.risk_level} />
                  </div>
                </div>

                <button
                  onClick={() => onSelectClaim(claim.project_id, claim.id)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded transition-colors flex items-center gap-1"
                >
                  Review Notice <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
