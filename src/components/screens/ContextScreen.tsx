import React, { useState } from 'react';
import {
  Layers,
  ArrowLeft,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  Sparkles,
  GitFork,
  Check,
} from 'lucide-react';
import { Project, SourceItem, SourceType, WorkContext } from '../../types';

interface ContextScreenProps {
  workContext: WorkContext;
  initialProjectId?: string;
  onOpenEvidence: (title: string, conclusion: string, rule: string, sources: SourceItem[]) => void;
}

export const ContextScreen: React.FC<ContextScreenProps> = ({
  workContext,
  initialProjectId = 'proj-client-proposal',
  onOpenEvidence,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState<string | null>(null);

  const selectedProject =
    workContext.projects.find((p) => p.id === selectedProjectId) || workContext.projects[0];

  const getSourceIcon = (source: SourceType) => {
    switch (source) {
      case 'gmail':
        return <Mail className="w-3.5 h-3.5 text-[#EA4335]" />;
      case 'teams':
        return <MessageSquare className="w-3.5 h-3.5 text-[#4B7BEC]" />;
      case 'telegram':
        return <Send className="w-3.5 h-3.5 text-[#229ED9]" />;
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5 text-[#34A853]" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-[#68737D]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'AT_RISK':
        return (
          <span className="bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E7A83B]" />
            AT RISK
          </span>
        );
      case 'NEEDS_ATTENTION':
        return (
          <span className="bg-[#FFF7ED] border border-[#FFEDD5] text-[#C2410C] px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
            NEEDS ATTENTION
          </span>
        );
      case 'ON_TRACK':
        return (
          <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#20B486]" />
            ON TRACK
          </span>
        );
      default:
        return null;
    }
  };

  const handleInspectConclusion = (conclusion: string, rule: string, sourceIds: string[]) => {
    const matchedSources = workContext.sourceItems.filter((s) => sourceIds.includes(s.id));
    onOpenEvidence(
      `Evidence: ${conclusion}`,
      conclusion,
      rule,
      matchedSources.length > 0 ? matchedSources : workContext.sourceItems.slice(0, 2)
    );
  };

  return (
    <div id="screen-context" className="pb-10 space-y-6">
      {/* Screen Title */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#17212B]">
              CONTEXT
            </h1>
            <p className="text-sm text-[#68737D] mt-0.5">See how your work connects.</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#7C5CFC] bg-[#7C5CFC]/10 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>Relational Graph</span>
          </div>
        </div>

        {/* Project Selector Chips */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {workContext.projects.map((project) => {
            const isSelected = project.id === selectedProjectId;
            return (
              <button
                key={project.id}
                id={`btn-select-proj-${project.id}`}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setSelectedGraphNodeId(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#17212B] text-white border-[#17212B] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#68737D] hover:text-[#17212B] border-[#E2E8F0]'
                }`}
              >
                <span>{project.title}</span>
                {project.status === 'AT_RISK' && (
                  <span className="w-2 h-2 rounded-full bg-[#E7A83B]" />
                )}
                {project.status === 'ON_TRACK' && (
                  <span className="w-2 h-2 rounded-full bg-[#20B486]" />
                )}
                {project.status === 'NEEDS_ATTENTION' && (
                  <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedProject && (
        <div className="space-y-5">
          {/* Project Detail Card */}
          <div
            id="context-project-detail-header"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[18px] p-5 shadow-2xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#68737D]">
                  ACTIVE PROJECT DETAIL
                </span>
                <h2 className="text-xl font-extrabold text-[#17212B] tracking-tight mt-0.5">
                  {selectedProject.title.toUpperCase()}
                </h2>
              </div>
              {getStatusBadge(selectedProject.status)}
            </div>

            {/* Sub-sections: STATE, DECISIONS, TASKS, WAITING, PEOPLE, TIMELINE */}
            <div className="mt-5 divide-y divide-[#F1F5F9] space-y-3.5">
              {/* STATE */}
              <div className="pt-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#68737D] block mb-1">
                  STATE
                </span>
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold text-[#17212B] leading-snug">
                    "{selectedProject.statusDetail}"
                  </p>
                  <button
                    onClick={() =>
                      handleInspectConclusion(
                        selectedProject.statusDetail,
                        selectedProject.stateExplanation.rule,
                        selectedProject.stateExplanation.evidenceIds
                      )
                    }
                    className="text-xs text-[#7C5CFC] font-semibold hover:underline shrink-0 ml-2"
                  >
                    Why?
                  </button>
                </div>
              </div>

              {/* DECISIONS */}
              <div className="pt-3.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#68737D] block mb-1">
                  DECISIONS
                </span>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-[#4B7BEC]/10 flex items-center justify-center">
                      {getSourceIcon(selectedProject.decision.sourceType)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#17212B]">
                        "{selectedProject.decision.title}"
                      </span>
                      <span className="text-[11px] text-[#68737D] block">
                        Logged by {selectedProject.decision.decider} • {selectedProject.decision.timestamp}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleInspectConclusion(
                        selectedProject.decision.title,
                        'Explicit approval logged in authorized work channel',
                        [selectedProject.decision.sourceItemId]
                      )
                    }
                    className="text-[11px] text-[#16B8A6] font-semibold hover:underline"
                  >
                    Source
                  </button>
                </div>
              </div>

              {/* TASKS */}
              <div className="pt-3.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#68737D] block mb-1">
                  TASKS
                </span>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#17212B]">
                      "{selectedProject.userTask.title}"
                    </span>
                    <span className="text-[11px] text-[#68737D] block">
                      Assignee: {selectedProject.userTask.assignee} • Due {selectedProject.userTask.deadline}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#E2E8F0] text-[#475569] px-2 py-0.5 rounded-md">
                    {selectedProject.userTask.status}
                  </span>
                </div>
              </div>

              {/* WAITING */}
              <div className="pt-3.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#68737D] block mb-1">
                  WAITING
                </span>
                <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl flex items-center justify-between text-xs text-[#92400E]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D97706]" />
                    <span>
                      <strong className="font-bold">"{selectedProject.waitingOn.person}</strong> —{' '}
                      {selectedProject.waitingOn.item}"
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleInspectConclusion(
                        `Waiting on ${selectedProject.waitingOn.person} for ${selectedProject.waitingOn.item}`,
                        'Unfulfilled promise blocking project finalization',
                        [selectedProject.waitingOn.sourceItemId]
                      )
                    }
                    className="text-[11px] font-bold text-[#B45309] hover:underline"
                  >
                    Evidence
                  </button>
                </div>
              </div>

              {/* PEOPLE */}
              <div className="pt-3.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#68737D] block mb-1.5">
                  PEOPLE
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedProject.people.map((person) => (
                    <div
                      key={person.id}
                      className="bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1 rounded-full text-xs flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#16B8A6]" />
                      <span className="font-semibold text-[#17212B]">{person.name}</span>
                      <span className="text-[11px] text-[#68737D]">({person.role})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIMELINE */}
              <div className="pt-3.5">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#68737D] block mb-2">
                  TIMELINE
                </span>
                <div className="space-y-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
                  {selectedProject.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative pl-5">
                      <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full bg-[#16B8A6] ring-2 ring-white" />
                      <div className="flex-1 bg-[#FFFFFF] border border-[#E2E8F0] p-2.5 rounded-xl text-xs">
                        <div className="flex items-center justify-between text-[#68737D] mb-0.5">
                          <span className="font-bold text-[#17212B] text-[11px]">
                            {step.timeLabel}
                          </span>
                          <span className="flex items-center gap-1 text-[10px]">
                            {getSourceIcon(step.sourceType)}
                            {step.sourceType.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-[#17212B] font-medium">{step.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section: EVIDENCE GRAPH */}
          <div
            id="section-evidence-graph"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[18px] p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C5CFC]">
                  GROUNDED EXPLANABILITY
                </span>
                <h3 className="text-base font-bold text-[#17212B]">EVIDENCE GRAPH</h3>
              </div>
              <span className="text-xs text-[#68737D] flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-[#16B8A6]" />
                Interactive Links
              </span>
            </div>

            <p className="text-xs text-[#68737D] mb-4">
              Visually connect each conclusion to its original authorized source. Tap any node to
              inspect:
            </p>

            {/* Visual Graph Layout */}
            <div className="space-y-4 bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[16px]">
              {/* Branch 1: AT RISK -> Gmail + Telegram */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      setSelectedGraphNodeId('node-conclusion-at-risk');
                      handleInspectConclusion(
                        'AT RISK',
                        'Deadline is approaching (Thursday) and required information (Pricing sheet) is missing.',
                        ['src-gmail-01', 'src-telegram-01']
                      );
                    }}
                    className={`cursor-pointer px-3.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-2xs ${
                      selectedGraphNodeId === 'node-conclusion-at-risk'
                        ? 'bg-[#E7A83B] text-white border-[#E7A83B] scale-105'
                        : 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] hover:border-[#E7A83B]'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>"AT RISK"</span>
                  </div>
                  <span className="text-xs text-[#68737D] font-medium">connected to:</span>
                </div>

                {/* Indented source leaves */}
                <div className="ml-6 space-y-1.5 border-l-2 border-[#CBD5E1] pl-3">
                  <div
                    onClick={() => {
                      setSelectedGraphNodeId('node-src-gmail-deadline');
                      handleInspectConclusion(
                        'Thursday Proposal Deadline',
                        'Received via Gmail thread',
                        ['src-gmail-01']
                      );
                    }}
                    className={`cursor-pointer p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      selectedGraphNodeId === 'node-src-gmail-deadline'
                        ? 'bg-[#16B8A6]/15 border-[#16B8A6] font-bold text-[#17212B]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:border-[#16B8A6]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                      <span>Gmail → Thursday deadline</span>
                    </div>
                    <span className="text-[10px] text-[#16B8A6] font-semibold">Inspect</span>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedGraphNodeId('node-src-tg-pricing');
                      handleInspectConclusion(
                        'Pricing Sheet Pending',
                        'Promised tonight via Telegram',
                        ['src-telegram-01']
                      );
                    }}
                    className={`cursor-pointer p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      selectedGraphNodeId === 'node-src-tg-pricing'
                        ? 'bg-[#16B8A6]/15 border-[#16B8A6] font-bold text-[#17212B]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:border-[#16B8A6]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-[#229ED9]" />
                      <span>Telegram → Pricing pending</span>
                    </div>
                    <span className="text-[10px] text-[#16B8A6] font-semibold">Inspect</span>
                  </div>
                </div>
              </div>

              {/* Branch 2: OPTION B APPROVED -> Teams */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      setSelectedGraphNodeId('node-conclusion-option-b');
                      handleInspectConclusion(
                        'OPTION B APPROVED',
                        'Client approved Option B in Teams channel',
                        ['src-teams-01']
                      );
                    }}
                    className={`cursor-pointer px-3.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-2xs ${
                      selectedGraphNodeId === 'node-conclusion-option-b'
                        ? 'bg-[#20B486] text-white border-[#20B486] scale-105'
                        : 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] hover:border-[#20B486]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>"OPTION B APPROVED"</span>
                  </div>
                  <span className="text-xs text-[#68737D] font-medium">connected to:</span>
                </div>

                {/* Indented source leaf */}
                <div className="ml-6 space-y-1.5 border-l-2 border-[#CBD5E1] pl-3">
                  <div
                    onClick={() => {
                      setSelectedGraphNodeId('node-src-teams-approval');
                      handleInspectConclusion(
                        'Option B Approval Message',
                        'Sent by Elena Rostova',
                        ['src-teams-01']
                      );
                    }}
                    className={`cursor-pointer p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      selectedGraphNodeId === 'node-src-teams-approval'
                        ? 'bg-[#16B8A6]/15 border-[#16B8A6] font-bold text-[#17212B]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:border-[#16B8A6]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-[#4B7BEC]" />
                      <span>Teams → approval message</span>
                    </div>
                    <span className="text-[10px] text-[#16B8A6] font-semibold">Inspect</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
