import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Timer as TimerIcon,
  Sun,
  Lightbulb,
  CheckCircle,
  Utensils,
  Check,
} from 'lucide-react';
import { Recipe } from '../types';
import { audioService } from '../services/audioService';

interface CookingModeModalProps {
  recipe: Recipe;
  servings: number;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  servings,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showIngredientsDrawer, setShowIngredientsDrawer] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockObj, setWakeLockObj] = useState<unknown>(null);

  const baseServings = recipe.servings || 1;
  const multiplier = servings / baseServings;
  const currentStep = recipe.steps[currentStepIndex] || recipe.steps[0];
  const stepTotalSecs =
    (currentStep?.timerMinutes || 0) * 60 + (currentStep?.timerSeconds || 0);

  // Step-specific timer state
  const [timerRemaining, setTimerRemaining] = useState<number>(stepTotalSecs);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Reset timer when step changes
  useEffect(() => {
    const secs = (currentStep?.timerMinutes || 0) * 60 + (currentStep?.timerSeconds || 0);
    setTimerRemaining(secs);
    setTimerRunning(false);
  }, [currentStepIndex, currentStep]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            audioService.playTimerDoneChime();
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerRemaining]);

  // Request Wake Lock to keep screen awake while cooking
  useEffect(() => {
    let released = false;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const wl = await navigator.wakeLock.request('screen');
          if (!released) {
            setWakeLockObj(wl);
            setWakeLockActive(true);
            wl.addEventListener('release', () => {
              setWakeLockActive(false);
            });
          }
        }
      } catch {
        // WakeLock unsupported or denied
      }
    };
    requestWakeLock();

    return () => {
      released = true;
      if (wakeLockObj && typeof (wakeLockObj as { release?: () => void }).release === 'function') {
        (wakeLockObj as { release: () => void }).release();
      }
    };
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentStepIndex < recipe.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, recipe.steps.length, onClose]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentStepIndex + 1) / recipe.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-stone-800 bg-stone-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            title="退出烹飪模式"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-white truncate max-w-[200px] sm:max-w-md">
              {recipe.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>{servings} 人份</span>
              <span>•</span>
              <span className="text-amber-400">
                步驟 {currentStepIndex + 1} / {recipe.steps.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {wakeLockActive && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700 text-xs font-medium">
              <Sun className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>螢幕常亮已開啟</span>
            </div>
          )}

          <button
            onClick={() => setShowIngredientsDrawer(!showIngredientsDrawer)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showIngredientsDrawer
                ? 'bg-amber-500 text-stone-950 border-amber-400'
                : 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{showIngredientsDrawer ? '隱藏食材' : '查看食材'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-stone-800">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Step Center Stage */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-8 flex flex-col justify-between max-w-4xl mx-auto w-full">
        <div className="space-y-6 my-auto">
          {/* Step Tag */}
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-sm font-bold tracking-wide">
              STEP {currentStepIndex + 1}
            </span>
            {currentStep?.title && (
              <h3 className="text-xl sm:text-2xl font-bold text-stone-200">
                {currentStep.title}
              </h3>
            )}
          </div>

          {/* Big Readable Instruction */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-relaxed tracking-tight py-2">
            {currentStep?.instruction}
          </div>

          {/* Step Photo in Cooking Mode */}
          {currentStep?.image && (
            <div className="my-3 max-w-xl mx-auto rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
              <img
                src={currentStep.image}
                alt={currentStep.title || `步驟 ${currentStepIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full max-h-72 sm:max-h-84 object-contain mx-auto"
              />
            </div>
          )}

          {/* Tip Note if any */}
          {currentStep?.tip && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-stone-900 border border-amber-500/30 text-amber-200/90 text-base leading-relaxed">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">主廚叮嚀：</span>
                {currentStep.tip}
              </div>
            </div>
          )}

          {/* Integrated Step Timer */}
          {stepTotalSecs > 0 && (
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <TimerIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-stone-400 font-semibold mb-0.5">
                    步驟專屬烹飪計時
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-400">
                    {formatTimer(timerRemaining)}
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base shadow-lg transition-transform active:scale-95 ${
                    timerRunning
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
                  }`}
                >
                  {timerRunning ? (
                    <>
                      <Pause className="w-5 h-5 fill-stone-950" />
                      <span>暫停</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-stone-950" />
                      <span>{timerRemaining === 0 ? '重新計時' : '開始計時'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setTimerRemaining((s) => s + 60)}
                  className="px-3.5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-sm border border-stone-700 transition-colors"
                  title="延長 1 分鐘"
                >
                  +1 分
                </button>

                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerRemaining(stepTotalSecs);
                  }}
                  className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700 transition-colors"
                  title="重設計時器"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-8 border-t border-stone-800 mt-6">
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 sm:px-8 py-3.5 rounded-2xl font-bold text-base bg-stone-800 hover:bg-stone-700 text-white disabled:opacity-30 disabled:cursor-not-allowed border border-stone-700 transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>上一步</span>
          </button>

          {currentStepIndex < recipe.steps.length - 1 ? (
            <button
              onClick={() => setCurrentStepIndex((prev) => prev + 1)}
              className="flex items-center gap-2 px-6 sm:px-10 py-3.5 rounded-2xl font-bold text-base bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>下一步</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 sm:px-10 py-3.5 rounded-2xl font-bold text-base bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <CheckCircle className="w-5 h-5" />
              <span>完成料理！</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Side Ingredient Drawer */}
      {showIngredientsDrawer && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-stone-900 border-l border-stone-800 shadow-2xl p-6 overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              <span>食材清單 ({servings}人份)</span>
            </h3>
            <button
              onClick={() => setShowIngredientsDrawer(false)}
              className="p-2 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recipe.ingredients.map((ing) => {
              let amtStr = '';
              if (typeof ing.amount === 'number') {
                const scaled = ing.amount * multiplier;
                const formatted = Number.isInteger(scaled)
                  ? scaled.toString()
                  : (Math.round(scaled * 10) / 10).toString();
                amtStr = `${formatted} ${ing.unit}`;
              } else {
                amtStr = `${ing.amount || ''} ${ing.unit}`;
              }

              return (
                <div
                  key={ing.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-stone-800/80 border border-stone-700/60"
                >
                  <span className="text-sm font-medium text-stone-200">{ing.name}</span>
                  <span className="text-sm font-bold text-amber-400">{amtStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
