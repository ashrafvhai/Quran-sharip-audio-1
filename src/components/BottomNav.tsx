import React from 'react';
import { Disc3, Mic2, ListMusic, Settings, Search } from 'lucide-react';
import { NavigationTab } from '../types/quran';

interface BottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'player', label: 'প্লেয়ার', icon: Disc3 },
    { id: 'reciters', label: 'ক্বারীগণ', icon: Mic2 },
    { id: 'playlists', label: 'অফলাইন', icon: ListMusic },
    { id: 'search', label: 'অনুসন্ধান', icon: Search },
    { id: 'settings', label: 'সেটিংস', icon: Settings }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/92 backdrop-blur-2xl border-t border-white/[0.08] px-3 pb-safe pt-2">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all select-none cursor-pointer ${
                isActive ? 'text-emerald-400' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? 'animate-pulse' : ''} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-bangla ${isActive ? 'font-bold text-white' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

