import { useEffect } from 'react';
import { useAudio } from '../store/AudioContext';

export const useMediaSession = () => {
  const { currentTrack, isPlaying, playPause, next, prev } = useAudio();

  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    const session = navigator.mediaSession as any;

    session.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album || '',
      artwork: currentTrack.cover
        ? [{ src: currentTrack.cover, sizes: '512x512', type: 'image/png' }]
        : [{ src: '/static/placeholder.png', sizes: '512x512', type: 'image/png' }],
    });

    const handlers: Record<string, () => void> = {
      play: playPause,
      pause: playPause,
      previoustrack: prev,
      nexttrack: next,
    };

    Object.entries(handlers).forEach(([action, handler]) => {
      session.setActionHandler(action, handler);
    });
  }, [currentTrack, isPlaying, playPause, next, prev]);
};