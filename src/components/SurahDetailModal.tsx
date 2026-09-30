import React from 'react';
import { BookOpen, CheckCircle2, Download, Info, Play, Sparkles, X } from 'lucide-react';
import { Qari, Surah } from '../types/quran';

interface SurahDetailModalProps {
  surah: Surah | null;
  onClose: () => void;
  onPlay: (surah: Surah) => void;
  isCurrent: boolean;
  isPlaying: boolean;
  isDownloaded: boolean;
  onDownload: (surah: Surah) => void;
  currentQari: Qari;
}

export const SurahDetailModal: React.FC<SurahDetailModalProps> = ({
  surah,
  onClose,
  onPlay,
  isCurrent,
  isPlaying,
  isDownloaded,
  onDownload,
  currentQari
}) => {
  if (!surah) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900/95 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold">
              {surah.id}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 font-bangla">
                সূরা {surah.nameBangla}
              </h2>
              <p className="text-xs text-slate-400">
                {surah.nameEnglish} · {surah.meaningBangla}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Arabic Center Banner */}
        <div className="my-5 p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-slate-900/60 border border-emerald-800/30 text-center">
          <span className="font-arabic text-4xl sm:text-5xl font-bold text-emerald-300 drop-shadow-md select-none block mb-2">
            {surah.nameArabic}
          </span>
          <span className="text-xs text-emerald-400/90 font-mono tracking-wide">
            পবিত্র কুরআনের {surah.id} নং সূরা
          </span>
        </div>

        {/* Statistical Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">মোট আয়াত</span>
            <span className="text-base font-bold text-slate-100 font-mono">
              {surah.versesCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">নাজিল স্থান</span>
            <span className="text-base font-bold text-emerald-400">
              {surah.type === 'Makki' ? 'মাক্কী' : 'মাদানী'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">মোট রুকু</span>
            <span className="text-base font-bold text-slate-100 font-mono">
              {surah.rukuCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">নাজিল ক্রম</span>
            <span className="text-base font-bold text-slate-100 font-mono">
              {surah.revelationOrder}
            </span>
          </div>
        </div>

        {/* Fazilat & Meaning Section */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              সূরার বাংলা অর্থ ও তাৎপর্য
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-bangla">
              {surah.nameBangla} শব্দের অর্থ "{surah.meaningBangla}"। এটি পবিত্র কুরআনের {surah.type === 'Makki' ? 'মাক্কী যুগে' : 'মাদানী যুগে'} অবতীর্ণ অন্যতম গুরুত্বপূর্ণ ও বরকতময় সূরা।
            </p>
          </div>

          {surah.fazilat && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                ফজিলত ও বিশেষ মর্যাদা
              </h4>
              <p className="text-sm text-amber-100/90 leading-relaxed font-bangla">
                {surah.fazilat}
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => onDownload(surah)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
              isDownloaded
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {isDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>অফলাইনে আছে</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>অফলাইনে সংরক্ষণ</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onPlay(surah);
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isCurrent && isPlaying ? 'তিলাওয়াত শুনছেন' : `শুনুন (${currentQari.nameBangla})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
