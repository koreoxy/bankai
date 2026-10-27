import { Play, Pause, Heart, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudio } from '../store/AudioContext';
import { updateTrack } from '../lib/db';
import { AudioVisualizer } from './AudioVisualizer';

interface MiniPlayerProps {
  onExpand: () => void;
}

const MiniPlayer = ({ onExpand }: MiniPlayerProps) => {
  const { currentTrack, isPlaying, playPause, next, progress, duration, dispatch } = useAudio();

  if (!currentTrack) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTrack) return;
    dispatch({ type: 'TOGGLE_LIKE', payload: currentTrack.id });
    await updateTrack({ ...currentTrack, liked: !currentTrack.liked });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onClick={onExpand}
      className="fixed bottom-14 md:bottom-0 left-0 right-0 bg-[#1f1f1f] border-t border-gray-900 px-4 py-2 flex items-center gap-3 z-40 cursor-pointer shadow-[0_-8px_24px_rgba(0,0,0,0.5)]"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>

      {/* Cover */}
      <div className="w-11 h-11 rounded overflow-hidden flex-shrink-0 bg-gray-800 relative">
        {currentTrack.cover ? (
          <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <Play size={18} />
          </div>
        )}
      </div>

      {/* Info + Waveform */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <div className="truncate">
          <p className="font-bold text-white text-sm truncate">{currentTrack.title}</p>
          <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
        </div>
        {isPlaying && <AudioVisualizer isPlaying={isPlaying} />}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <motion.button 
          whileTap={{ scale: 0.8 }} 
          onClick={toggleLike}
          className="text-gray-400 hover:text-white p-1 hidden sm:block"
        >
          <Heart size={18} className={`text-red-500 ${currentTrack.liked ? 'fill-red-500' : ''}`} />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.85 }} 
          whileHover={{ scale: 1.05 }}
          onClick={playPause} 
          className="text-white p-1"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.85 }} 
          whileHover={{ scale: 1.05 }}
          onClick={next} 
          className="text-white p-1"
        >
          <SkipForward size={22} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MiniPlayer;