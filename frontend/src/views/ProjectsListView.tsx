import React from 'react';
import { Building, MapPin, Calendar, IndianRupee, ArrowUpRight, HardHat } from 'lucide-react';
import { Project } from '../api/client';

interface ProjectsListViewProps {
  projects: Project[];
  onSelectProject: (id: number) => void;
}

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  projects,
  onSelectProject
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="panel-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <HardHat className="w-4 h-4 text-amber-600" />
              Construction Portfolio Management
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Active Project Packages Under Weather Surveillance
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              4 major civil infrastructure & commercial EPC packages connected to EntitlementIQ Sentinel.
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-900 text-amber-400 rounded">
            {projects.length} Active Packages
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="panel-card p-5 hover:border-amber-400 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                  {project.code}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold">
                  {project.status}
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 mt-2">
                {project.name}
              </h2>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Employer: <strong className="text-slate-800">{project.client}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Location: <strong className="text-slate-800">{project.location}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contract Value: <strong className="font-mono text-slate-900">₹{(project.contract_value / 10000000).toFixed(1)} Cr</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Completion: <strong className="font-mono text-slate-800">{project.target_completion_date}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {project.code === 'Project #042' ? '⭐ Primary Hackathon Demo Target' : 'FIDIC Standard EPC'}
              </span>
              <button
                onClick={() => onSelectProject(project.id)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded flex items-center gap-1 transition-colors"
              >
                Open Claims Workspace <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
