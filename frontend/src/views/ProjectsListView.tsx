import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  HardHat,
  ShieldCheck,
  Search,
  Filter,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project } from '../api/client';

interface ProjectsListViewProps {
  projects: Project[];
  onSelectProject: (id: number) => void;
}

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  projects,
  onSelectProject
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Triggered' | 'Urgent' | 'Under Surveillance'>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'Triggered') return p.code === 'Project #042' || p.code === 'Project #017';
    if (filterType === 'Urgent') return p.code === 'Project #042';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Portfolio Header matching Slide 08 */}
      <div className="bg-[#0B1120] text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-md">
              Portfolio Scale · Slide 08
            </span>
            <span className="text-xs text-slate-400 font-mono">Continuous Multi-Project Surveillance</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
            The system remembers every project — across hundreds at once
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            A claims team doesn&apos;t want: <em>&ldquo;Here&apos;s one claim.&rdquo;</em> They want: <strong>&ldquo;Here are the projects where you may be leaving money on the table.&rdquo;</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center min-w-[120px]">
            <div className="text-2xl font-extrabold font-mono text-amber-400">500+</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Monitored</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="panel-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by package name, code, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Triggered', 'Urgent'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f as any)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                filterType === f
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f} Packages
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const isTarget = project.code === 'Project #042';
          return (
            <div
              key={project.id}
              className={`panel-card p-5 hover:border-amber-400 transition-all flex flex-col justify-between ${
                isTarget ? 'border-amber-300 ring-2 ring-amber-400/20' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                      {project.code}
                    </span>
                    {isTarget && (
                      <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                        ⭐ Primary Hackathon Demo
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold">
                    {project.status}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 mt-2">
                  {project.name}
                </h2>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Employer: <strong className="text-slate-800">{project.client}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Location: <strong className="text-slate-800">{project.location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Contract Value: <strong className="font-mono text-slate-900">₹{(project.contract_value / 10000000).toFixed(1)} Cr</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Target Completion: <strong className="font-mono text-slate-800">{project.target_completion_date}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {project.code === 'Project #042'
                    ? 'Clause 8.4(b) (8.2 + 4.0 = 12.2d vs 14d)'
                    : 'Weather Threshold Active'}
                </span>
                <button
                  onClick={() => onSelectProject(project.id)}
                  className={`px-3.5 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all ${
                    isTarget
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Open Claims Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
