import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ArrowRight,
  Layers,
  RefreshCw,
  Cpu,
  Database,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  X,
  Play,
} from 'lucide-react';

interface DemoFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteFlow: () => void;
}

const FLOW_STEPS = [
  { id: 1, title: 'CONNECT SOURCES', desc: 'Gmail, Teams, Telegram (Demo), Calendar, Documents', icon: Layers },
  { id: 2, title: 'SYNC DEMO DATA', desc: 'Pull permitted messages & calendar events', icon: RefreshCw },
  { id: 3, title: 'NORMALIZE INFORMATION', desc: 'Map heterogeneous items into canonical SourceItem schema', icon: Database },
  { id: 4, title: 'LOCAL AI ANALYSIS', desc: 'Extract entities, cross-reference threads on device', icon: Cpu },
  { id: 5, title: 'BUILD WORK CONTEXT', desc: 'Create relational graph of projects, people, & tasks', icon: Layers },
  { id: 6, title: 'IDENTIFY PROJECT STATE', desc: 'Deterministic rule: deadline approaching + missing pricing', icon: AlertTriangle },
  { id: 7, title: 'SHOW WHAT CHANGED', desc: '3 decisions, 2 commitments, Option B approved', icon: FileCheck },
  { id: 8, title: 'SHOW BLOCKERS', desc: 'Waiting on Rahul for updated pricing sheet', icon: AlertTriangle },
  { id: 9, title: 'SHOW NEXT ACTION', desc: 'Update proposal once pricing arrives tonight', icon: ArrowRight },
  { id: 10, title: 'SHOW SOURCE EVIDENCE', desc: 'Every deduction traceable to original message', icon: ShieldCheck },
];

export const DemoFlowModal: React.FC<DemoFlowModalProps> = ({
  isOpen,
  onClose,
  onCompleteFlow,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
      setIsPlaying(true);
      return;
    }

    if (!isPlaying) return;

    if (activeStep < FLOW_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isPlaying, activeStep]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Dialog container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          className="relative w-full max-w-lg bg-[#FFFFFF] rounded-[24px] shadow-2xl overflow-hidden border border-[#E2E8F0] z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#16B8A6] uppercase bg-[#16B8A6]/10 px-2 py-0.5 rounded-full">
                  PRIMARY USER FLOW DEMO
                </span>
                <span className="text-[10px] font-semibold text-[#68737D]">
                  Step {activeStep + 1} of {FLOW_STEPS.length}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#17212B] mt-1">
                How SPLICER AI Processes Your Work
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Flow View */}
          <div className="px-6 py-4 overflow-y-auto space-y-2">
            {FLOW_STEPS.map((step, idx) => {
              const isPast = idx < activeStep;
              const isCurrent = idx === activeStep;
              const StepIcon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 border ${
                    isCurrent
                      ? 'bg-[#16B8A6]/8 border-[#16B8A6] shadow-xs'
                      : isPast
                      ? 'bg-[#FFFFFF] border-[#E2E8F0] opacity-85'
                      : 'bg-neutral-50/50 border-transparent opacity-40'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-[#20B486] text-white'
                        : isCurrent
                        ? 'bg-[#16B8A6] text-white animate-pulse'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold tracking-tight ${
                          isCurrent ? 'text-[#0d9488]' : 'text-[#17212B]'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68737D] mt-0.5 leading-snug">{step.desc}</p>
                  </div>

                  <StepIcon
                    className={`w-4 h-4 mt-1 shrink-0 ${
                      isCurrent ? 'text-[#16B8A6]' : 'text-neutral-400'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#F1F5F9] flex items-center justify-between">
            <button
              onClick={() => {
                setActiveStep(0);
                setIsPlaying(true);
              }}
              className="text-xs font-semibold text-[#68737D] hover:text-[#17212B] flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Replay Flow
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onCompleteFlow();
                  onClose();
                }}
                className="py-2 px-4 rounded-[14px] bg-[#16B8A6] hover:bg-[#14a393] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Apply to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
