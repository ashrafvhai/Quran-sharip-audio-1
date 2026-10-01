import React, { useState } from 'react';
import { Play, Search, User, BookOpen } from 'lucide-react';
import { SURAHS } from '../data/surahs';
import { QARIS } from '../data/qaris';
import { Qari, Surah } from '../types/quran';

interface SearchViewProps {
  onSelectSurah: (surah: Surah) => void;
  onSelectReciter: (qari: Qari) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onSelectSurah,
  onSelectReciter
}) => {
  const [query, setQuery] = useState('');

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.nameEnglish.toLowerCase().includes(query.toLowerCase()) ||
      s.nameBangla.toLowerCase().includes(query.toLowerCase()) ||
      s.nameArabic.includes(query) ||
      s.meaningBangla.toLowerCase().includes(query.toLowerCase()) ||
      s.meaningEnglish.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toString() === query.trim()
  );

  const filteredReciters = QARIS.filter(
    (q) =>
      q.nameEnglish.toLowerCase().includes(query.toLowerCase()) ||
      q.nameBangla.toLowerCase().includes(query.toLowerCase()) ||
      q.countryBangla.toLowerCase().includes(query.toLowerCase()) ||
      q.countryEnglish.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-36 animate-fade-in select-none">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4 font-bangla">
          অনুসন্ধান (Search)
        </h1>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="সূরা বা ক্বারীর নাম দিয়ে খুঁজুন (যেমন: বাকারা, ১, আফাসি)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/[0.07] border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Reciters Section */}
        {filteredReciters.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider flex items-center gap-1.5 font-bangla">
              <User size={13} />
              <span>ক্বারী ও হুজুরগণ</span>
            </h3>
            <div className="space-y-1.5">
              {filteredReciters.slice(0, 5).map((q) => (
                <div
                  key={q.id}
                  onClick={() => onSelectReciter(q)}
                  className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/30 bg-white/10 shrink-0">
                      {q.avatarUrl ? (
                        <img src={q.avatarUrl} alt={q.nameEnglish} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-white bg-emerald-800">
                          {q.nameEnglish.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-bangla">{q.nameBangla}</h4>
                      <p className="text-[11px] text-white/40">{q.flag} {q.nameEnglish} · {q.countryBangla}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Surahs Section */}
        <div>
          <h3 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider flex items-center gap-1.5 font-bangla">
            <BookOpen size={13} />
            <span>পবিত্র কুরআন সূরাসমূহ</span>
          </h3>
          <div className="space-y-1">
            {filteredSurahs.slice(0, 25).map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSurah(s)}
                className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-white font-mono text-xs flex items-center justify-center font-bold">
                    {s.id}
                  </div>
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
                      Surah {s.nameEnglish} · {s.meaningBangla} · {s.versesCount} আয়াত
                    </p>
                  </div>
                </div>
                <Play size={13} className="text-white/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
