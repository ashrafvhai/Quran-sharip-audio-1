import React, { useState } from 'react';
import {
  ChevronDown,
  Moon,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Star,
  Volume2,
  VolumeX,
  ListMusic,
  Sliders,
  Sparkles
} from 'lucide-react';
import { AmbientSoundItem, BackgroundTheme, Qari, Surah } from '../types/quran';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSurah: Surah;
  currentQari: Qari;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onSkipTime: (deltaSeconds: number) => void;
  playbackSpeed: number;
  onChangeSpeed: () => void;
  activeAmbientSound: AmbientSoundItem;
  onOpenAmbientModal: () => void;
  onOpenSleepTimer: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenScriptModal: () => void;
  onOpenQueueModal: () => void;
  theme: BackgroundTheme;
  volume: number;
  onChangeVolume: (vol: number) => void;
}

function formatMinutes(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatRemaining(currentTime: number, duration: number): string {
  if (isNaN(duration) || duration <= 0) return '-0:00';
  const rem = Math.max(0, duration - currentTime);
  const m = Math.floor(rem / 60);
  const s = Math.floor(rem % 60);
  return `-${m}:${s.toString().padStart(2, '0')}`;
}

export const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  isOpen,
  onClose,
  currentSurah,
  currentQari,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  onSkipTime,
  playbackSpeed,
  onChangeSpeed,
  activeAmbientSound,
  onOpenAmbientModal,
  onOpenSleepTimer,
  isFavorite,
  onToggleFavorite,
  onOpenScriptModal,
  onOpenQueueModal,
  theme,
  volume,
  onChangeVolume
}) => {
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  if (!isOpen) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black animate-fade-in select-none">
      {/* Background Visual Layer */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {theme.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
            style={{
              backgroundImage: `url(${theme.imageUrl})`,
              filter: 'brightness(0.72) contrast(1.05)'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#18181c] to-[#0a0a0c]" />
        )}

        {/* Soft atmospheric gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
      </div>

      {/* Top Bar with Drag Handle & Ambient Sound Pill */}
      <div className="relative z-10 pt-4 px-5 flex flex-col items-center">
        {/* Swipe Down Drag Pill */}
        <button
          onClick={onClose}
          className="w-12 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all cursor-pointer mb-3"
          aria-label="Minimize Player"
        />

        {/* Ambient Sound Pill (Exact match to video: e.g. "🌧️ Rain", "✨ Purr", "🦉 Night Owl") */}
        <button
          onClick={onOpenAmbientModal}
          className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <span>{activeAmbientSound.badgeLabel}</span>
        </button>
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Bottom Floating Control Panel (Matches Video at 0:04 - 0:06) */}
      <div className="relative z-10 px-6 pb-8 pt-4 w-full max-w-lg mx-auto">
        {/* Reciter Avatar & Surah Title Row */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Reciter Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-xl shrink-0 bg-white/10">
              {currentQari.avatarUrl ? (
                <img
                  src={currentQari.avatarUrl}
                  alt={currentQari.nameEnglish}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-sm text-white bg-gradient-to-tr from-emerald-800 to-teal-900">
                  {currentQari.nameEnglish.charAt(0)}
                </div>
              )}
            </div>

            {/* Title & Reciter Name */}
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white tracking-tight truncate flex items-center gap-2">
                <span>{currentSurah.nameEnglish}</span>
                <span className="font-arabic text-lg font-normal text-white/70">
                  ({currentSurah.nameArabic})
                </span>
              </h2>
              <p className="text-xs text-white/70 truncate mt-0.5">
                {currentQari.nameEnglish}
              </p>
            </div>
          </div>

          {/* Star Favorite Button */}
          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isFavorite
                ? 'text-amber-300 bg-amber-500/20'
                : 'text-white/60 hover:text-white bg-white/10'
            }`}
            aria-label="Favorite"
          >
            <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Progress Bar & Scrubber */}
        <div className="mb-4">
          <div className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer flex items-center group">
            <div
              className="h-full bg-white rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transform scale-100 group-hover:scale-125 transition-transform" />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer"
            />
          </div>

          {/* Time Labels: Current Time & Negative Remaining Time */}
          <div className="flex justify-between items-center text-[11px] font-mono text-white/60 mt-1.5">
            <span>{formatMinutes(currentTime)}</span>
            <span>{formatRemaining(currentTime, duration)}</span>
          </div>
        </div>

        {/* Controls Cluster (Speed, Prev/Rewind, Play/Pause, Next/Forward, Sleep Moon) */}
        <div className="flex items-center justify-between px-2 mb-6">
          {/* Speed Button (1x, 1.25x, etc.) */}
          <button
            onClick={onChangeSpeed}
            className="w-9 text-xs font-mono font-bold text-white/70 hover:text-white transition-colors cursor-pointer text-left"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>

          {/* Center Buttons: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-5 sm:gap-7">
            {/* Previous */}
            <button
              onClick={onPrev}
              className="p-2 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer"
              aria-label="Previous Surah"
            >
              <SkipBack size={24} fill="currentColor" />
            </button>

            {/* Big Solid Play / Pause Button */}
            <button
              onClick={onPlayPause}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:bg-white/95 active:scale-95 transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="p-2 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer"
              aria-label="Next Surah"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>

          {/* Sleep Timer (Moon Icon) */}
          <button
            onClick={onOpenSleepTimer}
            className="w-9 p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer text-right flex justify-end"
            title="Sleep Timer"
            aria-label="Sleep Timer"
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Bottom Utility Row (Volume, 'ق' Arabic text, Ambient Sound, Queue) */}
        <div className="flex items-center justify-around pt-3 border-t border-white/10 text-white/60">
          {/* Volume Button with Popover */}
          <div className="relative">
            <button
              onClick={() => setShowVolumePopup(!showVolumePopup)}
              className="p-2 hover:text-white transition-colors cursor-pointer"
              title="Volume"
            >
              <Volume2 size={20} />
            </button>

            {showVolumePopup && (
              <div className="absolute bottom-12 -left-8 bg-black/90 border border-white/20 rounded-2xl p-3 shadow-2xl flex flex-col items-center gap-2 z-30">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <span className="text-[10px] font-mono text-white/70">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* 'ق' Arabic Ayah / Text View Toggle */}
          <button
            onClick={onOpenScriptModal}
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center font-arabic font-bold text-lg text-white/90 hover:text-white hover:border-white transition-colors cursor-pointer"
            title="কুরআন আয়াত ও অর্থ"
          >
            ق
          </button>

          {/* Ambient Sounds / Background Settings Toggle */}
          <button
            onClick={onOpenAmbientModal}
            className="p-2 hover:text-white transition-colors cursor-pointer"
            title="Background Sound"
          >
            <Sparkles size={20} />
          </button>

          {/* Queue / Surah List */}
          <button
            onClick={onOpenQueueModal}
            className="p-2 hover:text-white transition-colors cursor-pointer"
            title="Surah List"
          >
            <ListMusic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
