import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading weather data">
      {/* Hero Skeleton */}
      <div className="h-72 sm:h-80 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-800 rounded-xl" />
            <div className="h-4 w-32 bg-slate-800/60 rounded-lg" />
          </div>
          <div className="h-10 w-10 bg-slate-800 rounded-2xl" />
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-baseline gap-4">
            <div className="h-20 w-36 bg-slate-800 rounded-2xl" />
            <div className="h-6 w-24 bg-slate-800/60 rounded-lg" />
          </div>
          <div className="h-14 w-32 bg-slate-800 rounded-xl" />
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-800/60">
          <div className="h-10 bg-slate-800/40 rounded-xl" />
          <div className="h-10 bg-slate-800/40 rounded-xl" />
          <div className="h-10 bg-slate-800/40 rounded-xl" />
          <div className="h-10 bg-slate-800/40 rounded-xl" />
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="h-44 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center pb-2">
          <div className="h-5 w-40 bg-slate-800 rounded-lg" />
          <div className="h-8 w-28 bg-slate-800 rounded-xl" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 w-20 bg-slate-800/40 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-96 rounded-3xl bg-slate-900/80 border border-slate-800 p-6" />
        <div className="lg:col-span-4 h-96 rounded-3xl bg-slate-900/80 border border-slate-800 p-6" />
      </div>
    </div>
  );
};
