import React from 'react';
import { Download, Sparkles, UserCheck } from 'lucide-react';
import { Qari } from '../types/quran';

interface NavbarProps {
  currentQari: Qari;
  onOpenQariModal: () => void;
  onOpenThemeModal: () => void;
  onOpenOfflineModal: () => void;
  offlineCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentQari,
  onOpenQariModal,
  onOpenThemeModal,
  onOpenOfflineModal,
  offlineCount
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-emerald-900/30 bg-slate-950/75 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-slate-950 font-arabic font-bold text-xl select-none">
            ۞
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-emerald-100 flex items-center gap-1.5 font-bangla">
              নূরানী কুরআন
              <span className="text-xs font-normal text-emerald-400/90 font-mono tracking-normal">
                ১১৪ সূরা
              </span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Contextual Quick Buttons */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={onOpenQariModal}
            className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="truncate max-w-[180px]">ক্বারী: {currentQari.nameBangla}</span>
          </button>

          <button
            onClick={onOpenThemeModal}
            className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ব্যাকগ্রাউন্ড থিম</span>
          </button>

          <button
            onClick={onOpenOfflineModal}
            className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>অফলাইন তিলাওয়াত</span>
            {offlineCount > 0 && (
              <span className="text-xs font-mono bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                {offlineCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Mobile + Desktop) */}
        <div className="flex items-center gap-2">
          {/* Quick Qari Switcher Button */}
          <button
            onClick={onOpenQariModal}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-200 hover:bg-emerald-900/70 hover:border-emerald-500/60 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
            title="ক্বারী পরিবর্তন করুন"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ক্বারী:</span>
            <span className="truncate max-w-[100px] sm:max-w-[130px]">
              {currentQari.nameBangla.replace('শাইখ ', '').replace('ক্বারী ', '')}
            </span>
          </button>

          {/* Quick Theme Switcher */}
          <button
            onClick={onOpenThemeModal}
            className="p-2 text-slate-300 hover:text-amber-300 rounded-lg bg-slate-900/60 border border-slate-700/50 hover:border-amber-500/40 transition-colors cursor-pointer"
            title="ভিডিও ও ব্যাকগ্রাউন্ড পরিবর্তন"
            aria-label="ব্যাকগ্রাউন্ড সেটিংস"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          {/* Offline Manager Button */}
          <button
            onClick={onOpenOfflineModal}
            className="p-2 text-slate-300 hover:text-teal-300 rounded-lg bg-slate-900/60 border border-slate-700/50 hover:border-teal-500/40 transition-colors relative cursor-pointer"
            title="অফলাইন ডাউনলোড সমূহ"
            aria-label="অফলাইন ডাউনলোড"
          >
            <Download className="w-4 h-4 text-teal-400" />
            {offlineCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {offlineCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
