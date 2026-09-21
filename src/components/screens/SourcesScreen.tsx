import React, { useState } from 'react';
import {
  Layers,
  Mail,
  MessageSquare,
  Send,
  Calendar,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
  ExternalLink,
  Lock,
  Eye,
} from 'lucide-react';
import { ConnectorInfo, ConnectorStatus, SourceItem, SourceType, WorkContext } from '../../types';

interface SourcesScreenProps {
  workContext: WorkContext;
  connectors: ConnectorInfo[];
  onSyncAll: () => Promise<void>;
  onInspectRawItems: (source: SourceType, items: SourceItem[]) => void;
  onOpenPermissions: (connector: ConnectorInfo) => void;
}

export const SourcesScreen: React.FC<SourcesScreenProps> = ({
  workContext,
  connectors,
  onSyncAll,
  onInspectRawItems,
  onOpenPermissions,
}) => {
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const getSourceIcon = (source: SourceType) => {
    switch (source) {
      case 'gmail':
        return <Mail className="w-5 h-5 text-[#EA4335]" />;
      case 'teams':
        return <MessageSquare className="w-5 h-5 text-[#4B7BEC]" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-[#229ED9]" />;
      case 'calendar':
        return <Calendar className="w-5 h-5 text-[#34A853]" />;
      case 'document':
        return <FileText className="w-5 h-5 text-[#68737D]" />;
      default:
        return <FileText className="w-5 h-5 text-neutral-500" />;
    }
  };

  const getStatusBadge = (status: ConnectorStatus) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20B486]" />
            CONNECTED
          </span>
        );
      case 'DEMO_MODE':
        return (
          <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            DEMO MODE
          </span>
        );
      case 'SYNCING':
        return (
          <span className="bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            SYNCING
          </span>
        );
      case 'NOT_CONNECTED':
        return (
          <span className="bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5">
            NOT CONNECTED
          </span>
        );
      case 'ERROR':
        return (
          <span className="bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3" />
            ERROR
          </span>
        );
      default:
        return null;
    }
  };

  const handleRunSync = async () => {
    setIsSyncingAll(true);
    setSyncFeedback('Normalizing source data into local vault...');
    try {
      await onSyncAll();
      setSyncFeedback('All connectors normalized & indexed locally.');
      setTimeout(() => setSyncFeedback(null), 3500);
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div id="screen-sources" className="pb-10 space-y-6">
      {/* Title & Subtitle */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#17212B]">
              CONNECTED SOURCES
            </h1>
            <p className="text-sm text-[#68737D] mt-0.5">
              Choose what SPLICER AI can understand.
            </p>
          </div>
          <button
            onClick={handleRunSync}
            disabled={isSyncingAll}
            className="flex items-center gap-1.5 py-2 px-3.5 bg-[#FFFFFF] border border-[#CBD5E1] hover:border-[#16B8A6] rounded-[14px] text-xs font-bold text-[#17212B] transition-all shadow-2xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#16B8A6] ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Syncing...' : 'Sync All'}</span>
          </button>
        </div>

        {syncFeedback && (
          <div className="mt-3 p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs font-semibold text-[#065F46] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#20B486]" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* Security note */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[18px] flex items-start gap-3 text-xs text-[#68737D]">
        <Shield className="w-5 h-5 text-[#16B8A6] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#17212B] block">
            Least-Privilege Normalization Architecture
          </span>
          Connectors only pull permitted work data and immediately normalize it into the canonical
          local schema. Telegram is explicitly tagged <strong className="text-[#1D4ED8]">DEMO MODE</strong> as
          production TDLib/Bot bridges are plug-and-play.
        </div>
      </div>

      {/* Source Cards List */}
      <div className="space-y-3.5">
        {connectors.map((connector) => {
          const itemsFromSource = workContext.sourceItems.filter(
            (s) => s.source === connector.id
          );

          return (
            <div
              key={connector.id}
              id={`card-connector-${connector.id}`}
              className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[18px] p-4 shadow-2xs transition-all"
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                    {getSourceIcon(connector.id)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#17212B] flex items-center gap-2">
                      {connector.name}
                      {connector.status === 'DEMO_MODE' && (
                        <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                          Demo Connector
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-[#68737D]">
                      Last sync: <strong className="text-[#17212B]">{connector.lastSync}</strong>
                    </span>
                  </div>
                </div>

                {getStatusBadge(connector.status)}
              </div>

              {/* Permission / Scope info */}
              <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] text-xs space-y-1">
                <div className="flex items-center justify-between text-[#68737D]">
                  <span>Scope: {connector.permissionScope}</span>
                  <span className="font-semibold text-[#17212B]">
                    {itemsFromSource.length} items cached
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">{connector.notes}</p>
              </div>

              {/* Actions Footer */}
              <div className="mt-3.5 pt-2 flex items-center justify-between">
                <button
                  onClick={() => onInspectRawItems(connector.id, itemsFromSource)}
                  className="text-xs font-semibold text-[#16B8A6] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Normalized Data ({itemsFromSource.length})</span>
                </button>

                <button
                  onClick={() => onOpenPermissions(connector)}
                  className="py-1.5 px-3 rounded-[12px] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[11px] font-bold text-[#17212B] transition-colors"
                >
                  Permissions
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
