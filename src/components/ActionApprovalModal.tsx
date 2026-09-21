import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertCircle, X, Check, ArrowRight } from 'lucide-react';

interface ActionApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle: string;
  actionType: 'CREATE_TASK' | 'SET_REMINDER' | 'DRAFT_FOLLOWUP' | 'SCHEDULE_FOCUS';
  contextReason: string;
  onApprove: (actionDetails: { title: string; note: string }) => void;
}

export const ActionApprovalModal: React.FC<ActionApprovalModalProps> = ({
  isOpen,
  onClose,
  actionTitle,
  actionType,
  contextReason,
  onApprove,
}) => {
  const [approvedState, setApprovedState] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setApprovedState(true);
    setTimeout(() => {
      onApprove({
        title: actionTitle,
        note: contextReason,
      });
      setApprovedState(false);
      onClose();
    }, 600);
  };

  const getActionHeading = () => {
    switch (actionType) {
      case 'DRAFT_FOLLOWUP':
        return 'Draft Work Follow-up';
      case 'CREATE_TASK':
        return 'Create Local Task';
      case 'SET_REMINDER':
        return 'Set Device Reminder';
      case 'SCHEDULE_FOCUS':
        return 'Schedule Calendar Focus Block';
      default:
        return 'Recommended Action';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-[#FFFFFF] rounded-[24px] shadow-2xl p-6 border border-[#E2E8F0] z-10"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#16B8A6]/10 flex items-center justify-center text-[#16B8A6]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16B8A6]">
                  User Confirmation Required
                </span>
                <h3 className="text-base font-bold text-[#17212B]">{getActionHeading()}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[18px] p-4 mb-4">
            <div className="text-xs font-bold text-[#68737D] uppercase tracking-wider mb-1">
              Proposed Action
            </div>
            <p className="text-sm font-semibold text-[#17212B] mb-2">{actionTitle}</p>
            <div className="text-xs text-[#68737D] border-t border-[#E2E8F0] pt-2">
              <span className="font-semibold text-[#17212B]">Context Justification: </span>
              {contextReason}
            </div>
          </div>

          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 mb-5 flex items-start gap-2.5 text-xs text-[#92400E]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
            <p>
              <strong>Security Guarantee:</strong> SPLICER AI never silently sends messages, edits
              calendars, or mutates external workspaces without your explicit permission.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              id="btn-cancel-action"
              className="flex-1 py-3 px-4 rounded-[14px] border border-[#CBD5E1] text-[#68737D] hover:bg-neutral-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              id="btn-confirm-action"
              disabled={approvedState}
              className={`flex-1 py-3 px-4 rounded-[14px] text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 ${
                approvedState
                  ? 'bg-[#20B486]'
                  : 'bg-[#16B8A6] hover:bg-[#14a393] active:scale-[0.98]'
              }`}
            >
              {approvedState ? (
                <>
                  <Check className="w-4 h-4" /> Approved
                </>
              ) : (
                <>
                  Approve Action <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
