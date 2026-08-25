import React from 'react';
import {
  Calendar,
  HardHat,
  RefreshCw,
  CheckCircle2,
  BookOpen,
  Sliders,
  DollarSign,
  IndianRupee
} from 'lucide-react';
import { Project } from '../../api/client';

interface NavbarProps {
  projects: Project[];
  selectedProjectId: number;
  onSelectProject: (id: number) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenPitchGuide?: () => void;
  currencyMode?: 'INR' | 'USD';
  onToggleCurrency?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onRefresh,
  isRefreshing,
  onOpenPitchGuide,
  currencyMode = 'INR',
  onToggleCurrency
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Project Selector & Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <HardHat className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            Active Package:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => onSelectProject(Number(e.target.value))}
            className="text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none cursor-pointer transition-colors"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>
            System Date: <strong className="font-mono text-slate-950">02 Sep 2026</strong>
          </span>
        </div>
      </div>

      {/* Right: Actions & Solution Walkthrough */}
      <div className="flex items-center gap-2.5">
        {/* Currency Switcher */}
        {onToggleCurrency && (
          <button
            onClick={onToggleCurrency}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Toggle between INR (₹ Lakhs) and USD ($)"
          >
            {currencyMode === 'INR' ? (
              <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                <IndianRupee className="w-3.5 h-3.5" /> INR (₹)
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-emerald-700 font-bold">
                <DollarSign className="w-3.5 h-3.5" /> USD ($)
              </span>
            )}
          </button>
        )}

        {/* Methodology Guide */}
        {onOpenPitchGuide && (
          <button
            onClick={onOpenPitchGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Methodology Guide</span>
          </button>
        )}

        {/* Sync Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh Data from Backend"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">Sync Data</span>
        </button>

        {/* Engine Operational Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden md:inline">Engine Active</span>
        </div>
      </div>
    </header>
  );
};
