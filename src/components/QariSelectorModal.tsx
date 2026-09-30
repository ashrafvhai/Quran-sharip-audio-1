import React, { useState } from 'react';
import { Check, Mic2, Search, X } from 'lucide-react';
import { QARIS } from '../data/qaris';
import { Qari } from '../types/quran';

interface QariSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQari: Qari;
  onSelectQari: (qari: Qari) => void;
}

export const QariSelectorModal: React.FC<QariSelectorModalProps> = ({
  isOpen,
  onClose,
  currentQari,
  onSelectQari
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredQaris = QARIS.filter(
    (q) =>
      q.nameBangla.toLowerCase().includes(search.toLowerCase()) ||
      q.nameEnglish.toLowerCase().includes(search.toLowerCase()) ||
      q.nameArabic.includes(search) ||
      q.countryBangla.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-emerald-800/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-bangla">
                ক্বারী ও হুযুর নির্বাচন করুন
              </h2>
              <p className="text-xs text-slate-400">
                পছন্দের বিশ্বখ্যাত ক্বারীর সুললিত কণ্ঠে ১১৪ সূরার তিলাওয়াত শুনুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative my-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ক্বারীর নাম বা দেশ খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Qaris List */}
        <div className="overflow-y-auto space-y-2.5 pr-1">
          {filteredQaris.map((qari) => {
            const isSelected = qari.id === currentQari.id;
            return (
              <button
                key={qari.id}
                onClick={() => {
                  onSelectQari(qari);
                  onClose();
                }}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {qari.nameBangla.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100 truncate">
                        {qari.nameBangla}
                      </h3>
                      {qari.popular && (
                        <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded-md">
                          জনপ্রিয়
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 truncate">
                      <span>{qari.nameEnglish}</span>
                      <span>·</span>
                      <span>{qari.countryBangla}</span>
                      <span>·</span>
                      <span className="text-emerald-400/90">{qari.style}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {qari.descriptionBangla}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-arabic text-lg font-bold text-emerald-400/80 hidden sm:inline select-none">
                    {qari.nameArabic}
                  </span>
                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {filteredQaris.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              কোনো ক্বারী খুঁজে পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
