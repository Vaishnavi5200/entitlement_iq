import React, { useState, useEffect } from 'react';
import { FileText, Printer, Copy, Check, CheckCircle2, Building, Calendar, IndianRupee, ArrowUpRight } from 'lucide-react';
import { api, ClaimNotice } from '../api/client';
import { Logo } from '../components/ui/Logo';

interface ClaimsViewProps {
  onSelectProjectDetail: () => void;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({ onSelectProjectDetail }) => {
  const [claimNotice, setClaimNotice] = useState<ClaimNotice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Load claim notice for Project #042 or #031
    api.getClaimNotice(1).then(res => {
      setClaimNotice(res);
    }).catch(e => {
      console.error(e);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleCopy = () => {
    if (claimNotice?.formal_notice_text) {
      navigator.clipboard.writeText(claimNotice.formal_notice_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="panel-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-600" />
              Contract Notice Dispatch (FIDIC Clause 20.1)
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Draft Contractor Claim Notices
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Substantiated draft legal notices with contemporary record citations, prepared for Project Manager review and formal dispatch.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <Printer className="w-4 h-4" />
            Print / Export Official PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading Claim Notices...
        </div>
      ) : claimNotice ? (
        <div className="panel-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-mono text-slate-500">
                Notice Reference: <strong className="text-slate-900">{claimNotice.claim_reference || claimNotice.notice_reference || "EIQ-CLM-2026-042-01"}</strong>
              </span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{claimNotice.subject}</div>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied to Clipboard!" : "Copy Full Notice Text"}
            </button>
          </div>

          {/* Letterhead Preview Header */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo variant="icon" size="md" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  BuildCore Engineering JV
                </div>
                <div className="text-[10px] text-slate-300">
                  Principal Contractor · Project #042 Riverside Commercial Complex
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              DISPATCH FORM: FIDIC SUB-CLAUSE 20.1
            </span>
          </div>

          <div
            id="printable-claim-notice"
            className="p-6 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-text shadow-2xs"
          >
            {claimNotice.formal_notice_text}
          </div>
        </div>
      ) : (
        <div className="panel-card p-12 text-center text-slate-500 text-sm space-y-3">
          <div>No approved claim notices generated yet.</div>
          <button
            onClick={onSelectProjectDetail}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            Open Project #042 to Review & Approve Claim <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
};
