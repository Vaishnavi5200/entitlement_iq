import React, { useState, useEffect } from 'react';
import { FileText, Printer, Copy, Check, CheckCircle2, Building, Calendar, IndianRupee } from 'lucide-react';
import { api, ClaimNotice } from '../api/client';

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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-600" />
              Claims & Formal Legal Notices
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Generated Contractor Claim Notices (FIDIC Clause 20.1)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved claim documents formatted for official dispatch to the Employer / Project Engineer.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Loading Claim Notices...</div>
      ) : claimNotice ? (
        <div className="panel-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-mono text-slate-500">
                Reference: <strong className="text-slate-900">{claimNotice.claim_reference || claimNotice.notice_reference || "EIQ-CLM-2026-042-01"}</strong>
              </span>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{claimNotice.subject}</div>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Body"}
            </button>
          </div>

          <div
            id="printable-claim-notice"
            className="p-6 bg-slate-50 border border-slate-200 rounded font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-text"
          >
            {claimNotice.formal_notice_text}
          </div>
        </div>
      ) : (
        <div className="panel-card p-8 text-center text-slate-500 text-sm space-y-2">
          <div>No approved claim notices generated yet.</div>
          <button
            onClick={onSelectProjectDetail}
            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800"
          >
            Open Project #042 to Review & Approve Claim
          </button>
        </div>
      )}
    </div>
  );
};
