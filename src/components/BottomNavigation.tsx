import React from 'react';
import { Activity, Network, HelpCircle, Layers, Shield } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavigationProps {
  currentTab: NavTab;
  onTabSelect: (tab: NavTab) => void;
  pulseBadgeCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabSelect,
  pulseBadgeCount = 2,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'pulse', label: 'PULSE', icon: Activity },
    { id: 'context', label: 'CONTEXT', icon: Network },
    { id: 'ask', label: 'ASK', icon: HelpCircle },
    { id: 'sources', label: 'SOURCES', icon: Layers },
    { id: 'privacy', label: 'PRIVACY', icon: Shield },
  ];

  return (
    <nav
      id="splicer-bottom-nav"
      aria-label="Android Bottom Navigation"
      className="w-full bg-[#FFFFFF] border-t border-[#E2E8F0] px-2 py-1.5 flex items-center justify-around z-30 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabSelect(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative rounded-xl transition-all duration-150 active:scale-95 focus:outline-none"
          >
            {/* Active Pill Indicator (Android Material You style) */}
            <div
              className={`flex items-center justify-center w-14 h-7 rounded-full transition-all duration-200 relative ${
                isActive
                  ? 'bg-[#16B8A6]/15 text-[#0d9488]'
                  : 'text-[#68737D] hover:text-[#17212B]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              {tab.id === 'pulse' && pulseBadgeCount > 0 && (
                <span
                  id="pulse-notification-dot"
                  className="absolute top-1 right-3 w-2 h-2 bg-[#E05C6F] rounded-full ring-2 ring-white"
                />
              )}
            </div>

            {/* Tab Label */}
            <span
              className={`text-[11px] font-semibold mt-1 tracking-wider uppercase ${
                isActive ? 'text-[#0d9488] font-bold' : 'text-[#68737D]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
