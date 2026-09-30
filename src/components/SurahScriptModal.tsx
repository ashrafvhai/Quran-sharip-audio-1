import React from 'react';
import { BookOpen, Sparkles, X } from 'lucide-react';
import { Surah } from '../types/quran';

interface SurahScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  surah: Surah | null;
}

export const SurahScriptModal: React.FC<SurahScriptModalProps> = ({
  isOpen,
  onClose,
  surah
}) => {
  if (!isOpen || !surah) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl animate-fade-in p-0 sm:p-4 select-none">
      <div className="w-full sm:max-w-md bg-[#121214] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center font-arabic font-bold text-lg text-emerald-300">
              ق
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Surah {surah.nameEnglish} ({surah.nameArabic})
              </h2>
              <p className="text-[11px] text-white/50">
                {surah.type === 'Makki' ? 'Makki' : 'Madani'} · {surah.versesCount} verses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Bismillah */}
        {surah.id !== 9 && (
          <div className="text-center py-6 border-b border-white/[0.06]">
            <p className="font-arabic text-2xl sm:text-3xl text-white font-bold leading-relaxed">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-xs text-white/50 mt-1 italic">
              "In the name of Allah, the Entirely Merciful, the Especially Merciful."
            </p>
          </div>
        )}

        {/* Surah Meaning & Details */}
        <div className="py-4 space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
              Meaning & Theme
            </span>
            <p className="text-sm text-white/90 font-medium">
              English: {surah.meaningEnglish}
            </p>
            <p className="text-sm text-white/70 mt-1">
              বাংলা: {surah.meaningBangla}
            </p>
          </div>

          {surah.fazilat && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[11px] text-amber-300 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Sparkles size={12} />
                Virtue & Significance (ফজিলত)
              </span>
              <p className="text-xs text-amber-100/90 leading-relaxed font-bangla">
                {surah.fazilat}
              </p>
            </div>
          )}

          {/* Revelation & Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-white/[0.03] text-center border border-white/[0.06]">
              <span className="text-[10px] text-white/40 block">Verses</span>
              <span className="text-sm font-bold text-white">{surah.versesCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] text-center border border-white/[0.06]">
              <span className="text-[10px] text-white/40 block">Rukus</span>
              <span className="text-sm font-bold text-white">{surah.rukuCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] text-center border border-white/[0.06]">
              <span className="text-[10px] text-white/40 block">Order</span>
              <span className="text-sm font-bold text-white">#{surah.revelationOrder}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
