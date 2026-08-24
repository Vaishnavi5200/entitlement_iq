import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FileCheck2,
  Database,
  ClockAlert,
  FileText,
  FileCode,
  History,
  ShieldCheck,
  HardHat,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId?: number;
  setSelectedProjectId: (id: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedProjectId,
  setSelectedProjectId
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'project-detail', label: 'Project #042 Workspace', icon: FolderKanban, badge: 'Active', isProject: true },
    { id: 'projects-list', label: 'All Projects', icon: HardHat, badge: '4' },
    { id: 'entitlements', label: 'Entitlements', icon: FileCheck2, badge: '3 Detected' },
    { id: 'evidence', label: 'Evidence Matrix', icon: Database, badge: null },
    { id: 'deadlines', label: 'Notice Deadlines', icon: ClockAlert, badge: '2 Urgent' },
    { id: 'claims', label: 'Claims & Notices', icon: FileText, badge: null },
    { id: 'contract-upload', label: 'Contract Rule AI', icon: FileCode, badge: 'AI' },
    { id: 'audit-log', label: 'Audit Trail', icon: History, badge: null },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-bold tracking-tighter text-base shadow-sm">
          EIQ
        </div>
        <div>
          <div className="font-bold text-slate-100 text-sm tracking-tight flex items-center gap-1.5">
            EntitlementIQ
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
              MVP
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight">Construction Claims Sentinel</p>
        </div>
      </div>

      {/* Core Workflow Purpose Badge */}
      <div className="mx-3 mt-3 p-2.5 rounded bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 leading-relaxed">
        <div className="font-semibold text-slate-200 flex items-center gap-1 mb-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Deterministic Engine
        </div>
        <span className="text-slate-400">Detect Delay → Prove Rule → Beat Deadline → Generate Claim</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Main Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isProject) {
                  setSelectedProjectId(1);
                }
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : item.badge === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : item.badge.includes('Urgent')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Demo Scenario Card */}
      <div className="p-3 mx-2.5 mb-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
        <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span>Demo Target</span>
          <span className="text-amber-400 font-mono">#042</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Riverside Commercial: Clause 8.4(b) (8.2 + 4.0 = 12.2d vs 14d actual).
        </p>
        <button
          onClick={() => {
            setSelectedProjectId(1);
            setActiveTab('project-detail');
          }}
          className="mt-2 w-full py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors border border-slate-700"
        >
          Open Project #042 <ChevronRight className="w-3 h-3 text-amber-400" />
        </button>
      </div>

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-800/80 flex items-center gap-2.5 bg-slate-950/40">
        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
          RS
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-200 truncate">Rajesh Sharma</div>
          <div className="text-[10px] text-slate-400 truncate">Sr. Claims & Contracts PM</div>
        </div>
      </div>
    </aside>
  );
};
