import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  Download,
  Loader2,
  MoreVertical,
  Pause,
  Play,
  Share2,
  Shuffle,
  Volume2
} from 'lucide-react';
import { SURAHS } from '../data/surahs';
import { Qari, Surah } from '../types/quran';

interface ReciterDetailViewProps {
  qari: Qari;
  onBack: () => void;
  currentSurah: Surah | null;
  isPlaying: boolean;
  onPlaySurah: (surah: Surah) => void;
  onShufflePlay: () => void;
  isDownloaded: (surahId: number) => boolean;
  isDownloading: (surahId: number) => boolean;
  downloadProgress?: (surahId: number) => number | undefined;
  onToggleDownload: (surah: Surah) => void;
  onDownloadAll: () => void;
  onOpenSurahDetails: (surah: Surah) => void;
}

export const ReciterDetailView: React.FC<ReciterDetailViewProps> = ({
  qari,
  onBack,
  currentSurah,
  isPlaying,
  onPlaySurah,
  onShufflePlay,
  isDownloaded,
  isDownloading,
  downloadProgress,
  onToggleDownload,
  onDownloadAll,
  onOpenSurahDetails
}) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-36 animate-fade-in select-none">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-30 bg-black/70 backdrop-blur-xl border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-sm font-semibold text-white/90 truncate max-w-[200px] font-bangla">
          {qari.nameBangla}
        </span>

        <div className="w-9" />
      </div>

      <div className="max-w-md mx-auto px-4 pt-3">
        {/* Hero Section with Avatar & Information */}
        <div className="flex flex-col items-center text-center pt-2 pb-5">
          {/* Circular Reciter Portrait */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-2xl mb-4 bg-white/5">
            {qari.avatarUrl ? (
              <img
                src={qari.avatarUrl}
                alt={qari.nameEnglish}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-4xl text-white bg-gradient-to-tr from-emerald-800 to-teal-900">
                {qari.nameEnglish.charAt(0)}
              </div>
            )}
          </div>

          {/* Name & Arabic title */}
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1 font-bangla">
            {qari.nameBangla}
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-white/60 mb-2">
            <span>{qari.flag}</span>
            <span>{qari.countryBangla}</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono text-[11px]">{qari.nameEnglish}</span>
          </div>

          {/* Bio with ...More toggle */}
          <p className="text-xs text-white/60 max-w-sm leading-relaxed mb-5 px-2 font-bangla">
            {isBioExpanded
              ? qari.descriptionBangla
              : qari.descriptionBangla.slice(0, 95) + '...'}
            <button
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="text-emerald-400 font-semibold ml-1 cursor-pointer hover:underline"
            >
              {isBioExpanded ? 'কম দেখুন' : 'বিস্তারিত'}
            </button>
          </p>

          {/* Action Buttons: Shuffle & Big Play */}
          <div className="flex items-center justify-center gap-3 w-full max-w-xs">
            <button
              onClick={onShufflePlay}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer"
              title="এলোমেলো সূরা চালান (Shuffle)"
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={() => onPlaySurah(SURAHS[0])}
              className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer font-bangla"
            >
              <Play size={16} fill="currentColor" />
              <span>সূরা আল-ফাতিহা চালান</span>
            </button>
          </div>
        </div>

        {/* Section Header: 114 Surahs Recorded + Cloud Download All */}
        <div className="flex items-center justify-between py-3 mb-1 border-t border-white/[0.08]">
          <span className="text-xs font-semibold text-white/80 tracking-wide font-bangla">
            ১১৪টি সম্পূর্ণ সূরা রেকর্ডকৃত
          </span>

          <button
            onClick={onDownloadAll}
            className="p-1.5 text-white/60 hover:text-emerald-400 transition-colors cursor-pointer"
            title="সব সূরা একসাথে ডাউনলোড করুন"
          >
            <Cloud size={20} />
          </button>
        </div>

        {/* List of 114 Surahs (বাংলা ও আরবী প্রাধান্য এবং ছোট্ট করে ইংলিশ) */}
        <div className="space-y-1">
          {SURAHS.map((surah) => {
            const isCurrent = currentSurah?.id === surah.id;
            const downloaded = isDownloaded(surah.id);
            const downloading = isDownloading(surah.id);
            const progress = downloadProgress?.(surah.id);

            return (
              <div
                key={surah.id}
                onClick={() => onPlaySurah(surah)}
                className={`group relative flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-950/40 border border-emerald-500/40 shadow-lg'
                    : 'hover:bg-white/[0.05]'
                }`}
              >
                {/* Left: Number + Bangla Name + Arabic Calligraphy + Small English */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-white/[0.07] text-white/70 border border-white/10'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 bg-slate-950 rounded-full eq-bar-1" />
                        <span className="w-0.5 bg-slate-950 rounded-full eq-bar-2" />
                        <span className="w-0.5 bg-slate-950 rounded-full eq-bar-3" />
                      </div>
                    ) : (
                      surah.id
                    )}
                  </div>

                  <div className="min-w-0">
                    {/* বাংলা নাম এবং আরবী */}
                    <div className="flex items-baseline gap-2 truncate">
                      <h4 className="text-sm font-bold text-white truncate font-bangla">
                        সূরা {surah.nameBangla}
                      </h4>
                      <span className="font-arabic text-base font-bold text-emerald-300/90 select-none">
                        ({surah.nameArabic})
                      </span>
                    </div>

                    {/* ছোট্ট করে ইংলিশ নাম, অর্থ এবং আয়াত সংখ্যা */}
                    <div className="flex items-center gap-1.5 text-xs text-white/50 truncate mt-0.5">
                      <span className="font-mono text-[11px] text-emerald-400/80">
                        {surah.nameEnglish}
                      </span>
                      <span>·</span>
                      <span className="truncate">{surah.meaningBangla}</span>
                      <span>·</span>
                      <span>{surah.versesCount} আয়াত</span>
                      <span>·</span>
                      <span>{surah.type === 'Makki' ? 'মাক্কী' : 'মাদানী'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Cloud Download & More Options */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleDownload(surah)}
                    disabled={downloading}
                    className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                    title={downloaded ? 'অফলাইনে প্রস্তুত' : 'অফলাইনে ডাউনলোড করুন'}
                  >
                    {downloading ? (
                      <div className="flex items-center gap-1">
                        <Loader2 size={16} className="animate-spin text-amber-400" />
                        {progress !== undefined && (
                          <span className="text-[10px] font-mono text-amber-300">
                            {progress}%
                          </span>
                        )}
                      </div>
                    ) : downloaded ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Cloud size={18} />
                    )}
                  </button>

                  <button
                    onClick={() => onOpenSurahDetails(surah)}
                    className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                    title="সূরার অর্থ ও ফজিলত"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
