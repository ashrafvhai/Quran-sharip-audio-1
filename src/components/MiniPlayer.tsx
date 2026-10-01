import React from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { Qari, Surah } from '../types/quran';

interface MiniPlayerProps {
  currentSurah: Surah;
  currentQari: Qari | null;
  isPlaying: boolean;
  onPlayPause: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  onOpenFullPlayer: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentSurah,
  currentQari,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onOpenFullPlayer
}) => {
  return (
    <div
      onClick={onOpenFullPlayer}
      className="fixed bottom-[68px] left-3 right-3 sm:left-auto sm:right-auto sm:w-[460px] sm:left-1/2 sm:-translate-x-1/2 z-40 bg-[#16161a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2.5 px-3.5 shadow-2xl flex items-center justify-between gap-3 cursor-pointer hover:bg-[#1a1a20] transition-all active:scale-[0.99] select-none"
    >
      {/* Left: Avatar Thumbnail & Prominent Bangla + Arabic + Small English Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-emerald-500/30">
          {currentQari?.avatarUrl ? (
            <img
              src={currentQari.avatarUrl}
              alt={currentQari.nameEnglish}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white/80 bg-gradient-to-tr from-emerald-800 to-teal-900">
              {currentQari ? currentQari.nameEnglish.charAt(0) : 'Q'}
            </div>
          )}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-1" />
                <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-2" />
                <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-3" />
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          {/* বাংলা এবং আরবী */}
          <div className="flex items-baseline gap-1.5 truncate">
            <h4 className="text-xs font-bold text-white truncate font-bangla">
              {currentSurah.id}. সূরা {currentSurah.nameBangla}
            </h4>
            <span className="font-arabic text-xs font-bold text-emerald-300 select-none">
              ({currentSurah.nameArabic})
            </span>
          </div>

          {/* ছোট্ট করে ইংলিশ এবং ক্বারীর নাম */}
          <div className="flex items-center gap-1.5 text-[10px] text-white/50 truncate mt-0.5">
            <span className="font-mono text-emerald-400/80">
              Surah {currentSurah.nameEnglish}
            </span>
            <span>·</span>
            <span className="truncate">{currentQari?.nameBangla || 'ক্বারী নির্বাচন করুন'}</span>
          </div>
        </div>
      </div>

      {/* Right: Previous, Play/Pause, Next */}
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onPrev}
          className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Previous Surah"
        >
          <SkipBack size={17} fill="currentColor" />
        </button>

        <button
          onClick={onPlayPause}
          className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={15} fill="currentColor" />
          ) : (
            <Play size={15} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <button
          onClick={onNext}
          className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Next Surah"
        >
          <SkipForward size={17} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
