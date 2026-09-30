export type RevelationType = 'Makki' | 'Madani';

export interface Surah {
  id: number;
  nameArabic: string;
  nameBangla: string;
  nameEnglish: string;
  meaningBangla: string;
  meaningEnglish: string;
  versesCount: number;
  type: RevelationType;
  rukuCount: number;
  revelationOrder: number;
  fazilat?: string;
}

export interface Qari {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  nameArabic: string;
  countryBangla: string;
  countryEnglish: string;
  flag: string;
  descriptionBangla: string;
  bioEnglish?: string;
  server: string; // e.g. "server16.mp3quran.net/bader"
  fallbackServer?: string;
  style: string;
  popular?: boolean;
  isNew?: boolean;
  isTop?: boolean;
  avatarUrl?: string;
  regionGroup: 'Saudi Arabia' | 'Egypt' | 'Uzbekistan' | 'Russia' | 'Worldwide';
}

export interface BackgroundTheme {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  imageUrl: string;
  videoUrl?: string;
  ambientType: 'stars' | 'rain' | 'gold_dust' | 'none' | 'cat' | 'owl' | 'wave' | 'fire';
  descriptionBangla: string;
}

export interface AmbientSoundItem {
  id: string;
  nameEnglish: string;
  nameBangla: string;
  icon: string; // rain, birds, fire, wave, wind, cat, owl, river, whale, crickets, thunderstorm, thunder, train, nosound
  soundId: string;
  themeId?: string;
  badgeLabel: string;
}

export type RepeatMode = 'off' | 'one' | 'all';

export interface DownloadedSurah {
  key: string; // `${qariId}_${surahId}`
  qariId: string;
  surahId: number;
  surahNameBangla: string;
  qariNameBangla: string;
  sizeBytes: number;
  downloadedAt: number;
}

export type NavigationTab = 'home' | 'reciters' | 'playlists' | 'settings' | 'search';
