import { Play, Pause, Heart, SkipForward, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudio } from '../store/AudioContext';
import { updateTrack } from '../lib/db';
import { AudioVisualizer } from './AudioVisualizer';

interface MiniPlayerProps {
  onExpand: () => void;
}

const MiniPlayer = ({ onExpand }: MiniPlayerProps) => {
  const { currentTrack, isPlaying, playPause, next, progress, duration, dispatch, volume, isMuted } = useAudio();

  if (!currentTrack) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTrack) return;
    dispatch({ type: 'TOGGLE_LIKE', payload: currentTrack.id });
    await updateTrack({ ...currentTrack, liked: !currentTrack.liked });
  };

  const changeVolume = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    const newVol = Math.max(0, Math.min(1, volume + delta));
    dispatch({ type: 'SET_VOLUME', payload: newVol });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      onClick={onExpand}
      className="fixed bottom-[52px] md:bottom-0 left-0 right-0 p-2 sm:p-3 z-40 cursor-pointer window-frame bg-[#1E2025] select-none"
    >
      {/* Progress bar */}
      <div className="absolute top-[-2px] left-0 right-0 h-1 bevel-inset">
        <div className="h-full bg-[#FF7A59] transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Cover */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bevel-inset overflow-hidden">
          {currentTrack.cover ? (
            <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8A909A]">
              <Play size={16} />
            </div>
          )}
        </div>

        {/* Info + Waveform */}
        <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-4">
          <div className="truncate">
            <p className="font-bold text-[#F0F4F8] text-xs sm:text-sm truncate">{currentTrack.title}</p>
            <p className="text-[#8A909A] text-[10px] sm:text-xs truncate font-mono">{currentTrack.artist}</p>
          </div>
          <AudioVisualizer isPlaying={isPlaying} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Spotify-style Volume Controls */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'SET_MUTED', payload: !isMuted });
              }}
              className="btn-retro p-1"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={16} className="text-[#FF499E]" />
              ) : volume < 0.5 ? (
                <Volume1 size={16} className="text-[#00D2FF]" />
              ) : (
                <Volume2 size={16} className="text-[#00D2FF]" />
              )}
            </button>
            <button
              onClick={(e) => changeVolume(e, -0.1)}
              className="btn-retro px-2 py-1 text-xs"
              title="Volume Down"
            >
              -
            </button>
            <div className="w-16 h-2 bevel-inset relative overflow-hidden">
              <div
                className="h-full bg-[#00D2FF] transition-all"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
            <button
              onClick={(e) => changeVolume(e, 0.1)}
              className="btn-retro px-2 py-1 text-xs"
              title="Volume Up"
            >
              +
            </button>
          </div>

          <motion.button 
            whileTap={{ scale: 0.8 }} 
            onClick={toggleLike}
            className="btn-retro"
          >
            <Heart size={16} className={currentTrack.liked ? 'fill-[#FF499E] text-[#FF499E]' : ''} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.85 }} 
            onClick={playPause} 
            className="btn-retro btn-retro-accent"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.85 }} 
            onClick={next} 
            className="btn-retro"
          >
            <SkipForward size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MiniPlayer;