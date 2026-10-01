import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Cloud,
  Film,
  HardDrive,
  Loader2,
  Mic2,
  Moon,
  MoreVertical,
  Pause,
  Play,
  Repeat,
  Repeat1,
  RotateCcw,
  RotateCw,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Star,
  UserCheck,
  Video,
  Volume2
} from 'lucide-react';
import { BackgroundTheme, Qari, RepeatMode, Surah } from '../types/quran';
import { QARIS } from '../data/qaris';
import { THEMES } from '../data/themes';

interface MainAudioPlayerViewProps {
  currentSurah: Surah;
  currentQari: Qari | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onSkipTime: (deltaSeconds: number) => void;
  playbackSpeed: number;
  onChangeSpeed: () => void;
  repeatMode: RepeatMode;
  onCycleRepeatMode: () => void;
  onOpenQariPicker: () => void;
  onSelectQari: (qari: Qari) => void;
  theme: BackgroundTheme;
  onSelectTheme: (t: BackgroundTheme) => void;
  onOpenSleepTimer: () => void;
  sleepTimerMinutes: number | null;
  sleepRemainingSeconds: number | null;
  onOpenScriptModal: () => void;
  isFavoriteSurah: boolean;
  onToggleFavoriteSurah: () => void;
  surahs: Surah[];
  onPlaySurah: (surah: Surah) => void;
  onShuffleSurahs: () => void;
  isDownloaded: (surahId: number) => boolean;
  isDownloading: (surahId: number) => boolean;
  downloadProgress?: (surahId: number) => number | undefined;
  onToggleDownload: (surah: Surah) => void;
  onOpenSurahDetails: (surah: Surah) => void;
  onExpandPlayer: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
}

