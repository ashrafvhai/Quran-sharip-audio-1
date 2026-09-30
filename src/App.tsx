/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { HomeView } from './components/HomeView';
import { RecitersView } from './components/RecitersView';
import { ReciterDetailView } from './components/ReciterDetailView';
import { PlaylistsView } from './components/PlaylistsView';
import { SettingsView } from './components/SettingsView';
import { SearchView } from './components/SearchView';
import { AmbientSoundModal } from './components/AmbientSoundModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { SurahScriptModal } from './components/SurahScriptModal';

import { SURAHS } from './data/surahs';
import { QARIS, getSurahAudioUrl } from './data/qaris';
import { THEMES } from './data/themes';
import { AMBIENT_SOUNDS } from './data/ambientSounds';
import {
  AmbientSoundItem,
  BackgroundTheme,
  DownloadedSurah,
  NavigationTab,
  Qari,
  Surah
} from './types/quran';
import {
  clearAllOfflineData,
  deleteOfflineSurah,
  downloadAndSaveSurah,
  getAllOfflineSurahs,
  getOfflineAudioBlob
} from './services/offlineStorage';
import { ambientAudio } from './services/ambientAudio';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('reciters');
  const [selectedReciterDetail, setSelectedReciterDetail] = useState<Qari | null>(QARIS[0]); // default to Bader Al-Turki like video

  // Audio Playback
  const [currentSurah, setCurrentSurah] = useState<Surah>(SURAHS[11]); // Surah Yusuf (12) like in video!
  const [currentQari, setCurrentQari] = useState<Qari>(QARIS[0]); // Bader Al-Turki
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Hidden native audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Full Screen Player visibility
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);

  // Background Ambient Sound & Visuals
  const [activeAmbientSound, setActiveAmbientSound] = useState<AmbientSoundItem>(AMBIENT_SOUNDS[1]); // default to Rain like in video
  const [ambientVolume, setAmbientVolume] = useState<number>(0.45);
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>(THEMES[0]); // Mountain Rain
  const [isAmbientModalOpen, setIsAmbientModalOpen] = useState<boolean>(false);

  // Sleep Timer
  const [isSleepModalOpen, setIsSleepModalOpen] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepRemainingSeconds, setSleepRemainingSeconds] = useState<number | null>(null);

  // Script / Ayah modal
  const [isScriptModalOpen, setIsScriptModalOpen] = useState<boolean>(false);

  // Offline Storage
  const [downloadedSurahs, setDownloadedSurahs] = useState<DownloadedSurah[]>([]);
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());
  const [downloadProgressMap, setDownloadProgressMap] = useState<Record<number, number>>({});

  // Favorites
  const [favoriteSurahIds, setFavoriteSurahIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('ay_fav_surahs');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set([12, 1, 18, 36, 55, 67]); // Yusuf pre-favorited as in video
  });

  const [favoriteQariIds, setFavoriteQariIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('ay_fav_qaris');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(['fares_abbad', 'bader_al_turki']); // matches video favorites!
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // Load offline storage
  // -------------------------------------------------------------
  const refreshOfflineList = async () => {
    try {
      const list = await getAllOfflineSurahs();
      setDownloadedSurahs(list);
    } catch {}
  };

  useEffect(() => {
    refreshOfflineList();
  }, []);

  // -------------------------------------------------------------
  // Ambient Sound Controller (Web Audio API)
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeAmbientSound.soundId !== 'none') {
      ambientAudio.playSound(activeAmbientSound.soundId);
    } else {
      ambientAudio.stopSound();
    }
  }, [activeAmbientSound]);

  const handleSelectAmbientSound = (item: AmbientSoundItem) => {
    setActiveAmbientSound(item);

    // Switch visual theme if matching
    if (item.themeId) {
      const matchedTheme = THEMES.find((t) => t.id === item.themeId);
      if (matchedTheme) {
        setCurrentTheme(matchedTheme);
      }
    }
  };

  const handleChangeAmbientVolume = (vol: number) => {
    setAmbientVolume(vol);
    ambientAudio.setVolume(vol);
  };

  // -------------------------------------------------------------
  // Recitation Audio Source Controller
  // -------------------------------------------------------------
  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const loadSurahAudio = async () => {
      // 1. Check IndexedDB offline copy first
      const offlineBlob = await getOfflineAudioBlob(currentQari.id, currentSurah.id);
      if (!active) return;

      if (offlineBlob) {
        objectUrl = URL.createObjectURL(offlineBlob);
        setAudioSrc(objectUrl);
      } else {
        // 2. Stream online via MP3Quran server
        const url = getSurahAudioUrl(currentQari, currentSurah.id);
        setAudioSrc(url);
      }
    };

    loadSurahAudio();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentSurah, currentQari]);

  // Sync native audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioSrc) {
      audio.src = audioSrc;
      audio.playbackRate = playbackSpeed;
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    }
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // MediaSession API
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSurah) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${currentSurah.nameEnglish} (${currentSurah.nameArabic})`,
      artist: currentQari.nameEnglish,
      album: 'Al-Quran Recitation',
      artwork: [
        {
          src: currentQari.avatarUrl || '/src/assets/images/holy_kaaba_makkah_1790527911160.jpg',
          sizes: '512x512',
          type: 'image/jpeg'
        }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('previoustrack', () => handlePrevSurah());
    navigator.mediaSession.setActionHandler('nexttrack', () => handleNextSurah());
  }, [currentSurah, currentQari]);

  // -------------------------------------------------------------
  // Sleep Timer countdown
  // -------------------------------------------------------------
  useEffect(() => {
    if (sleepRemainingSeconds === null) return;

    if (sleepRemainingSeconds <= 0) {
      setIsPlaying(false);
      setSleepTimerMinutes(null);
      setSleepRemainingSeconds(null);
      showToast('🌙 Sleep timer finished, recitation stopped.');
      return;
    }

    const timer = setInterval(() => {
      setSleepRemainingSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepRemainingSeconds]);

  const handleSetSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    if (minutes === null) {
      setSleepRemainingSeconds(null);
      showToast('Sleep timer turned off');
    } else if (minutes === -1) {
      setSleepRemainingSeconds(null);
      showToast('Will stop at end of surah');
    } else {
      setSleepRemainingSeconds(minutes * 60);
      showToast(`Sleep timer set to ${minutes} minutes`);
    }
  };

  // -------------------------------------------------------------
  // Playback Controls
  // -------------------------------------------------------------
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSurah = () => {
    const nextId = currentSurah.id >= 114 ? 1 : currentSurah.id + 1;
    const next = SURAHS.find((s) => s.id === nextId);
    if (next) {
      setCurrentSurah(next);
      setIsPlaying(true);
    }
  };

  const handlePrevSurah = () => {
    const prevId = currentSurah.id <= 1 ? 114 : currentSurah.id - 1;
    const prev = SURAHS.find((s) => s.id === prevId);
    if (prev) {
      setCurrentSurah(prev);
      setIsPlaying(true);
    }
  };

  const handleCycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
    showToast(`Speed: ${speeds[nextIdx]}x`);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkipTime = (delta: number) => {
    if (audioRef.current) {
      const t = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
      audioRef.current.currentTime = t;
      setCurrentTime(t);
    }
  };

  const handleAudioEnded = () => {
    if (sleepTimerMinutes === -1) {
      setIsPlaying(false);
      setSleepTimerMinutes(null);
      showToast('Surah completed, sleep timer ended');
      return;
    }
    handleNextSurah();
  };

  // -------------------------------------------------------------
  // Offline Downloads (IndexedDB)
  // -------------------------------------------------------------
  const isSurahDownloaded = (surahId: number): boolean => {
    return downloadedSurahs.some(
      (d) => d.qariId === currentQari.id && d.surahId === surahId
    );
  };

  const handleToggleDownload = async (surah: Surah) => {
    if (isSurahDownloaded(surah.id)) {
      await deleteOfflineSurah(currentQari.id, surah.id);
      await refreshOfflineList();
      showToast(`Removed Surah ${surah.nameEnglish} from offline`);
      return;
    }

    if (downloadingIds.has(surah.id)) return;

    setDownloadingIds((prev) => new Set(prev).add(surah.id));
    setDownloadProgressMap((prev) => ({ ...prev, [surah.id]: 0 }));
    showToast(`Downloading Surah ${surah.nameEnglish}...`);

    const audioUrl = getSurahAudioUrl(currentQari, surah.id);

    try {
      await downloadAndSaveSurah(currentQari, surah, audioUrl, (percent) => {
        setDownloadProgressMap((prev) => ({ ...prev, [surah.id]: percent }));
      });
      await refreshOfflineList();
      showToast(`Surah ${surah.nameEnglish} saved for offline!`);
    } catch (err: any) {
      showToast(`Download failed: ${err.message || 'Check connection'}`);
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(surah.id);
        return next;
      });
      setDownloadProgressMap((prev) => {
        const copy = { ...prev };
        delete copy[surah.id];
        return copy;
      });
    }
  };

  const handleDownloadAll = async () => {
    showToast('Download started in background...');
    for (let i = 1; i <= Math.min(10, SURAHS.length); i++) {
      const s = SURAHS[i - 1];
      if (!isSurahDownloaded(s.id)) {
        await handleToggleDownload(s);
      }
    }
  };

  const handleDeleteOffline = async (qariId: string, surahId: number) => {
    await deleteOfflineSurah(qariId, surahId);
    await refreshOfflineList();
    showToast('Removed recording');
  };

  const handleClearAllOffline = async () => {
    if (window.confirm('Delete all offline recordings?')) {
      await clearAllOfflineData();
      await refreshOfflineList();
      showToast('All offline recordings cleared');
    }
  };

  // -------------------------------------------------------------
  // Favorite Handlers
  // -------------------------------------------------------------
  const handleToggleFavoriteSurah = () => {
    setFavoriteSurahIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentSurah.id)) {
        next.delete(currentSurah.id);
        showToast('Removed from favorites');
      } else {
        next.add(currentSurah.id);
        showToast('Added to favorites');
      }
      localStorage.setItem('ay_fav_surahs', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleToggleFavoriteQari = (qariId: string) => {
    setFavoriteQariIds((prev) => {
      const next = new Set(prev);
      if (next.has(qariId)) {
        next.delete(qariId);
      } else {
        next.add(qariId);
      }
      localStorage.setItem('ay_fav_qaris', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // -------------------------------------------------------------
  // Navigation & Reciter Selection
  // -------------------------------------------------------------
  const handleSelectReciter = (qari: Qari) => {
    setSelectedReciterDetail(qari);
    setCurrentQari(qari);
  };

  const handlePlaySurahFromList = (surah: Surah) => {
    setCurrentSurah(surah);
    setIsPlaying(true);
  };

  const handleShufflePlay = () => {
    const randomSurah = SURAHS[Math.floor(Math.random() * SURAHS.length)];
    setCurrentSurah(randomSurah);
    setIsPlaying(true);
    showToast(`Shuffled to Surah ${randomSurah.nameEnglish}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-white selection:text-black">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={handleAudioEnded}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white text-black text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-1.5">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tab Content Routing */}
      {activeTab === 'home' && (
        <HomeView
          currentQari={currentQari}
          currentSurah={currentSurah}
          isPlaying={isPlaying}
          onResumeReciter={(q) => {
            setSelectedReciterDetail(q);
            setActiveTab('reciters');
          }}
          onExploreNewReciters={() => {
            setSelectedReciterDetail(null);
            setActiveTab('reciters');
          }}
          onSelectReciter={(q) => {
            setSelectedReciterDetail(q);
            setCurrentQari(q);
            setActiveTab('reciters');
          }}
          favoriteQariIds={favoriteQariIds}
        />
      )}

      {activeTab === 'reciters' && (
        selectedReciterDetail ? (
          <ReciterDetailView
            qari={selectedReciterDetail}
            onBack={() => setSelectedReciterDetail(null)}
            currentSurah={currentSurah}
            isPlaying={isPlaying}
            onPlaySurah={handlePlaySurahFromList}
            onShufflePlay={handleShufflePlay}
            isDownloaded={isSurahDownloaded}
            isDownloading={(id) => downloadingIds.has(id)}
            downloadProgress={(id) => downloadProgressMap[id]}
            onToggleDownload={handleToggleDownload}
            onDownloadAll={handleDownloadAll}
            onOpenSurahDetails={(s) => {
              setCurrentSurah(s);
              setIsScriptModalOpen(true);
            }}
          />
        ) : (
          <RecitersView
            onSelectReciter={handleSelectReciter}
            favoriteQariIds={favoriteQariIds}
            onToggleFavoriteQari={handleToggleFavoriteQari}
          />
        )
      )}

      {activeTab === 'playlists' && (
        <PlaylistsView
          downloadedSurahs={downloadedSurahs}
          onPlaySurah={(surahId, qariId) => {
            const s = SURAHS.find((item) => item.id === surahId);
            if (qariId) {
              const q = QARIS.find((item) => item.id === qariId);
              if (q) setCurrentQari(q);
            }
            if (s) {
              setCurrentSurah(s);
              setIsPlaying(true);
            }
          }}
          onDeleteDownload={handleDeleteOffline}
          onClearAllOffline={handleClearAllOffline}
          favoriteSurahIds={favoriteSurahIds}
          surahs={SURAHS}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          currentTheme={currentTheme}
          onSelectTheme={(t) => setCurrentTheme(t)}
          onOpenAmbientModal={() => setIsAmbientModalOpen(true)}
          onOpenSleepTimer={() => setIsSleepModalOpen(true)}
          ambientVolume={ambientVolume}
          onChangeAmbientVolume={handleChangeAmbientVolume}
          sleepTimerMinutes={sleepTimerMinutes}
        />
      )}

      {activeTab === 'search' && (
        <SearchView
          onSelectSurah={(s) => {
            setCurrentSurah(s);
            setIsPlaying(true);
          }}
          onSelectReciter={(q) => {
            setSelectedReciterDetail(q);
            setCurrentQari(q);
            setActiveTab('reciters');
          }}
        />
      )}

      {/* Floating Mini Player (Shown when full player is minimized) */}
      {!isFullPlayerOpen && currentSurah && (
        <MiniPlayer
          currentSurah={currentSurah}
          currentQari={currentQari}
          isPlaying={isPlaying}
          onPlayPause={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          onNext={(e) => {
            e.stopPropagation();
            handleNextSurah();
          }}
          onPrev={(e) => {
            e.stopPropagation();
            handlePrevSurah();
          }}
          onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
        />
      )}

      {/* Bottom Navigation Bar (5 tabs matching video) */}
      <BottomNav
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'reciters' && !selectedReciterDetail) {
            setSelectedReciterDetail(QARIS[0]); // default to Bader Al-Turki view like in video
          }
        }}
      />

      {/* Full-Screen Immersive Video Player (Expanded) */}
      <FullScreenPlayer
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        currentSurah={currentSurah}
        currentQari={currentQari}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextSurah}
        onPrev={handlePrevSurah}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onSkipTime={handleSkipTime}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={handleCycleSpeed}
        activeAmbientSound={activeAmbientSound}
        onOpenAmbientModal={() => setIsAmbientModalOpen(true)}
        onOpenSleepTimer={() => setIsSleepModalOpen(true)}
        isFavorite={favoriteSurahIds.has(currentSurah.id)}
        onToggleFavorite={handleToggleFavoriteSurah}
        onOpenScriptModal={() => setIsScriptModalOpen(true)}
        onOpenQueueModal={() => {
          setIsFullPlayerOpen(false);
          setActiveTab('reciters');
        }}
        theme={currentTheme}
        volume={volume}
        onChangeVolume={(v) => setVolume(v)}
      />

      {/* Ambient Sound Selection Modal (Exact match to video 0:07 - 0:08) */}
      <AmbientSoundModal
        isOpen={isAmbientModalOpen}
        onClose={() => setIsAmbientModalOpen(false)}
        selectedSoundId={activeAmbientSound.id}
        onSelectSound={handleSelectAmbientSound}
        ambientVolume={ambientVolume}
        onChangeAmbientVolume={handleChangeAmbientVolume}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
        currentTimerMinutes={sleepTimerMinutes}
        remainingSeconds={sleepRemainingSeconds}
        onSetTimer={handleSetSleepTimer}
      />

      {/* Surah Script & Translation Sheet ('ق' button) */}
      <SurahScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        surah={currentSurah}
      />
    </div>
  );
}
