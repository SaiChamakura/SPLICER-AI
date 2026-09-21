import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCcw,
  Smartphone,
  Play,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  ConnectorInfo,
  NavTab,
  Project,
  SourceItem,
  SourceType,
  WorkContext,
} from './types';
import { LocalWorkVault } from './services/vaultService';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { BottomNavigation } from './components/BottomNavigation';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { ActionApprovalModal } from './components/ActionApprovalModal';
import { DemoFlowModal } from './components/DemoFlowModal';
import { RawItemsModal } from './components/RawItemsModal';
import { PermissionsModal } from './components/PermissionsModal';
import { PulseScreen } from './components/screens/PulseScreen';
import { ContextScreen } from './components/screens/ContextScreen';
import { AskScreen } from './components/screens/AskScreen';
import { SourcesScreen } from './components/screens/SourcesScreen';
import { PrivacyScreen } from './components/screens/PrivacyScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('pulse');
  const [workContext, setWorkContext] = useState<WorkContext>(() =>
    LocalWorkVault.getWorkContext()
  );
  const [connectors, setConnectors] = useState<ConnectorInfo[]>(() =>
    LocalWorkVault.getConnectors()
  );

  // Evidence Drawer state
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [currentEvidence, setCurrentEvidence] = useState<{
    title: string;
    conclusionText: string;
    ruleExplanation?: string;
    sourceItems: SourceItem[];
    confidence?: number;
  } | null>(null);

  // Action Approval Modal state
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    actionType: 'CREATE_TASK' | 'SET_REMINDER' | 'DRAFT_FOLLOWUP' | 'SCHEDULE_FOCUS';
    contextReason: string;
  } | null>(null);

  // Interactive Flow Modal
  const [demoFlowModalOpen, setDemoFlowModalOpen] = useState(false);

  // Raw Items Modal
  const [rawItemsModalOpen, setRawItemsModalOpen] = useState(false);
  const [inspectedSource, setInspectedSource] = useState<SourceType | null>(null);
  const [inspectedItems, setInspectedItems] = useState<SourceItem[]>([]);

  // Permissions Modal
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedConnectorForPerms, setSelectedConnectorForPerms] =
    useState<ConnectorInfo | null>(null);

  // Project navigation helper
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    'proj-client-proposal'
  );

  // Phone frame view mode for desktop preview
  const [usePhoneFrame, setUsePhoneFrame] = useState(true);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const handleOpenEvidence = (
    title: string,
    conclusionText: string,
    ruleExplanation: string,
    sourceItems: SourceItem[]
  ) => {
    setCurrentEvidence({
      title,
      conclusionText,
      ruleExplanation,
      sourceItems,
      confidence: 0.98,
    });
    setEvidenceDrawerOpen(true);
  };

  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentTab('context');
  };

  const handleSelectAction = (
    title: string,
    actionType: 'CREATE_TASK' | 'SET_REMINDER' | 'DRAFT_FOLLOWUP' | 'SCHEDULE_FOCUS',
    contextReason: string
  ) => {
    setPendingAction({ title, actionType, contextReason });
    setActionModalOpen(true);
  };

  const handleActionApproved = (details: { title: string; note: string }) => {
    setBannerNotice(`Action Approved: "${details.title}"`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleSyncAll = async () => {
    const res = await LocalWorkVault.simulateSourceSync();
    setWorkContext(res.context);
    setConnectors(LocalWorkVault.getConnectors());
  };

  const handleResetDemo = () => {
    const ctx = LocalWorkVault.resetToDemoWorkspace();
    setWorkContext(ctx);
    setConnectors(LocalWorkVault.getConnectors());
    setSelectedProjectId('proj-client-proposal');
    setBannerNotice('Demo Workspace Loaded (Client Proposal scenario active)');
    setTimeout(() => setBannerNotice(null), 3000);
  };

  const handlePurgeVault = () => {
    const ctx = LocalWorkVault.purgeVault();
    setWorkContext(ctx);
    setBannerNotice('Local Encrypted Vault Purged');
    setTimeout(() => setBannerNotice(null), 3000);
  };

  const handleInspectRaw = (source: SourceType, items: SourceItem[]) => {
    setInspectedSource(source);
    setInspectedItems(items);
    setRawItemsModalOpen(true);
  };

  const handleOpenPermissions = (connector: ConnectorInfo) => {
    setSelectedConnectorForPerms(connector);
    setPermissionsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0e1621] sm:bg-[#0c1219] flex flex-col items-center justify-start sm:py-6 sm:px-4 selection:bg-[#16B8A6]/30">
      {/* Top Hackathon Control Bar (Desktop Only) */}
      <header
        id="splicer-top-developer-bar"
        className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-3 py-2 bg-neutral-900/80 border border-neutral-800 rounded-2xl text-xs text-neutral-300 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#16B8A6] animate-pulse" />
          <span className="font-bold text-white tracking-wider">SPLICER AI ANDROID</span>
          <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono">
            v1.0-preview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-quick-load-demo"
            onClick={handleResetDemo}
            className="flex items-center gap-1 bg-[#16B8A6]/20 hover:bg-[#16B8A6]/30 text-[#16B8A6] px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors"
            title="Load the preloaded Client Proposal scenario"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Load Demo</span>
          </button>

          <button
            id="btn-interactive-demo-flow"
            onClick={() => setDemoFlowModalOpen(true)}
            className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors"
            title="View the 10-step Primary User Flow"
          >
            <Play className="w-3 h-3 text-[#16B8A6]" />
            <span>Flow</span>
          </button>

          <button
            onClick={() => setUsePhoneFrame(!usePhoneFrame)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title={usePhoneFrame ? 'Expand width' : 'Phone bezel mode'}
          >
            {usePhoneFrame ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Smartphone className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Android Phone Container */}
      <div
        id="splicer-phone-container"
        className={`w-full transition-all duration-300 flex flex-col relative bg-[#F5F7F9] overflow-hidden ${
          usePhoneFrame
            ? 'sm:max-w-[430px] sm:h-[880px] sm:rounded-[44px] sm:border-[8px] sm:border-neutral-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] sm:ring-1 sm:ring-neutral-700/50'
            : 'max-w-2xl min-h-screen sm:min-h-[900px] sm:rounded-3xl sm:border border-neutral-800'
        }`}
      >
        {/* Android Status Bar */}
        <AndroidStatusBar onDeviceAiActive={true} />

        {/* Global Action Banner Feedback */}
        {bannerNotice && (
          <div
            id="app-banner-notification"
            className="mx-4 mt-2 p-2.5 bg-[#17212B] text-white text-xs font-semibold rounded-xl flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#20B486]" />
              <span>{bannerNotice}</span>
            </div>
            <button
              onClick={() => setBannerNotice(null)}
              className="text-neutral-400 hover:text-white text-xs"
            >
              ×
            </button>
          </div>
        )}

        {/* Scrollable Screen Content Container */}
        <main
          id="splicer-screen-viewport"
          tabIndex={0}
          aria-label="Screen Viewport"
          className="flex-1 overflow-y-auto px-5 pt-2 pb-6 scroll-smooth focus:outline-none"
        >
          {currentTab === 'pulse' && (
            <PulseScreen
              workContext={workContext}
              onViewProject={handleViewProject}
              onViewContext={() => setCurrentTab('context')}
              onOpenEvidence={handleOpenEvidence}
              onSelectAction={handleSelectAction}
            />
          )}

          {currentTab === 'context' && (
            <ContextScreen
              workContext={workContext}
              initialProjectId={selectedProjectId}
              onOpenEvidence={handleOpenEvidence}
            />
          )}

          {currentTab === 'ask' && (
            <AskScreen
              workContext={workContext}
              onOpenEvidence={handleOpenEvidence}
            />
          )}

          {currentTab === 'sources' && (
            <SourcesScreen
              workContext={workContext}
              connectors={connectors}
              onSyncAll={handleSyncAll}
              onInspectRawItems={handleInspectRaw}
              onOpenPermissions={handleOpenPermissions}
            />
          )}

          {currentTab === 'privacy' && (
            <PrivacyScreen
              workContext={workContext}
              onPurgeVault={handlePurgeVault}
              onResetDemoWorkspace={handleResetDemo}
              onOpenDataFlowDemo={() => setDemoFlowModalOpen(true)}
            />
          )}
        </main>

        {/* Android Bottom Navigation */}
        <BottomNavigation
          currentTab={currentTab}
          onTabSelect={(tab) => setCurrentTab(tab)}
          pulseBadgeCount={workContext.statsSinceLastChecked.needingAttention}
        />

        {/* Android Bottom Gesture Pill Simulation */}
        <div className="w-full bg-white flex justify-center pb-2 pt-0.5 select-none">
          <div className="w-32 h-1 bg-neutral-300 rounded-full" />
        </div>
      </div>

      {/* Global Modals & Sheets */}
      <EvidenceDrawer
        isOpen={evidenceDrawerOpen}
        onClose={() => setEvidenceDrawerOpen(false)}
        evidence={currentEvidence}
        onSelectSourceItem={(item) => {
          handleInspectRaw(item.source, [item]);
          setEvidenceDrawerOpen(false);
        }}
      />

      {pendingAction && (
        <ActionApprovalModal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          actionTitle={pendingAction.title}
          actionType={pendingAction.actionType}
          contextReason={pendingAction.contextReason}
          onApprove={handleActionApproved}
        />
      )}

      <DemoFlowModal
        isOpen={demoFlowModalOpen}
        onClose={() => setDemoFlowModalOpen(false)}
        onCompleteFlow={handleResetDemo}
      />

      <RawItemsModal
        isOpen={rawItemsModalOpen}
        onClose={() => setRawItemsModalOpen(false)}
        sourceType={inspectedSource}
        items={inspectedItems}
      />

      <PermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        connector={selectedConnectorForPerms}
      />
    </div>
  );
}
