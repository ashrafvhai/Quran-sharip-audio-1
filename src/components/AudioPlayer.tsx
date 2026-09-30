import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FastForward,
  Gauge,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Qari, RepeatMode, Surah } from '../types/quran';

interface AudioPlayerProps {
  currentSurah: Surah | null;
  currentQari: Qari;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  audioSrc: string | null;
  isOffline: boolean;
  isDownloading: boolean;
  downloadProgress?: number;
  onDownload: (surah: Surah) => void;
  repeatMode: RepeatMode;
  onCycleRepeatMode: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  sleepTimerMinutes: number | null;
  sleepRemainingSeconds: number | null;
  onOpenSleepTimer: () => void;
  onEnded: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSurah,
  currentQari,
  isPlaying,
  onPlayPause,
  onNextSurah,
  onPrevSurah,
  audioSrc,
  isOffline,
  isDownloading,
  downloadProgress,
  onDownload,
  repeatMode,
  onCycleRepeatMode,
  playbackSpeed,
  onChangeSpeed,
  sleepTimerMinutes,
  sleepRemainingSeconds,
  onOpenSleepTimer,
  onEnded
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  // Sync audio source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioSrc) {
      audio.src = audioSrc;
      audio.playbackRate = playbackSpeed;
      if (isPlaying) {
        setIsBuffering(true);
        audio.play().catch((err) => {
          console.warn('Playback error or interrupted:', err);
        });
      }
    } else {
      audio.pause();
    }
  }, [audioSrc]);

  // Handle play / pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSrc]);

  // Handle speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // MediaSession API integration for lockscreen / car audio / bluetooth
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSurah) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${currentSurah.nameBangla} (${currentSurah.nameArabic})`,
      artist: currentQari.nameBangla,
      album: 'পবিত্র আল-কুরআনুল কারীম',
      artwork: [
        {
          src: '/src/assets/images/holy_kaaba_makkah_1790527911160.jpg',
          sizes: '512x512',
          type: 'image/jpeg'
        }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => onPlayPause());
    navigator.mediaSession.setActionHandler('pause', () => onPlayPause());
    navigator.mediaSession.setActionHandler('previoustrack', () => onPrevSurah());
    navigator.mediaSession.setActionHandler('nexttrack', () => onNextSurah());
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      }
    });
    navigator.mediaSession.setActionHandler('seekforward', () => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
      }
    });

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [currentSurah, currentQari, duration, onPlayPause, onNextSurah, onPrevSurah]);

  if (!currentSurah) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setIsBuffering(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsBuffering(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.7;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onEnded={onEnded}
      />

      {/* ========================================================
          STICKY BOTTOM BAR (COMPACT CONTROLS)
          ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-emerald-900/40 shadow-2xl transition-all">
        {/* Scrubbing Progress Bar along the top of sticky bar */}
        <div className="relative group w-full h-1 bg-slate-800 cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-3 -top-1 opacity-0 cursor-pointer"
            aria-label="Seek audio"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Left Zone: Surah & Qari Info */}
          <div className="flex items-center gap-3 min-w-0 max-w-[35%] sm:max-w-[30%]">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-left group flex items-center gap-3 cursor-pointer min-w-0"
              title="প্লেয়ার বড় করুন"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/40 to-teal-900/60 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-300 font-bold font-mono">
                {currentSurah.id}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-emerald-300 transition-colors">
                    {currentSurah.nameBangla}
                  </h4>
                  {isOffline && (
                    <span
                      title="অফলাইন তিলাওয়াত চলছে"
                      className="text-emerald-400 shrink-0 inline-flex"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {currentQari.nameBangla.replace('শাইখ ', '').replace('ক্বারী ', '')}
                </p>
              </div>
            </button>
          </div>

          {/* Center Zone: Playback Controls */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Previous Surah */}
              <button
                onClick={onPrevSurah}
                className="p-2 text-slate-300 hover:text-emerald-300 transition-colors active:scale-90 cursor-pointer"
                title="পূর্ববর্তী সূরা"
                aria-label="পূর্ববর্তী সূরা"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Skip Back 10s */}
              <button
                onClick={() => handleSkip(-10)}
                className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-slate-200 transition-colors active:scale-90 cursor-pointer"
                title="১০ সেকেন্ড পেছনে"
                aria-label="১০ সেকেন্ড পেছনে"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Play / Pause Primary Button */}
              <button
                onClick={onPlayPause}
                disabled={isBuffering && !audioSrc}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                aria-label={isPlaying ? 'বিরতি' : 'প্লে'}
              >
                {isBuffering ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Skip Forward 10s */}
              <button
                onClick={() => handleSkip(10)}
                className="hidden sm:inline-flex p-1.5 text-slate-400 hover:text-slate-200 transition-colors active:scale-90 cursor-pointer"
                title="১০ সেকেন্ড সামনে"
                aria-label="১০ সেকেন্ড সামনে"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Next Surah */}
              <button
                onClick={onNextSurah}
                className="p-2 text-slate-300 hover:text-emerald-300 transition-colors active:scale-90 cursor-pointer"
                title="পরবর্তী সূরা"
                aria-label="পরবর্তী সূরা"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>
            </div>

            {/* Time Indicator */}
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Zone: Extra Controls (Repeat, Sleep Timer, Download, Expand) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Repeat Mode */}
            <button
              onClick={onCycleRepeatMode}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                repeatMode !== 'off'
                  ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={
                repeatMode === 'one'
                  ? 'একই সূরা পুনরাবৃত্তি (Repeat Surah)'
                  : repeatMode === 'all'
                  ? 'ধারাবাহিক অটো-প্লে (Continuous)'
                  : 'লুপ বন্ধ'
              }
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>

            {/* Sleep Timer */}
            <button
              onClick={onOpenSleepTimer}
              className={`hidden sm:inline-flex items-center gap-1 p-2 rounded-lg transition-colors cursor-pointer ${
                sleepTimerMinutes
                  ? 'text-amber-400 bg-amber-950/50 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="স্লিপ টাইমার"
            >
              <Clock className="w-4 h-4" />
              {sleepRemainingSeconds !== null && (
                <span className="text-[11px] font-mono">
                  {Math.ceil(sleepRemainingSeconds / 60)}m
                </span>
              )}
            </button>

            {/* Offline Download Button */}
            <button
              onClick={() => onDownload(currentSurah)}
              disabled={isDownloading}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isOffline
                  ? 'text-emerald-400 bg-emerald-950/50'
                  : isDownloading
                  ? 'text-amber-400 bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isOffline ? 'অফলাইনে প্রস্তুত' : 'অফলাইন ডাউনলোড'}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : isOffline ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>

            {/* Expand Modal Button */}
            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="পূর্ণাঙ্গ প্লেয়ার মোড"
              aria-label="পূর্ণাঙ্গ প্লেয়ার"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          FULL-SCREEN IMMERSIVE PLAYER MODAL
          ======================================================== */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900/90 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between max-h-[92vh] overflow-y-auto">
            {/* Top Bar of Modal */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
              >
                <ChevronDown className="w-5 h-5" />
                <span>মিনিমাইজ</span>
              </button>

              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold font-bangla">
                  পবিত্র আল-কুরআন তিলাওয়াত
                </span>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Center Visual & Arabic Calligraphy */}
            <div className="my-auto text-center py-4 flex flex-col items-center">
              {/* Islamic Star / Emblem Glow */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 border-2 border-emerald-500/40 flex items-center justify-center shadow-2xl shadow-emerald-500/10 mb-6 group">
                <div className="text-center">
                  <span className="text-3xl sm:text-4xl font-arabic font-bold text-emerald-300 drop-shadow-md select-none block">
                    {currentSurah.nameArabic}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono mt-1 block">
                    সূরা নং {currentSurah.id}
                  </span>
                </div>

                {/* Subtle sound wave aura when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Title & Metadata */}
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-bangla mb-1">
                {currentSurah.nameBangla}
              </h2>
              <p className="text-sm text-slate-300 mb-2">
                {currentSurah.nameEnglish} · {currentSurah.meaningBangla}
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4">
                <span>{currentSurah.versesCount} আয়াত</span>
                <span>·</span>
                <span>{currentSurah.type === 'Makki' ? 'মাক্কী' : 'মাদানী'}</span>
                <span>·</span>
                <span>রুকু {currentSurah.rukuCount}</span>
              </div>

              {/* Qari badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/30 text-emerald-200 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>তিলাওয়াত: {currentQari.nameBangla}</span>
              </div>
            </div>

            {/* Seekbar and Timer */}
            <div className="mt-6 mb-4">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
              {/* Previous */}
              <button
                onClick={onPrevSurah}
                className="p-3 text-slate-300 hover:text-emerald-400 transition-colors active:scale-95 cursor-pointer"
                title="পূর্ববর্তী সূরা"
              >
                <SkipBack className="w-6 h-6 fill-current" />
              </button>

              {/* Skip Back 10 */}
              <button
                onClick={() => handleSkip(-10)}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors active:scale-95 cursor-pointer"
                title="১০ সেকেন্ড পেছনে"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Large Play/Pause */}
              <button
                onClick={onPlayPause}
                disabled={isBuffering && !audioSrc}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
              >
                {isBuffering ? (
                  <Loader2 className="w-8 h-8 animate-spin text-slate-950" />
                ) : isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </button>

              {/* Skip Forward 10 */}
              <button
                onClick={() => handleSkip(10)}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors active:scale-95 cursor-pointer"
                title="১০ সেকেন্ড সামনে"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Next */}
              <button
                onClick={onNextSurah}
                className="p-3 text-slate-300 hover:text-emerald-400 transition-colors active:scale-95 cursor-pointer"
                title="পরবর্তী সূরা"
              >
                <SkipForward className="w-6 h-6 fill-current" />
              </button>
            </div>

            {/* Bottom Actions Row in Modal */}
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
              {/* Speed Button */}
              <button
                onClick={() => {
                  const speeds = [0.75, 1.0, 1.25, 1.5];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  onChangeSpeed(speeds[nextIdx]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
                title="প্লেব্যাক স্পিড পরিবর্তন"
              >
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                <span>{playbackSpeed}x গতি</span>
              </button>

              {/* Repeat Button */}
              <button
                onClick={onCycleRepeatMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  repeatMode !== 'off'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
                title="রিপিট মোড"
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Repeat className="w-3.5 h-3.5" />
                )}
                <span>
                  {repeatMode === 'one'
                    ? 'একই সূরা'
                    : repeatMode === 'all'
                    ? 'পরপর সব'
                    : 'লুপ বন্ধ'}
                </span>
              </button>

              {/* Sleep Timer */}
              <button
                onClick={onOpenSleepTimer}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  sleepTimerMinutes
                    ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
                title="স্লিপ টাইমার"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {sleepRemainingSeconds !== null
                    ? `${Math.ceil(sleepRemainingSeconds / 60)} মিনিট`
                    : 'টাইমার'}
                </span>
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleMute}
                  className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={isMuted ? 'আনমিউট' : 'মিউট'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
