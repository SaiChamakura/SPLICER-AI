import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  User,
  ArrowRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  CalendarClock,
  HelpCircle,
} from 'lucide-react';
import { Project, SourceItem, WorkContext } from '../../types';

interface PulseScreenProps {
  workContext: WorkContext;
  onViewProject: (projectId: string) => void;
  onViewContext: () => void;
  onOpenEvidence: (title: string, conclusion: string, rule: string, sources: SourceItem[]) => void;
  onSelectAction: (actionTitle: string, actionType: 'DRAFT_FOLLOWUP', contextReason: string) => void;
}

export const PulseScreen: React.FC<PulseScreenProps> = ({
  workContext,
  onViewProject,
  onViewContext,
  onOpenEvidence,
  onSelectAction,
}) => {
  const clientProposal = workContext.projects.find((p) => p.id === 'proj-client-proposal') || workContext.projects[0];

  const handleOpenClientProposalEvidence = () => {
    const matchingSources = workContext.sourceItems.filter(
      (s) => s.id === 'src-gmail-01' || s.id === 'src-telegram-01'
    );
    onOpenEvidence(
      'Client Proposal: At Risk State',
      'Your proposal is due Thursday and the updated pricing sheet is still pending.',
      'AT RISK because deadline is approaching (Thursday evening) AND required dependency (Rahul\'s pricing sheet) is missing.',
      matchingSources
    );
  };

  const handleOpenDecisionEvidence = () => {
    const teamsSource = workContext.sourceItems.filter((s) => s.id === 'src-teams-01');
    onOpenEvidence(
      'Recent Decision: Option B Approved',
      'Client approved Option B via Microsoft Teams channel announcement.',
      'Explicit confirmation extracted from Elena Rostova in #acme-account-team.',
      teamsSource
    );
  };

  const handleOpenNextActionEvidence = () => {
    const matchingSources = workContext.sourceItems.filter(
      (s) => s.id === 'src-telegram-01' || s.id === 'src-teams-01'
    );
    onOpenEvidence(
      'Next Action Recommendation',
      'Update the proposal after pricing arrives tonight.',
      'Option B scope already approved; awaiting pricing sheet before compiling Proposal v2.',
      matchingSources
    );
  };

  return (
    <div id="screen-pulse" className="pb-8 space-y-6">
      {/* App Header with Status */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#17212B]">
              SPLICER AI
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#16B8A6]/10 text-[#0d9488] px-2 py-0.5 rounded-full border border-[#16B8A6]/20">
              Demo Workspace
            </span>
          </div>

          {/* Small Status Badge */}
          <div
            id="header-local-intelligence-status"
            className="flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E2E8F0] px-2.5 py-1 rounded-full shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#20B486] animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-[#17212B] uppercase">
              LOCAL INTELLIGENCE ACTIVE
            </span>
          </div>
        </div>

        {/* Greeting & Subtitle */}
        <div className="mt-3">
          <h2 className="text-xl font-bold text-[#17212B]">Good morning, Alex.</h2>
          <p className="text-sm text-[#68737D] mt-0.5">Here's what changed in your work.</p>
        </div>
      </div>

      {/* Section: SINCE YOU LAST CHECKED */}
      <section aria-labelledby="section-since-last-checked">
        <h3
          id="section-since-last-checked"
          className="text-xs font-bold uppercase tracking-widest text-[#68737D] mb-2.5 flex items-center justify-between"
        >
          <span>SINCE YOU LAST CHECKED</span>
          <span className="text-[11px] font-medium text-[#16B8A6]">Local Sync</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: 3 decisions */}
          <div
            onClick={handleOpenDecisionEvidence}
            className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#16B8A6] p-3.5 rounded-[18px] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[#16B8A6] mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#16B8A6]" />
              <span className="text-[10px] text-[#68737D] font-medium group-hover:text-[#16B8A6]">
                Why?
              </span>
            </div>
            <div className="text-lg font-bold text-[#17212B]">3 decisions</div>
            <div className="text-xs text-[#68737D]">Approved or confirmed</div>
          </div>

          {/* Card 2: 2 commitments */}
          <div
            onClick={handleOpenClientProposalEvidence}
            className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#16B8A6] p-3.5 rounded-[18px] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[#4B7BEC] mb-1">
              <FileCheck2 className="w-4 h-4 text-[#4B7BEC]" />
              <span className="text-[10px] text-[#68737D] font-medium group-hover:text-[#4B7BEC]">
                Why?
              </span>
            </div>
            <div className="text-lg font-bold text-[#17212B]">2 commitments</div>
            <div className="text-xs text-[#68737D]">Pricing & deliverable</div>
          </div>

          {/* Card 3: 1 deadline change */}
          <div
            onClick={handleOpenClientProposalEvidence}
            className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#16B8A6] p-3.5 rounded-[18px] transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center justify-between text-[#E7A83B] mb-1">
              <CalendarClock className="w-4 h-4 text-[#E7A83B]" />
              <span className="text-[10px] text-[#68737D] font-medium group-hover:text-[#E7A83B]">
                Why?
              </span>
            </div>
            <div className="text-lg font-bold text-[#17212B]">1 deadline change</div>
            <div className="text-xs text-[#68737D]">Thursday evening sync</div>
          </div>

          {/* Card 4: 2 items needing attention */}
          <div
            onClick={handleOpenClientProposalEvidence}
            className="bg-[#FFFFFF] border border-[#FDE68A] hover:border-[#E7A83B] p-3.5 rounded-[18px] transition-all cursor-pointer shadow-2xs group bg-amber-50/20"
          >
            <div className="flex items-center justify-between text-[#E7A83B] mb-1">
              <AlertTriangle className="w-4 h-4 text-[#E7A83B]" />
              <span className="text-[10px] text-[#E7A83B] font-semibold">Priority</span>
            </div>
            <div className="text-lg font-bold text-[#17212B]">2 items</div>
            <div className="text-xs text-[#68737D]">Needing attention</div>
          </div>
        </div>
      </section>

      {/* Section: NEEDS ATTENTION (Large project card) */}
      <section aria-labelledby="section-needs-attention">
        <div className="flex items-center justify-between mb-2.5">
          <h3
            id="section-needs-attention"
            className="text-xs font-bold uppercase tracking-widest text-[#68737D]"
          >
            NEEDS ATTENTION
          </h3>
          <button
            onClick={handleOpenClientProposalEvidence}
            className="text-[11px] font-semibold text-[#7C5CFC] flex items-center gap-1 hover:underline"
          >
            <HelpCircle className="w-3 h-3" /> View Evidence
          </button>
        </div>

        {clientProposal && (
          <div
            id="card-client-proposal-large"
            className="bg-[#FFFFFF] border-2 border-[#E7A83B]/60 rounded-[18px] p-5 shadow-xs relative overflow-hidden"
          >
            {/* Top Row: Title & Status */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#68737D]">
                  PROJECT
                </span>
                <h4 className="text-lg font-bold text-[#17212B] tracking-tight">
                  {clientProposal.title.toUpperCase()}
                </h4>
              </div>

              {/* Status Badge */}
              <span
                id="badge-client-proposal-status"
                className="bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] px-2.5 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#E7A83B]" />
                AT RISK
              </span>
            </div>

            {/* Context Explanation */}
            <p className="text-sm font-medium text-[#17212B] mt-3 leading-relaxed">
              "{clientProposal.statusDetail}"
            </p>

            {/* Detail Indicators */}
            <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-[#17212B]">
                <Clock className="w-4 h-4 text-[#E7A83B]" />
                <div>
                  <span className="text-[#68737D] block text-[10px] uppercase font-semibold">
                    Deadline
                  </span>
                  <span className="font-semibold">Due Thursday</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#17212B]">
                <User className="w-4 h-4 text-[#4B7BEC]" />
                <div>
                  <span className="text-[#68737D] block text-[10px] uppercase font-semibold">
                    Blocker
                  </span>
                  <span className="font-semibold">Waiting on Rahul</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="mt-4 flex items-center gap-2">
              <button
                id="btn-view-project"
                onClick={() => onViewProject(clientProposal.id)}
                className="flex-1 py-2.5 px-4 bg-[#17212B] hover:bg-black text-white text-xs font-bold rounded-[14px] transition-all flex items-center justify-center gap-1.5"
              >
                <span>VIEW PROJECT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-why-project-at-risk"
                onClick={handleOpenClientProposalEvidence}
                className="py-2.5 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#17212B] text-xs font-semibold rounded-[14px] transition-colors"
                title="Explain with source evidence"
              >
                WHY?
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Section: RECENT DECISION */}
      <section aria-labelledby="section-recent-decision">
        <h3
          id="section-recent-decision"
          className="text-xs font-bold uppercase tracking-widest text-[#68737D] mb-2.5"
        >
          RECENT DECISION
        </h3>

        <div
          id="card-recent-decision"
          onClick={handleOpenDecisionEvidence}
          className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#16B8A6] p-4 rounded-[18px] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-bold text-[#17212B]">"Client approved Option B."</p>
            <span className="text-[10px] font-semibold text-[#16B8A6] group-hover:underline">
              Inspect
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-[#68737D]">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#4B7BEC]/10 flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-[#4B7BEC]" />
              </div>
              <span className="font-semibold text-[#17212B]">Microsoft Teams</span>
              <span>• 8:42 PM</span>
            </div>
            <span className="text-[11px] text-[#68737D]">Elena Rostova</span>
          </div>
        </div>
      </section>

      {/* Section: NEXT ACTION */}
      <section aria-labelledby="section-next-action">
        <h3
          id="section-next-action"
          className="text-xs font-bold uppercase tracking-widest text-[#68737D] mb-2.5"
        >
          NEXT ACTION
        </h3>

        <div
          id="card-next-action"
          className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-[18px] shadow-2xs"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-[#17212B]">
              "Update the proposal after pricing arrives."
            </p>
            <span className="text-[10px] font-bold text-[#16B8A6] bg-[#16B8A6]/10 px-2 py-0.5 rounded-full">
              Recommended
            </span>
          </div>

          <p className="text-xs text-[#68737D] mt-1.5">
            Dependent on Rahul's tier-2 pricing sheet delivery tonight.
          </p>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              id="btn-view-context"
              onClick={onViewContext}
              className="py-2 px-3.5 bg-[#16B8A6] hover:bg-[#14a393] text-white text-xs font-bold rounded-[14px] transition-colors"
            >
              VIEW CONTEXT
            </button>
            <button
              id="btn-draft-action"
              onClick={() =>
                onSelectAction(
                  'Update proposal after pricing arrives',
                  'DRAFT_FOLLOWUP',
                  'Option B scope already approved. Prepare draft Proposal v2 once Rahul sends the sheet tonight.'
                )
              }
              className="py-2 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#17212B] text-xs font-semibold rounded-[14px] transition-colors"
            >
              Prepare Action
            </button>
            <button
              onClick={handleOpenNextActionEvidence}
              className="text-xs text-[#7C5CFC] font-semibold hover:underline ml-auto"
            >
              Why this?
            </button>
          </div>
        </div>
      </section>

      {/* Section: LOCAL AI */}
      <div
        id="section-local-ai-indicator"
        className="pt-2 flex items-center justify-between text-xs text-[#68737D] border-t border-[#E2E8F0]"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
          <span className="text-[12px] font-medium text-[#17212B]">Analyzed on device</span>
          <span className="text-[10px] text-[#68737D]">(Hardware/Local Model)</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#16B8A6] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16B8A6]" />
          <span>Local Vault Encrypted</span>
        </div>
      </div>
    </div>
  );
};
