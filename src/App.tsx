/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { MainAudioPlayerView } from './components/MainAudioPlayerView';
import { QuickQariPickerModal } from './components/QuickQariPickerModal';
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
  RepeatMode,
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
  // Navigation: Audio Player is the primary default view!
  const [activeTab, setActiveTab] = useState<NavigationTab>('player');

  // Reciter: By default NO voice is preselected unless user previously saved one in localStorage!
  const [currentQari, setCurrentQari] = useState<Qari | null>(() => {
    try {
      const savedId = localStorage.getItem('quran_selected_qari_id');
      if (savedId) {
        const found = QARIS.find((q) => q.id === savedId);
        if (found) return found;
      }
    } catch {}
    return null; // By default no voice is preselected
  });

  const [selectedReciterDetail, setSelectedReciterDetail] = useState<Qari | null>(() => {
    try {
      const savedId = localStorage.getItem('quran_selected_qari_id');
      if (savedId) {
        return QARIS.find((q) => q.id === savedId) || null;
      }
    } catch {}
    return null;
  });

  // If no Qari has been selected yet, open the Qari Picker Modal right away so user picks their Shaykh
  const [isQariPickerOpen, setIsQariPickerOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('quran_selected_qari_id');
    } catch {
      return true;
    }
  });

  // Audio Playback
  const [currentSurah, setCurrentSurah] = useState<Surah>(SURAHS[0]); // Surah Al-Fatihah
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Hidden native audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Full Screen Player visibility
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);

  // Background Ambient Sound & Visuals (Default: SILENT - no hissing or whooshing noise on enter!)
  const [activeAmbientSound, setActiveAmbientSound] = useState<AmbientSoundItem>(AMBIENT_SOUNDS[0]); // 'none'
  const [ambientVolume, setAmbientVolume] = useState<number>(0.4);
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>(THEMES[0]); // Holy Kaaba Makkah
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
    return new Set([1, 12, 18, 36, 55, 67]);
  });

  const [favoriteQariIds, setFavoriteQariIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('ay_fav_qaris');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(['abdurrahman_sudais', 'mishary_alafasy', 'maher_almuaiqly']);
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // Guaranteed silent on initial load - stop any lingering sounds
  // -------------------------------------------------------------
  useEffect(() => {
    ambientAudio.stopSound();
  }, []);

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
    if (activeAmbientSound && activeAmbientSound.soundId !== 'none') {
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
    if (!currentQari) {
      setAudioSrc(null);
      setIsPlaying(false);
      return;
    }

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
      title: `${currentSurah.nameBangla} (${currentSurah.nameArabic})`,
      artist: currentQari ? `${currentQari.nameBangla} • ${currentQari.nameEnglish}` : 'আল-কুরআন তিলাওয়াত',
      album: 'Al-Quran Recitation Audio Player',
      artwork: [
        {
          src: currentQari?.avatarUrl || currentTheme.imageUrl || '/src/assets/images/holy_kaaba_makkah_1790527911160.jpg',
          sizes: '512x512',
          type: 'image/jpeg'
        }
      ]
    });

    navigator.mediaSession.setActionHandler('play', () => {
      if (currentQari) setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('previoustrack', () => handlePrevSurah());
    navigator.mediaSession.setActionHandler('nexttrack', () => handleNextSurah());
  }, [currentSurah, currentQari, currentTheme]);

  // -------------------------------------------------------------
  // Sleep Timer countdown
  // -------------------------------------------------------------
  useEffect(() => {
    if (sleepRemainingSeconds === null) return;

    if (sleepRemainingSeconds <= 0) {
      setIsPlaying(false);
      setSleepTimerMinutes(null);
      setSleepRemainingSeconds(null);
      showToast('🌙 স্লিপ টাইমার শেষ, তিলাওয়াত বন্ধ হয়েছে।');
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
      showToast('স্লিপ টাইমার বন্ধ করা হয়েছে');
    } else if (minutes === -1) {
      setSleepRemainingSeconds(null);
      showToast('বর্তমান সূরা শেষে তিলাওয়াত বন্ধ হবে');
    } else {
      setSleepRemainingSeconds(minutes * 60);
      showToast(`স্লিপ টাইমার: ${minutes} মিনিটে সেট করা হয়েছে`);
    }
  };

  // -------------------------------------------------------------
  // Playback Controls
  // -------------------------------------------------------------
  const handlePlayPause = () => {
    if (!currentQari) {
      setIsQariPickerOpen(true);
      showToast('অনুগ্রহ করে তিলাওয়াত শুনতে প্রথমে একজন ক্বারী নির্বাচন করুন');
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextSurah = () => {
    const nextId = currentSurah.id >= 114 ? 1 : currentSurah.id + 1;
    const next = SURAHS.find((s) => s.id === nextId);
    if (next) {
      setCurrentSurah(next);
      if (currentQari) setIsPlaying(true);
    }
  };

  const handlePrevSurah = () => {
    const prevId = currentSurah.id <= 1 ? 114 : currentSurah.id - 1;
    const prev = SURAHS.find((s) => s.id === prevId);
    if (prev) {
      setCurrentSurah(prev);
      if (currentQari) setIsPlaying(true);
    }
  };

  const handleCycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
    showToast(`স্পিড: ${speeds[nextIdx]}x`);
  };

  const handleCycleRepeatMode = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(next);
    showToast(next === 'one' ? 'বর্তমান সূরা রিপিট চালু' : next === 'all' ? 'সব সূরা রিপিট চালু' : 'রিপিট বন্ধ');
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
      showToast('সূরা সমাপ্ত, স্লিপ টাইমার অনুসারে তিলাওয়াত বন্ধ হলো');
      return;
    }

    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    handleNextSurah();
  };

  // -------------------------------------------------------------
  // Offline Downloads (IndexedDB)
  // -------------------------------------------------------------
  const isSurahDownloaded = (surahId: number): boolean => {
    if (!currentQari) return false;
    return downloadedSurahs.some(
      (d) => d.qariId === currentQari.id && d.surahId === surahId
    );
  };

  const handleToggleDownload = async (surah: Surah) => {
    if (!currentQari) {
      setIsQariPickerOpen(true);
      showToast('ডাউনলোড করতে প্রথমে একজন ক্বারী নির্বাচন করুন');
      return;
    }

    if (isSurahDownloaded(surah.id)) {
      await deleteOfflineSurah(currentQari.id, surah.id);
      await refreshOfflineList();
      showToast(`সূরা ${surah.nameBangla} অফলাইন থেকে মোছা হয়েছে`);
      return;
    }

    if (downloadingIds.has(surah.id)) return;

    setDownloadingIds((prev) => new Set(prev).add(surah.id));
    setDownloadProgressMap((prev) => ({ ...prev, [surah.id]: 0 }));
    showToast(`সূরা ${surah.nameBangla} ডাউনলোড শুরু হচ্ছে...`);

    const audioUrl = getSurahAudioUrl(currentQari, surah.id);

    try {
      await downloadAndSaveSurah(currentQari, surah, audioUrl, (percent) => {
        setDownloadProgressMap((prev) => ({ ...prev, [surah.id]: percent }));
      });
      await refreshOfflineList();
      showToast(`সূরা ${surah.nameBangla} সফলভাবে অফলাইনে সংরক্ষিত!`);
    } catch (err: any) {
      showToast(`ডাউনলোড ব্যর্থ হয়েছে: ${err.message || 'ইন্টারনেট চেক করুন'}`);
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

  const handleDeleteOffline = async (qariId: string, surahId: number) => {
    await deleteOfflineSurah(qariId, surahId);
    await refreshOfflineList();
    showToast('অফলাইন তিলাওয়াত মোছা হয়েছে');
  };

  const handleClearAllOffline = async () => {
    if (window.confirm('সকল অফলাইন সংরক্ষিত সূরা মুছে ফেলতে চান?')) {
      await clearAllOfflineData();
      await refreshOfflineList();
      showToast('সকল অফলাইন তিলাওয়াত পরিষ্কার করা হয়েছে');
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
        showToast('প্রিয় তালিকা থেকে বাদ দেওয়া হয়েছে');
      } else {
        next.add(currentSurah.id);
        showToast('প্রিয় তালিকায় যুক্ত করা হয়েছে');
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
  // Qari Selection (Persists for subsequent visits!)
  // -------------------------------------------------------------
  const handleSelectQari = (qari: Qari) => {
    setCurrentQari(qari);
    setSelectedReciterDetail(qari);
    try {
      localStorage.setItem('quran_selected_qari_id', qari.id);
    } catch {}
    setIsQariPickerOpen(false);
    showToast(`${qari.nameBangla} নির্বাচিত হয়েছেন`);
  };

  const handlePlaySurahFromList = (surah: Surah) => {
    setCurrentSurah(surah);
    if (!currentQari) {
      setIsQariPickerOpen(true);
      showToast('অনুগ্রহ করে তিলাওয়াত শুনতে একজন ক্বারী নির্বাচন করুন');
      return;
    }
    setIsPlaying(true);
  };

  const handleShufflePlay = () => {
    const randomSurah = SURAHS[Math.floor(Math.random() * SURAHS.length)];
    setCurrentSurah(randomSurah);
    if (!currentQari) {
      setIsQariPickerOpen(true);
      showToast('অনুগ্রহ করে প্রথমে একজন ক্বারী নির্বাচন করুন');
      return;
    }
    setIsPlaying(true);
    showToast(`এলোমেলো সূরা: ${randomSurah.nameBangla}`);
  };

  return (
    <div className="min-h-screen bg-[#09090c] text-white selection:bg-emerald-500 selection:text-black">
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
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold font-bangla shadow-2xl animate-fade-in flex items-center gap-1.5 border border-emerald-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tab Routing */}
      {activeTab === 'player' && (
        <MainAudioPlayerView
          currentSurah={currentSurah}
          currentQari={currentQari}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNextSurah={handleNextSurah}
          onPrevSurah={handlePrevSurah}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          onSkipTime={handleSkipTime}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={handleCycleSpeed}
          repeatMode={repeatMode}
          onCycleRepeatMode={handleCycleRepeatMode}
          onOpenQariPicker={() => setIsQariPickerOpen(true)}
          onSelectQari={handleSelectQari}
          theme={currentTheme}
          onSelectTheme={(t) => setCurrentTheme(t)}
          onOpenSleepTimer={() => setIsSleepModalOpen(true)}
          sleepTimerMinutes={sleepTimerMinutes}
          sleepRemainingSeconds={sleepRemainingSeconds}
          onOpenScriptModal={() => setIsScriptModalOpen(true)}
          isFavoriteSurah={favoriteSurahIds.has(currentSurah.id)}
          onToggleFavoriteSurah={handleToggleFavoriteSurah}
          surahs={SURAHS}
          onPlaySurah={handlePlaySurahFromList}
          onShuffleSurahs={handleShufflePlay}
          isDownloaded={isSurahDownloaded}
          isDownloading={(id) => downloadingIds.has(id)}
          downloadProgress={(id) => downloadProgressMap[id]}
          onToggleDownload={handleToggleDownload}
          onOpenSurahDetails={(s) => {
            setCurrentSurah(s);
            setIsScriptModalOpen(true);
          }}
          onExpandPlayer={() => setIsFullPlayerOpen(true)}
          volume={volume}
          onChangeVolume={(v) => setVolume(v)}
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
            onDownloadAll={() => {
              if (selectedReciterDetail) {
                showToast('ডাউনলোড ব্যাকগ্রাউন্ডে চলছে...');
              }
            }}
            onOpenSurahDetails={(s) => {
              setCurrentSurah(s);
              setIsScriptModalOpen(true);
            }}
          />
        ) : (
          <RecitersView
            onSelectReciter={(q) => {
              handleSelectQari(q);
              setSelectedReciterDetail(q);
            }}
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
              if (q) handleSelectQari(q);
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

      {activeTab === 'search' && (
        <SearchView
          onSelectSurah={(s) => {
            handlePlaySurahFromList(s);
            setActiveTab('player');
          }}
          onSelectReciter={(q) => {
            handleSelectQari(q);
            setActiveTab('player');
          }}
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

      {/* Floating Mini Player (Shown when on secondary tabs and player is not full screen) */}
      {!isFullPlayerOpen && activeTab !== 'player' && currentSurah && (
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

      {/* Bottom Navigation Bar */}
      <BottomNav
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'reciters' && !selectedReciterDetail && currentQari) {
            setSelectedReciterDetail(currentQari);
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
          setActiveTab('player');
        }}
        theme={currentTheme}
        onSelectTheme={(t) => setCurrentTheme(t)}
        volume={volume}
        onChangeVolume={(v) => setVolume(v)}
        onOpenQariPicker={() => setIsQariPickerOpen(true)}
      />

      {/* Quick Qari Selection Modal (Opens by default on first launch & when user clicks Change Qari) */}
      <QuickQariPickerModal
        isOpen={isQariPickerOpen}
        onClose={() => setIsQariPickerOpen(false)}
        currentQari={currentQari}
        onSelectQari={handleSelectQari}
        isInitialRequired={!currentQari}
      />

      {/* Ambient Sound Selection Modal */}
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
