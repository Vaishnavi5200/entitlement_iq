import React, { useState } from 'react';
import { ClockAlert, AlertTriangle, ShieldCheck, ArrowUpRight, Calendar, Calculator } from 'lucide-react';
import { DashboardMetrics } from '../api/client';
import { RiskBadge, StatusBadge } from '../components/ui/Badges';
import { MathTraceModal, MathTopic } from '../components/ui/MathTraceModal';

interface DeadlinesViewProps {
  metrics: DashboardMetrics | null;
  onSelectClaim: (projectId: number, entitlementId: number) => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({
  metrics,
  onSelectClaim
}) => {
  const [activeMathTopic, setActiveMathTopic] = useState<MathTopic | null>(null);

  if (!metrics) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="panel-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <ClockAlert className="w-4 h-4 text-amber-600" />
              Contractual Notice Period Monitor
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Notice Deadlines & Forfeiture Risk Monitor
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict 28-day statutory notice countdowns under FIDIC Sub-Clause 20.1 to prevent contractual forfeiture.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
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
          <span className="text-xs text-slate-500 font-mono font-semibold">
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
                  <span className="text-xs font-mono text-slate-500 font-semibold">Clause {claim.clause_number}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">{claim.event_name}</div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                  <span>
                    Est. Exposure: <strong>₹{(claim.estimated_impact / 100000).toFixed(1)} Lakh</strong> ({claim.eligible_days}d EoT)
                  </span>
                  <button
                    onClick={() => setActiveMathTopic(claim.project_code === 'Project #042' ? 'financial_4_7_lakh' : 'portfolio_19_7_lakh')}
                    className="text-amber-700 underline flex items-center gap-0.5 hover:text-amber-900"
                  >
                    <Calculator className="w-2.5 h-2.5" />
                    Math Trace
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="font-mono text-sm font-extrabold text-slate-900">
                    {claim.days_remaining > 0 ? (
                      <button
                        onClick={() => setActiveMathTopic('deadline_5_days')}
                        className={`hover:underline flex items-center gap-1 ml-auto ${
                          claim.days_remaining <= 5 ? 'text-rose-700' : 'text-slate-900'
                        }`}
                      >
                        <span>{claim.days_remaining} Days Remaining</span>
                        <ClockAlert className="w-3 h-3 text-rose-500" />
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold">Notice Served</span>
                    )}
                  </div>
                  <div className="mt-0.5">
                    <RiskBadge level={claim.risk_level} />
                  </div>
                </div>

                <button
                  onClick={() => onSelectClaim(claim.project_id, claim.id)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  Review Notice <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
