import { createContext, useContext, useReducer, type ReactNode, useEffect, useRef } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  url: string;
  duration: number;
  liked?: boolean;
  blob?: Blob;
}

interface AudioState {
  playlist: Track[];
  currentTrack: Track | null;
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
}

type Action =
  | { type: 'SET_PLAYLIST'; payload: Track[] }
  | { type: 'SET_CURRENT_TRACK'; payload: Track }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MUTED'; payload: boolean }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'off' | 'all' | 'one' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'ADD_TRACK'; payload: Track }
  | { type: 'REMOVE_TRACK'; payload: string }
  | { type: 'TOGGLE_LIKE'; payload: string };

const initialState: AudioState = {
  playlist: [],
  currentTrack: null,
  currentIndex: -1,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off',
};

function audioReducer(state: AudioState, action: Action): AudioState {
  switch (action.type) {
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'SET_CURRENT_TRACK':
      return { 
        ...state, 
        currentTrack: action.payload,
        currentIndex: state.playlist.findIndex(t => t.id === action.payload.id),
        progress: 0,
        duration: action.payload.duration,
      };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };
    case 'SET_MUTED':
      return { ...state, isMuted: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, isShuffle: !state.isShuffle };
    case 'SET_REPEAT_MODE':
      return { ...state, repeatMode: action.payload };
    case 'NEXT_TRACK': {
      if (state.playlist.length === 0) return state;
      let nextIndex = state.currentIndex;
      if (state.repeatMode === 'one') return state;
      if (state.isShuffle) {
        nextIndex = Math.floor(Math.random() * state.playlist.length);
      } else {
        nextIndex = (state.currentIndex + 1) % state.playlist.length;
        if (nextIndex === 0 && state.repeatMode === 'off') {
          return { ...state, isPlaying: false, progress: 0 };
        }
      }
      return { 
        ...state, 
        currentTrack: state.playlist[nextIndex],
        currentIndex: nextIndex,
        progress: 0,
        duration: state.playlist[nextIndex].duration,
      };
    }
    case 'PREV_TRACK': {
      if (state.playlist.length === 0) return state;
      let prevIndex = state.currentIndex;
      if (state.isShuffle) {
        prevIndex = Math.floor(Math.random() * state.playlist.length);
      } else {
        prevIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
      }
      return { 
        ...state, 
        currentTrack: state.playlist[prevIndex],
        currentIndex: prevIndex,
        progress: 0,
        duration: state.playlist[prevIndex].duration,
      };
    }
    case 'ADD_TRACK':
      return { ...state, playlist: [...state.playlist, action.payload] };
    case 'REMOVE_TRACK':
      return { ...state, playlist: state.playlist.filter(t => t.id !== action.payload) };
    case 'TOGGLE_LIKE': {
      const updatedPlaylist = state.playlist.map(t => 
        t.id === action.payload ? { ...t, liked: !t.liked } : t
      );
      const updatedCurrentTrack = state.currentTrack?.id === action.payload 
        ? { ...state.currentTrack, liked: !state.currentTrack.liked }
        : state.currentTrack;
      return { ...state, playlist: updatedPlaylist, currentTrack: updatedCurrentTrack };
    }
    default:
      return state;
  }
}

interface AudioContextType extends AudioState {
  dispatch: React.Dispatch<Action>;
  audioRef: React.RefObject<HTMLAudioElement>;
  playPause: () => void;
  seek: (time: number) => void;
  next: () => void;
  prev: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = state.volume;
    audio.muted = state.isMuted;

    const handleTimeUpdate = () => dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime });
    const handleLoadedMetadata = () => dispatch({ type: 'SET_DURATION', payload: audio.duration });
    
    const handleEnded = () => {
      if (state.repeatMode === 'one') {
        // Replay current track from beginning
        audio.currentTime = 0;
        if (state.isPlaying) {
          audio.play().catch(console.error);
        }
        return;
      }
      // For 'all' or 'off', go to next track
      dispatch({ type: 'NEXT_TRACK' });
    };

    const handlePlay = () => dispatch({ type: 'SET_PLAYING', payload: true });
    const handlePause = () => dispatch({ type: 'SET_PLAYING', payload: false });

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [state.volume, state.isMuted, state.repeatMode, state.isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = state.isMuted ? 0 : state.volume;
    audio.muted = state.isMuted;
  }, [state.volume, state.isMuted]);

  useEffect(() => {
    if (state.currentTrack && audioRef.current.src !== state.currentTrack.url) {
      audioRef.current.src = state.currentTrack.url;
      if (state.isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [state.currentTrack]);

  const playPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  };

  const seek = (time: number) => {
    audioRef.current.currentTime = time;
    dispatch({ type: 'SET_PROGRESS', payload: time });
  };

  const next = () => dispatch({ type: 'NEXT_TRACK' });
  const prev = () => dispatch({ type: 'PREV_TRACK' });

  return (
    <AudioContext.Provider value={ { 
      ...state, 
      dispatch, 
      audioRef, 
      playPause, 
      seek, 
      next, 
      prev, 
    }} >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};