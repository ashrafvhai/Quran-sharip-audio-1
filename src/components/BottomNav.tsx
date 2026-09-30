import React from 'react';
import { Home, Mic2, ListMusic, Settings, Search } from 'lucide-react';
import { NavigationTab } from '../types/quran';

interface BottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'reciters', label: 'Reciters', icon: Mic2 },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'search', label: 'Search', icon: Search }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-2xl border-t border-white/[0.08] px-3 pb-safe pt-2">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all select-none cursor-pointer ${
                isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
