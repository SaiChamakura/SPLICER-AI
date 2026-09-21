import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  ShieldCheck,
  Search,
  ExternalLink,
  Bot,
  Zap,
} from 'lucide-react';
import { AnswerWithEvidence, SourceItem, SourceType, WorkContext } from '../../types';
import { getActiveAIEngine } from '../../services/aiEngine';

interface AskScreenProps {
  workContext: WorkContext;
  onOpenEvidence: (title: string, conclusion: string, rule: string, sources: SourceItem[]) => void;
}

export const AskScreen: React.FC<AskScreenProps> = ({ workContext, onOpenEvidence }) => {
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAnswer, setActiveAnswer] = useState<AnswerWithEvidence | null>({
    id: 'ans-default-demo',
    question: 'Why is the proposal at risk?',
    title: 'PROPOSAL STATUS',
    answer:
      'The proposal is due Thursday, but the updated pricing sheet has not arrived yet. The client has already approved Option B.',
    evidenceItems: [
      {
        sourceType: 'gmail',
        sourceName: 'Gmail',
        snippet: 'Proposal due Thursday',
        sender: 'Sarah Chen',
        timestamp: 'Yesterday, 4:15 PM',
        sourceItemId: 'src-gmail-01',
      },
      {
        sourceType: 'teams',
        sourceName: 'Microsoft Teams',
        snippet: 'Option B approved',
        sender: 'Elena Rostova',
        timestamp: 'Today, 8:42 PM',
        sourceItemId: 'src-teams-01',
      },
      {
        sourceType: 'telegram',
        sourceName: 'Telegram',
        snippet: 'Pricing sheet promised',
        sender: 'Rahul Sharma',
        timestamp: 'Today, 9:13 PM',
        sourceItemId: 'src-telegram-01',
      },
    ],
    localAiEngine: 'Local On-Device Engine (Encrypted Vault)',
    latencyMs: 98,
    confidence: 0.99,
  });

  const suggestionChips = [
    'WHAT CHANGED TODAY?',
    'WHAT AM I WAITING FOR?',
    'WHAT IS BLOCKING THE PROPOSAL?',
    'WHAT DID THE CLIENT DECIDE?',
    'WHAT SHOULD I DO NEXT?',
    'Why is the proposal at risk?',
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsProcessing(true);
    setQueryInput(questionText);

    try {
      const engine = getActiveAIEngine();
      const answer = await engine.askQuestion(questionText, workContext);
      setActiveAnswer(answer);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

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
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  const handleInspectSpecificEvidence = (sourceItemId: string, snippet: string) => {
    const matched = workContext.sourceItems.filter((s) => s.id === sourceItemId);
    onOpenEvidence(
      `Evidence: ${snippet}`,
      snippet,
      'Authorized ground truth retrieved from local vault',
      matched.length > 0 ? matched : workContext.sourceItems.slice(0, 1)
    );
  };

  return (
    <div id="screen-ask" className="pb-10 space-y-5">
      {/* Title & Subtitle */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-extrabold tracking-tight text-[#17212B]">
            ASK YOUR WORK
          </h1>
          <div className="flex items-center gap-1.5 bg-[#7C5CFC]/10 text-[#7C5CFC] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <Zap className="w-3 h-3" />
            <span>LOCAL AI</span>
          </div>
        </div>
        <p className="text-sm text-[#68737D] mt-0.5">
          Ask questions about your connected work.
        </p>
      </div>

      {/* Suggestion Chips */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#68737D] block mb-2">
          SUGGESTED WORK QUERIES
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              id={`btn-chip-${idx}`}
              onClick={() => handleAsk(chip)}
              className="text-[11px] font-bold uppercase tracking-wider bg-[#FFFFFF] hover:bg-[#16B8A6]/10 text-[#475569] hover:text-[#0d9488] border border-[#E2E8F0] hover:border-[#16B8A6] px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Query Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(queryInput);
        }}
        className="relative"
      >
        <div className="relative flex items-center bg-[#FFFFFF] border-2 border-[#CBD5E1] focus-within:border-[#16B8A6] rounded-[18px] shadow-xs px-4 py-2.5 transition-all">
          <Search className="w-4 h-4 text-[#68737D] mr-2.5 shrink-0" />
          <input
            id="input-ask-work"
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Ask about your work..."
            className="w-full bg-transparent text-sm font-medium text-[#17212B] placeholder:text-[#94A3B8] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isProcessing || !queryInput.trim()}
            className="ml-2 p-2 rounded-xl bg-[#16B8A6] hover:bg-[#14a393] disabled:opacity-40 text-white transition-all active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Loading state */}
      {isProcessing && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[18px] p-6 text-center shadow-xs">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#16B8A6] border-t-transparent mb-2" />
          <div className="text-xs font-semibold text-[#17212B]">
            Querying local encrypted work vault...
          </div>
          <div className="text-[11px] text-[#68737D] mt-0.5">
            Evaluating entity relationships on device (0 network calls)
          </div>
        </div>
      )}

      {/* Grounded Answer Card */}
      {!isProcessing && activeAnswer && (
        <div
          id="card-ai-answer"
          className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[18px] p-5 shadow-xs space-y-4"
        >
          {/* Answer Top Bar */}
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7C5CFC] bg-[#7C5CFC]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                LOCAL AI
              </span>
              <span className="text-[11px] text-[#68737D] font-mono">
                {activeAnswer.latencyMs}ms on-device
              </span>
            </div>

            <span className="text-[11px] font-semibold text-[#20B486] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Grounded
            </span>
          </div>

          {/* Answer Title & Body */}
          <div>
            <h2 className="text-sm font-extrabold tracking-wider uppercase text-[#17212B] mb-2">
              {activeAnswer.title}
            </h2>
            <p className="text-sm font-medium text-[#17212B] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl">
              "{activeAnswer.answer}"
            </p>
          </div>

          {/* EVIDENCE SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#68737D]">
                EVIDENCE
              </h3>
              <span className="text-[11px] text-[#68737D]">Tap to inspect source</span>
            </div>

            <div className="space-y-2">
              {activeAnswer.evidenceItems.map((evidence, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    handleInspectSpecificEvidence(evidence.sourceItemId, evidence.snippet)
                  }
                  className="p-3 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#16B8A6] rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-[#F1F5F9]">
                      {getSourceIcon(evidence.sourceType)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#17212B] block">
                        {evidence.sourceName}
                      </span>
                      <span className="text-xs text-[#68737D] italic group-hover:text-[#17212B]">
                        "{evidence.snippet}"
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#16B8A6]">
                    <span>Why?</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Footnote */}
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#68737D]">
            <span>Model: {activeAnswer.localAiEngine}</span>
            <span className="font-semibold text-[#16B8A6]">Encrypted Local Cache</span>
          </div>
        </div>
      )}
    </div>
  );
};
