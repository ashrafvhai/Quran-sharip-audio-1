import React from 'react';
import { Play, Sparkles, Star, Users, Flame, ChevronRight } from 'lucide-react';
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
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">
          Home
        </h1>

        {/* 3 New Reciters Added Banner (Matches video 0:23) */}
        <div
          onClick={onExploreNewReciters}
          className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border border-blue-500/20 mb-5 flex items-center justify-between cursor-pointer hover:border-blue-500/40 transition-all shadow-lg active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">3 new reciters added</h4>
              <p className="text-[11px] text-white/50">Tap to explore</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/40" />
        </div>

        {/* Recently Played Card (Matches video 0:24) */}
        <div className="p-4 rounded-3xl bg-[#141418] border border-white/[0.08] mb-6 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20 shrink-0 bg-white/10">
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
              <span className="text-[11px] text-white/40 block">Recently Played</span>
              <h3 className="text-base font-bold text-white truncate">
                {currentQari.nameEnglish}
              </h3>
              <p className="text-xs text-white/60 truncate mt-0.5">
                Surah {currentSurah?.nameEnglish || 'Al-Fatihah'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onResumeReciter(currentQari)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Play size={12} fill="currentColor" />
            <span>Continue</span>
          </button>
        </div>

        {/* Your Favourites (Matches video 0:24) */}
        {favoriteReciters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span>Your favourites</span>
              </h3>
              <button
                onClick={onExploreNewReciters}
                className="text-xs text-white/50 hover:text-white cursor-pointer"
              >
                See all
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
                  <span className="text-xs font-semibold text-white/90 truncate max-w-[80px]">
                    {q.nameEnglish.replace('Sheikh ', '')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* New Reciters Row */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">New reciters</h3>
            <button
              onClick={onExploreNewReciters}
              className="text-xs text-white/50 hover:text-white cursor-pointer"
            >
              See all
            </button>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
            {newReciters.slice(0, 5).map((q) => (
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
                <span className="text-xs font-semibold text-white/90 truncate max-w-[80px]">
                  {q.nameEnglish.replace('Sheikh ', '')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Insights Section (Matches video 0:25 - 0:26) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Insights</span>
            </h3>
            <span className="text-xs text-white/50">See more</span>
          </div>

          {/* 3 Metric cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="p-3 rounded-2xl bg-[#141418] border border-white/[0.08] text-center">
              <span className="text-[10px] text-white/40 block mb-0.5">Streak</span>
              <span className="text-sm font-extrabold text-white">0 days</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141418] border border-white/[0.08] text-center">
              <span className="text-[10px] text-white/40 block mb-0.5">This week</span>
              <span className="text-sm font-extrabold text-white">19 min</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141418] border border-white/[0.08] text-center">
              <span className="text-[10px] text-white/40 block mb-0.5">Record</span>
              <span className="text-sm font-extrabold text-white">1 day</span>
            </div>
          </div>

          {/* Today's Listening Goal Card (Matches video 0:26) */}
          <div className="p-5 rounded-3xl bg-[#141418] border border-white/[0.08] shadow-xl text-center">
            <h4 className="text-xs font-medium text-white/60 mb-3">
              Today's listening
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
                  strokeDashoffset="150"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white font-mono">
                  4:10
                </span>
                <span className="text-[10px] text-white/50">
                  of your 10-minute goal
                </span>
              </div>
            </div>

            {/* Days of the Week Dot Indicators */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 text-[11px] text-white/50">
              {[
                { day: 'Mon', active: true },
                { day: 'Tue', active: true },
                { day: 'Wed', active: true },
                { day: 'Thu', active: true },
                { day: 'Fri', active: true },
                { day: 'Sat', active: false },
                { day: 'Sun', active: false }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.active ? 'bg-red-500' : 'bg-white/10'}`} />
                  <span className="text-[10px]">{item.day}</span>
                </div>
              ))}
            </div>

            {/* Continue Listening Primary Button */}
            <button
              onClick={() => onResumeReciter(currentQari)}
              className="w-full py-3 rounded-2xl bg-white hover:bg-white/95 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Play size={14} fill="currentColor" />
              <span>Continue Listening</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
