import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FolderDown,
  HardDrive,
  Play,
  Trash2,
  WifiOff,
  X
} from 'lucide-react';
import { DownloadedSurah, Surah } from '../types/quran';
import { formatBytes, getOfflineAudioBlob, saveBlobToFile } from '../services/offlineStorage';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadedSurahs: DownloadedSurah[];
  onPlaySurah: (surahId: number) => void;
  onDeleteDownload: (qariId: string, surahId: number) => void;
  onClearAll: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  downloadedSurahs,
  onPlaySurah,
  onDeleteDownload,
  onClearAll
}) => {
  if (!isOpen) return null;

  const totalSize = downloadedSurahs.reduce((sum, item) => sum + item.sizeBytes, 0);

  const handleExportToFile = async (item: DownloadedSurah) => {
    const blob = await getOfflineAudioBlob(item.qariId, item.surahId);
    if (blob) {
      saveBlobToFile(
        blob,
        `Quran_Surah_${item.surahId}_${item.surahNameBangla}_${item.qariNameBangla}.mp3`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-emerald-800/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-bangla">
                অফলাইন তিলাওয়াত ভান্ডার
              </h2>
              <p className="text-xs text-slate-400">
                ইন্টারনেট ছাড়াই যেকোনো স্থানে শোনার জন্য সংরক্ষিত সূরাসমূহ
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

        {/* Offline Status Summary Banner */}
        <div className="my-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-200">
                  {downloadedSurahs.length} টি সূরা অফলাইনে সংরক্ষিত
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({formatBytes(totalSize)})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ডাটা বা ওয়াইফাই বন্ধ থাকলেও এগুলো সাথে সাথে চালু হবে।
              </p>
            </div>
          </div>

          {downloadedSurahs.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              সব ডিলিট করুন
            </button>
          )}
        </div>

        {/* List of Downloaded Surahs */}
        <div className="overflow-y-auto space-y-2 pr-1 flex-1">
          {downloadedSurahs.map((item) => (
            <div
              key={item.key}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-emerald-800/40 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {item.surahId}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-100 truncate">
                    সূরা {item.surahNameBangla}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    ক্বারী: {item.qariNameBangla} · {formatBytes(item.sizeBytes)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Play Offline */}
                <button
                  onClick={() => {
                    onPlaySurah(item.surahId);
                    onClose();
                  }}
                  className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="অফলাইনে চালান"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">শুনুন</span>
                </button>

                {/* Save MP3 to Disk */}
                <button
                  onClick={() => handleExportToFile(item)}
                  className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  title="মেমরিতে সেভ করুন (.mp3)"
                >
                  <FolderDown className="w-4 h-4 text-teal-400" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDeleteDownload(item.qariId, item.surahId)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {downloadedSurahs.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-200">
                এখনও কোনো সূরা ডাউনলোড করা হয়নি
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                সূরা তালিকার যেকোনো সূরার পাশে ডাউনলোড আইকনে ক্লিক করলেই সেটি সাথে সাথে অফলাইনে সংরক্ষিত হয়ে যাবে।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
