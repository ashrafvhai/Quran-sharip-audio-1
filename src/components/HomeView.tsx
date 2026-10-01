import React from 'react';
import { Play, Sparkles, Star, Users, Flame, ChevronRight, Mic2 } from 'lucide-react';
import { QARIS } from '../data/qaris';
import { Qari, Surah } from '../types/quran';

interface HomeViewProps {
  currentQari: Qari;
  currentSurah: Surah | null;
  isPlaying: boolean;
  onResumeReciter: (qari: Qari) => void;
  onExploreNewReciters: () => void;
  onSelectReciter: (qari: Qari) => void;
  favoriteQariIds: Set<string>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentQari,
  currentSurah,
  isPlaying,
  onResumeReciter,
  onExploreNewReciters,
  onSelectReciter,
  favoriteQariIds
}) => {
  const favoriteReciters = QARIS.filter((q) => favoriteQariIds.has(q.id));
  const newReciters = QARIS.filter((q) => q.isNew || q.popular);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-36 animate-fade-in select-none">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-bangla">
            কুরআন তিলাওয়াত
          </h1>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            ১১৪ সূরা
          </span>
        </div>

        {/* 3 New Reciters Added Banner */}
        <div
          onClick={onExploreNewReciters}
          className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-teal-950/60 to-slate-900 border border-emerald-500/30 mb-5 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all shadow-lg active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white font-bangla">নতুন ক্বারী যুক্ত হয়েছে</h4>
              <p className="text-[11px] text-white/50">দেখতে এখানে ট্যাপ করুন</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/40" />
        </div>

        {/* Recently Played Card (বাংলা ও আরবী ও ছোট ইংলিশ) */}
        <div className="p-4 rounded-3xl bg-[#141418] border border-white/[0.08] mb-6 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-emerald-500/30 shrink-0 bg-white/10">
              {currentQari.avatarUrl ? (
                <img
                  src={currentQari.avatarUrl}
                  alt={currentQari.nameEnglish}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-base text-white bg-emerald-800">
                  {currentQari.nameEnglish.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <span className="text-[11px] text-emerald-400 font-medium block font-bangla">
                সর্বশেষ পঠিত
              </span>
              <h3 className="text-base font-bold text-white truncate font-bangla">
                ক্বারী {currentQari.nameBangla}
              </h3>
              <p className="text-xs text-white/70 truncate mt-0.5">
                সূরা {currentSurah?.nameBangla || 'আল-ফাতিহা'} ({currentSurah?.nameArabic})
                <span className="text-[10px] text-white/40 ml-1">· {currentSurah?.nameEnglish}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onResumeReciter(currentQari)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 font-bangla shadow-md"
          >
            <Play size={12} fill="currentColor" />
            <span>শুনুন</span>
          </button>
        </div>

        {/* Your Favourites */}
        {favoriteReciters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-bangla">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span>আপনার পছন্দের ক্বারীগণ</span>
              </h3>
              <button
                onClick={onExploreNewReciters}
                className="text-xs text-white/50 hover:text-white cursor-pointer"
              >
                সব দেখুন
              </button>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
              {favoriteReciters.map((q) => (
                <button
                  key={q.id}
                  onClick={() => onSelectReciter(q)}
                  className="flex flex-col items-center cursor-pointer select-none group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-white/15 bg-white/10 group-hover:scale-105 transition-transform mb-1 shadow-md">
                    {q.avatarUrl ? (
                      <img
                        src={q.avatarUrl}
                        alt={q.nameEnglish}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-emerald-800">
                        {q.nameEnglish.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white/90 truncate max-w-[85px] font-bangla">
                    {q.nameBangla.replace('শাইখ ', '').replace('ক্বারী ', '')}
                  </span>
                  <span className="text-[10px] text-white/40 truncate max-w-[85px]">
                    {q.nameEnglish}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* New Reciters Row */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white font-bangla">বিশ্বনন্দিত ক্বারীগণ</h3>
            <button
              onClick={onExploreNewReciters}
              className="text-xs text-white/50 hover:text-white cursor-pointer"
            >
              সব দেখুন
            </button>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
            {newReciters.slice(0, 6).map((q) => (
              <button
                key={q.id}
                onClick={() => onSelectReciter(q)}
                className="flex flex-col items-center cursor-pointer select-none group"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/15 bg-white/10 group-hover:scale-105 transition-transform mb-1 shadow-md">
                  {q.avatarUrl ? (
                    <img
                      src={q.avatarUrl}
                      alt={q.nameEnglish}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-emerald-800">
                      {q.nameEnglish.charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-emerald-500 text-black text-[9px] font-extrabold uppercase tracking-wider py-0.5">
                    NEW
                  </span>
                </div>
                <span className="text-xs font-semibold text-white/90 truncate max-w-[85px] font-bangla">
                  {q.nameBangla.replace('শাইখ ', '').replace('ক্বারী ', '')}
                </span>
                <span className="text-[10px] text-white/40 truncate max-w-[85px]">
                  {q.nameEnglish}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-bangla">
              <span>তিলাওয়াত ট্র্যাকার (Insights)</span>
            </h3>
            <span className="text-xs text-white/50">দৈনিক লক্ষ্য</span>
          </div>

          {/* 3 Metric cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="p-3 rounded-2xl bg-[#141418] border border-white/[0.08] text-center">
              <span className="text-[10px] text-white/40 block mb-0.5 font-bangla">ধারাবাহিকতা</span>
              <span className="text-sm font-extrabold text-white">১ দিন</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141418] border border-white/[0.08] text-center">
              <span className="text-[10px] text-white/40 block mb-0.5 font-bangla">এই সপ্তাহে</span>
              <span className="text-sm font-extrabold text-emerald-400">১৯ মিনিট</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141418] border border-white/[0.08] text-center">
              <span className="text-[10px] text-white/40 block mb-0.5 font-bangla">সর্বোচ্চ রেকর্ড</span>
              <span className="text-sm font-extrabold text-white">১ দিন</span>
            </div>
          </div>

          {/* Today's Listening Goal Card */}
          <div className="p-5 rounded-3xl bg-[#141418] border border-white/[0.08] shadow-xl text-center">
            <h4 className="text-xs font-medium text-white/60 mb-3 font-bangla">
              আজকের কুরআন শ্রবণ লক্ষ্য
            </h4>

            {/* Circular Gauge Center */}
            <div className="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset="120"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono">
                  ৪:১০
                </span>
                <span className="text-[10px] text-white/50 font-bangla">
                  ১০ মিনিট লক্ষ্যের মধ্যে
                </span>
              </div>
            </div>

            {/* Days of the Week Dot Indicators */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 text-[11px] text-white/50">
              {[
                { day: 'সোম', active: true },
                { day: 'মঙ্গল', active: true },
                { day: 'বুধ', active: true },
                { day: 'বৃহঃ', active: true },
                { day: 'শুক্র', active: true },
                { day: 'শনি', active: false },
                { day: 'রবি', active: false }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.active ? 'bg-emerald-400' : 'bg-white/10'}`} />
                  <span className="text-[10px] font-bangla">{item.day}</span>
                </div>
              ))}
            </div>

            {/* Continue Listening Primary Button */}
            <button
              onClick={() => onResumeReciter(currentQari)}
              className="w-full py-3 rounded-2xl bg-white hover:bg-white/95 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer font-bangla"
            >
              <Play size={14} fill="currentColor" />
              <span>তিলাওয়াত চালিয়ে যান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
