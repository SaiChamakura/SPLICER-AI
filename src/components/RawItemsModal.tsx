import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code, Copy, Check, FileText } from 'lucide-react';
import { SourceItem, SourceType } from '../types';

interface RawItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: SourceType | null;
  items: SourceItem[];
}

export const RawItemsModal: React.FC<RawItemsModalProps> = ({
  isOpen,
  onClose,
  sourceType,
  items,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen || !sourceType) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#FFFFFF] rounded-[24px] shadow-2xl p-6 border border-[#E2E8F0] z-10 flex flex-col max-h-[85vh]"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#16B8A6]/10 text-[#16B8A6]">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17212B]">
                  Normalized <span className="uppercase">{sourceType}</span> Items
                </h3>
                <span className="text-[11px] text-[#68737D]">
                  Unified SourceItem Schema in Local Vault
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-3 overflow-y-auto space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#68737D]">
                No items cached for this source.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-3.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#16B8A6]">{item.id}</span>
                    <button
                      onClick={() => handleCopy(item.id, JSON.stringify(item, null, 2))}
                      className="text-[11px] text-[#68737D] hover:text-[#17212B] flex items-center gap-1 font-sans"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#20B486]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy JSON
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1 text-[#334155]">
                    <div>
                      <span className="text-[#94A3B8]">Sender:</span> {item.sender.name} ({item.sender.emailOrHandle})
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Title:</span> {item.title}
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Timestamp:</span> {item.timestamp}
                    </div>
                    <div className="bg-[#FFFFFF] p-2 rounded border border-[#E2E8F0] mt-1 text-[#0F172A]">
                      "{item.content}"
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-[#F1F5F9] flex justify-end">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-[#17212B] hover:bg-black text-white text-xs font-bold rounded-[12px]"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
