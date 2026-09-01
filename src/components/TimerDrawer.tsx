import React, { useState } from 'react';
import {
  X,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Bell,
  Clock,
  Sparkles,
  CheckCircle,
  Timer as TimerIcon,
  Flame,
} from 'lucide-react';
import { ActiveTimer, PresetTimer } from '../types';
import { PRESET_TIMERS } from '../data/initialRecipes';

interface TimerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  timers: ActiveTimer[];
  onToggleTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
  onAddSeconds: (id: string, seconds: number) => void;
  onCreateTimer: (name: string, totalSeconds: number, recipeId?: string, stepNumber?: number) => void;
}

export const TimerDrawer: React.FC<TimerDrawerProps> = ({
  isOpen,
  onClose,
  timers,
  onToggleTimer,
  onResetTimer,
  onDeleteTimer,
  onAddSeconds,
  onCreateTimer,
}) => {
  const [customName, setCustomName] = useState('');
  const [customMinutes, setCustomMinutes] = useState(5);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSecs = Number(customMinutes) * 60 + Number(customSeconds);
    if (totalSecs <= 0) return;

    onCreateTimer(customName.trim() || `計時器 ${customMinutes}分${customSeconds ? `${customSeconds}秒` : ''}`, totalSecs);
    setCustomName('');
    setCustomMinutes(5);
    setCustomSeconds(0);
    setShowCustomForm(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-stone-900 text-stone-100 h-full shadow-2xl flex flex-col border-l border-stone-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <TimerIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">烹飪計時管理</h2>
              <p className="text-xs text-stone-400">支援多組獨立計時與廚房常用預設</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Active Timers List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                執行中計時器 ({timers.length})
              </span>
              <button
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>自訂新計時</span>
              </button>
            </div>

            {/* Custom Timer Input Form */}
            {showCustomForm && (
              <form
                onSubmit={handleCreateCustom}
                className="p-4 rounded-2xl bg-stone-800/90 border border-amber-500/40 space-y-3 mb-4"
              >
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="計時器名稱 (如：煎牛排、煮水餃)"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 flex items-center gap-1 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-700">
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Math.max(0, Number(e.target.value)))}
                      className="w-12 bg-transparent text-white font-bold text-center focus:outline-none"
                    />
                    <span className="text-stone-400">分鐘</span>
                  </div>

                  <div className="flex-1 flex items-center gap-1 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-700">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customSeconds}
                      onChange={(e) => setCustomSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
                      className="w-12 bg-transparent text-white font-bold text-center focus:outline-none"
                    />
                    <span className="text-stone-400">秒鐘</span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                  >
                    開始
                  </button>
                </div>
              </form>
            )}

            {/* List of active timers */}
            {timers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-stone-950/40 border border-stone-800/80">
                <Clock className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-300">目前沒有進行中的計時</p>
                <p className="text-xs text-stone-500 mt-1">
                  可從下方快速選擇廚房常用預設，或在食譜步驟中直接啟動。
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {timers.map((timer) => {
                  const percent = Math.max(
                    0,
                    Math.min(100, (timer.remainingSeconds / timer.totalSeconds) * 100)
                  );
                  const isFinished = timer.remainingSeconds === 0;

                  return (
                    <div
                      key={timer.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isFinished
                          ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-900/20'
                          : timer.isRunning
                          ? 'bg-stone-800/90 border-amber-500/50 shadow-md shadow-amber-950/20'
                          : 'bg-stone-800/50 border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="min-w-0 flex-1 mr-2">
                          <h4 className="font-bold text-sm text-stone-100 truncate">
                            {timer.name}
                          </h4>
                          {timer.recipeTitle && (
                            <p className="text-[11px] text-stone-400 truncate">
                              食譜：{timer.recipeTitle}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onAddSeconds(timer.id, 60)}
                            className="px-2 py-1 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300 text-[11px] font-semibold"
                            title="延長 1 分鐘"
                          >
                            +1 分
                          </button>
                          <button
                            onClick={() => onDeleteTimer(timer.id)}
                            className="p-1 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-700"
                            title="刪除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Remaining Time & Progress */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`font-mono text-2xl font-bold ${
                            isFinished
                              ? 'text-rose-400 animate-pulse'
                              : timer.isRunning
                              ? 'text-amber-400'
                              : 'text-stone-300'
                          }`}
                        >
                          {isFinished ? '時間到！' : formatTime(timer.remainingSeconds)}
                        </div>

                        <div className="flex items-center gap-2">
                          {!isFinished && (
                            <button
                              onClick={() => onToggleTimer(timer.id)}
                              className={`p-2 rounded-xl text-stone-950 font-bold transition-transform active:scale-95 ${
                                timer.isRunning
                                  ? 'bg-amber-500 hover:bg-amber-400'
                                  : 'bg-emerald-500 hover:bg-emerald-400'
                              }`}
                            >
                              {timer.isRunning ? (
                                <Pause className="w-4 h-4 fill-stone-950" />
                              ) : (
                                <Play className="w-4 h-4 fill-stone-950" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => onResetTimer(timer.id)}
                            className="p-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-300 transition-colors"
                            title="重設"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-stone-700/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isFinished
                              ? 'bg-rose-500'
                              : timer.isRunning
                              ? 'bg-amber-400'
                              : 'bg-stone-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Presets Grid */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3">
              廚房常用快選預設
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_TIMERS.map((preset, idx) => {
                const totalSecs = preset.minutes * 60 + preset.seconds;
                return (
                  <button
                    key={idx}
                    onClick={() => onCreateTimer(preset.name, totalSecs)}
                    className="p-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 hover:border-amber-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-stone-200 group-hover:text-amber-400 transition-colors">
                        {preset.name}
                      </span>
                      <Flame className="w-3 h-3 text-amber-500 opacity-60 group-hover:opacity-100" />
                    </div>
                    <div className="text-xs font-mono font-semibold text-amber-400/90 mb-1">
                      {preset.minutes} 分 {preset.seconds ? `${preset.seconds} 秒` : ''}
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1 leading-tight">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