function formatMinutes(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const MainAudioPlayerView: React.FC<MainAudioPlayerViewProps> = ({
  currentSurah,
  currentQari,
  isPlaying,
  onPlayPause,
  onNextSurah,
  onPrevSurah,
  currentTime,
  duration,
  onSeek,
  onSkipTime,
  playbackSpeed,
  onChangeSpeed,
  repeatMode,
  onCycleRepeatMode,
  onOpenQariPicker,
  onSelectQari,
  theme,
  onSelectTheme,
  onOpenSleepTimer,
  sleepTimerMinutes,
  sleepRemainingSeconds,
  onOpenScriptModal,
  isFavoriteSurah,
  onToggleFavoriteSurah,
  surahs,
  onPlaySurah,
  onShuffleSurahs,
  isDownloaded,
  isDownloading,
  downloadProgress,
  onToggleDownload,
  onOpenSurahDetails,
  onExpandPlayer,
  volume,
  onChangeVolume
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'makki' | 'madani' | 'offline'>('all');
  const [showThemePicker, setShowThemePicker] = useState(false);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // The designated 7 Sheikhs
  const top7Sheikhs = QARIS.slice(0, 7);

  const filteredSurahs = surahs.filter((s) => {
    if (filterType === 'makki' && s.type !== 'Makki') return false;
    if (filterType === 'madani' && s.type !== 'Madani') return false;
    if (filterType === 'offline' && !isDownloaded(s.id)) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.nameBangla.toLowerCase().includes(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      s.meaningBangla.toLowerCase().includes(q) ||
      s.id.toString() === q
    );
  });

  return (
    <div className="min-h-screen bg-[#09090c] text-white pb-36 animate-fade-in select-none">
      <div className="max-w-md mx-auto px-4 pt-4 sm:pt-6">
        {/* ========================================================
            TOP BAR: APP BRANDING & QUICK ACTIONS
            ======================================================== */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-arabic font-bold text-xl shadow-lg shadow-emerald-500/20">
              ۞
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white font-bangla tracking-tight flex items-center gap-1.5">
                নূরানী কুরআন অডিও
              </h1>
              <span className="text-[10px] text-emerald-400 font-mono block -mt-0.5">
                Digital Quran Player
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Sacred Theme Button */}
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-white/10 transition-colors cursor-pointer"
              title="পবিত্র দৃশ্য ও ভিডিও নির্বাচন"
            >
              <Video size={17} />
            </button>

            {/* Change Qari Button */}
            <button
              onClick={onOpenQariPicker}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-900/80 transition-all cursor-pointer shadow-sm"
              title="ক্বারী পরিবর্তন"
            >
              <Mic2 size={13} className="text-emerald-400" />
              <span className="truncate max-w-[120px] font-bangla">
                {currentQari ? currentQari.nameBangla.replace('শাইখ ', '').replace('ক্বারী ', '') : 'ক্বারী নির্বাচন'}
              </span>
            </button>
          </div>
        </div>

        {/* Sacred Theme Switcher Drawer */}
        {showThemePicker && (
          <div className="mb-4 p-3.5 rounded-3xl bg-[#141418] border border-amber-400/30 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-bangla">
                <Film size={14} className="text-amber-400" />
                পবিত্র ব্যাকগ্রাউন্ড দৃশ্য বেছে নিন:
              </span>
              <button
                onClick={() => setShowThemePicker(false)}
                className="text-[11px] text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((t) => {
                const isSelected = t.id === theme.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t);
                      setShowThemePicker(false);
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-400 ring-1 ring-amber-400'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div
                      className="w-full h-12 rounded-xl bg-cover bg-center mb-1.5"
                      style={{
                        backgroundImage: t.imageUrl ? `url(${t.imageUrl})` : undefined,
                        backgroundColor: !t.imageUrl ? '#050505' : undefined
                      }}
                    />
                    <span className="text-[10px] font-bold text-white block truncate font-bangla">
                      {t.nameBangla.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            FEATURED AUDIO PLAYER CARD (THE HEART OF THE AUDIO PLAYER)
            ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden p-5 sm:p-6 mb-6 border border-emerald-500/30 bg-gradient-to-b from-[#161622] via-[#121218] to-[#0d0d12] shadow-2xl">
          {/* Subtle Background Glow Artwork */}
          {theme.imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-md pointer-events-none transition-all duration-1000 transform scale-110"
              style={{ backgroundImage: `url(${theme.imageUrl})` }}
            />
          )}

          <div className="relative z-10">
            {/* Center Artwork / Album Display */}
            <div
              onClick={onExpandPlayer}
              className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl mb-4 group cursor-pointer"
            >
              {theme.imageUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${theme.imageUrl})` }}
                />
              ) : (
                <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                  <span className="font-arabic text-4xl text-emerald-300 font-bold">
                    {currentSurah.nameArabic}
                  </span>
                </div>
              )}

              {/* Quran Number Badge */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/20">
                সূরা {currentSurah.id}
              </div>

              {/* Fullscreen Expand Hint */}
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white/80 border border-white/20">
                ভিডিও মোড ⛶
              </div>

              {/* Live sound wave aura if playing */}
              {isPlaying && (
                <div className="absolute inset-0 border-2 border-emerald-400 rounded-3xl animate-ping pointer-events-none" />
              )}
            </div>

            {/* Surah Title (বাংলা এবং আরবী এবং ছোট্ট করে ইংলিশ) */}
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-bangla">
                  সূরা {currentSurah.nameBangla}
                </h2>
                <span className="font-arabic text-2xl font-bold text-emerald-300 drop-shadow">
                  ({currentSurah.nameArabic})
                </span>
              </div>

              {/* ছোট্ট করে ইংলিশ নাম ও অর্থ */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/60 mt-1">
                <span className="font-mono text-emerald-400 font-medium">
                  Surah {currentSurah.nameEnglish}
                </span>
                <span>·</span>
                <span>{currentSurah.meaningBangla}</span>
                <span>·</span>
                <span>{currentSurah.versesCount} আয়াত</span>
                <span>·</span>
                <span>{currentSurah.type === 'Makki' ? 'মাক্কী' : 'মাদানী'}</span>
              </div>
            </div>

            {/* Reciter Avatar Bar (Clickable to switch) */}
            <button
              onClick={onOpenQariPicker}
              className="w-full p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-between gap-3 transition-all cursor-pointer mb-4"
              title="ক্বারী পরিবর্তন করতে ক্লিক করুন"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/40 shrink-0 bg-white/10">
                  {currentQari?.avatarUrl ? (
                    <img
                      src={currentQari.avatarUrl}
                      alt={currentQari.nameEnglish}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-emerald-800">
                      {currentQari?.nameEnglish.charAt(0) || 'Q'}
                    </div>
                  )}
                </div>

                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate font-bangla">
                      {currentQari?.nameBangla || 'ক্বারী নির্বাচন করুন'}
                    </span>
                    <span className="text-[10px] text-white/50">{currentQari?.flag}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/40 truncate">
                    <span className="font-mono">{currentQari?.nameEnglish}</span>
                    <span>·</span>
                    <span className="font-arabic">{currentQari?.nameArabic}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 text-emerald-400 text-xs font-semibold font-bangla">
                <span>পরিবর্তন</span>
                <span className="text-xs">›</span>
              </div>
            </button>

            {/* Scrubber Progress Bar */}
            <div className="mb-4">
              <div className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer flex items-center group">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform scale-100 group-hover:scale-125 transition-transform" />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-5 opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-white/60 mt-1.5">
                <span>{formatMinutes(currentTime)}</span>
                <div className="flex items-center gap-1.5">
                  {isPlaying && (
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-1" />
                      <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-2" />
                      <span className="w-0.5 bg-emerald-400 rounded-full eq-bar-3" />
                    </div>
                  )}
                  <span>{formatMinutes(duration)}</span>
                </div>
              </div>
            </div>

            {/* Primary Audio Player Controls */}
            <div className="flex items-center justify-between mb-4 px-1">
              {/* Shuffle */}
              <button
                onClick={onShuffleSurahs}
                className="p-2.5 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="এলোমেলো চালান (Shuffle)"
              >
                <Shuffle size={18} />
              </button>

              {/* Skip Previous Surah */}
              <button
                onClick={onPrevSurah}
                className="p-2.5 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer"
                title="পূর্ববর্তী সূরা"
              >
                <SkipBack size={22} fill="currentColor" />
              </button>

              {/* Rewind 10s */}
              <button
                onClick={() => onSkipTime(-10)}
                className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
                title="১০ সেকেন্ড পেছনে"
              >
                <RotateCcw size={18} />
              </button>

              {/* Big Solid Play / Pause */}
              <button
                onClick={onPlayPause}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:bg-white/95 active:scale-95 transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" className="ml-1" />
                )}
              </button>

              {/* Fast Forward 10s */}
              <button
                onClick={() => onSkipTime(10)}
                className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
                title="১০ সেকেন্ড সামনে"
              >
                <RotateCw size={18} />
              </button>

              {/* Skip Next Surah */}
              <button
                onClick={onNextSurah}
                className="p-2.5 text-white/80 hover:text-white active:scale-90 transition-all cursor-pointer"
                title="পরবর্তী সূরা"
              >
                <SkipForward size={22} fill="currentColor" />
              </button>

              {/* Repeat Mode */}
              <button
                onClick={onCycleRepeatMode}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                  repeatMode !== 'off'
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/40'
                    : 'text-white/60 hover:text-white'
                }`}
                title="রিপিট মোড"
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>

            {/* Secondary Controls (Speed, Sleep Moon, Ayah Script, Favorite, Offline) */}
            <div className="flex items-center justify-around pt-3 border-t border-white/10 text-white/70">
              {/* Speed */}
              <button
                onClick={onChangeSpeed}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors cursor-pointer"
                title="তিলাওয়াতের গতি"
              >
                {playbackSpeed}x গতি
              </button>

              {/* Sleep Timer */}
              <button
                onClick={onOpenSleepTimer}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  sleepTimerMinutes
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'hover:text-white'
                }`}
                title="স্লিপ টাইমার"
              >
                <Moon size={16} />
                {sleepRemainingSeconds !== null && (
                  <span className="text-[10px] font-mono">
                    {Math.ceil(sleepRemainingSeconds / 60)}m
                  </span>
                )}
              </button>

              {/* Ayah Script 'ق' */}
              <button
                onClick={onOpenScriptModal}
                className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center font-arabic font-bold text-base text-emerald-300 hover:text-white hover:border-emerald-400 transition-colors cursor-pointer"
                title="কুরআন আয়াত ও অর্থ"
              >
                ق
              </button>

              {/* Favorite Star */}
              <button
                onClick={onToggleFavoriteSurah}
                className={`p-1.5 transition-colors cursor-pointer ${
                  isFavoriteSurah ? 'text-amber-400' : 'hover:text-white'
                }`}
                title="পছন্দের সূরা"
              >
                <Star size={18} fill={isFavoriteSurah ? 'currentColor' : 'none'} />
              </button>

              {/* Download Current Surah */}
              <button
                onClick={() => onToggleDownload(currentSurah)}
                className={`p-1.5 transition-colors cursor-pointer ${
                  isDownloaded(currentSurah.id) ? 'text-emerald-400' : 'hover:text-white'
                }`}
                title={isDownloaded(currentSurah.id) ? 'অফলাইনে প্রস্তুত' : 'অফলাইন ডাউনলোড'}
              >
                {isDownloading(currentSurah.id) ? (
                  <Loader2 size={18} className="animate-spin text-amber-400" />
                ) : isDownloaded(currentSurah.id) ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Cloud size={18} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            7 DESIGNATED SHEIKHS QUICK CAROUSEL (AS REQUESTED BY USER)
            ======================================================== */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white font-bangla flex items-center gap-1.5">
              <span>সম্মানিত ৭ জন ক্বারীগণ</span>
              <span className="text-[10px] text-emerald-400 font-mono font-normal">
                (১ ক্লিকে ভয়েস পরিবর্তন)
              </span>
            </h3>
            <button
              onClick={onOpenQariPicker}
              className="text-xs text-white/50 hover:text-emerald-400 font-bangla"
            >
              সব ক্বারী ›
            </button>
          </div>

          <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none">
            {top7Sheikhs.map((q) => {
              const isSelected = currentQari?.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQari(q)}
                  className={`flex flex-col items-center group cursor-pointer text-center select-none shrink-0 transition-transform active:scale-95 ${
                    isSelected ? 'scale-105' : ''
                  }`}
                >
                  <div
                    className={`relative w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg mb-1.5 transition-all ${
                      isSelected
                        ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-emerald-500/20'
                        : 'border-white/15 bg-white/10 group-hover:border-white/40'
                    }`}
                  >
                    {q.avatarUrl ? (
                      <img src={q.avatarUrl} alt={q.nameEnglish} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-emerald-800">
                        {q.nameEnglish.charAt(0)}
                      </div>
                    )}

                    {q.emoji && (
                      <span className="absolute -top-0.5 -right-0.5 text-xs bg-slate-950/80 rounded-full w-5 h-5 flex items-center justify-center border border-white/20 z-10">
                        {q.emoji}
                      </span>
                    )}

                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                    )}
                  </div>

                  {/* Bangla Name */}
                  <span
                    className={`text-xs font-semibold truncate max-w-[85px] font-bangla ${
                      isSelected ? 'text-emerald-300 font-bold' : 'text-white/80 group-hover:text-white'
                    }`}
                  >
                    {q.nameBangla.replace('শাইখ ', '').replace('ক্বারী ', '')}
                  </span>

                  {/* English Name */}
                  <span className="text-[10px] text-white/40 truncate max-w-[85px] font-mono">
                    {q.nameEnglish.replace('Sheikh ', '').split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            114 SURAHS PLAYLIST & SEARCH
            ======================================================== */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-white font-bangla">
              ১১৪টি সূরার অডিও প্লেলিস্ট
            </h3>
            <span className="text-xs font-mono text-white/50">
              {filteredSurahs.length} টি সূরা
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="সূরার নাম, আরবী বা নম্বর দিয়ে খুঁজুন (যেমন: বাকারা, ১)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-white/35 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer font-bangla ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              সব ১১৪ সূরা
            </button>
            <button
              onClick={() => setFilterType('makki')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer font-bangla ${
                filterType === 'makki'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              মাক্কী সূরা (৮৬)
            </button>
            <button
              onClick={() => setFilterType('madani')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer font-bangla ${
                filterType === 'madani'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              মাদানী সূরা (২৮)
            </button>
            <button
              onClick={() => setFilterType('offline')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer font-bangla ${
                filterType === 'offline'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'bg-white/[0.05] text-teal-300/80 border border-teal-500/30'
              }`}
            >
              অফলাইন সংরক্ষিত
            </button>
          </div>

          {/* Surah List Tracks */}
          <div className="space-y-1.5 mt-2">
            {filteredSurahs.map((surah) => {
              const isCurrent = currentSurah.id === surah.id;
              const downloaded = isDownloaded(surah.id);
              const downloading = isDownloading(surah.id);
              const progress = downloadProgress?.(surah.id);

              return (
                <div
                  key={surah.id}
                  onClick={() => onPlaySurah(surah)}
                  className={`group relative flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-950/50 border border-emerald-500/40 shadow-lg'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05]'
                  }`}
                >
                  {/* Left: Number + Bangla Name + Arabic + Small English */}
                  <div className="flex items-center gap-3 min-w-0">
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
                      {/* বাংলা এবং আরবী */}
                      <div className="flex items-baseline gap-2 truncate">
                        <h4 className="text-sm font-bold text-white truncate font-bangla">
                          সূরা {surah.nameBangla}
                        </h4>
                        <span className="font-arabic text-base font-bold text-emerald-300/90 select-none">
                          ({surah.nameArabic})
                        </span>
                      </div>

                      {/* ছোট্ট করে ইংলিশ নাম ও অর্থ */}
                      <div className="flex items-center gap-1.5 text-xs text-white/50 truncate mt-0.5">
                        <span className="font-mono text-[11px] text-emerald-400/80">
                          Surah {surah.nameEnglish}
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

                  {/* Right Actions: Offline Download + Details */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleDownload(surah)}
                      disabled={downloading}
                      className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                      title={downloaded ? 'অফলাইনে প্রস্তুত' : 'অফলাইন ডাউনলোড'}
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
    </div>
  );
};
