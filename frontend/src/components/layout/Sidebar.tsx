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
  ChevronRight,
  BookOpen,
  Cpu
} from 'lucide-react';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId?: number;
  setSelectedProjectId: (id: number) => void;
  onOpenPitchGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedProjectId,
  setSelectedProjectId,
  onOpenPitchGuide
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard, badge: null },
    { id: 'project-detail', label: 'Project #042 Workspace', icon: FolderKanban, badge: 'Active', isProject: true },
    { id: 'projects-list', label: 'Portfolio Overview', icon: HardHat, badge: '4 Projects' },
    { id: 'entitlements', label: 'Weather Entitlements', icon: FileCheck2, badge: '3 Identified' },
    { id: 'evidence', label: 'Evidence Matrix', icon: Database, badge: '8/10' },
    { id: 'deadlines', label: 'Notice Deadlines', icon: ClockAlert, badge: '2 Urgent' },
    { id: 'claims', label: 'Draft Claim Notices', icon: FileText, badge: null },
    { id: 'contract-upload', label: 'AI Contract Analysis', icon: FileCode, badge: 'Assisted' },
    { id: 'audit-log', label: 'Audit Ledger', icon: History, badge: null },
  ];

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/90 select-none min-h-screen">
      {/* Official Brand Header with Logo */}
      <div className="p-4 border-b border-slate-800/90 flex items-center justify-between">
        <Logo variant="horizontal" size="md" showTagline={true} />
      </div>

      {/* Core Workflow Purpose Pill */}
      <div className="mx-3 mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
        <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Claims Intelligence Workflow</span>
        </div>
        <div className="text-[10px] text-amber-400 font-mono tracking-tight font-semibold">
          Detect → Validate → Prove → Quantify → Track → Review
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Claims Workspace
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : item.badge === 'Active'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : item.badge.includes('Urgent')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Methodology Guide Trigger */}
      <div className="px-3 pb-2">
        <button
          onClick={onOpenPitchGuide}
          className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/30 text-xs font-semibold text-slate-200 flex items-center justify-between transition-all group shadow-xs"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-[11px] font-bold text-slate-100">Platform Methodology</div>
              <div className="text-[9.5px] text-slate-400 font-normal">Architecture & Calculations</div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
        </button>
      </div>

      {/* Footer User Info */}
      <div className="p-3 border-t border-slate-800/90 flex items-center gap-2.5 bg-[#080D18]">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
          RS
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-slate-200 truncate">Rajesh Sharma</div>
          <div className="text-[10px] text-slate-400 truncate">Sr. Claims & Contracts PM</div>
        </div>
      </div>
    </aside>
  );
};
