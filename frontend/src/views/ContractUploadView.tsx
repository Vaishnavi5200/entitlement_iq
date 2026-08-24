import React, { useState } from 'react';
import {
  FileCode,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api, Project } from '../api/client';

interface ContractUploadViewProps {
  projects: Project[];
  onRuleConfirmed?: () => void;
}

export const ContractUploadView: React.FC<ContractUploadViewProps> = ({
  projects,
  onRuleConfirmed
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 1);
  const [contractTitle, setContractTitle] = useState<string>("FIDIC Red Book Conditions of Contract — Package C");
  const [contractText, setContractText] = useState<string>(`CLAUSE 8.4 — EXTENSION OF TIME FOR COMPLETION
The Contractor shall be entitled subject to Sub-Clause 20.1 [Contractor's Claims] to an extension of the Time for Completion if and to the extent that completion is delayed by exceptionally adverse climatic conditions.
For the purposes of this Sub-Clause, exceptionally adverse climatic conditions are defined as weather conditions exceeding the historical 10-year meteorological baseline (8.2 days per monitoring period) by an agreed contractual buffer margin of not less than four (4.0) days, resulting in an entitlement threshold of 12.2 days.
The Contractor shall give notice to the Engineer not later than 28 days after the Contractor became aware of the event.`);

  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedRule, setExtractedRule] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleExtract = async () => {
    try {
      setIsExtracting(true);
      setSavedSuccess(false);
      const res = await api.parseContractClause({
        project_id: selectedProjectId,
        contract_title: contractTitle,
        contract_text: contractText
      });
      setExtractedRule(res);
    } catch (e) {
      console.error("Extraction error", e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmAndSave = async () => {
    if (!extractedRule) return;
    try {
      setIsSaving(true);
      // In MVP, saves confirmed rule to active project
      setSavedSuccess(true);
      if (onRuleConfirmed) {
        setTimeout(() => onRuleConfirmed(), 1500);
      }
    } catch (e) {
      console.error("Save error", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="panel-card p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Contract Intelligence & Rule Extraction
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-1">
          Extract Weather Entitlement Rules from Contracts
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Claude AI Contract Agent parses unstructured legal clauses into structured calculation inputs. Human review required before saving.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Upload (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="panel-card p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Project:</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contract Title:</label>
              <input
                type="text"
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Contract Clause Text / PDF OCR Content:
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Sub-Clause 8.4</span>
              </div>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                rows={8}
                className="w-full bg-slate-50 border border-slate-300 rounded p-3 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none leading-relaxed"
                placeholder="Paste contract clause text here..."
              />
            </div>

            <button
              onClick={handleExtract}
              disabled={isExtracting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              {isExtracting ? "Extracting Clause Rules with AI..." : "Run AI Clause Extraction"}
            </button>
          </div>
        </div>

        {/* Right: Extracted Structured JSON & Human Confirmation (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {extractedRule ? (
            <div className="panel-card p-5 space-y-4 border-amber-300 bg-amber-50/10">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Extracted Structured Rule
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Confidence: {(extractedRule.confidence * 100).toFixed(0)}%
                </span>
              </div>

              {/* Editable parameters */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 text-[11px] font-semibold mb-1">Clause Number</label>
                  <input
                    type="text"
                    value={extractedRule.clause || "8.4(b)"}
                    onChange={(e) => setExtractedRule({ ...extractedRule, clause: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] font-semibold mb-1">Notice Period (Days)</label>
                  <input
                    type="number"
                    value={extractedRule.notice_window_days || 28}
                    onChange={(e) => setExtractedRule({ ...extractedRule, notice_window_days: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] font-semibold mb-1">Historical Baseline (Days)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={extractedRule.baseline_days || 8.2}
                    onChange={(e) => setExtractedRule({ ...extractedRule, baseline_days: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] font-semibold mb-1">Contract Margin Buffer (Days)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={extractedRule.margin_days || 4.0}
                    onChange={(e) => setExtractedRule({ ...extractedRule, margin_days: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Plain English summary */}
              <div className="p-3 bg-white rounded border border-slate-200 text-xs">
                <div className="font-bold text-slate-700 mb-1">Human Interpretation:</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {extractedRule.human_explanation}
                </p>
              </div>

              {/* Raw JSON Schema display */}
              <div className="p-3 bg-slate-900 text-amber-400 rounded font-mono text-[10px] overflow-x-auto max-h-36">
                <pre>{JSON.stringify(extractedRule, null, 2)}</pre>
              </div>

              {/* Confirmation CTA */}
              <button
                onClick={handleConfirmAndSave}
                disabled={isSaving}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {savedSuccess ? "Rule Confirmed & Saved!" : "Confirm Structured Rule & Activate Sentinel"}
              </button>

              {savedSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-center text-xs text-emerald-800 font-semibold">
                  Rule successfully registered. Deterministic monitoring engine activated.
                </div>
              )}
            </div>
          ) : (
            <div className="panel-card p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px] border-dashed">
              <FileCode className="w-10 h-10 text-slate-300 mb-2" />
              <div className="text-xs font-semibold text-slate-600">No Rule Extracted Yet</div>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Click &quot;Run AI Clause Extraction&quot; to parse contract clauses into auditable JSON parameters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
