import React from 'react';
import { AlertCircle, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';

export const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const normalized = level?.toLowerCase() || 'low';
  
  if (normalized === 'critical') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
        Critical Risk
      </span>
    );
  }
  if (normalized === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        High Risk
      </span>
    );
  }
  if (normalized === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        Medium Risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      Low Risk
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'Needs PM Review' || status === 'Awaiting PM Approval') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Awaiting PM Approval
      </span>
    );
  }
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Approved
      </span>
    );
  }
  if (status === 'Claim Generated' || status === 'Claim Issued') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-900 text-white">
        <FileText className="w-3 h-3 text-amber-400" />
        Notice Dispatched
      </span>
    );
  }
  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <XCircle className="w-3 h-3 text-slate-500" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {status}
    </span>
  );
};
