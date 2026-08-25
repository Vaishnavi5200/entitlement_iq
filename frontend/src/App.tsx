import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './views/DashboardView';
import { ProjectDetailView } from './views/ProjectDetailView';
import { ProjectsListView } from './views/ProjectsListView';
import { EvidenceView } from './views/EvidenceView';
import { DeadlinesView } from './views/DeadlinesView';
import { ClaimsView } from './views/ClaimsView';
import { ContractUploadView } from './views/ContractUploadView';
import { AuditLogView } from './views/AuditLogView';
import { PitchDeckWalkthroughModal } from './components/ui/PitchDeckWalkthroughModal';
import { api, DashboardMetrics, Project, Entitlement } from './api/client';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [currentEntitlement, setCurrentEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState<boolean>(false);
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>('INR');

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [mRes, pRes] = await Promise.all([
        api.getDashboardMetrics(),
        api.getProjects()
      ]);
      setMetrics(mRes);
      setProjects(pRes);

      // Load initial entitlement for Project #042
      const ent = await api.getEntitlement(1);
      setCurrentEntitlement(ent);
    } catch (e) {
      console.error("Failed to load initial data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const [mRes, ent] = await Promise.all([
        api.getDashboardMetrics(),
        api.getEntitlement(selectedProjectId)
      ]);
      setMetrics(mRes);
      setCurrentEntitlement(ent);
    } catch (e) {
      console.error("Refresh error", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSelectClaim = (projId: number, _entId: number) => {
    setSelectedProjectId(projId);
    setActiveTab('project-detail');
  };

  const handleSelectProjectFromList = (projId: number) => {
    setSelectedProjectId(projId);
    setActiveTab('project-detail');
  };

  const toggleCurrency = () => {
    setCurrencyMode(prev => prev === 'INR' ? 'USD' : 'INR');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6F8] text-slate-900">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={(id) => {
            setSelectedProjectId(id);
            setActiveTab('project-detail');
          }}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
          currencyMode={currencyMode}
          onToggleCurrency={toggleCurrency}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
          <DashboardView
              metrics={metrics}
              loading={loading}
              onSelectClaim={handleSelectClaim}
              onNavigateToUpload={() => setActiveTab('contract-upload')}
              onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
              onRetry={loadInitialData}
              currencyMode={currencyMode}
            />
          )}

          {activeTab === 'project-detail' && (
            <ProjectDetailView
              projectId={selectedProjectId}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
              onClaimGenerated={handleRefresh}
              currencyMode={currencyMode}
            />
          )}

          {activeTab === 'projects-list' && (
            <ProjectsListView
              projects={projects}
              onSelectProject={handleSelectProjectFromList}
            />
          )}

          {activeTab === 'entitlements' && (
            <ProjectDetailView
              projectId={selectedProjectId}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
              onClaimGenerated={handleRefresh}
              currencyMode={currencyMode}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidenceView entitlement={currentEntitlement} />
          )}

          {activeTab === 'deadlines' && (
            <DeadlinesView
              metrics={metrics}
              onSelectClaim={handleSelectClaim}
            />
          )}

          {activeTab === 'claims' && (
            <ClaimsView
              onSelectProjectDetail={() => {
                setSelectedProjectId(1);
                setActiveTab('project-detail');
              }}
            />
          )}

          {activeTab === 'contract-upload' && (
            <ContractUploadView
              projects={projects}
              onRuleConfirmed={() => {
                handleRefresh();
                setActiveTab('project-detail');
              }}
            />
          )}

          {activeTab === 'audit-log' && (
            <AuditLogView />
          )}
        </main>
      </div>

      {/* Interactive Platform Methodology Guide Modal */}
      <PitchDeckWalkthroughModal
        isOpen={isPitchGuideOpen}
        onClose={() => setIsPitchGuideOpen(false)}
        onNavigateToDemo={(projId) => {
          setSelectedProjectId(projId || 1);
          setActiveTab('project-detail');
        }}
      />
    </div>
  );
};

export default App;
