import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, CheckCircle2, Lock } from 'lucide-react';
import { ConnectorInfo } from '../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connector: ConnectorInfo | null;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  connector,
}) => {
  if (!isOpen || !connector) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-sm bg-[#FFFFFF] rounded-[24px] shadow-2xl p-6 border border-[#E2E8F0] z-10 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#16B8A6]/10 text-[#16B8A6] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17212B]">{connector.name} Permissions</h3>
                <span className="text-[11px] text-[#68737D]">Least-Privilege Authorization</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#68737D]">
              <span>Status</span>
              <span className="font-bold text-[#20B486] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
              </span>
            </div>
            <div className="flex items-center justify-between text-[#68737D]">
              <span>Grant Type</span>
              <span className="font-medium text-[#17212B]">
                {connector.isRealOAuthSupported ? 'Scoped User OAuth 2.0 (PKCE)' : 'Demo Sandbox'}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0] text-[#475569]">
              <strong className="text-[#17212B]">Permitted Scope:</strong> {connector.permissionScope}
            </div>
          </div>

          <div className="text-[11px] text-[#68737D] bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
            Tokens and encryption keys are held exclusively inside Android Keystore. SPLICER AI can only
            read specified work threads.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-[12px] bg-[#17212B] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
