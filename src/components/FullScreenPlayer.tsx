import { 
  Play, Pause, Heart, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX,
  ChevronDown, ListMusic, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../store/AudioContext';
import { AudioVisualizer } from './AudioVisualizer';

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenPlayer = ({ isOpen, onClose }: FullScreenPlayerProps) => {
  const { 
    currentTrack, isPlaying, playPause, next, prev, 
    progress, duration, seek, volume, isMuted, dispatch,
    isShuffle, repeatMode
  } = useAudio();

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <AnimatePresence>
      {isOpen && currentTrack && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed inset-0 bg-black z-[60] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronDown size={28} />
            </motion.button>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-xs tracking-widest uppercase">Now Playing</span>
              <AudioVisualizer isPlaying={isPlaying} />
            </div>
            <motion.button whileTap={{ scale: 0.85 }} className="text-gray-400 hover:text-white transition-colors">
              <MoreHorizontal size={24} />
            </motion.button>
          </div>

          {/* Album Art */}
          <div className="flex justify-center px-8 mt-4 mb-8 flex-shrink-0">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            >
              {currentTrack.cover ? (
                <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <Play size={64} className="text-gray-600" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Info + Like */}
          <div className="flex items-center justify-between px-8 mb-4">
            <div className="min-w-0">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white font-bold text-xl truncate"
              >
                {currentTrack.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="text-gray-400 text-sm truncate mt-0.5"
              >
                {currentTrack.artist}
              </motion.p>
            </div>
            <motion.button whileTap={{ scale: 0.8 }} className="text-gray-400 hover:text-accent ml-4 transition-colors">
              <Heart size={26} />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="px-8 mb-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer h-1"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{fmt(progress)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-6 px-8 mb-6">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
              className={`transition-colors ${isShuffle ? 'text-accent' : 'text-gray-400 hover:text-white'}`}
            >
              <Shuffle size={22} />
            </motion.button>

            <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }} onClick={prev} className="text-white">
              <SkipBack size={34} fill="white" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={playPause}
              className="bg-accent text-black rounded-full w-16 h-16 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] ml-1"
            >
              {isPlaying ? <Pause size={30} fill="black" /> : <Play size={30} fill="black" />}
            </motion.button>

            <motion.button whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.05 }} onClick={next} className="text-white">
              <SkipForward size={34} fill="white" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() =>
                dispatch({
                  type: 'SET_REPEAT_MODE',
                  payload: repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off',
                })
              }
              className={`transition-colors ${repeatMode !== 'off' ? 'text-accent' : 'text-gray-400 hover:text-white'}`}
            >
              <Repeat size={22} />
            </motion.button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 px-8">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => dispatch({ type: 'SET_MUTED', payload: !isMuted })}
              className="text-gray-400"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => dispatch({ type: 'SET_VOLUME', payload: Number(e.target.value) })}
              className="flex-1 accent-accent cursor-pointer h-1"
            />
            <ListMusic size={20} className="text-gray-400" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenPlayer;
