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
      id: 'step-1-detect',
      title: '1. Detect: Automated Threshold Surveillance',
      subtitle: 'Continuous monitoring of weather and site metrics against contract baselines',
      tag: 'Step 01 · Detect',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10.5px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                Continuous Anomaly Detection
              </div>
              <h3 className="text-base font-extrabold mt-1">
                Automated Meteorological Ingestion
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Live automated weather stations (AWS) stream daily precipitation, wind gusts, and temperature against official 10-year historical IMD baselines.
              </p>
            </div>
            <div className="hidden sm:block">
              <Logo variant="icon" size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Baseline Comparison:</span>
              <p className="text-slate-700">
                Measures actual adverse rain days (14.0 days) directly against historical August baseline allowance (8.2 days).
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200">
              <span className="font-bold text-amber-900 block mb-1">Why Weather First?</span>
              <p className="text-slate-700">
                Weather is empirical and measurable. Entitlement is computed deterministically rather than subject to narrative dispute.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'step-2-validate',
      title: '2. Validate: AI-Assisted Contract Analysis',
      subtitle: 'Extracting structured numerical parameters from contractual clauses',
      tag: 'Step 02 · Validate',
      content: (
        <div className="space-y-3.5 text-xs">
          <p className="text-slate-700 leading-relaxed">
            Unstructured legal PDFs (e.g. FIDIC Red Book Sub-Clause 8.4b) are parsed into precise contractual variables:
          </p>

          <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-100 space-y-1">
            <div className="text-amber-400 font-bold">Clause 8.4(b) Structure:</div>
            <div>• Historical Baseline = 8.2 days</div>
            <div>• Contractual Margin = 4.0 days</div>
            <div className="text-emerald-400">• Entitlement Threshold = 8.2 + 4.0 = 12.2 days</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <strong>Human Verification Step:</strong> Extracted parameters must be verified by the Contracts Manager before activating automated surveillance.
          </div>
        </div>
      )
    },
    {
      id: 'step-3-prove',
      title: '3. Prove: Contemporary Evidence Matrix',
      subtitle: 'Substantiating delays with signed site reports and critical path schedules',
      tag: 'Step 03 · Prove',
      content: (
        <div className="space-y-3.5 text-xs">
          <p className="text-slate-700">
            A claim is only as strong as its contemporary records. EntitlementIQ correlates evidence across silos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">AWS Telemetry</span>
              <span className="text-[10px] text-slate-500 font-mono">14 rain days logged</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">DPR #218 Signed</span>
              <span className="text-[10px] text-slate-500 font-mono">Work stoppage recorded</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Primavera P6 Analysis</span>
              <span className="text-[10px] text-slate-500 font-mono">CP-1042 on critical path</span>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 font-semibold text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Evidence Completeness Score: 8/10 contemporarily verified before PM review.</span>
          </div>
        </div>
      )
    },
    {
      id: 'step-4-quantify',
      title: '4. Quantify: Deterministic Mathematical Derivation',
      subtitle: 'Pure Python arithmetic calculates prolongation costs with zero hallucinations',
      tag: 'Step 04 · Quantify',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Delay Duration Derivation:</span>
              <p className="text-slate-700 font-mono text-[11px]">
                14.0 Actual Adverse Days - 8.0 Scheduled Baseline = <strong>6.0 Critical Path Days</strong>.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block">Cost Calculation Breakdown:</span>
              <p className="text-slate-700 font-mono text-[11px]">
                Daily Burn: ₹50k (Overhead) + ₹20k (Plant) + ₹8.3k (Labor) = ₹78,333.33/d.
                <br />
                <strong>6 days × ₹78,333.33 = ₹4,69,999.98 (₹4.70L)</strong>.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 text-white font-mono text-[11px] text-center">
            Every day count and rupee has an inspectable arithmetic trace.
          </div>
        </div>
      )
    },
    {
      id: 'step-5-track',
      title: '5. Track: Statutory Notice Clock Monitor',
      subtitle: 'Preventing contractual forfeiture under standard 28-day notice clauses',
      tag: 'Step 05 · Track',
      content: (
        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center justify-between">
            <div>
              <div className="font-bold">FIDIC Sub-Clause 20.1 Strict Notice Window</div>
              <p className="text-[11px] text-rose-800 mt-0.5">
                Contractors must submit formal notice within 28 days of event occurrence or forfeit 100% of compensation rights.
              </p>
            </div>
            <ClockAlert className="w-8 h-8 text-rose-600 shrink-0 ml-3" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-900 font-bold">
              Critical (&le; 3 Days)
            </div>
            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 font-bold">
              High (&le; 5 Days)
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-bold">
              Low (&gt; 10 Days)
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'step-6-review',
      title: '6. Review: PM Approval & Draft Claim Notice',
      subtitle: 'Mandatory human approval gate before notice dispatch',
      tag: 'Step 06 · Review',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                AI Role (Assistant)
              </span>
              <p className="text-slate-600 text-[11px]">
                Detects threshold breaches, compiles contemporary evidence, quantifies daily financial exposure, and drafts standard notice letters.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-950 block text-[11px] uppercase tracking-wider">
                PM Role (Decision Maker)
              </span>
              <p className="text-emerald-900 text-[11px]">
                Reviews calculated delay, adjusts eligible days or rates based on site context, and formally approves notice dispatch.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 text-white font-mono text-[11px] text-center">
            &ldquo;AI Proposes. A Human Approves. The Engineer Determines. Always.&rdquo;
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
