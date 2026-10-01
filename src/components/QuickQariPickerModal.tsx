import React, { useState } from 'react';
import { Check, Mic2, Search, UserCheck, X } from 'lucide-react';
import { QARIS } from '../data/qaris';
import { Qari } from '../types/quran';

interface QuickQariPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQari: Qari | null;
  onSelectQari: (qari: Qari) => void;
  isInitialRequired?: boolean;
}

export const QuickQariPickerModal: React.FC<QuickQariPickerModalProps> = ({
  isOpen,
  onClose,
  currentQari,
  onSelectQari,
  isInitialRequired = false
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredQaris = QARIS.filter(
    (q) =>
      q.nameBangla.toLowerCase().includes(search.toLowerCase()) ||
      q.nameEnglish.toLowerCase().includes(search.toLowerCase()) ||
      q.nameArabic.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl animate-fade-in p-0 sm:p-4 select-none">
      <div className="w-full sm:max-w-lg bg-[#141418] border border-emerald-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Mic2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-bangla">
                ক্বারী / হুজুর নির্বাচন করুন
              </h2>
              <p className="text-xs text-white/50">
                পছন্দের ক্বারীর ভয়েসে তিলাওয়াত শুনুন (১ ক্লিকে পরিবর্তন)
              </p>
            </div>
          </div>

          {!isInitialRequired && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative my-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="ক্বারীর নাম বা দেশ খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-white/35 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* 7 Sheikhs & Reciters List */}
        <div className="overflow-y-auto space-y-2 py-1 pr-1 flex-1">
          {filteredQaris.map((qari) => {
            const isSelected = currentQari?.id === qari.id;

            return (
              <button
                key={qari.id}
                onClick={() => {
                  onSelectQari(qari);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-400/60 shadow-lg ring-1 ring-emerald-400/40'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
                }`}
              >
                {/* Sheikh Photo & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-13 h-13 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-white/10 shadow-md">
                    {qari.avatarUrl ? (
                      <img
                        src={qari.avatarUrl}
                        alt={qari.nameEnglish}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-white bg-emerald-800">
                        {qari.nameEnglish.charAt(0)}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-950/50 flex items-center justify-center">
                        <Check size={18} className="text-emerald-300 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    {/* Bangla Name */}
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate font-bangla flex items-center gap-1.5">
                        {qari.emoji && <span>{qari.emoji}</span>}
                        <span>{qari.nameBangla}</span>
                      </h4>
                      {qari.popular && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-md font-mono shrink-0">
                          জনপ্রিয়
                        </span>
                      )}
                    </div>

                    {/* English Name & Arabic Calligraphy */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-emerald-400/90 font-medium truncate">
                        {qari.nameEnglish}
                      </span>
                      <span>·</span>
                      <span className="text-[11px] text-white/50">{qari.flag} {qari.countryBangla}</span>
                    </div>

                    {/* Arabic Name */}
                    <span className="font-arabic text-sm text-white/60 block mt-0.5">
                      {qari.nameArabic}
                    </span>
                  </div>
                </div>

                {/* Right Selection Pill */}
                <div className="shrink-0 flex items-center gap-2">
                  {isSelected ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] font-bangla">
                      নির্বাচিত
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/60 hover:text-white text-[10px] font-bangla">
                      নির্বাচন করুন
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
