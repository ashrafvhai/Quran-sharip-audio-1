import React from 'react';
import {
  CheckCircle2,
  Cloud,
  FolderDown,
  HardDrive,
  ListMusic,
  Play,
  Star,
  Trash2,
  WifiOff
} from 'lucide-react';
import { DownloadedSurah, Qari, Surah } from '../types/quran';
import { formatBytes, getOfflineAudioBlob, saveBlobToFile } from '../services/offlineStorage';

interface PlaylistsViewProps {
  downloadedSurahs: DownloadedSurah[];
  onPlaySurah: (surahId: number, qariId?: string) => void;
  onDeleteDownload: (qariId: string, surahId: number) => void;
  onClearAllOffline: () => void;
  favoriteSurahIds: Set<number>;
  surahs: Surah[];
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  downloadedSurahs,
  onPlaySurah,
  onDeleteDownload,
  onClearAllOffline,
  favoriteSurahIds,
  surahs
}) => {
  const totalBytes = downloadedSurahs.reduce((acc, curr) => acc + curr.sizeBytes, 0);

  const handleExportMP3 = async (item: DownloadedSurah) => {
    const blob = await getOfflineAudioBlob(item.qariId, item.surahId);
    if (blob) {
      saveBlobToFile(
        blob,
        `Quran_${item.surahId}_${item.surahNameBangla}_${item.qariNameBangla}.mp3`
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-36 animate-fade-in select-none">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4 font-bangla">
          প্লেলিস্ট ও অফলাইন
        </h1>

        {/* Offline Storage Banner */}
        <div className="p-4 rounded-3xl bg-[#141418] border border-white/[0.08] mb-6 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <WifiOff size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-bangla">
                {downloadedSurahs.length} টি সূরা অফলাইনে সংরক্ষিত
              </h3>
              <p className="text-xs text-white/50 font-mono">
                {formatBytes(totalBytes)} ব্যবহৃত স্টোরেজ
              </p>
            </div>
          </div>

          {downloadedSurahs.length > 0 && (
            <button
              onClick={onClearAllOffline}
              className="text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 border border-rose-500/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-bangla"
            >
              সব মুছুন
            </button>
          )}
        </div>

        {/* Downloaded Surahs List */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5 font-bangla">
            <HardDrive size={15} className="text-emerald-400" />
            <span>সংরক্ষিত তিলাওয়াতসমূহ (ইন্টারনেট ছাড়া চলবে)</span>
          </h2>

          <div className="space-y-1.5">
            {downloadedSurahs.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {item.surahId}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate font-bangla">
                      সূরা {item.surahNameBangla}
                    </h4>
                    <p className="text-[11px] text-white/40 truncate">
                      ক্বারী: {item.qariNameBangla} · {formatBytes(item.sizeBytes)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onPlaySurah(item.surahId, item.qariId)}
                    className="p-2 rounded-xl bg-white text-black hover:bg-white/90 transition-colors cursor-pointer"
                    title="শুনুন"
                  >
                    <Play size={13} fill="currentColor" />
                  </button>

                  <button
                    onClick={() => handleExportMP3(item)}
                    className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                    title="মোবাইলে MP3 সেভ করুন"
                  >
                    <FolderDown size={16} />
                  </button>

                  <button
                    onClick={() => onDeleteDownload(item.qariId, item.surahId)}
                    className="p-2 text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                    title="ডিলিট"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {downloadedSurahs.length === 0 && (
              <div className="text-center py-8 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-xs text-white/40 font-bangla">
                  এখনও কোনো সূরা অফলাইনে ডাউনলোড করা হয়নি। সূরা তালিকার ক্লাউড আইকনে ট্যাপ করলেই সরাসরি ডিভাইসে সংরক্ষিত হয়ে যাবে।
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Surahs */}
        <div>
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5 font-bangla">
            <Star size={15} className="text-amber-400 fill-amber-400" />
            <span>পছন্দের সূরাসমূহ</span>
          </h2>

          <div className="space-y-1">
            {surahs
              .filter((s) => favoriteSurahIds.has(s.id))
              .map((s) => (
                <div
                  key={s.id}
                  onClick={() => onPlaySurah(s.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 font-mono text-xs text-white/40">
                      {s.id}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <h4 className="text-xs font-bold text-white font-bangla">
                          সূরা {s.nameBangla}
                        </h4>
                        <span className="font-arabic text-xs font-bold text-emerald-300">
                          ({s.nameArabic})
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40 font-mono">
                        Surah {s.nameEnglish} · {s.versesCount} আয়াত
                      </p>
                    </div>
                  </div>
                  <Play size={14} className="text-white/40" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
