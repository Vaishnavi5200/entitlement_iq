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
  Edit3
} from 'lucide-react';
import { api, Entitlement, Project, Contract, WeatherObservation, ClaimNotice } from '../api/client';
import { RiskBadge, StatusBadge } from '../components/ui/Badges';

interface ProjectDetailViewProps {
  projectId: number;
  onNavigateToDashboard: () => void;
  onClaimGenerated?: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  onNavigateToDashboard,
  onClaimGenerated
}) => {
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherObservation[]>([]);
  const [claimNotice, setClaimNotice] = useState<ClaimNotice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Drawers state
  const [showSourceClauseModal, setShowSourceClauseModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showClaimNoticeModal, setShowClaimNoticeModal] = useState<boolean>(false);
  const [showRecalcDrawer, setShowRecalcDrawer] = useState<boolean>(false);

  // Review Form state
  const [reviewDecision, setReviewDecision] = useState<'Approve' | 'Edit' | 'Reject'>('Approve');
  const [reviewEligibleDays, setReviewEligibleDays] = useState<number>(6);
  const [reviewFinancialImpact, setReviewFinancialImpact] = useState<number>(470000);
  const [reviewRationale, setReviewRationale] = useState<string>(
    "Verified against IMD rain records, site shutdown sign-off DPR #218, and P6 schedule critical path analysis. Recommended for formal notice submission."
  );
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  // Recalculation Form state (Deterministic Engine Playground)
  const [calcBaseline, setCalcBaseline] = useState<number>(8.2);
  const [calcMargin, setCalcMargin] = useState<number>(4.0);
  const [calcActualDays, setCalcActualDays] = useState<number>(14.0);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // UI accordions
  const [expandFinancials, setExpandFinancials] = useState<boolean>(true);
  const [expandCalendar, setExpandCalendar] = useState<boolean>(false);
  const [expandTraces, setExpandTraces] = useState<boolean>(false);

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

  if (loading || !entitlement || !project) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Project #042 Workspace & Deterministic Entitlement Analysis...</span>
        </div>
      </div>
    );
  }

  const activeRule = entitlement.rule || contracts[0]?.rules[0];
  const adverseObservations = weatherData.filter(w => w.is_adverse);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. PROJECT HEADER */}
      <div className="panel-card p-5 bg-white border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
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
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              {project.name}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Contract Form: <strong className="text-slate-800">{contracts[0]?.form_type || "FIDIC Red Book (EPC / Design-Build)"}</strong> • Monitoring Period: <strong className="text-slate-800">August 2026</strong> • Contract Value: <strong className="font-mono text-slate-800">₹{(project.contract_value / 10000000).toFixed(1)} Cr</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Claim Status
              </div>
              <div className="mt-0.5">
                <StatusBadge status={entitlement.status} />
              </div>
            </div>

            {entitlement.status === 'Needs PM Review' ? (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded transition-colors shadow-xs flex items-center gap-1.5"
              >
                <FileSignature className="w-4 h-4" />
                PM Review Workspace
              </button>
            ) : (
              <button
                onClick={() => setShowClaimNoticeModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded transition-colors shadow-xs flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                View Generated Claim Notice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ENTITLEMENT SUMMARY HERO CARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Status & Trigger */}
        <div className="panel-card p-4 md:col-span-1 border-amber-300 bg-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Contract Entitlement
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 font-bold text-slate-900 text-base leading-snug">
            Potential Weather Entitlement Detected
          </div>
          <p className="mt-1 text-[11px] text-slate-600">
            Clause 8.4(b) threshold exceeded during August 2026 monitoring window.
          </p>
        </div>

        {/* 6 Eligible Days */}
        <div className="panel-card p-4">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <span>Eligible Extension (EoT)</span>
            <FileClock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-slate-900">
            {entitlement.eligible_days.toFixed(0)}{' '}
            <span className="text-sm font-sans font-semibold text-slate-500">Days</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Contract-rule-driven critical path impact
          </div>
        </div>

        {/* ₹4.7 Lakh Estimated Impact */}
        <div className="panel-card p-4 border-slate-300 bg-slate-900 text-white">
          <div className="flex items-center justify-between text-slate-300 text-[11px] font-bold uppercase tracking-wider">
            <span>Estimated Financial Impact</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-amber-400">
            ₹{(entitlement.estimated_financial_impact / 100000).toFixed(1)}{' '}
            <span className="text-sm font-sans font-semibold text-slate-300">Lakh</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-300">
            ₹{entitlement.daily_rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/day prolongation rate
          </div>
        </div>

        {/* Notice Deadline 5 Days Left */}
        <div className="panel-card p-4 border-rose-200 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-800 text-[11px] font-bold uppercase tracking-wider">
            <span>Notice Deadline</span>
            <ClockAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold font-mono text-rose-700">
            {entitlement.days_remaining}{' '}
            <span className="text-sm font-sans font-semibold text-rose-600">Days Left</span>
          </div>
          <div className="mt-1 text-[11px] font-semibold text-rose-700">
            Strict 28-day notice rule expires 07 Sep 2026
          </div>
        </div>
      </div>

      {/* 3. CONTRACT RULE SECTION & STRUCTURED INPUTS */}
      <div className="panel-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Contract Rule: Clause {activeRule?.clause_number || "8.4(b)"} — Weather Delay
            </h2>
          </div>
          <button
            onClick={() => setShowSourceClauseModal(true)}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            View Source Clause
          </button>
        </div>

        {/* Human Interpretation vs Structured Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Human readable interpretation */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Human-Readable Legal Interpretation
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-200">
              {activeRule?.human_explanation}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">Clause Mechanism:</span>
              <span>10-Yr Historical Baseline + Contract Buffer = Entitlement Threshold</span>
            </div>
          </div>

          {/* Structured calculation inputs */}
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Structured Calculation Inputs (Auditable)
              </span>
              <button
                onClick={() => setShowRecalcDrawer(!showRecalcDrawer)}
                className="text-[11px] font-semibold text-amber-700 hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                {showRecalcDrawer ? "Hide Engine Playground" : "Test Custom Variables"}
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-sans font-semibold text-slate-500 uppercase">Baseline</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{entitlement.historical_baseline_days}d</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-sans font-semibold text-slate-500 uppercase">Margin</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">+{entitlement.contractual_margin_days}d</div>
              </div>
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                <div className="text-[10px] font-sans font-bold uppercase">Threshold</div>
                <div className="text-sm font-extrabold mt-0.5">{entitlement.threshold_days}d</div>
              </div>
              <div className="p-2 rounded bg-slate-900 text-amber-400 border border-slate-800">
                <div className="text-[10px] font-sans font-bold uppercase text-slate-300">Actual</div>
                <div className="text-sm font-extrabold mt-0.5">{entitlement.actual_adverse_days}d</div>
              </div>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="text-[10px] font-sans font-bold uppercase">Trigger</div>
                <div className="text-sm font-extrabold mt-0.5">{entitlement.is_triggered ? '14 > 12.2' : 'No'}</div>
              </div>
              <div className="p-2 rounded bg-slate-100 border border-slate-300 text-slate-900">
                <div className="text-[10px] font-sans font-bold uppercase">Eligible</div>
                <div className="text-sm font-extrabold mt-0.5">{entitlement.eligible_days}d</div>
              </div>
            </div>

            {/* Recalculation Engine Drawer */}
            {showRecalcDrawer && (
              <div className="mt-3 p-3.5 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Deterministic Backend Engine Playground
                  </span>
                  <button
                    onClick={handleResetDefaults}
                    className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Project #042 Defaults
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Historical Baseline (Days)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcBaseline}
                      onChange={(e) => setCalcBaseline(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Contract Margin (Days)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcMargin}
                      onChange={(e) => setCalcMargin(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Actual Adverse Days (August)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={calcActualDays}
                      onChange={(e) => setCalcActualDays(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleRecalculate}
                  disabled={isRecalculating}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  {isRecalculating ? "Calculating on backend..." : "Run Backend Deterministic Calculation"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. WEATHER ANALYSIS & VISUAL COMPARISON */}
      <div className="panel-card p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Weather Analysis: August 2026
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              10-Year IMD Meteorological Baseline vs Actual On-Site Automatic Weather Station Log.
            </p>
          </div>
          <button
            onClick={() => setExpandCalendar(!expandCalendar)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            {expandCalendar ? "Hide Daily Logs" : `View All 14 Adverse Dates (${weatherData.length} Days)`}
            {expandCalendar ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Clean visual comparison component */}
        <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Arithmetic Stack */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600 font-sans">Historical Baseline (10-Yr Avg)</span>
                <span className="font-bold text-slate-800">8.2 days</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-600 font-sans">Contractual Margin Buffer</span>
                <span className="font-bold text-slate-800">+4.0 days</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b-2 border-slate-400 bg-amber-50/50 px-2 rounded">
                <span className="font-bold text-amber-900 font-sans">Entitlement Threshold</span>
                <span className="font-extrabold text-amber-900 text-sm">12.2 days</span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-2 bg-slate-900 text-white rounded">
                <span className="font-bold text-slate-100 font-sans">Actual Adverse Days Recorded</span>
                <span className="font-extrabold text-amber-400 text-sm">14.0 days</span>
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Threshold vs Actual Days</span>
                  <span className="text-amber-700 font-bold">14.0 &gt; 12.2 Days</span>
                </div>
                <div className="relative h-6 bg-slate-200 rounded overflow-hidden">
                  {/* Baseline fill */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-slate-400"
                    style={{ width: `${(8.2 / 16) * 100}%` }}
                    title="Historical Baseline: 8.2d"
                  ></div>
                  {/* Margin fill */}
                  <div
                    className="absolute top-0 bottom-0 bg-amber-400"
                    style={{ left: `${(8.2 / 16) * 100}%`, width: `${(4.0 / 16) * 100}%` }}
                    title="Margin Buffer: 4.0d"
                  ></div>
                  {/* Actual Marker */}
                  <div
                    className="absolute top-0 bottom-0 bg-slate-900 opacity-90"
                    style={{ left: `${(14.0 / 16) * 100}%`, width: '4px' }}
                    title="Actual Days: 14.0d"
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0d</span>
                  <span>Baseline (8.2d)</span>
                  <span>Threshold (12.2d)</span>
                  <span className="font-bold text-slate-900">Actual (14.0d)</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>THRESHOLD PASSED: Contractual Entitlement Established</span>
                </div>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  +1.8d Excess over Threshold / 6.0d EoT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Daily August Calendar Log */}
        {expandCalendar && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              August 2026 Adverse Event Log ({adverseObservations.length} Adverse Days)
            </h3>
            <div className="overflow-x-auto max-h-64 overflow-y-auto border border-slate-200 rounded">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-600 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2 text-right">Rainfall (mm)</th>
                    <th className="px-3 py-2 text-right">Wind (km/h)</th>
                    <th className="px-3 py-2">Trigger Classification</th>
                    <th className="px-3 py-2">On-Site Disruption Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adverseObservations.map((obs) => (
                    <tr key={obs.id} className="hover:bg-amber-50/50">
                      <td className="px-3 py-1.5 font-mono font-semibold text-slate-900">
                        {obs.obs_date}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-800">
                        {obs.rainfall_mm} mm
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono text-slate-700">
                        {obs.wind_kmh} km/h
                      </td>
                      <td className="px-3 py-1.5 text-slate-700">
                        {obs.adverse_trigger_reason}
                      </td>
                      <td className="px-3 py-1.5 font-medium text-slate-900">
                        {obs.site_impact_logged}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. EVIDENCE SECTION (8/10 COMPLETENESS) & IMPACT ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Evidence Panel (7 cols) */}
        <div className="lg:col-span-7 panel-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Contemporary Evidence Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Substantiation required under FIDIC Sub-Clause 20.1.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-mono font-bold">
              <span>Evidence Completeness:</span>
              <span className="text-amber-400">{entitlement.evidence_score}/{entitlement.evidence_total}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {entitlement.evidence_items.map((ev) => (
              <div
                key={ev.id}
                className={`p-3 rounded-lg border text-xs transition-colors ${
                  ev.is_missing
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded text-[10px] uppercase">
                        {ev.type}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">{ev.date}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[11px] text-slate-600 font-medium">Source: {ev.source}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1">{ev.title}</div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{ev.relevance}</p>
                  </div>

                  <div className="shrink-0">
                    {ev.verification_status === 'Verified' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Missing (2 pts)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact & Deadline Sentinel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Time & Financial Impact Analysis */}
          <div className="panel-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Impact Analysis (Auditable Inputs)
              </h2>
              <span className="text-xs font-mono font-bold text-slate-900">
                ₹{(entitlement.estimated_financial_impact / 100000).toFixed(1)} Lakh Total
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Eligible Delay (Time Impact):</span>
                <span className="font-mono font-bold text-slate-900">{entitlement.eligible_days} Calendar Days</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Daily Prolongation Burn Rate:</span>
                <span className="font-mono font-bold text-slate-900">₹{entitlement.daily_rate.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / day</span>
              </div>
            </div>

            {/* Expandable Financial Line Items */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                Financial Breakdown Composition:
              </div>
              <div className="space-y-1.5 text-xs">
                {entitlement.financial_breakdown_json?.map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-800">{item.category}</div>
                      <div className="text-[10px] text-slate-500">{item.description}</div>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900 shrink-0 ml-2">
                      ₹{item.total.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deadline Sentinel Card */}
          <div className="panel-card p-5 border-amber-300 bg-amber-50/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <ClockAlert className="w-4 h-4 text-amber-600" />
                Notice Deadline Sentinel
              </span>
              <RiskBadge level={entitlement.risk_level} />
            </div>

            <div className="p-3 bg-white rounded border border-amber-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Event Detection Date:</span>
                <span className="font-mono font-semibold text-slate-800">{entitlement.detection_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contractual Notice Window:</span>
                <span className="font-mono font-semibold text-slate-800">{entitlement.notice_window_days} Days (Clause 20.1)</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1">
                <span className="text-slate-700 font-bold">Calculated Deadline:</span>
                <span className="font-mono font-bold text-rose-700">{entitlement.notice_deadline_date}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1 text-sm">
                <span className="font-bold text-slate-900">Days Remaining:</span>
                <span className="font-mono font-extrabold text-amber-600">{entitlement.days_remaining} Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. MODAL: SOURCE CLAUSE VIEW */}
      {showSourceClauseModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Source Contract Clause: Sub-Clause 8.4(b)
                </h3>
              </div>
              <button
                onClick={() => setShowSourceClauseModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-3 font-mono bg-slate-50 p-4 rounded border border-slate-200 leading-relaxed max-h-96 overflow-y-auto">
              <p className="font-bold text-slate-900 font-sans text-sm">
                FIDIC Red Book Conditions of Contract — Sub-Clause 8.4 [Extension of Time for Completion]
              </p>
              <p>{activeRule?.raw_clause_text}</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">
                Document: <strong className="text-slate-700">GCC_Riverside_Complex_Executed_Final.pdf</strong> (Page 48)
              </span>
              <button
                onClick={() => setShowSourceClauseModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: PM REVIEW & APPROVAL WORKSPACE */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-slate-300 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                  Human-In-The-Loop Approval Gateway
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Project Manager Review: Project #042 Delay Claim
                </h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Why was this flagged */}
            <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200 text-xs space-y-1.5">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Why was this entitlement flagged by EntitlementIQ?
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                <li>Clause 8.4(b) threshold (12.2 days) exceeded: <strong>14.0 actual adverse rain days</strong> logged.</li>
                <li>Critical path delay impact confirmed on Substructure Concreting (<strong>6.0 eligible days</strong>).</li>
                <li>Estimated recoverable prolongation value: <strong>₹4.7 Lakh</strong>.</li>
                <li>Notice window compliance: <strong>5 calendar days remaining</strong> before contractual forfeiture.</li>
              </ul>
            </div>

            {/* Action Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Select PM Decision:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReviewDecision('Approve')}
                  className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    reviewDecision === 'Approve'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Claim
                </button>
                <button
                  type="button"
                  onClick={() => setReviewDecision('Edit')}
                  className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    reviewDecision === 'Edit'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Edit3 className="w-4 h-4" /> Edit Values
                </button>
                <button
                  type="button"
                  onClick={() => setReviewDecision('Reject')}
                  className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    reviewDecision === 'Reject'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <XCircle className="w-4 h-4" /> Reject Entitlement
                </button>
              </div>
            </div>

            {/* Adjustable Values if Edit mode */}
            {reviewDecision === 'Edit' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Adjust Eligible Days:</label>
                  <input
                    type="number"
                    value={reviewEligibleDays}
                    onChange={(e) => setReviewEligibleDays(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Adjust Financial Claim (₹):</label>
                  <input
                    type="number"
                    value={reviewFinancialImpact}
                    onChange={(e) => setReviewFinancialImpact(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* PM Rationale */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">PM Notes & Decision Rationale:</label>
              <textarea
                value={reviewRationale}
                onChange={(e) => setReviewRationale(e.target.value)}
                rows={3}
                className="w-full border border-slate-300 rounded p-2 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                placeholder="Enter formal justification for audit trail..."
              />
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 font-semibold hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors shadow-xs flex items-center gap-1.5"
              >
                {isSubmittingReview ? "Recording Decision..." : "Confirm & Generate Claim Notice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: FORMAL CLAIM NOTICE PREVIEW & EXPORT */}
      {showClaimNoticeModal && claimNotice && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Generated Claim Notice Document
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Ref: {claimNotice.claim_reference || claimNotice.notice_reference} • FIDIC Sub-Clause 20.1
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowClaimNoticeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Printable Notice Text Area */}
            <div
              id="printable-claim-notice"
              className="flex-1 overflow-y-auto font-mono text-xs text-slate-800 bg-slate-50 p-5 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed select-text"
            >
              {claimNotice.formal_notice_text}
            </div>

            {/* Actions: Print / Download / Copy */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready for Service to Employer / Engineer
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyNotice}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded flex items-center gap-1 transition-colors"
                >
                  {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedNotice ? "Copied!" : "Copy Text"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
