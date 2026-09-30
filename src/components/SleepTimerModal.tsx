import React from 'react';
import { Clock, Moon, X } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimerMinutes: number | null;
  remainingSeconds: number | null;
  onSetTimer: (minutes: number | null) => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  currentTimerMinutes,
  remainingSeconds,
  onSetTimer
}) => {
  if (!isOpen) return null;

  const timerOptions = [
    { label: '১৫ মিনিট', minutes: 15 },
    { label: '৩০ মিনিট', minutes: 30 },
    { label: '৪৫ মিনিট', minutes: 45 },
    { label: '৬০ মিনিট (১ ঘণ্টা)', minutes: 60 },
    { label: 'সূরা শেষে বন্ধ', minutes: -1 } // -1 indicates end of surah
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900/95 border border-emerald-800/40 rounded-3xl p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-bangla">
                স্লিপ টাইমার (Sleep Timer)
              </h2>
              <p className="text-[11px] text-slate-400">
                ঘুমানোর সময় স্বয়ংক্রিয়ভাবে অডিও বন্ধ করার সময় নির্ধারণ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Timer Status */}
        {remainingSeconds !== null && (
          <div className="my-4 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
            <span className="text-xs text-amber-300 font-medium block">
              বাকি আছে:
            </span>
            <span className="text-2xl font-bold font-mono text-amber-200">
              {Math.floor(remainingSeconds / 60)}:
              {(remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Options */}
        <div className="space-y-2 my-4">
          {timerOptions.map((opt) => {
            const isSelected = currentTimerMinutes === opt.minutes;
            return (
              <button
                key={opt.minutes}
                onClick={() => {
                  onSetTimer(opt.minutes);
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-950/60 border-amber-500/60 text-amber-200 shadow-sm'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}

          {currentTimerMinutes !== null && (
            <button
              onClick={() => {
                onSetTimer(null);
                onClose();
              }}
              className="w-full text-center px-4 py-2.5 rounded-xl border border-rose-900/40 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer mt-2"
            >
              টাইমার বন্ধ করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
