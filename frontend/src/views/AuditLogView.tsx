import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, User, Bot, CheckCircle2, Clock, FileCode } from 'lucide-react';
import { api, AuditLog } from '../api/client';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getAuditLogs().then(res => {
      setLogs(res);
    }).catch(err => {
      console.error("Audit fetch error", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="panel-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <History className="w-4 h-4 text-amber-600" />
              Immutable Audit Ledger
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Contract & Claim Traceability Log
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              End-to-end chronological timeline of all algorithmic triggers, contract rule verifications, and human PM approvals.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-900 text-amber-400 rounded">
            {logs.length} Audit Events Logged
          </span>
        </div>
      </div>

      <div className="panel-card p-5">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading Audit Log...</div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
            {logs.map((log) => {
              const isAI = log.actor.toLowerCase().includes('claude') || log.actor.toLowerCase().includes('agent');
              const isPM = log.actor.toLowerCase().includes('rajesh') || log.actor.toLowerCase().includes('pm');
              const isEngine = log.actor.toLowerCase().includes('engine');

              return (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                      isPM
                        ? 'bg-amber-500'
                        : isAI
                        ? 'bg-indigo-600'
                        : 'bg-slate-700'
                    }`}
                  ></div>

                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 uppercase">
                          {log.action}
                        </span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          {isAI ? <Bot className="w-3.5 h-3.5 text-indigo-600" /> : <User className="w-3.5 h-3.5 text-slate-600" />}
                          {log.actor}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed pt-1">
                      {log.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
