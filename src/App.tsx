import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { PWAStatusBanner } from './components/PWAStatusBanner';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import ImportButton from './components/ImportButton';
import { AudioProvider, useAudio } from './store/AudioContext';
import { useMediaSession } from './hooks/useMediaSession';
import { getTracks } from './lib/db';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library'>('home');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { playlist, currentTrack, dispatch } = useAudio();

  useMediaSession();

  useEffect(() => {
    getTracks().then((tracks) => {
      if (tracks && tracks.length > 0) {
        const rehydrated = tracks.map((t: any) => ({
          ...t,
          url: t.blob ? URL.createObjectURL(t.blob) : t.url,
        }));
        dispatch({ type: 'SET_PLAYLIST', payload: rehydrated });
      }
    });
  }, [dispatch]);

  const filteredPlaylist = playlist.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTrackItem = (track: any) => {
    const isCurrent = currentTrack?.id === track.id;
    return (
      <div
        key={track.id}
        onClick={() => dispatch({ type: 'SET_CURRENT_TRACK', payload: track })}
        className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
          isCurrent ? 'bg-[#272727] text-accent' : 'hover:bg-[#272727] text-white'
        }`}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1f1f1f] flex items-center justify-center">
          {track.cover ? (
            <img src={track.cover} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <Play size={20} className="text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{track.title}</p>
          <p className="text-gray-400 text-xs truncate">{track.artist}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-24">
        <PWAStatusBanner />
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-gray-900 bg-black/60 backdrop-blur sticky top-0 z-30">
          <span className="font-bold text-xl tracking-widest text-accent">Bankai</span>
          <ImportButton />
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'home' && (
              <div>
                <h1 className="text-3xl font-extrabold mb-6">Good day</h1>
                <div className="flex flex-col gap-2">
                  {playlist.length === 0 ? (
                    <p className="text-gray-500">No tracks imported yet. Click "Import" in the top bar to add music files!</p>
                  ) : (
                    playlist.map(renderTrackItem)
                  )}
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div>
                <h1 className="text-3xl font-extrabold mb-6">Search</h1>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-xl bg-[#1f1f1f] px-4 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {filteredPlaylist.length === 0 ? (
                    <p className="text-gray-500">No matching tracks found.</p>
                  ) : (
                    filteredPlaylist.map(renderTrackItem)
                  )}
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div>
                <h1 className="text-3xl font-extrabold mb-6">Your Library</h1>
                <div className="flex flex-col gap-2">
                  {playlist.length === 0 ? (
                    <p className="text-gray-500">No imported music. Add local files to get started.</p>
                  ) : (
                    playlist.map(renderTrackItem)
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Mini Player */}
      <MiniPlayer onExpand={() => setIsFullScreen(true)} />

      {/* Full-screen Player */}
      <FullScreenPlayer isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} />

      {/* Mobile Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}
