import React from 'react';
import { Bookmark, CheckCircle2, Download, Info, Loader2, Pause, Play } from 'lucide-react';
import { Surah } from '../types/quran';

interface SurahCardProps {
  surah: Surah;
  isPlaying: boolean;
  isCurrent: boolean;
  isDownloaded: boolean;
  isDownloading: boolean;
  downloadProgress?: number;
  isFavorite: boolean;
  onPlay: (surah: Surah) => void;
  onToggleDownload: (surah: Surah) => void;
  onToggleFavorite: (surahId: number) => void;
  onOpenDetails: (surah: Surah) => void;
}

function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .split('')
    .map((d) => bengaliDigits[parseInt(d, 10)] ?? d)
    .join('');
}

export const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  isPlaying,
  isCurrent,
  isDownloaded,
  isDownloading,
  downloadProgress,
  isFavorite,
  onPlay,
  onToggleDownload,
  onToggleFavorite,
  onOpenDetails
}) => {
  return (
    <div
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
        isCurrent
          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
          : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/60 hover:border-emerald-800/40'
      } backdrop-blur-md flex flex-col justify-between`}
    >
      {/* Top Row: Surah Number, Name & Arabic Calligraphy */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Number Emblem */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-semibold text-sm transition-colors ${
              isCurrent
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-emerald-300 border border-emerald-500/20 group-hover:border-emerald-500/40'
            }`}
          >
            {toBengaliNumber(surah.id)}
          </div>

          {/* Names */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-200 transition-colors">
                {surah.nameBangla}
              </h3>
              {isDownloaded && (
                <span
                  title="অফলাইনে সংরক্ষিত - ইন্টারনেট ছাড়াও শুনতে পারবেন"
                  className="text-emerald-400 inline-flex items-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[170px] sm:max-w-[210px]">
              {surah.nameEnglish} · {surah.meaningBangla}
            </p>
          </div>
        </div>

        {/* Arabic Calligraphy */}
        <div className="text-right">
          <span className="font-arabic text-2xl font-bold text-emerald-300/90 leading-none block select-none">
            {surah.nameArabic}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            {surah.type === 'Makki' ? 'মাক্কী' : 'মাদানী'}
          </span>
        </div>
      </div>

      {/* Middle Row: Clean unboxed metadata with separators (frontend-design standard) */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 pt-1 border-t border-slate-800/50">
        <span>{toBengaliNumber(surah.versesCount)} আয়াত</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>রুকু {toBengaliNumber(surah.rukuCount)}</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span>নাজিল ক্রম: {toBengaliNumber(surah.revelationOrder)}</span>
      </div>

      {/* Bottom Row: Actions */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        {/* Play/Pause Button */}
        <button
          onClick={() => onPlay(surah)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
            isCurrent && isPlaying
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
          }`}
          aria-label={isCurrent && isPlaying ? 'তিলাওয়াত থামান' : 'তিলাওয়াত শুনুন'}
        >
          {isCurrent && isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>বিরতি</span>
              {/* Equalizer animation */}
              <div className="flex items-end gap-0.5 h-3 ml-1">
                <span className="w-0.5 bg-slate-950 rounded-full eq-bar-1" />
                <span className="w-0.5 bg-slate-950 rounded-full eq-bar-2" />
                <span className="w-0.5 bg-slate-950 rounded-full eq-bar-3" />
              </div>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>তিলাওয়াত শুনুন</span>
            </>
          )}
        </button>

        {/* Secondary action cluster: Download, Details, Favorite */}
        <div className="flex items-center gap-1">
          {/* Download Button */}
          <button
            onClick={() => onToggleDownload(surah)}
            disabled={isDownloading}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDownloaded
                ? 'text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60'
                : isDownloading
                ? 'text-amber-400 bg-amber-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={
              isDownloaded
                ? 'অফলাইনে সংরক্ষিত (মুছতে ক্লিক করুন)'
                : isDownloading
                ? `ডাউনলোড হচ্ছে ${downloadProgress || 0}%`
                : 'অফলাইনে শোনার জন্য ডাউনলোড করুন'
            }
            aria-label="অফলাইন ডাউনলোড"
          >
            {isDownloading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                {downloadProgress !== undefined && (
                  <span className="text-[10px] font-mono text-amber-300">
                    {downloadProgress}%
                  </span>
                )}
              </div>
            ) : isDownloaded ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Details / Fazilat modal */}
          <button
            onClick={() => onOpenDetails(surah)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            title="সূরার অর্থ ও ফজিলত"
            aria-label="সূরার বিবরণ"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Favorite Bookmark */}
          <button
            onClick={() => onToggleFavorite(surah.id)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isFavorite
                ? 'text-amber-400 bg-amber-950/40 hover:bg-amber-900/50'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
            title={isFavorite ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় রাখুন'}
            aria-label="পছন্দ"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
