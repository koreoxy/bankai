import { 
  Play, Pause, Heart, SkipForward, SkipBack, Shuffle, Repeat, Volume2, VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../store/AudioContext';
import { updateTrack } from '../lib/db';
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

  const toggleLike = async () => {
    if (!currentTrack) return;
    dispatch({ type: 'TOGGLE_LIKE', payload: currentTrack.id });
    await updateTrack({ ...currentTrack, liked: !currentTrack.liked });
  };

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
          className="fixed inset-0 bg-[#121316] z-[60] flex flex-col overflow-hidden scanline"
        >
          {/* Header / Window Title Bar */}
          <div className="flex items-center justify-between p-3 flex-shrink-0 window-title-bar-active border-b-2 border-[#0A0A0C]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-widest text-black">WIN_PLAYER.EXE</span>
              <AudioVisualizer isPlaying={isPlaying} />
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              className="btn-retro btn-retro-accent py-0.5 px-2 text-xs"
            >
              [X]
            </motion.button>
          </div>

          {/* Main Container */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
            {/* Album Art CRT Screen */}
            <div className="w-full aspect-square bevel-inset p-2 mb-6 relative">
              {currentTrack.cover ? (
                <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0A0A0C]">
                  <Play size={64} className="text-[#3A3D45]" />
                </div>
              )}
            </div>

            {/* Info + Like */}
            <div className="w-full flex items-center justify-between bevel-raised p-4 mb-4">
              <div className="min-w-0">
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#FF7A59] font-bold text-xl truncate"
                >
                  {currentTrack.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="text-[#8A909A] text-sm truncate mt-0.5 font-mono"
                >
                  {currentTrack.artist}
                </motion.p>
              </div>
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={toggleLike}
                className="btn-retro p-2"
              >
                <Heart size={20} className={currentTrack.liked ? 'fill-[#FF499E] text-[#FF499E]' : 'text-[#8A909A]'} />
              </motion.button>
            </div>

            {/* Progress Bar Inset */}
            <div className="w-full bevel-inset p-3 mb-6">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full accent-[#FF7A59] cursor-pointer h-2 bg-transparent"
              />
              <div className="flex justify-between text-xs text-[#8A909A] mt-2 font-mono">
                <span>{fmt(progress)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Main Controls Bevel */}
            <div className="flex items-center justify-center gap-4 bevel-raised p-4 w-full mb-6">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
                className={`btn-retro ${isShuffle ? 'btn-retro-accent' : ''}`}
              >
                <Shuffle size={18} />
              </motion.button>

              <motion.button whileTap={{ scale: 0.85 }} onClick={prev} className="btn-retro">
                <SkipBack size={18} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={playPause}
                className="btn-retro btn-retro-accent px-6 py-2 text-lg"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              <motion.button whileTap={{ scale: 0.85 }} onClick={next} className="btn-retro">
                <SkipForward size={18} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  const nextMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
                  dispatch({ type: 'SET_REPEAT_MODE', payload: nextMode });
                }}
                className={`btn-retro ${repeatMode !== 'off' ? 'btn-retro-accent' : ''}`}
              >
                <Repeat size={18} />
              </motion.button>
            </div>

            {/* Volume Control Bar */}
            <div className="flex items-center gap-3 bevel-raised p-3 w-full">
              <button
                onClick={() => dispatch({ type: 'SET_MUTED', payload: !isMuted })}
                className="btn-retro p-1"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={16} className="text-[#FF499E]" />
                ) : (
                  <Volume2 size={16} className="text-[#00D2FF]" />
                )}
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_VOLUME', payload: Math.max(0, volume - 0.1) })}
                className="btn-retro px-2 py-0.5 text-xs"
              >
                -
              </button>
              <div className="flex-1 bevel-inset h-3 relative overflow-hidden">
                <div
                  className="h-full bg-[#00D2FF]"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_VOLUME', payload: Math.min(1, volume + 0.1) })}
                className="btn-retro px-2 py-0.5 text-xs"
              >
                +
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenPlayer;