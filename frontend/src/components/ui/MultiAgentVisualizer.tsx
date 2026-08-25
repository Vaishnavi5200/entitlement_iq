import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Calculator,
  Database,
  IndianRupee,
  ClockAlert,
  ShieldCheck,
  UserCheck,
  FileCheck2,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface MultiAgentVisualizerProps {
  projectId?: number;
  onOpenReview?: () => void;
}

export const MultiAgentVisualizer: React.FC<MultiAgentVisualizerProps> = ({
  onOpenReview
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('entitlement-engine');

  const agents = [
    {
      id: 'contract-agent',
      name: 'Contract Agent',
      type: 'AI Reasoning (Claude)',
      icon: Bot,
      color: 'indigo',
      badge: 'LLM Agent',
      status: 'Completed',
      input: 'GCC Riverside Executed Contract (PDF / OCR)',
      logic: 'Analyzes legal text, identifies Clause 8.4(b) [Weather Delay], extracts baseline (8.2d) & margin (4.0d).',
      output: 'Structured Rule: Threshold = 12.2d, 28-day notice window',
      audit: 'Audited & confirmed by PM Rajesh Sharma'
    },
    {
      id: 'weather-agent',
      name: 'Weather Agent',
      type: 'API & Station Ingestion',
      icon: Database,
      color: 'sky',
      badge: 'Data Pipeline',
      status: 'Completed',
      input: 'IMD Station Gridded Data + On-Site AWS Sensors',
      logic: 'Normalizes 31 daily weather observations for August 2026; classifies rain > 15mm or wind > 45km/h as adverse.',
      output: '14.0 Adverse Weather Days recorded',
      audit: 'Certified against Site Station #AWS-NCR-042'
    },
    {
      id: 'entitlement-engine',
      name: 'Entitlement Engine',
      type: 'Deterministic Pure Python',
      icon: Calculator,
      color: 'amber',
      badge: 'Deterministic Code',
      status: 'Active Trigger',
      input: 'Baseline 8.2d + Margin 4.0d (12.2d) vs Actual 14.0d',
      logic: 'Pure mathematical evaluation: Actual (14.0) > Threshold (12.2) = TRUE. Excess over scheduled baseline (8.0d) = 6.0 Days.',
      output: '6.0 Calendar Days Extension of Time (EoT)',
      audit: 'Deterministic execution ID #CALC-20260902-883'
    },
    {
      id: 'evidence-agent',
      name: 'Evidence Agent',
      type: 'Multi-Stream Correlator',
      icon: FileCheck2,
      color: 'blue',
      badge: 'Evidence Correlator',
      status: 'Completed',
      input: 'DPR #218, Primavera P6 TIA Schedule, Drone Photos, AWS Logs',
      logic: 'Cross-references delay dates with critical path activity CP-1042 (Basement B2 Slab Casting).',
      output: 'Evidence Completeness: 8/10 (4 Verified, 1 Missing Slump Test)',
      audit: 'Verified against Site Agent & Resident Engineer DPR'
    },
    {
      id: 'impact-calculator',
      name: 'Impact Calculator',
      type: 'Deterministic Cost Engine',
      icon: IndianRupee,
      color: 'emerald',
      badge: 'Deterministic Math',
      status: 'Completed',
      input: 'Daily Overhead (₹50k) + Equipment (₹20k) + Labor (₹8.3k)',
      logic: '₹78,333.33/day prolongation burn rate × 6.0 eligible critical path delay days.',
      output: '₹4,70,000 (₹4.70 Lakh) Estimated Prolongation Claim',
      audit: 'Tied to BOQ Schedule of Rates (Item 1.4 General Preliminaries)'
    },
    {
      id: 'deadline-sentinel',
      name: 'Deadline Sentinel',
      type: 'Temporal Rule Monitor',
      icon: ClockAlert,
      color: 'rose',
      badge: 'Statutory Sentinel',
      status: 'Urgent',
      input: 'Detection Date: 10 Aug 2026 | Notice Window: 28 Days',
      logic: 'Calculates strict contractual cutoff date under Sub-Clause 20.1: 07 Sep 2026.',
      output: '5 Days Remaining in Notice Window (Risk: High)',
      audit: 'Automated alert dispatched to Project Manager'
    },
    {
      id: 'validator',
      name: 'Validator & Auditor',
      type: 'Integrity & Coherence',
      icon: ShieldCheck,
      color: 'purple',
      badge: 'System Audit',
      status: 'Completed',
      input: 'All upstream agent payloads and temporal proofs',
      logic: 'Validates that weather dates match DPR shutdown dates, critical path activity, and financial rates.',
      output: 'Confidence: 94% | 0 Contradictions detected',
      audit: 'All calculations logged to immutable audit ledger'
    },
    {
      id: 'human-gate',
      name: 'Human Gate (PM)',
      type: 'Human-in-the-Loop Governance',
      icon: UserCheck,
      color: 'amber',
      badge: 'Human Decision',
      status: 'Awaiting Sign-Off',
      input: 'Comprehensive Entitlement Intelligence Dossier',
      logic: 'PM Rajesh Sharma reviews clause, weather source, calculation, evidence, impact, and deadline.',
      output: 'Action: Approve → Generates Official FIDIC Claim Notice',
      audit: 'Human approval is mandatory before any claim is issued'
    }
  ];

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[2];

  return (
    <div className="space-y-4">
      {/* Principle Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono">
              System Architecture
            </span>
            <span className="text-xs text-slate-400 font-mono">Multi-Agent Claims Pipeline</span>
          </div>
          <h3 className="text-sm font-bold text-slate-100">
            &ldquo;AI for clause interpretation, deterministic computation for mathematics.&rdquo;
          </h3>
          <p className="text-xs text-slate-300">
            Strict separation between natural language parsing, empirical data ingestion, mathematical evaluation, and human authorization.
          </p>
        </div>

        {onOpenReview && (
          <button
            onClick={onOpenReview}
            className="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Open PM Human Gate
          </button>
        )}
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          const isSelected = agent.id === selectedAgentId;
          const isHuman = agent.id === 'human-gate';
          const isEngine = agent.id === 'entitlement-engine';

          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between min-h-[110px] relative ${
                isSelected
                  ? 'bg-slate-900 text-white border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    agent.status.includes('Active') || agent.status.includes('Awaiting')
                      ? 'bg-amber-400 animate-pulse'
                      : agent.status.includes('Urgent')
                      ? 'bg-rose-500'
                      : 'bg-emerald-500'
                  }`}
                ></span>
              </div>

              <div className="my-1">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-amber-400' : isHuman ? 'text-amber-600' : isEngine ? 'text-amber-500' : 'text-slate-600'
                    }`}
                  />
                  <span className="text-xs font-bold truncate">{agent.name}</span>
                </div>
                <div className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {agent.badge}
                </div>
              </div>

              <div
                className={`text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded truncate ${
                  isSelected
                    ? 'bg-slate-800 text-amber-300'
                    : isHuman
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {agent.status}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Agent Deep-Dive Card */}
      <div className="panel-card p-5 border-slate-300 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-900 text-amber-400">
              <selectedAgent.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{selectedAgent.name}</h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {selectedAgent.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Role in EntitlementIQ 6-Step Loop: <strong className="text-slate-700">{selectedAgent.badge}</strong>
              </p>
            </div>
          </div>

          <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Status: {selectedAgent.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 block">
              1. Input Data Source
            </span>
            <p className="text-slate-800 font-semibold">{selectedAgent.input}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800 block">
              2. Logic & Execution
            </span>
            <p className="text-slate-800">{selectedAgent.logic}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900 text-white border border-slate-800 space-y-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-400 block">
              3. Deterministic Output
            </span>
            <p className="text-slate-100 font-mono font-semibold">{selectedAgent.output}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Audit Trace: <strong className="text-slate-700 font-mono">{selectedAgent.audit}</strong>
          </span>
          <span className="text-slate-400 font-mono">End-to-End Latency: 42ms</span>
        </div>
      </div>
    </div>
  );
};
