import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Database,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Trash2,
  RefreshCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { WorkContext } from '../../types';

interface PrivacyScreenProps {
  workContext: WorkContext;
  onPurgeVault: () => void;
  onResetDemoWorkspace: () => void;
  onOpenDataFlowDemo: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  workContext,
  onPurgeVault,
  onResetDemoWorkspace,
  onOpenDataFlowDemo,
}) => {
  const [showKeyDetails, setShowKeyDetails] = useState(false);
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);

  return (
    <div id="screen-privacy" className="pb-10 space-y-6">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#17212B]">
              YOUR DATA
            </h1>
            <p className="text-sm text-[#68737D] mt-0.5">
              Understand exactly how SPLICER AI handles your work.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#20B486]/10 flex items-center justify-center text-[#20B486]">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Prominent Card: LOCAL INTELLIGENCE */}
      <section aria-labelledby="section-local-intelligence">
        <div
          id="card-local-intelligence-privacy"
          className="bg-[#FFFFFF] border-2 border-[#16B8A6]/40 rounded-[18px] p-5 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#20B486] animate-pulse" />
              <h2
                id="section-local-intelligence"
                className="text-base font-extrabold text-[#17212B] tracking-tight uppercase"
              >
                LOCAL INTELLIGENCE
              </h2>
            </div>
            <span className="text-xs font-bold text-[#0d9488] bg-[#16B8A6]/10 px-2.5 py-0.5 rounded-full">
              On-device AI
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 text-xs font-semibold">
            <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
              <span className="text-[#68737D]">AI Processing</span>
              <span className="text-[#0d9488] font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#16B8A6]" />
                ON DEVICE
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
              <span className="text-[#68737D]">Local Work Context</span>
              <span className="text-[#17212B] font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#4B7BEC]" />
                ENCRYPTED (AES-256)
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl">
              <span className="text-[#68737D]">Cloud AI</span>
              <span className="text-[#20B486] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#20B486]" />
                NOT REQUIRED FOR LOCAL TASKS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: DATA FLOW */}
      <section aria-labelledby="section-data-flow">
        <div className="flex items-center justify-between mb-2.5">
          <h2
            id="section-data-flow"
            className="text-xs font-bold uppercase tracking-widest text-[#68737D]"
          >
            DATA FLOW
          </h2>
          <button
            onClick={onOpenDataFlowDemo}
            className="text-[11px] font-semibold text-[#16B8A6] hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            Watch Pipeline Demo
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[18px] p-5 shadow-2xs">
          {/* Visual Data Flow Chain */}
          <div className="space-y-2 text-xs font-bold text-center">
            <div className="bg-[#F1F5F9] text-[#17212B] py-2.5 px-3 rounded-xl border border-[#CBD5E1]">
              SOURCE
            </div>

            <div className="flex justify-center text-[#94A3B8]">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="bg-[#EFF6FF] text-[#1D4ED8] py-2.5 px-3 rounded-xl border border-[#BFDBFE]">
              AUTHORIZED CONNECTOR
            </div>

            <div className="flex justify-center text-[#94A3B8]">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="bg-[#ECFDF5] text-[#065F46] py-2.5 px-3 rounded-xl border border-[#A7F3D0]">
              LOCAL WORK VAULT (AES-GCM)
            </div>

            <div className="flex justify-center text-[#94A3B8]">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="bg-[#FAF5FF] text-[#6B21A8] py-2.5 px-3 rounded-xl border border-[#E9D5FF]">
              ON-DEVICE AI (Reasoning & Graph)
            </div>

            <div className="flex justify-center text-[#94A3B8]">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="bg-[#17212B] text-white py-2.5 px-3 rounded-xl">
              ANSWER & EVIDENCE
            </div>
          </div>

          {/* Honest architectural disclosure */}
          <div className="mt-5 p-3.5 bg-[#F8FAFC] border-l-3 border-[#16B8A6] rounded-r-xl text-xs space-y-2 text-[#475569]">
            <p>
              <strong className="text-[#17212B]">Network Boundary: </strong>
              Source services may require network access for synchronization.
            </p>
            <p>
              <strong className="text-[#17212B]">Inference Boundary: </strong>
              AI reasoning can run on device when supported.
            </p>
          </div>
        </div>
      </section>

      {/* Section: PERMISSIONS */}
      <section aria-labelledby="section-permissions">
        <h2
          id="section-permissions"
          className="text-xs font-bold uppercase tracking-widest text-[#68737D] mb-2.5"
        >
          PERMISSIONS
        </h2>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-[18px] p-4 shadow-2xs divide-y divide-[#F1F5F9] text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#17212B]">Gmail</span>
            <span className="text-[#20B486] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#17212B]">Teams</span>
            <span className="text-[#20B486] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#17212B]">Calendar</span>
            <span className="text-[#20B486] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
            </span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <span className="font-semibold text-[#17212B]">Telegram</span>
            <span className="text-[#3B82F6] font-semibold">Demo mode</span>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              id="btn-manage-access"
              onClick={() => setShowKeyDetails(!showKeyDetails)}
              className="py-2 px-4 rounded-[14px] bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#17212B] transition-colors"
            >
              {showKeyDetails ? 'Hide Security Details' : 'MANAGE ACCESS'}
            </button>

            <button
              onClick={() => setPurgeConfirmOpen(true)}
              className="text-xs text-[#DC2626] font-semibold hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Purge Vault
            </button>
          </div>
        </div>

        {/* Security Details Drawer if opened */}
        {showKeyDetails && (
          <div className="mt-3 bg-[#17212B] text-neutral-200 p-4 rounded-[18px] text-xs space-y-2 font-mono">
            <div className="flex items-center gap-2 text-[#16B8A6] font-bold">
              <KeyRound className="w-4 h-4" />
              <span>Android Keystore Security Parameters</span>
            </div>
            <div>Key Alias: {workContext.vaultStatus.keystoreAlias}</div>
            <div>Cipher: {workContext.vaultStatus.encryptionAlgorithm}</div>
            <div>Encrypted Vault Size: {workContext.vaultStatus.localPayloadSizeKB} KB</div>
            <div>Hardware Backing: StrongBox / TEE Emulation Active</div>
          </div>
        )}
      </section>

      {/* Demo Reset button */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onResetDemoWorkspace}
          className="text-xs text-[#68737D] hover:text-[#17212B] flex items-center gap-1.5 font-semibold"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Workspace</span>
        </button>

        <span className="text-[11px] text-[#94A3B8]">SPLICER AI v1.0 • Local-First Architecture</span>
      </div>

      {/* Purge Confirm Dialog */}
      {purgeConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[24px] p-6 max-w-sm w-full border border-[#E2E8F0] shadow-xl">
            <h3 className="text-base font-bold text-[#DC2626] mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Purge Local Vault?
            </h3>
            <p className="text-xs text-[#68737D] mb-4 leading-relaxed">
              This will erase all normalized projects, tasks, and cached items from your local
              encrypted storage. You can restore the demo workspace anytime.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setPurgeConfirmOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-[#68737D] rounded-[12px] hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onPurgeVault();
                  setPurgeConfirmOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#DC2626] rounded-[12px] hover:bg-red-700"
              >
                Purge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
