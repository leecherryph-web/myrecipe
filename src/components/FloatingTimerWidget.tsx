import React from 'react';
import { Timer, Bell, Play, Pause, X } from 'lucide-react';
import { ActiveTimer } from '../types';

interface FloatingTimerWidgetProps {
  timers: ActiveTimer[];
  onOpenDrawer: () => void;
  onDismissFinished: () => void;
}

export const FloatingTimerWidget: React.FC<FloatingTimerWidgetProps> = ({
  timers,
  onOpenDrawer,
  onDismissFinished,
}) => {
  if (timers.length === 0) return null;

  const runningTimers = timers.filter((t) => t.isRunning);
  const finishedTimers = timers.filter((t) => t.remainingSeconds === 0);

  // Find shortest remaining time
  const shortestTimer = [...timers].sort(
    (a, b) => a.remainingSeconds - b.remainingSeconds
  )[0];

  const formatShort = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 no-print">
      {/* Finished Alert Banner if any */}
      {finishedTimers.length > 0 && (
        <div
          onClick={onOpenDrawer}
          className="cursor-pointer bg-rose-600 text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-rose-900/30 flex items-center gap-3 border border-rose-400 animate-bounce"
        >
          <Bell className="w-5 h-5 animate-spin" />
          <div>
            <div className="font-bold text-xs">烹飪計時時間到！</div>
            <div className="text-[11px] opacity-90">{finishedTimers[0].name}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismissFinished();
            }}
            className="p-1 hover:bg-rose-700 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Pill */}
      <button
        id="floating-active-timers-pill"
        onClick={onOpenDrawer}
        className="bg-stone-900/95 hover:bg-stone-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-stone-700/80 backdrop-blur-md flex items-center gap-3 transition-transform active:scale-95 group"
      >
        <div className="relative">
          <Timer
            className={`w-4 h-4 text-amber-400 ${
              runningTimers.length > 0 ? 'animate-pulse' : ''
            }`}
          />
          {timers.length > 1 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
              {timers.length}
            </span>
          )}
        </div>

        <div className="text-left">
          <div className="text-[11px] text-stone-400 font-medium leading-none">
            {shortestTimer.name}
          </div>
          <div className="font-mono font-bold text-sm text-amber-400 leading-tight">
            {shortestTimer.remainingSeconds === 0
              ? '已結束'
              : formatShort(shortestTimer.remainingSeconds)}
          </div>
        </div>

        <span className="text-xs text-stone-400 group-hover:text-stone-200">
          展開
        </span>
      </button>
    </div>
  );
};
