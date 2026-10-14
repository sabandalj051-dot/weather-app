import React from 'react';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 text-slate-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-semibold text-slate-300">
            Atmosphere Weather · Open Meteorological Platform
          </div>
          <p className="text-slate-400">
            High-precision forecasts, WMO condition mapping, and global telemetry. No tracking or cookies.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-sky-400 transition-colors"
          >
            <span>Powered by Open-Meteo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <span className="text-slate-700">·</span>

          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Data (CC BY 4.0)</span>
          </span>

          <span className="text-slate-700">·</span>

          <span>WMO 0–99 Compliant</span>
        </div>
      </div>
    </footer>
  );
};
