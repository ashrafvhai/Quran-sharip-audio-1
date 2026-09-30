import React, { useState } from 'react';
import {
  Bird,
  Check,
  CloudLightning,
  CloudRain,
  Flame,
  Search,
  Sparkles,
  Train,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  X,
  Zap,
  Droplets,
  Disc,
  Cat,
  MoonStar
} from 'lucide-react';
import { AMBIENT_SOUNDS } from '../data/ambientSounds';
import { AmbientSoundItem } from '../types/quran';

interface AmbientSoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSoundId: string;
  onSelectSound: (item: AmbientSoundItem) => void;
  ambientVolume: number;
  onChangeAmbientVolume: (vol: number) => void;
}

export const AmbientSoundModal: React.FC<AmbientSoundModalProps> = ({
  isOpen,
  onClose,
  selectedSoundId,
  onSelectSound,
  ambientVolume,
  onChangeAmbientVolume
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredSounds = AMBIENT_SOUNDS.filter((s) =>
    s.nameEnglish.toLowerCase().includes(search.toLowerCase()) ||
    s.nameBangla.toLowerCase().includes(search.toLowerCase())
  );

  const renderIcon = (iconName: string, isSelected: boolean) => {
    const size = 26;
    const strokeWidth = isSelected ? 2.2 : 1.8;

    switch (iconName) {
      case 'nosound':
        return <VolumeX size={size} strokeWidth={strokeWidth} />;
      case 'rain':
        return <CloudRain size={size} strokeWidth={strokeWidth} />;
      case 'birds':
        return <Bird size={size} strokeWidth={strokeWidth} />;
      case 'fire':
        return <Flame size={size} strokeWidth={strokeWidth} />;
      case 'wave':
        return <Waves size={size} strokeWidth={strokeWidth} />;
      case 'wind':
        return <Wind size={size} strokeWidth={strokeWidth} />;
      case 'cat':
        return <Cat size={size} strokeWidth={strokeWidth} />;
      case 'owl':
        return <MoonStar size={size} strokeWidth={strokeWidth} />;
      case 'river':
        return <Droplets size={size} strokeWidth={strokeWidth} />;
      case 'whale':
        return <Disc size={size} strokeWidth={strokeWidth} />;
      case 'crickets':
        return <Sparkles size={size} strokeWidth={strokeWidth} />;
      case 'thunderstorm':
        return <CloudLightning size={size} strokeWidth={strokeWidth} />;
      case 'thunder':
        return <Zap size={size} strokeWidth={strokeWidth} />;
      case 'train':
        return <Train size={size} strokeWidth={strokeWidth} />;
      default:
        return <Sparkles size={size} strokeWidth={strokeWidth} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl animate-fade-in p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-[#121214] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 pb-8 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <h2 className="text-base font-bold text-white tracking-wide">
            Background sound
          </h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold hover:bg-white/90 transition-colors cursor-pointer"
            aria-label="Confirm"
          >
            <Check size={18} strokeWidth={2.8} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative my-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Thunder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.07] border border-white/10 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        {/* Grid of Sound Icons */}
        <div className="overflow-y-auto flex-1 grid grid-cols-3 gap-3.5 py-2 pr-1">
          {filteredSounds.map((item) => {
            const isSelected = item.id === selectedSoundId;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSound(item)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-white/15 ring-2 ring-white/60 shadow-lg scale-[1.02]'
                    : 'bg-white/[0.05] hover:bg-white/[0.09] active:scale-95'
                }`}
              >
                {/* Active Checkmark Pill on Top-Right */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                    <Check size={11} strokeWidth={3.5} />
                  </div>
                )}

                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                    isSelected ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {renderIcon(item.icon, isSelected)}
                </div>

                {/* Sound Name */}
                <span
                  className={`text-xs font-medium text-center line-clamp-1 ${
                    isSelected ? 'text-white font-semibold' : 'text-white/60'
                  }`}
                >
                  {item.nameEnglish}
                </span>
              </button>
            );
          })}
        </div>

        {/* Ambient Sound Volume Slider */}
        <div className="pt-4 mt-2 border-t border-white/10 flex items-center gap-3">
          <Volume2 size={16} className="text-white/50 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
              <span>Background volume</span>
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
      </div>
    </div>
  );
};
