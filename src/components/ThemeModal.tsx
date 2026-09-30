import React from 'react';
import { Eye, Flame, Layers, Sliders, Sparkles, Video, VideoOff, X } from 'lucide-react';
import { THEMES } from '../data/themes';
import { BackgroundTheme } from '../types/quran';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BackgroundTheme;
  onSelectTheme: (theme: BackgroundTheme) => void;
  isVideoEnabled: boolean;
  onToggleVideo: () => void;
  dimmerOpacity: number;
  onChangeDimmer: (opacity: number) => void;
  blurAmount: number;
  onChangeBlur: (blur: number) => void;
  isParticlesEnabled: boolean;
  onToggleParticles: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  isVideoEnabled,
  onToggleVideo,
  dimmerOpacity,
  onChangeDimmer,
  blurAmount,
  onChangeBlur,
  isParticlesEnabled,
  onToggleParticles
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900/95 border border-emerald-800/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-bangla">
                ব্যাকগ্রাউন্ড ও ভিডিও সেটিংস
              </h2>
              <p className="text-xs text-slate-400">
                প্রশান্তিময় পবিত্র দৃশ্য ও ভিডিও কাস্টমাইজ করুন
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

        {/* Theme Grid */}
        <div className="my-5">
          <label className="text-xs font-semibold text-slate-300 mb-3 block uppercase tracking-wider">
            পছন্দের ব্যাকগ্রাউন্ড দৃশ্য বেছে নিন
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme)}
                  className={`relative overflow-hidden rounded-2xl border text-left p-3.5 transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/40'
                      : 'border-slate-800 hover:border-emerald-700/60 bg-slate-800/40'
                  }`}
                >
                  {/* Thumbnail Banner */}
                  {theme.imageUrl ? (
                    <div
                      className="w-full h-20 rounded-xl bg-cover bg-center mb-2.5 relative overflow-hidden"
                      style={{ backgroundImage: `url(${theme.imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors" />
                    </div>
                  ) : (
                    <div className="w-full h-20 rounded-xl bg-slate-950 border border-slate-800 mb-2.5 flex items-center justify-center text-xs text-slate-400">
                      ডার্ক মোড (OLED Minimal)
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100 block">
                      {theme.nameBangla}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                        সক্রিয়
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {theme.descriptionBangla}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video & Ambient Toggles */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-100">
                  ব্যাকগ্রাউন্ড ভিডিও প্লেয়ার
                </h4>
                <p className="text-xs text-slate-400">
                  পেছনে শান্তিময় লুপ ভিডিও চালু বা বন্ধ রাখুন
                </p>
              </div>
            </div>
            <button
              onClick={onToggleVideo}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isVideoEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  isVideoEnabled ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-100">
                  অ্যাম্বিয়েন্ট পার্টিকেল (বৃষ্টি / নূরানী আলো)
                </h4>
                <p className="text-xs text-slate-400">
                  কোমল বৃষ্টির ফোঁটা ও সোনালি আলোর ইফেক্ট
                </p>
              </div>
            </div>
            <button
              onClick={onToggleParticles}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isParticlesEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  isParticlesEnabled ? 'left-6.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Sliders: Dimmer & Blur */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  ব্যাকগ্রাউন্ড ডার্কনেস / স্বচ্ছতা (Dimmer)
                </span>
                <span className="font-mono text-emerald-400">
                  {Math.round(dimmerOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.3}
                max={0.95}
                step={0.05}
                value={dimmerOpacity}
                onChange={(e) => onChangeDimmer(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5 font-medium">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  ব্যাকগ্রাউন্ড ব্লার (Smooth Blur)
                </span>
                <span className="font-mono text-teal-400">{blurAmount}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={16}
                step={2}
                value={blurAmount}
                onChange={(e) => onChangeBlur(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
