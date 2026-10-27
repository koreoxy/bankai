import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';
import { PWAStatusBanner } from './components/PWAStatusBanner';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MiniPlayer from './components/MiniPlayer';
import FullScreenPlayer from './components/FullScreenPlayer';
import ImportButton from './components/ImportButton';
import { AudioProvider, useAudio } from './store/AudioContext';
import { useMediaSession } from './hooks/useMediaSession';
import { getTracks, updateTrack } from './lib/db';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library' | 'liked'>('home');
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
  
  const likedPlaylist = playlist.filter(track => track.liked);

  const toggleLikeTrack = async (e: React.MouseEvent, track: any) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_LIKE', payload: track.id });
    await updateTrack({ ...track, liked: !track.liked });
  };

  const renderTrackItem = (track: any) => {
    const isCurrent = currentTrack?.id === track.id;
    return (
      <div
        key={track.id}
        onClick={() => dispatch({ type: 'SET_CURRENT_TRACK', payload: track })}
        className={`flex items-center gap-4 px-4 py-3 cursor-pointer bevel-raised ${
          isCurrent ? 'bg-[#282B32]' : 'hover:bg-[#282B32]'
        }`}
      >
        <div className="w-12 h-12 bevel-inset flex-shrink-0 flex items-center justify-center">
          {track.cover ? (
            <img src={track.cover} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <Play size={20} className="text-[#8A909A]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate text-[#F0F4F8]">{track.title}</p>
          <p className="text-[#8A909A] text-xs truncate">{track.artist}</p>
        </div>
        <button
          onClick={(e) => toggleLikeTrack(e, track)}
          className="btn-retro"
        >
          <Heart size={18} className={track.liked ? 'fill-[#FF499E] text-[#FF499E]' : ''} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#121316] text-[#F0F4F8] overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-24">
        <PWAStatusBanner />
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between border-b-2 border-[#3A3D45] bg-[#1E2025] sticky top-0 z-30">
          <span className="font-bold text-xl tracking-widest text-[#FF7A59]">BANKAI.OS</span>
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
                <h1 className="text-3xl font-extrabold mb-6">WELCOME BACK</h1>
                <div className="flex flex-col gap-2">
                  {playlist.length === 0 ? (
                    <p className="text-[#8A909A]">NO TRACKS IMPORTED. USE IMPORT.EXE</p>
                  ) : (
                    playlist.map(renderTrackItem)
                  )}
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div>
                <h1 className="text-3xl font-extrabold mb-6">SEARCH</h1>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search track or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-xl bevel-inset px-4 py-3 text-sm outline-none focus:border-[#FF7A59] text-[#F0F4F8]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {filteredPlaylist.length === 0 ? (
                    <p className="text-[#8A909A]">NO MATCHING TRACKS FOUND.</p>
                  ) : (
                    filteredPlaylist.map(renderTrackItem)
                  )}
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div>
                <h1 className="text-3xl font-extrabold mb-6">YOUR LIBRARY</h1>
                <div className="flex flex-col gap-2">
                  {playlist.length === 0 ? (
                    <p className="text-[#8A909A]">NO IMPORTED MUSIC. ADD LOCAL FILES.</p>
                  ) : (
                    playlist.map(renderTrackItem)
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'liked' && (
              <div>
                <h1 className="text-3xl font-extrabold mb-6">LIKED SONGS</h1>
                <div className="flex flex-col gap-2">
                  {likedPlaylist.length === 0 ? (
                    <p className="text-[#8A909A]">NO LIKED SONGS YET.</p>
                  ) : (
                    likedPlaylist.map(renderTrackItem)
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
