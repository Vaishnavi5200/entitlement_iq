import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Database,
  Calendar,
  Layers,
  Award,
  ClockAlert,
  IndianRupee,
  FileCheck2,
  ArrowRight,
  Calculator,
  AlertTriangle
} from 'lucide-react';
import { Logo } from './Logo';

interface PitchDeckWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDemo: (projectId?: number) => void;
}

export const PitchDeckWalkthroughModal: React.FC<PitchDeckWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigateToDemo
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      id: 'section-1',
      title: 'EntitlementIQ — Construction Claims Intelligence',
      subtitle: 'Automated contract delay entitlement detection and notice preservation',
      tag: 'Overview & Mission',
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                Enterprise Claims Intelligence
              </div>
              <h3 className="text-lg font-extrabold mt-1">
                &ldquo;Detect the delay. Prove the entitlement. Beat the deadline.&rdquo;
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Detecting recoverable construction claims before statutory contractual notice deadlines expire.
              </p>
            </div>
            <div className="hidden sm:block">
              <Logo variant="icon" size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200">
              <span className="font-bold text-amber-900 block mb-1">Contract-Encoded Rules:</span>
              <p className="text-slate-700">
                <strong>Weather Entitlement Engine</strong>. Weather is contract-encoded with clear measurable thresholds (e.g. FIDIC 8.4b), meaning entitlement is computed deterministically, not guessed.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Core Claims Workflow:</span>
              <p className="font-mono text-amber-800 font-bold">
                Event → Entitlement → Evidence → Impact → Deadline → PM Approval
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section-2',
      title: 'The Challenge: Disconnected Records & Strict Notice Clocks',
      subtitle: 'The bottleneck in construction claims is correlating evidence in time',
      tag: 'Problem & Industry Context',
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            Every major construction project generates large volumes of disconnected data. When delays occur, evidence is scattered across disparate sources:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
            {['Site Reports', 'RFIs', 'P6 Schedules', 'Weather Logs', 'Site Photos', 'Contracts'].map((s) => (
              <div key={s} className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 font-semibold text-slate-800">
                {s}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center justify-between">
            <div>
              <div className="font-bold">The Statutory Clock Does Not Wait</div>
              <p className="text-[11px] text-rose-800 mt-0.5">
                FIDIC Sub-Clause 20.1 mandates a strict 28-day notice window. Missing this deadline can forfeit rights to prolongation cost recovery.
              </p>
            </div>
            <ClockAlert className="w-8 h-8 text-rose-600 shrink-0 ml-3" />
          </div>
        </div>
      )
    },
    {
      id: 'section-3',
      title: 'Deterministic Calculation & Mathematical Proof',
      subtitle: 'Every rupee, day count, and threshold has a step-by-step arithmetic derivation',
      tag: 'Calculation Architecture',
      content: (
        <div className="space-y-3.5 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px]">
            <span className="text-amber-400 font-bold">Clause 8.4(b) Proof:</span> &ldquo;Baseline (8.2d) + Margin (4.0d) = Threshold (12.2d). Recorded 14.0d &gt; 12.2d.&rdquo;
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Why 6.0 Eligible Days?</span>
              <p className="text-slate-700 font-mono text-[11px]">
                14.0 Actual Adverse Days - 8.0 Scheduled Baseline Allowance = <strong>6.0 Critical Path Days</strong> (Substructure Concreting CP-1042).
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block">Why ₹4.70 Lakh?</span>
              <p className="text-slate-700 font-mono text-[11px]">
                Overhead (₹50k) + Plant (₹20k) + Labor (₹8.3k) = ₹78,333.33/day.
                <br />
                <strong>6 days × ₹78,333.33/day = ₹4,69,999.98 (₹4.70L)</strong>.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 font-semibold text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Core Principle: Pure deterministic Python arithmetic handles all numerical evaluations.</span>
          </div>
        </div>
      )
    },
    {
      id: 'section-4',
      title: 'Legal Defensibility & Human Governance',
      subtitle: 'Surfacing potential recoverable exposure while preserving human authority',
      tag: 'Governance & Compliance',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                System Boundary & Constraints
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                <li>Identifies potential recoverable exposure</li>
                <li>Never makes binding legal determinations</li>
                <li>Generates draft notices for PM authorization</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px] block">
                Enterprise Value Delivered
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-900 text-[11px]">
                <li>Immediate notification before 28-day notice forfeiture</li>
                <li>Deterministic threshold & cost audit trail</li>
                <li>Mandatory PM review gate before notice issue</li>
                <li>Automated compilation of contemporary evidence</li>
              </ul>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 text-white font-mono text-[11px] text-center">
            &ldquo;AI Proposes. A Human Approves. The Engineer Determines. Always.&rdquo;
          </div>
        </div>
      )
    },
    {
      id: 'section-5',
      title: 'System Architecture: Multi-Agent Processing Pipeline',
      subtitle: 'Clear division of labor between reasoning, data ingestion, and math',
      tag: 'System Architecture',
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-slate-700">
            8 distinct modular components work in unison with strict separation of concerns:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold">1. Contract Parser (AI)</div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold">2. Weather Pipeline (Data)</div>
            <div className="p-2 bg-amber-50 border border-amber-200 rounded font-bold text-amber-900">3. Entitlement Engine (Math)</div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold">4. Evidence Correlator</div>
            <div className="p-2 bg-amber-50 border border-amber-200 rounded font-bold text-amber-900">5. Impact Calculator (Cost)</div>
            <div className="p-2 bg-rose-50 border border-rose-200 rounded font-bold text-rose-900">6. Notice Clock Monitor</div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded font-semibold">7. Audit Ledger</div>
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded font-bold text-emerald-900">8. PM Approval Gate</div>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Logo variant="icon" size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Platform Methodology Guide</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                  Section {currentSlide + 1} of {slides.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{current.tag}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900">{current.title}</h2>
          <p className="text-xs text-slate-500">{current.subtitle}</p>
        </div>

        {/* Slide Content */}
        <div className="min-h-[220px]">{current.content}</div>

        {/* Slide navigation controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-amber-500 w-6' : 'bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDemo(1);
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                Explore Project #042 Workspace <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
