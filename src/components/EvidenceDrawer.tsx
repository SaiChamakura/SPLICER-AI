import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, MessageSquare, Send, Calendar, FileText, CheckCircle2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { SourceItem, SourceType } from '../types';

interface EvidenceItemPayload {
  title: string;
  conclusionText: string;
  ruleExplanation?: string;
  sourceItems: SourceItem[];
  confidence?: number;
}

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceItemPayload | null;
  onSelectSourceItem?: (item: SourceItem) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  evidence,
  onSelectSourceItem,
}) => {
  if (!evidence) return null;

  const getSourceIcon = (source: SourceType) => {
    switch (source) {
      case 'gmail':
        return <Mail className="w-4 h-4 text-[#EA4335]" />;
      case 'teams':
        return <MessageSquare className="w-4 h-4 text-[#4B7BEC]" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-[#229ED9]" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-[#34A853]" />;
      case 'document':
        return <FileText className="w-4 h-4 text-[#68737D]" />;
      default:
        return <FileText className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getSourceBadgeLabel = (source: SourceType) => {
    switch (source) {
      case 'gmail':
        return 'Gmail';
      case 'teams':
        return 'Microsoft Teams';
      case 'telegram':
        return 'Telegram (Demo Connector)';
      case 'calendar':
        return 'Calendar';
      case 'document':
        return 'Local Document';
      default:
        return 'Source';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Bottom Sheet */}
          <motion.div
            id="splicer-evidence-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-lg bg-[#FFFFFF] rounded-t-[28px] shadow-2xl border-t border-neutral-100 flex flex-col max-h-[85vh] z-10 overflow-hidden"
          >
            {/* Sheet Handle */}
            <div className="pt-3 pb-1 flex justify-center items-center">
              <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-3 border-b border-[#F1F5F9] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest text-[#7C5CFC] uppercase bg-[#7C5CFC]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    WHY? SOURCE EVIDENCE
                  </span>
                  {evidence.confidence && (
                    <span className="text-[11px] font-medium text-[#20B486] bg-[#20B486]/10 px-2 py-0.5 rounded-full">
                      {Math.round(evidence.confidence * 100)}% Confidence
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#17212B] mt-1 tracking-tight">
                  {evidence.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                id="btn-close-evidence-drawer"
                className="p-1.5 rounded-full bg-[#F5F7F9] text-[#68737D] hover:text-[#17212B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scroll */}
            <div className="px-6 py-4 overflow-y-auto space-y-4">
              {/* Conclusion summary box */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-[18px]">
                <div className="text-xs font-semibold text-[#68737D] uppercase tracking-wider mb-1">
                  AI Grounded Conclusion
                </div>
                <p className="text-sm font-semibold text-[#17212B] leading-relaxed">
                  "{evidence.conclusionText}"
                </p>
                {evidence.ruleExplanation && (
                  <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-start gap-2 text-xs text-[#68737D]">
                    <CheckCircle2 className="w-4 h-4 text-[#16B8A6] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#17212B] font-semibold">Deterministic Rule: </strong>
                      {evidence.ruleExplanation}
                    </span>
                  </div>
                )}
              </div>

              {/* Source Evidence Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#68737D]">
                    Grounded In {evidence.sourceItems.length} Authorized Source{evidence.sourceItems.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-[11px] text-[#16B8A6] font-semibold flex items-center gap-1">
                    On-Device Vault
                  </span>
                </div>

                <div className="space-y-3">
                  {evidence.sourceItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      id={`evidence-source-card-${item.id}`}
                      className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#16B8A6]/60 transition-all rounded-[18px] p-3.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#F1F5F9]">
                            {getSourceIcon(item.source)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#17212B]">
                              {getSourceBadgeLabel(item.source)}
                            </span>
                            <span className="text-[11px] text-[#68737D] ml-2">
                              {item.timestamp}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold bg-[#F5F7F9] text-[#68737D] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                          Normalized
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#17212B] mb-1">
                        From: <span className="font-normal text-[#475569]">{item.sender.name}</span>
                        {item.sender.emailOrHandle && (
                          <span className="text-[11px] text-[#68737D] ml-1">
                            ({item.sender.emailOrHandle})
                          </span>
                        )}
                      </div>

                      {/* Quoted Snippet */}
                      <div className="bg-[#F8FAFC] border-l-3 border-[#16B8A6] p-2.5 rounded-r-lg my-2 text-xs text-[#17212B] italic leading-relaxed">
                        "{item.content}"
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#68737D] pt-1">
                        <span>Message ID: {item.sourceMessageId}</span>
                        {onSelectSourceItem && (
                          <button
                            onClick={() => onSelectSourceItem(item)}
                            className="text-[#16B8A6] font-semibold hover:underline flex items-center gap-0.5"
                          >
                            Inspect raw <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-3.5 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
              <span className="text-[11px] text-[#68737D] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#16B8A6]" />
                Zero cloud transmission during inference
              </span>
              <button
                onClick={onClose}
                id="btn-done-evidence"
                className="px-4 py-2 bg-[#17212B] hover:bg-black text-white text-xs font-semibold rounded-[14px] transition-colors"
              >
                Close Evidence
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
