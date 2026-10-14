import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div
      role="alert"
      className="bg-amber-950/80 border-b border-amber-600/30 text-amber-200 px-4 py-2 text-xs font-medium text-center flex items-center justify-center gap-2 backdrop-blur-md"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
      <span>
        You are currently offline. Showing cached weather readings. Reconnect to internet for real-time telemetry.
      </span>
    </div>
  );
};
