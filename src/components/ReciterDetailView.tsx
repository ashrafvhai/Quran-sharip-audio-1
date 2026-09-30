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
  Shuffle
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
  const [activeMenuSurahId, setActiveMenuSurahId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-36 animate-fade-in select-none">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-30 bg-black/60 backdrop-blur-xl border-b border-white/[0.06] px-4 h-14 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-sm font-semibold text-white/90 truncate max-w-[200px]">
          {qari.nameEnglish}
        </span>

        <div className="w-9" />
      </div>

      <div className="max-w-md mx-auto px-4 pt-3">
        {/* Hero Section with Avatar & Information (Matches Video 0:01 - 0:03) */}
        <div className="flex flex-col items-center text-center pt-2 pb-5">
          {/* Circular Reciter Portrait */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl mb-4 bg-white/5">
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
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1 flex items-center justify-center gap-2">
            <span>{qari.nameEnglish}</span>
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-white/60 mb-3">
            <span>{qari.flag}</span>
            <span>{qari.countryEnglish}</span>
          </div>

          {/* Bio with ...More toggle */}
          <p className="text-xs text-white/60 max-w-sm leading-relaxed mb-5 px-2">
            {isBioExpanded
              ? qari.bioEnglish || qari.descriptionBangla
              : (qari.bioEnglish || qari.descriptionBangla).slice(0, 95) + '...'}
            <button
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="text-white/90 font-semibold ml-1 cursor-pointer hover:underline"
            >
              {isBioExpanded ? 'Less' : 'More'}
            </button>
          </p>

          {/* Action Buttons: Shuffle & Big Play */}
          <div className="flex items-center justify-center gap-3 w-full max-w-xs">
            <button
              onClick={onShufflePlay}
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer"
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={() => onPlaySurah(SURAHS[0])}
              className="flex-1 h-12 rounded-2xl bg-white hover:bg-white/90 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all cursor-pointer"
            >
              <Play size={16} fill="currentColor" />
              <span>Play</span>
            </button>
          </div>
        </div>

        {/* Section Header: 114 Surahs Recorded + Cloud Download All */}
        <div className="flex items-center justify-between py-3 mb-1 border-t border-white/[0.08]">
          <span className="text-xs font-semibold text-white/80 tracking-wide">
            114 surahs recorded
          </span>

          <button
            onClick={onDownloadAll}
            className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Download All Surahs"
          >
            <Cloud size={20} />
          </button>
        </div>

        {/* List of 114 Surahs */}
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
                    ? 'bg-white/10 border border-white/15'
                    : 'hover:bg-white/[0.05]'
                }`}
              >
                {/* Left: Number + Title + English Translation */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-white text-black'
                        : 'bg-white/[0.07] text-white/70 border border-white/10'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    ) : (
                      surah.id
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {surah.nameEnglish} ({surah.nameArabic})
                      </h4>
                    </div>
                    <p className="text-xs text-white/40 truncate">
                      {surah.meaningEnglish} · {surah.versesCount} verses
                    </p>
                  </div>
                </div>

                {/* Right: Cloud Download & More Options */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleDownload(surah)}
                    disabled={downloading}
                    className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                    title={downloaded ? 'Downloaded' : 'Download for offline'}
                  >
                    {downloading ? (
                      <div className="flex items-center gap-1">
                        <Loader2 size={16} className="animate-spin text-white" />
                        {progress !== undefined && (
                          <span className="text-[10px] font-mono text-white/70">
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
                    title="Details"
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
