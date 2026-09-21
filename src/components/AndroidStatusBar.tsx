import React, { useEffect, useState } from 'react';
import { Wifi, Battery, ShieldCheck } from 'lucide-react';

interface AndroidStatusBarProps {
  onDeviceAiActive?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ onDeviceAiActive = true }) => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12;
      const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      setTimeStr(`${hours}:${minStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full bg-[#F5F7F9] text-[#17212B] px-5 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-30"
    >
      <div className="flex items-center gap-1.5">
        <span className="tracking-tight text-[13px]">{timeStr}</span>
        {onDeviceAiActive && (
          <span
            id="status-bar-ai-pill"
            className="flex items-center gap-1 bg-[#16B8A6]/10 text-[#0d9488] px-1.5 py-0.5 rounded-full text-[10px] font-medium tracking-tight ml-1"
            title="Local On-Device Intelligence Active"
          >
            <ShieldCheck className="w-2.5 h-2.5 text-[#16B8A6]" />
            <span>LOCAL</span>
          </span>
        )}
      </div>

      {/* Center Camera Punch-hole Simulation for Android feel */}
      <div className="w-3.5 h-3.5 bg-neutral-900 rounded-full mx-auto hidden sm:block border border-neutral-700/40 opacity-70" />

      <div className="flex items-center gap-2 text-neutral-600">
        <span className="text-[10px] font-bold text-neutral-500 tracking-wider">5G</span>
        <Wifi className="w-3.5 h-3.5 text-neutral-700" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 text-neutral-700" />
          <span className="text-[10px] font-medium text-neutral-600">89%</span>
        </div>
      </div>
    </div>
  );
};
