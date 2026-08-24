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
  if (status === 'Needs PM Review') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-500 text-white tracking-wide uppercase shadow-xs">
        <Clock className="w-3 h-3" />
        Needs PM Review
      </span>
    );
  }
  if (status === 'Approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-600 text-white tracking-wide uppercase">
        <CheckCircle2 className="w-3 h-3" />
        Approved
      </span>
    );
  }
  if (status === 'Claim Generated') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-indigo-700 text-white tracking-wide uppercase">
        <FileText className="w-3 h-3" />
        Claim Issued
      </span>
    );
  }
  if (status === 'Rejected') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-slate-700 text-white tracking-wide uppercase">
        <XCircle className="w-3 h-3" />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
      {status}
    </span>
  );
};
