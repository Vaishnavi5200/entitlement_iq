import React from 'react';
import { Database, CheckCircle2, AlertTriangle, FileText, Download, ExternalLink } from 'lucide-react';
import { Entitlement } from '../api/client';

interface EvidenceViewProps {
  entitlement: Entitlement | null;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ entitlement }) => {
  if (!entitlement) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Select a project to inspect contemporary evidence records.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="panel-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Database className="w-4 h-4 text-amber-600" />
              Contemporary Records Matrix (FIDIC Sub-Clause 20.1)
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Project #042 Delay & Prolongation Evidence Dossier
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated compilation of AWS weather records, engineer-signed daily site reports, and Primavera critical path analyses.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold px-3 py-1.5 bg-slate-900 text-white rounded">
            <span>Completeness Score:</span>
            <span className="text-amber-400">{entitlement.evidence_score}/{entitlement.evidence_total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {entitlement.evidence_items.map((item) => (
          <div
            key={item.id}
            className={`panel-card p-4 transition-colors ${
              item.is_missing ? 'border-rose-300 bg-rose-50/20' : 'hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-800">
                    {item.type}
                  </span>
                  <span className="font-mono text-xs text-slate-500">{item.date}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 font-semibold">Source: {item.source}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600">{item.relevance}</p>
                {item.file_attachment && (
                  <div className="text-[11px] font-mono text-slate-500 pt-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Attachment: <span className="text-slate-700 underline">{item.file_attachment}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {item.verification_status === 'Verified' ? (
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by QA/QC
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Missing Evidence Item (-2 pts)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
