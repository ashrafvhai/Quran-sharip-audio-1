import React from 'react';
import {
  Bell,
  Clock,
  Eye,
  HardDrive,
  Info,
  Moon,
  ShieldCheck,
  Sliders,
  Sparkles,
  Volume2
} from 'lucide-react';
import { BackgroundTheme } from '../types/quran';
import { THEMES } from '../data/themes';

interface SettingsViewProps {
  currentTheme: BackgroundTheme;
  onSelectTheme: (t: BackgroundTheme) => void;
  onOpenAmbientModal: () => void;
  onOpenSleepTimer: () => void;
  ambientVolume: number;
  onChangeAmbientVolume: (vol: number) => void;
  sleepTimerMinutes: number | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentTheme,
  onSelectTheme,
  onOpenAmbientModal,
  onOpenSleepTimer,
  ambientVolume,
  onChangeAmbientVolume,
  sleepTimerMinutes
}) => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-36 animate-fade-in select-none">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4">
          Settings
        </h1>

        {/* Ambient Sounds & Relaxation Card */}
        <div className="p-4 rounded-3xl bg-[#141418] border border-white/[0.08] mb-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Background Sound</h3>
                <p className="text-[11px] text-white/50">Rain, Purr, Night Owl, Waves & more</p>
              </div>
            </div>

            <button
              onClick={onOpenAmbientModal}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Choose
            </button>
          </div>

          {/* Ambient Volume */}
          <div>
            <div className="flex justify-between items-center text-[11px] text-white/50 mb-1.5">
              <span>Ambient Sound Volume</span>
              <span className="font-mono text-white/80">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={ambientVolume}
              onChange={(e) => onChangeAmbientVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* Sleep Timer */}
        <div
          onClick={onOpenSleepTimer}
          className="p-4 rounded-3xl bg-[#141418] border border-white/[0.08] mb-5 flex items-center justify-between cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <Moon size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Sleep Timer</h3>
              <p className="text-[11px] text-white/50">
                {sleepTimerMinutes ? `${sleepTimerMinutes} minutes active` : 'Off'}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-white/60">
            {sleepTimerMinutes ? `${sleepTimerMinutes}m` : 'Set'}
          </span>
        </div>

        {/* Themes Grid */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
            Background Visuals
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {THEMES.map((t) => {
              const isSelected = t.id === currentTheme.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t)}
                  className={`relative p-3 rounded-2xl border text-left cursor-pointer transition-all overflow-hidden ${
                    isSelected
                      ? 'bg-white/15 border-white ring-1 ring-white/50'
                      : 'bg-[#141418] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {t.imageUrl ? (
                    <div
                      className="w-full h-16 rounded-xl bg-cover bg-center mb-2"
                      style={{ backgroundImage: `url(${t.imageUrl})` }}
                    />
                  ) : (
                    <div className="w-full h-16 rounded-xl bg-black border border-white/10 mb-2 flex items-center justify-center text-[10px] text-white/40">
                      OLED Pure Dark
                    </div>
                  )}
                  <h4 className="text-xs font-bold text-white truncate">
                    {t.nameEnglish}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Info */}
        <div className="p-4 rounded-3xl bg-[#141418] border border-white/[0.08] text-center">
          <p className="text-xs font-bold text-white">Al-Quran Recitation Player</p>
          <p className="text-[11px] text-white/40 mt-0.5">
            Version 2.4.0 · 114 Surahs · Offline Support
          </p>
        </div>
      </div>
    </div>
  );
};
