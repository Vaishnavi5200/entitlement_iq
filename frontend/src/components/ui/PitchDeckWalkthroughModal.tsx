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
      id: 'slide-1',
      title: 'EntitlementIQ — Construction Claims Sentinel',
      subtitle: 'PS #13 · Change Order Claims Desk — AI For Business',
      tag: 'Overview & Mission',
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                byteBuilt 1.0 Hackathon · Team Submission
              </div>
              <h3 className="text-lg font-extrabold mt-1">
                &ldquo;Detect the delay. Prove the entitlement. Beat the deadline.&rdquo;
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Detecting recoverable construction claims before the contractual notice deadline closes.
              </p>
            </div>
            <div className="hidden sm:block">
              <Logo variant="icon" size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200">
              <span className="font-bold text-amber-900 block mb-1">Focused MVP Wedge:</span>
              <p className="text-slate-700">
                <strong>Weather Entitlement Engine</strong>. Weather is contract-encoded with clear measurable thresholds (e.g. FIDIC 8.4b), meaning entitlement is computed, not guessed.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Core 6-Step Loop:</span>
              <p className="font-mono text-amber-800 font-bold">
                Event → Entitlement → Evidence → Impact → Deadline → Action
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'slide-2',
      title: 'Problem: Change Orders Drowning in Fragmented Data',
      subtitle: 'The bottleneck isn&apos;t drafting claims — it&apos;s detecting them in time',
      tag: 'Problem Statement PS #13',
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-700 leading-relaxed">
            Every construction project generates a flood of disconnected records. When a delay happens, evidence is scattered across 6 separate silos:
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
              <div className="font-bold">The Contractual Clock Does Not Wait</div>
              <p className="text-[11px] text-rose-800 mt-0.5">
                FIDIC Sub-Clause 20.1 gives a strict 28-day notice window. Miss it, and the contractor forfeits 100% of delay compensation.
              </p>
            </div>
            <ClockAlert className="w-8 h-8 text-rose-600 shrink-0 ml-3" />
          </div>
        </div>
      )
    },
    {
      id: 'slide-3',
      title: 'Where Did This Number Come From? (Slide 05)',
      subtitle: 'Every ₹ and day count has an indisputable mathematical explanation',
      tag: 'Deterministic Math in Action',
      content: (
        <div className="space-y-3.5 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px]">
            <span className="text-amber-400 font-bold">Clause 8.4(b) Proof:</span> &ldquo;Baseline (8.2d) + Margin (4.0d) = Threshold (12.2d). Recorded 14.0d &gt; 12.2d.&rdquo;
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Why 6.0 Eligible Days?</span>
              <p className="text-slate-700 font-mono text-[11px]">
                14.0 Actual Adverse Days - 8.0 Scheduled Baseline Allowance = <strong>6.0 Critical Path Days</strong> (Activity CP-1042 Basement Concreting).
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block">Why ₹4.70 Lakh?</span>
              <p className="text-slate-700 font-mono text-[11px]">
                Overhead (₹50k) + Plant (₹20k) + Labor (₹8.3k) = ₹78,333.33/day.
                <br />
                <strong>6 days × ₹78,333.33/day = ₹4,69,999.98 (₹4.7L)</strong>.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 font-semibold text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Golden Rule: Pure Python math replaces LLM hallucinations for all numbers.</span>
          </div>
        </div>
      )
    },
    {
      id: 'slide-4',
      title: 'Defensibility & Non-Overclaiming (Slide 10 & 12)',
      subtitle: 'We do NOT guarantee claim recovery — we prevent statutory forfeiture',
      tag: 'Legal Defensibility & Ethics',
      content: (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
              <span className="font-bold text-rose-950 uppercase tracking-wider text-[10px] block">
                ❌ What We DO NOT Claim
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-rose-900 text-[11px]">
                <li>&ldquo;Claim is legally guaranteed&rdquo;</li>
                <li>&ldquo;Zero hallucinations anywhere in the universe&rdquo;</li>
                <li>&ldquo;AI makes the final legal / commercial decision&rdquo;</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px] block">
                ✅ What We DO Provide
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-900 text-[11px]">
                <li>Potential recoverable exposure identified</li>
                <li>Deterministic daily threshold calculations</li>
                <li>Human PM approval gate before notice dispatch</li>
                <li>Protection against the 28-day notice clock forfeiture</li>
              </ul>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 text-white font-mono text-[11px] text-center">
            &ldquo;AI Proposes. A Human Approves. Engineer Determines. ALWAYS.&rdquo;
          </div>
        </div>
      )
    },
    {
      id: 'slide-5',
      title: 'System Architecture: Multi-Agent Division of Labor (Slide 07)',
      subtitle: 'AI for reasoning, deterministic code for math',
      tag: 'Multi-Agent Pipeline',
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-slate-700">
            8 distinct agents work together with strict separation of reasoning and mathematics:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">1. Contract Agent (AI)</div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">2. Weather Agent (Data)</div>
            <div className="p-2 bg-amber-50 border border-amber-200 rounded font-bold text-amber-900">3. Entitlement Engine (Math)</div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">4. Evidence Agent (P6/AWS)</div>
            <div className="p-2 bg-amber-50 border border-amber-200 rounded font-bold text-amber-900">5. Impact Calculator (Math)</div>
            <div className="p-2 bg-rose-50 border border-rose-200 rounded font-bold text-rose-900">6. Deadline Sentinel (28d)</div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">7. Validator (Audit)</div>
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded font-bold text-emerald-900">8. Human Gate (PM)</div>
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
                <span className="text-xs font-bold text-slate-900">Pitch Deck & Solution Guide</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                  Slide {currentSlide + 1} of {slides.length}
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
                Open Live Project #042 Demo <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
