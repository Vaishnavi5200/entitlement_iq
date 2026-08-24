import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  FileCheck2,
  Calendar,
  ClockAlert,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sliders,
  Printer,
  Download,
  Copy,
  Check,
  Building,
  MapPin,
  FileSignature,
  FileClock,
  Send,
  XCircle,
  Edit3,
  Bot,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  UserCheck,
  Calculator
} from 'lucide-react';
import { api, Entitlement, Project, Contract, WeatherObservation, ClaimNotice } from '../api/client';
import { RiskBadge, StatusBadge } from '../components/ui/Badges';
import { MultiAgentVisualizer } from '../components/ui/MultiAgentVisualizer';
import { Logo } from '../components/ui/Logo';
import { MathTraceModal, MathTopic } from '../components/ui/MathTraceModal';

interface ProjectDetailViewProps {
  projectId: number;
  onNavigateToDashboard: () => void;
  onClaimGenerated?: () => void;
  currencyMode?: 'INR' | 'USD';
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onNavigateToDashboard,
  onClaimGenerated,
  currencyMode = 'INR'
}) => {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherObservation[]>([]);
  const [claimNotice, setClaimNotice] = useState<ClaimNotice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Tab within Project View
  const [activeSubTab, setActiveSubTab] = useState<'workbench' | 'pipeline' | 'contract' | 'evidence'>('workbench');

  // Math proof modal
  const [activeMathTopic, setActiveMathTopic] = useState<MathTopic | null>(null);

  // Modals & Drawers state
  const [showSourceClauseModal, setShowSourceClauseModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showClaimNoticeModal, setShowClaimNoticeModal] = useState<boolean>(false);
  const [showRecalcDrawer, setShowRecalcDrawer] = useState<boolean>(false);

  // Review Form state (Slide 10 Governance)
  const [reviewDecision, setReviewDecision] = useState<'Approve' | 'Edit' | 'Reject'>('Approve');
  const [reviewEligibleDays, setReviewEligibleDays] = useState<number>(6);
  const [reviewFinancialImpact, setReviewFinancialImpact] = useState<number>(470000);
  const [reviewRationale, setReviewRationale] = useState<string>(
    "Verified against IMD certified weather station log, Resident Engineer sign-off on DPR #218, and Primavera P6 TIA critical path model. Notice issued strictly within 28-day window under Clause 20.1 to avoid contractual forfeiture."
  );
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  // Recalculation Form state (Deterministic Engine Playground)
  const [calcBaseline, setCalcBaseline] = useState<number>(8.2);
  const [calcMargin, setCalcMargin] = useState<number>(4.0);
  const [calcActualDays, setCalcActualDays] = useState<number>(14.0);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // UI accordions
  const [expandCalendar, setExpandCalendar] = useState<boolean>(false);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const res = await api.getProjectDetails(projectId);
      setProject(res.project);
      setContracts(res.contracts);
      if (res.entitlements.length > 0) {
        const ent = res.entitlements[0];
        setEntitlement(ent);
        setReviewEligibleDays(ent.eligible_days);
        setReviewFinancialImpact(ent.estimated_financial_impact);
        setCalcBaseline(ent.historical_baseline_days);
        setCalcMargin(ent.contractual_margin_days);
        setCalcActualDays(ent.actual_adverse_days);

        // Fetch Claim Notice if already approved/generated
        if (ent.status === 'Approved' || ent.status === 'Claim Generated') {
          try {
            const notice = await api.getClaimNotice(ent.id);
            setClaimNotice(notice);
          } catch (e) {
            console.error("Notice fetch error", e);
          }
        }
      }

      const wRes = await api.getWeatherData(projectId);
      setWeatherData(wRes.observations);
    } catch (err) {
      console.error("Error loading project detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const handleRecalculate = async () => {
    if (!entitlement) return;
    try {
      setIsRecalculating(true);
      const res = await api.recalculateEntitlement(entitlement.id, {
        custom_baseline: Number(calcBaseline),
        custom_margin: Number(calcMargin),
        custom_actual_days: Number(calcActualDays)
      });
      setEntitlement(res.entitlement);
      setReviewEligibleDays(res.entitlement.eligible_days);
      setReviewFinancialImpact(res.entitlement.estimated_financial_impact);
    } catch (e) {
      console.error("Recalculation failed", e);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleResetDefaults = () => {
    setCalcBaseline(8.2);
    setCalcMargin(4.0);
    setCalcActualDays(14.0);
    if (entitlement) {
      api.recalculateEntitlement(entitlement.id, {
        custom_baseline: 8.2,
        custom_margin: 4.0,
        custom_actual_days: 14.0
      }).then(res => {
        setEntitlement(res.entitlement);
        setReviewEligibleDays(res.entitlement.eligible_days);
        setReviewFinancialImpact(res.entitlement.estimated_financial_impact);
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!entitlement) return;
    try {
      setIsSubmittingReview(true);
      const res = await api.submitPMReview(entitlement.id, {
        decision: reviewDecision,
        eligible_days: Number(reviewEligibleDays),
        financial_impact: Number(reviewFinancialImpact),
        reviewer_name: "Rajesh Sharma (Sr. Project Manager)",
        reviewer_role: "Contract Administrator & PM",
        rationale: reviewRationale
      });

      setEntitlement(res.entitlement);
      setShowReviewModal(false);

      if (reviewDecision === 'Approve') {
        const notice = await api.getClaimNotice(entitlement.id);
        setClaimNotice(notice);
        setShowClaimNoticeModal(true);
      }

      if (onClaimGenerated) onClaimGenerated();
    } catch (err) {
      console.error("Failed to submit PM review", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleCopyNotice = () => {
    if (claimNotice?.formal_notice_text) {
      navigator.clipboard.writeText(claimNotice.formal_notice_text);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2000);
    }
  };

  const formatCurrency = (valInInr: number) => {
    if (currencyMode === 'USD') {
      const usdVal = valInInr / 85;
      return `$${(usdVal / 1000).toFixed(1)}k`;
    }
    return `₹${(valInInr / 100000).toFixed(1)} Lakh`;
  };

  if (loading || !entitlement || !project) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-bold">Loading Project #042 Workspace & Deterministic Entitlement Analysis...</span>
        </div>
      </div>
    );
  }

  const activeRule = entitlement?.rule || (contracts[0]?.rules && contracts[0].rules.length > 0 ? contracts[0].rules[0] : null);
  const adverseObservations = weatherData?.filter(w => w.is_adverse) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. BREADCRUMBS & PROJECT HEADER */}
      <div className="panel-card p-5 bg-white border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={onNavigateToDashboard}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Portfolio
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                {project.code}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                {project.client}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {project.location}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Contract Form: <strong className="text-slate-900">{contracts[0]?.form_type || "FIDIC Red Book (EPC / Design-Build)"}</strong> • Monitoring Period: <strong className="text-slate-900">August 2026</strong> • Contract Value: <strong className="font-mono text-slate-900">₹{(project.contract_value / 10000000).toFixed(1)} Cr</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Claim Status
              </div>
              <div className="mt-0.5">
                <StatusBadge status={entitlement.status} />
              </div>
            </div>

            {entitlement.status === 'Needs PM Review' ? (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]"
              >
                <UserCheck className="w-4 h-4" />
                PM Review Workspace (Slide 10)
              </button>
            ) : (
              <button
                onClick={() => setShowClaimNoticeModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                View Generated Claim Notice
              </button>
            )}
          </div>
        </div>

        {/* Legal Disclaimer Pill */}
        <div className="mt-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Governance Guardrail:</strong> AI identifies contractual threshold breaches to prevent forfeiture under FIDIC Sub-Clause 20.1. Formal claim determination remains subject to Engineer determination.
            </span>
          </div>
          <button
            onClick={() => setActiveMathTopic('financial_4_7_lakh')}
            className="text-amber-800 font-bold underline font-mono text-[11px] shrink-0 flex items-center gap-1"
          >
            <Calculator className="w-3.5 h-3.5" />
            Audit Numbers
          </button>
        </div>

        {/* Workspace Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-4 pt-3 overflow-x-auto text-xs">
          {[
            { id: 'workbench', label: '1. Entitlement Workbench (Slide 05)', icon: FileCheck2 },
            { id: 'pipeline', label: '2. Multi-Agent Pipeline (Slide 07)', icon: Layers },
            { id: 'contract', label: '3. Contract Clause 8.4(b)', icon: FileText },
            { id: 'evidence', label: '4. Evidence Matrix (8/10)', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: WORKBENCH (SLIDE 05 CONTRACT RULE IN ACTION) */}
      {/* ========================================================================= */}
      {activeSubTab === 'workbench' && (
        <div className="space-y-6">
          {/* SLIDE 05 INFOGRAPHIC CARD: HOW THE WEATHER ENGINE REASONS */}
          <div className="panel-card p-5 border-amber-300 bg-amber-50/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-500 text-slate-950 rounded font-mono">
                    CONTRACT RULE IN ACTION · SLIDE 05
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    PROJECT #042 · CONTRACT CLAUSE 8.4(b) — WEATHER DELAY
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic mt-1">
                  &ldquo;If accumulated adverse-weather days in a monitoring period exceed the historical baseline by more than 4 days, Contractor is entitled to a time extension.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveMathTopic('weather_threshold_12_2')}
                  className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1 transition-colors"
                  title="Where did 12.2 and 14 days come from?"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-600" />
                  Audit 12.2d Threshold
                </button>
                <button
                  onClick={() => setShowRecalcDrawer(!showRecalcDrawer)}
                  className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-700" />
                  {showRecalcDrawer ? "Hide Playground" : "Test Variables"}
                </button>
              </div>
            </div>

            {/* Slide 5 Equation Visual Stack */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
              {/* 1. Baseline */}
              <button
                onClick={() => setActiveMathTopic('weather_threshold_12_2')}
                className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-all text-left"
              >
                <div className="text-2xl font-extrabold font-mono text-slate-900 flex items-center justify-between">
                  <span>{entitlement.historical_baseline_days} days</span>
                  <Calculator className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Historical baseline (10-Yr)
                </div>
              </button>

              {/* 2. Margin */}
              <button
                onClick={() => setActiveMathTopic('weather_threshold_12_2')}
                className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-400 transition-all text-left"
              >
                <div className="text-2xl font-extrabold font-mono text-slate-900 flex items-center justify-between">
                  <span>+ {entitlement.contractual_margin_days} days</span>
                  <Calculator className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                  Contract margin (8.4b)
                </div>
              </button>

              {/* 3. Threshold */}
              <button
                onClick={() => setActiveMathTopic('weather_threshold_12_2')}
                className="p-3.5 rounded-xl bg-amber-500 text-slate-950 border border-amber-600 shadow-sm hover:bg-amber-400 transition-all text-left"
              >
                <div className="text-2xl font-extrabold font-mono flex items-center justify-between">
                  <span>{entitlement.threshold_days} days</span>
                  <Calculator className="w-3.5 h-3.5 text-slate-950" />
                </div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider mt-1">
                  Contractual Threshold
                </div>
              </button>

              {/* 4. Actual Days */}
              <button
                onClick={() => setActiveMathTopic('weather_threshold_12_2')}
                className="p-3.5 rounded-xl bg-[#0B1120] text-amber-400 border border-slate-800 shadow-sm hover:border-amber-400 transition-all text-left"
              >
                <div className="text-2xl font-extrabold font-mono flex items-center justify-between">
                  <span>{entitlement.actual_adverse_days} days</span>
                  <Calculator className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-[11px] font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                  Actual rainy days (Aug)
                </div>
              </button>

              {/* 5. Trigger Outcome */}
              <div className="p-3.5 rounded-xl bg-rose-600 text-white border border-rose-700 shadow-sm flex flex-col justify-center text-left">
                <div className="text-xl font-extrabold tracking-tight">
                  EXCEEDED
                </div>
                <div className="text-[10.5px] font-mono text-rose-100 mt-1">
                  {entitlement.actual_adverse_days} &gt; {entitlement.threshold_days} → Potential Entitlement
                </div>
              </div>
            </div>

            {/* Slide 5 Entitlement Highlights Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Potential Entitlement Summary */}
              <button
                onClick={() => setActiveMathTopic('financial_4_7_lakh')}
                className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 text-left hover:border-amber-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] uppercase font-bold text-amber-400 tracking-wider">
                    POTENTIAL PROLONGATION EXPOSURE
                  </span>
                  <Calculator className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-1">
                  <strong>{entitlement.eligible_days} eligible days</strong> · Est. exposure <strong>{formatCurrency(entitlement.estimated_financial_impact)}</strong> · Evidence <strong>{entitlement.evidence_score}/{entitlement.evidence_total} complete</strong>
                </div>
              </button>

              {/* Notice Countdown */}
              <button
                onClick={() => setActiveMathTopic('deadline_5_days')}
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-left hover:border-rose-400 transition-all group flex items-center justify-between"
              >
                <div>
                  <span className="text-[10.5px] uppercase font-extrabold text-rose-900 tracking-wider">
                    NOTICE WINDOW (FIDIC 20.1)
                  </span>
                  <div className="text-lg font-extrabold font-mono text-rose-700 mt-0.5">
                    {entitlement.days_remaining} DAYS LEFT
                  </div>
                </div>
                <ClockAlert className="w-7 h-7 text-rose-600 shrink-0 group-hover:scale-110 transition-transform" />
              </button>

              {/* Action Button to PM Review Gate */}
              <button
                onClick={() => setShowReviewModal(true)}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>REVIEW CLAIM →</span>
                <span className="text-[11px] font-normal font-mono opacity-90">(PM Review Gate)</span>
              </button>
            </div>

            {/* Recalculation Engine Playground Drawer */}
            {showRecalcDrawer && (
              <div className="mt-4 p-4 bg-[#0B1120] text-slate-100 rounded-xl border border-slate-800 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    Deterministic Calculation Engine Playground
                  </span>
                  <button
                    onClick={handleResetDefaults}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Project #042 Baseline (8.2 + 4.0 = 12.2d)
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">10-Year Historical Baseline (Days)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcBaseline}
                      onChange={(e) => setCalcBaseline(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Contract Margin Buffer (Days)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcMargin}
                      onChange={(e) => setCalcMargin(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Actual Recorded Adverse Days (August)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={calcActualDays}
                      onChange={(e) => setCalcActualDays(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleRecalculate}
                  disabled={isRecalculating}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isRecalculating ? "Executing Python deterministic engine..." : "Run Backend Deterministic Calculation"}
                </button>
              </div>
            )}
          </div>

          {/* Grid: Financial Breakdown (Left) + Weather Timeline & Calendar (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Financial Composition (5 cols) */}
            <div className="lg:col-span-5 panel-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-amber-600" />
                  Prolongation Financial Composition
                </h2>
                <button
                  onClick={() => setActiveMathTopic('financial_4_7_lakh')}
                  className="text-xs font-mono font-bold text-amber-800 hover:underline flex items-center gap-1"
                >
                  <span>{formatCurrency(entitlement.estimated_financial_impact)}</span>
                  <Calculator className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Eligible Delay (Time Extension):</span>
                  <button
                    onClick={() => setActiveMathTopic('delay_6_days')}
                    className="font-mono font-bold text-slate-900 hover:underline"
                  >
                    {entitlement.eligible_days} Calendar Days
                  </button>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Daily Prolongation Burn Rate:</span>
                  <span className="font-mono font-bold text-slate-900">₹{entitlement.daily_rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / day</span>
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold text-slate-700 uppercase">Auditable Cost Breakdown:</div>
                {entitlement.financial_breakdown_json?.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{item.category}</div>
                      <div className="text-[10.5px] text-slate-500">{item.description}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900 shrink-0 ml-2">
                      ₹{item.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveMathTopic('financial_4_7_lakh')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                Where Did ₹4.7L Come From? (Full Math Proof)
              </button>
            </div>

            {/* Weather Observation Log & Calendar (7 cols) */}
            <div className="lg:col-span-7 panel-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    August 2026 Weather Observation Log
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    14 adverse precipitation & inundation days recorded on-site.
                  </p>
                </div>
                <button
                  onClick={() => setExpandCalendar(!expandCalendar)}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {expandCalendar ? "Collapse" : "Expand All 31 Days"}
                </button>
              </div>

              {/* Adverse Events Table */}
              <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 font-bold">Date</th>
                      <th className="px-3 py-2 font-bold text-right">Rain (mm)</th>
                      <th className="px-3 py-2 font-bold text-right">Wind (km/h)</th>
                      <th className="px-3 py-2 font-bold">Adverse Reason</th>
                      <th className="px-3 py-2 font-bold">Site Log Sign-Off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(expandCalendar ? weatherData : adverseObservations).map((obs) => (
                      <tr
                        key={obs.id}
                        className={`hover:bg-slate-50 ${
                          obs.is_adverse ? 'bg-amber-50/40 font-medium' : ''
                        }`}
                      >
                        <td className="px-3 py-2 font-mono font-bold text-slate-900">
                          {obs.obs_date}
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-slate-800">
                          {obs.rainfall_mm} mm
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-slate-600">
                          {obs.wind_kmh} km/h
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {obs.adverse_trigger_reason || <span className="text-slate-400">Normal weather</span>}
                        </td>
                        <td className="px-3 py-2 font-semibold text-slate-900 truncate max-w-[180px]" title={obs.site_impact_logged}>
                          {obs.site_impact_logged || <span className="text-slate-400">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MULTI-AGENT PIPELINE (SLIDE 06 & 07) */}
      {/* ========================================================================= */}
      {activeSubTab === 'pipeline' && (
        <MultiAgentVisualizer onOpenReview={() => setShowReviewModal(true)} />
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTRACT CLAUSE & LEGAL INTERPRETATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'contract' && (
        <div className="panel-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                FIDIC Red Book (EPC / Design-Build)
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Sub-Clause 8.4 [Extension of Time for Completion] & Clause 20.1 [Contractor Claims]
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-900 text-amber-400 rounded-md">
              Document: GCC_Riverside_Complex_Executed_Final.pdf
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Raw Contract Clause Text (Executed PDF):
              </label>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {activeRule?.raw_clause_text}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                AI Extracted & Human-Verified Legal Interpretation:
              </label>
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-xs text-slate-800 space-y-2 leading-relaxed">
                <p>{activeRule?.human_explanation}</p>
                <div className="pt-2 border-t border-amber-200/80 font-mono text-[11px] text-amber-900 space-y-1">
                  <div>• Baseline Allowance: <strong>{activeRule?.historical_baseline_days} Days</strong></div>
                  <div>• Margin Threshold: <strong>+{activeRule?.contractual_margin_days} Days</strong></div>
                  <div>• Statutory Notice Window: <strong>28 Calendar Days</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CONTEMPORARY EVIDENCE MATRIX */}
      {/* ========================================================================= */}
      {activeSubTab === 'evidence' && (
        <div className="panel-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Contemporary Records Dossier (FIDIC Sub-Clause 20.1)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated collation of weather station certificates, signed daily site progress logs, and Primavera critical path analyses.
              </p>
            </div>
            <div className="font-mono text-xs font-bold px-3 py-1.5 bg-slate-900 text-white rounded-lg">
              Completeness Score: <span className="text-amber-400">{entitlement.evidence_score}/{entitlement.evidence_total}</span>
            </div>
          </div>

          <div className="space-y-3">
            {entitlement.evidence_items.map((ev) => (
              <div
                key={ev.id}
                className={`p-4 rounded-xl border transition-all ${
                  ev.is_missing
                    ? 'bg-rose-50/30 border-rose-200'
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-800">
                        {ev.type}
                      </span>
                      <span className="font-mono text-xs text-slate-500">{ev.date}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600 font-semibold">Source: {ev.source}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                    <p className="text-xs text-slate-600">{ev.relevance}</p>
                    {ev.file_attachment && (
                      <div className="text-[11px] font-mono text-slate-500 pt-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        Attachment: <span className="text-slate-700 font-bold underline">{ev.file_attachment}</span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {ev.verification_status === 'Verified' ? (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        Missing Slump Log (-2 pts)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PM REVIEW & GOVERNANCE WORKSPACE (SLIDE 10) */}
      {/* ========================================================================= */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    PM Human Review Gate (Slide 10 Governance)
                  </h3>
                  <p className="text-xs text-slate-500">
                    &ldquo;AI Proposes. A Human Approves. ALWAYS.&rdquo;
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Decision selector */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setReviewDecision('Approve')}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                  reviewDecision === 'Approve'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                ✓ Approve & Issue Claim
              </button>

              <button
                type="button"
                onClick={() => setReviewDecision('Edit')}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                  reviewDecision === 'Edit'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Edit3 className="w-4 h-4 mx-auto mb-1" />
                ✎ Edit Parameters
              </button>

              <button
                type="button"
                onClick={() => setReviewDecision('Reject')}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                  reviewDecision === 'Reject'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-500/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <XCircle className="w-4 h-4 mx-auto mb-1" />
                ✕ Reject Event
              </button>
            </div>

            {/* Parameters adjustment */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Eligible Days Claimed (EoT):
                </label>
                <input
                  type="number"
                  value={reviewEligibleDays}
                  onChange={(e) => setReviewEligibleDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Estimated Prolongation Exposure (₹):
                </label>
                <input
                  type="number"
                  value={reviewFinancialImpact}
                  onChange={(e) => setReviewFinancialImpact(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Manager Written Rationale & Sign-Off Notes:
              </label>
              <textarea
                rows={3}
                value={reviewRationale}
                onChange={(e) => setReviewRationale(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 leading-relaxed focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                {isSubmittingReview ? "Recording PM Decision..." : "Submit PM Decision"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FORMAL LEGAL CLAIM NOTICE (FIDIC CLAUSE 20.1) */}
      {/* ========================================================================= */}
      {showClaimNoticeModal && claimNotice && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Logo variant="icon" size="sm" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official Contractor Notice of Claim
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">
                    FIDIC Sub-Clause 20.1 & Clause 8.4(b)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNotice}
                  className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNotice ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </button>
                <button
                  onClick={() => setShowClaimNoticeModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body with Letterhead */}
            <div
              id="printable-claim-notice"
              className="flex-1 overflow-y-auto p-6 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-text shadow-2xs"
            >
              {claimNotice.formal_notice_text}
            </div>
          </div>
        </div>
      )}

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
