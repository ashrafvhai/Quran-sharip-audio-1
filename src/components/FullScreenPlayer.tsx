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
  Sparkles,
  Video,
  Check,
  Film
} from 'lucide-react';
import { AmbientSoundItem, BackgroundTheme, Qari, Surah } from '../types/quran';
import { THEMES } from '../data/themes';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSurah: Surah;
  currentQari: Qari | null;
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
  onSelectTheme: (t: BackgroundTheme) => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  onOpenQariPicker?: () => void;
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
  onSelectTheme,
  volume,
  onChangeVolume,
  onOpenQariPicker
}) => {
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);

  if (!isOpen) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black animate-fade-in select-none">
      {/* Background Visual / Video Layer */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {theme.videoUrl ? (
          <video
            ref={(el) => {
              if (el) {
                el.muted = true;
                el.volume = 0;
                el.defaultMuted = true;
              }
            }}
            key={theme.videoUrl}
            src={theme.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{
              filter: 'brightness(0.68) contrast(1.05)',
              opacity: 0.88
            }}
          />
        ) : theme.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
            style={{
              backgroundImage: `url(${theme.imageUrl})`,
              filter: 'brightness(0.68) contrast(1.05)'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#18181c] to-[#0a0a0c]" />
        )}

        {/* Soft atmospheric gradient scrim for pristine typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/90 pointer-events-none" />
      </div>

      {/* Top Bar with Drag Handle & Quick Actions */}
      <div className="relative z-20 pt-4 px-5 flex flex-col items-center">
        {/* Swipe Down Drag Handle */}
        <button
          onClick={onClose}
          className="w-12 h-1.5 rounded-full bg-white/40 hover:bg-white/70 transition-all cursor-pointer mb-3"
          aria-label="Minimize Player"
        />

        {/* Dual Control Chips: Sacred Video Switcher + Ambient Sound */}
        <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-1 scrollbar-none">
          {/* Sacred Videos Button */}
          <button
            onClick={() => setShowVideoDrawer(!showVideoDrawer)}
            className={`px-3.5 py-1.5 rounded-full backdrop-blur-xl border text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer ${
              showVideoDrawer
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                : 'bg-black/40 hover:bg-black/60 border-white/20 text-amber-200'
            }`}
          >
            <Video size={13} className={showVideoDrawer ? 'text-slate-950' : 'text-amber-400'} />
            <span>পবিত্র ভিডিও দৃশ্য</span>
            <span className="text-[10px] opacity-75">({theme.nameBangla.split(' ')[0]})</span>
          </button>

          {/* Change Reciter Pill */}
          {onOpenQariPicker && (
            <button
              onClick={onOpenQariPicker}
              className="px-3 py-1.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/80 backdrop-blur-xl border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>🎙️ ক্বারী পরিবর্তন</span>
            </button>
          )}

          {/* Ambient Sound Pill */}
          <button
            onClick={onOpenAmbientModal}
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <span>{activeAmbientSound.badgeLabel}</span>
          </button>
        </div>
      </div>

      {/* Sacred Videos Drawer (Shows when "পবিত্র ভিডিও দৃশ্য" is active) */}
      {showVideoDrawer && (
        <div className="relative z-30 mx-4 my-2 p-3.5 rounded-3xl bg-black/85 backdrop-blur-2xl border border-amber-400/30 shadow-2xl animate-fade-in max-h-56 overflow-y-auto">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-bangla">
              <Film size={14} className="text-amber-400" />
              পবিত্র ও প্রশান্তিময় ভিডিও দৃশ্য নির্বাচন করুন:
            </span>
            <button
              onClick={() => setShowVideoDrawer(false)}
              className="text-[11px] text-white/50 hover:text-white cursor-pointer"
            >
              বন্ধ করুন ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {THEMES.map((item) => {
              const isSelected = item.id === theme.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTheme(item);
                    setShowVideoDrawer(false);
                  }}
                  className={`p-2 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/25 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-white/[0.06] border-white/10 hover:bg-white/[0.12]'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-cover bg-center shrink-0 border border-white/20"
                    style={{
                      backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
                      backgroundColor: !item.imageUrl ? '#050505' : undefined
                    }}
                  />
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-bold text-white truncate font-bangla">
                      {item.nameBangla}
                    </h5>
                    <p className="text-[9px] text-white/50 truncate">
                      {item.nameEnglish}
                    </p>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-amber-400 shrink-0 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Bottom Floating Control Panel */}
      <div className="relative z-20 px-5 pb-7 pt-2 w-full max-w-lg mx-auto">
        {/* Reciter Avatar & Surah Title Row (বাংলা + আরবী + ছোট ইংলিশ) */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            onClick={onOpenQariPicker}
            className="flex items-center gap-3.5 min-w-0 cursor-pointer group"
            title="ক্বারী পরিবর্তন করতে ক্লিক করুন"
          >
            {/* Reciter Avatar with subtle pulsating glow when playing */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400/30 group-hover:border-emerald-400 shadow-xl shrink-0 bg-white/10 transition-colors">
              {currentQari?.avatarUrl ? (
                <img
                  src={currentQari.avatarUrl}
                  alt={currentQari.nameEnglish}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-sm text-white bg-gradient-to-tr from-emerald-800 to-teal-900">
                  {currentQari ? currentQari.nameEnglish.charAt(0) : 'Q'}
                </div>
              )}
              {isPlaying && (
                <div className="absolute inset-0 border-2 border-emerald-400 rounded-full animate-ping pointer-events-none" />
              )}
            </div>

            {/* Title: বাংলা এবং আরবী এবং ছোট্ট করে ইংলিশ */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate font-bangla">
                  সূরা {currentSurah.nameBangla}
                </h2>
                <span className="font-arabic text-xl font-bold text-emerald-300 drop-shadow select-none">
                  ({currentSurah.nameArabic})
                </span>
              </div>

              {/* ছোট্ট করে ইংলিশ নাম ও অর্থ */}
              <div className="flex items-center gap-2 text-[11px] text-white/60 truncate mt-0.5">
                <span className="font-mono text-emerald-300/90 font-medium">
                  Surah {currentSurah.nameEnglish}
                </span>
                <span>·</span>
                <span className="truncate text-emerald-300 group-hover:underline flex items-center gap-1">
                  <span>{currentQari?.nameBangla || 'ক্বারী নির্বাচন করুন'}</span>
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded-full text-white/70">পরিবর্তন</span>
                </span>
              </div>
            </div>
          </div>

          {/* Star Favorite Button */}
          <button
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer shrink-0 ${
              isFavorite
                ? 'text-amber-300 bg-amber-500/25 border border-amber-400/40'
                : 'text-white/60 hover:text-white bg-white/10 border border-white/10'
            }`}
            aria-label="Favorite"
          >
            <Star size={19} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Progress Bar & Scrubber */}
        <div className="mb-4">
          <div className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer flex items-center group">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg transform scale-100 group-hover:scale-125 transition-transform" />
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
            <div className="flex items-center gap-1">
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-2.5 mr-1">
                  <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-1" />
                  <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-2" />
                  <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-3" />
                </div>
              )}
              <span>{formatRemaining(currentTime, duration)}</span>
            </div>
          </div>
        </div>

        {/* Controls Cluster (Speed, Prev/Rewind, Play/Pause, Next/Forward, Sleep Moon) */}
        <div className="flex items-center justify-between px-2 mb-5">
          {/* Speed Button (1x, 1.25x, etc.) */}
          <button
            onClick={onChangeSpeed}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors cursor-pointer text-center"
            title="তিলাওয়াতের গতি"
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
            className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer text-right flex justify-end"
            title="স্লিপ টাইমার"
            aria-label="Sleep Timer"
          >
            <Moon size={20} />
          </button>
        </div>

        {/* Bottom Utility Row (Volume, 'ق' Arabic text, Video Switcher, Queue) */}
        <div className="flex items-center justify-around pt-3 border-t border-white/10 text-white/60">
          {/* Volume Button with Popover */}
          <div className="relative">
            <button
              onClick={() => setShowVolumePopup(!showVolumePopup)}
              className="p-2 hover:text-white transition-colors cursor-pointer"
              title="ভলিউম"
            >
              <Volume2 size={20} />
            </button>

            {showVolumePopup && (
              <div className="absolute bottom-12 -left-8 bg-black/95 border border-white/20 rounded-2xl p-3 shadow-2xl flex flex-col items-center gap-2 z-40 backdrop-blur-xl">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <span className="text-[10px] font-mono text-white/80">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* 'ق' Arabic Ayah / Text View Toggle */}
          <button
            onClick={onOpenScriptModal}
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center font-arabic font-bold text-lg text-emerald-300 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
            title="কুরআন আয়াত ও অর্থ"
          >
            ق
          </button>

          {/* Sacred Videos Selector Quick Button */}
          <button
            onClick={() => setShowVideoDrawer(!showVideoDrawer)}
            className="p-2 hover:text-amber-300 transition-colors cursor-pointer"
            title="পবিত্র দৃশ্য ও ভিডিও"
          >
            <Video size={20} className="text-amber-400" />
          </button>

          {/* Queue / Surah List */}
          <button
            onClick={onOpenQueueModal}
            className="p-2 hover:text-white transition-colors cursor-pointer"
            title="সূরা তালিকা"
          >
            <ListMusic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
