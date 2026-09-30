import React, { useState } from 'react';
import { ChevronRight, Search, Star } from 'lucide-react';
import { QARIS } from '../data/qaris';
import { Qari } from '../types/quran';

interface RecitersViewProps {
  onSelectReciter: (qari: Qari) => void;
  favoriteQariIds: Set<string>;
  onToggleFavoriteQari: (qariId: string) => void;
}

export const RecitersView: React.FC<RecitersViewProps> = ({
  onSelectReciter,
  favoriteQariIds,
  onToggleFavoriteQari
}) => {
  const [search, setSearch] = useState('');

  const filteredQaris = QARIS.filter(
    (q) =>
      q.nameEnglish.toLowerCase().includes(search.toLowerCase()) ||
      q.nameBangla.toLowerCase().includes(search.toLowerCase()) ||
      q.countryEnglish.toLowerCase().includes(search.toLowerCase())
  );

  const topReciters = QARIS.filter((q) => q.isTop);
  const newReciters = QARIS.filter((q) => q.isNew || q.popular);
  const favoriteReciters = QARIS.filter((q) => favoriteQariIds.has(q.id));
  const saudiReciters = QARIS.filter((q) => q.regionGroup === 'Saudi Arabia');
  const egyptReciters = QARIS.filter((q) => q.regionGroup === 'Egypt');
  const uzbekReciters = QARIS.filter((q) => q.regionGroup === 'Uzbekistan');
  const russiaReciters = QARIS.filter((q) => q.regionGroup === 'Russia');

  const renderReciterAvatar = (qari: Qari, showNewBadge = false) => (
    <button
      key={qari.id}
      onClick={() => onSelectReciter(qari)}
      className="flex flex-col items-center group cursor-pointer text-center select-none"
    >
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border border-white/15 bg-white/10 group-hover:scale-105 group-hover:border-white/40 transition-all shadow-lg mb-1.5">
        {qari.avatarUrl ? (
          <img
            src={qari.avatarUrl}
            alt={qari.nameEnglish}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-sm text-white/90 bg-gradient-to-tr from-emerald-800 to-teal-900">
            {qari.nameEnglish.charAt(0)}
          </div>
        )}

        {showNewBadge && (
          <span className="absolute bottom-0 inset-x-0 bg-emerald-500 text-black text-[9px] font-extrabold uppercase tracking-wider py-0.5">
            NEW
          </span>
        )}
      </div>

      <span className="text-xs font-semibold text-white/90 truncate max-w-[80px] group-hover:text-white">
        {qari.nameEnglish.replace('Sheikh ', '')}
      </span>
      <span className="text-[10px] text-white/40 truncate max-w-[80px]">
        {qari.countryEnglish}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-36 animate-fade-in select-none">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">
          Reciters
        </h1>

        {/* Search Bar (Matches video 0:20) */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search reciters"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.07] border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {search ? (
          /* Search results */
          <div className="space-y-2">
            <h3 className="text-xs text-white/50 mb-2">Search results</h3>
            <div className="grid grid-cols-4 gap-4">
              {filteredQaris.map((q) => renderReciterAvatar(q))}
            </div>
            {filteredQaris.length === 0 && (
              <p className="text-center py-8 text-xs text-white/40">
                No reciters found.
              </p>
            )}
          </div>
        ) : (
          /* Grouped Sections exactly like the video (0:20 - 0:22) */
          <div className="space-y-7">
            {/* Top Reciters this month Card with avatars */}
            <div
              onClick={() => onSelectReciter(topReciters[0])}
              className="relative p-4 rounded-3xl bg-gradient-to-r from-[#17172b] to-[#11111d] border border-white/10 shadow-xl cursor-pointer hover:border-white/20 transition-all flex items-center justify-between"
            >
              <div>
                {/* 3 Avatar overlapping cluster */}
                <div className="flex items-center -space-x-3 mb-2.5">
                  {topReciters.slice(0, 3).map((r, i) => (
                    <div
                      key={r.id}
                      className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#12121e] bg-white/10 shadow-md"
                    >
                      {r.avatarUrl ? (
                        <img
                          src={r.avatarUrl}
                          alt={r.nameEnglish}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-emerald-800">
                          {r.nameEnglish.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <h3 className="text-sm font-bold text-white">Top Reciters</h3>
                <p className="text-xs text-white/50">This month</p>
              </div>

              <ChevronRight size={20} className="text-white/40" />
            </div>

            {/* Your favourites */}
            {favoriteReciters.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span>Your favourites</span>
                  </h3>
                  <button className="text-xs text-white/50 hover:text-white cursor-pointer">
                    See all
                  </button>
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
                  {favoriteReciters.map((q) => renderReciterAvatar(q))}
                </div>
              </div>
            )}

            {/* New reciters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">New reciters</h3>
                <button className="text-xs text-white/50 hover:text-white cursor-pointer">
                  See all
                </button>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
                {newReciters.map((q) => renderReciterAvatar(q, true))}
              </div>
            </div>

            {/* From Saudi Arabia */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">From Saudi Arabia</h3>
                <button className="text-xs text-white/50 hover:text-white cursor-pointer">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {saudiReciters.slice(0, 8).map((q) => renderReciterAvatar(q))}
              </div>
            </div>

            {/* From Egypt */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">From Egypt</h3>
                <button className="text-xs text-white/50 hover:text-white cursor-pointer">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {egyptReciters.map((q) => renderReciterAvatar(q))}
              </div>
            </div>

            {/* From Uzbekistan */}
            {uzbekReciters.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">From Uzbekistan</h3>
                  <button className="text-xs text-white/50 hover:text-white cursor-pointer">
                    See all
                  </button>
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
                  {uzbekReciters.map((q) => renderReciterAvatar(q))}
                </div>
              </div>
            )}

            {/* From Russia */}
            {russiaReciters.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">From Russia</h3>
                  <button className="text-xs text-white/50 hover:text-white cursor-pointer">
                    See all
                  </button>
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
                  {russiaReciters.map((q) => renderReciterAvatar(q))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
