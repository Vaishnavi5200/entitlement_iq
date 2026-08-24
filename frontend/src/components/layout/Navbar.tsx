import React from 'react';
import { Calendar, HardHat, RefreshCw, Bell, Search, CheckCircle2 } from 'lucide-react';
import { Project } from '../../api/client';

interface NavbarProps {
  projects: Project[];
  selectedProjectId: number;
  onSelectProject: (id: number) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onRefresh,
  isRefreshing
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Project Selector & Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <HardHat className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProject(Number(e.target.value))}
            className="text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 focus:ring-1 focus:ring-amber-500 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100/80 border border-slate-200 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Demo System Date: <strong className="font-mono text-slate-900">02 Sep 2026</strong></span>
        </div>
      </div>

      {/* Right: Actions, Sync, Notifications */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded transition-colors disabled:opacity-50"
          title="Sync with Deterministic Backend"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync Engine</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Backend Single Source of Truth Active</span>
        </div>
      </div>
    </header>
  );
};
