import { Plus } from 'lucide-react';
import * as mm from 'music-metadata-browser';
import { saveTrack } from '../lib/db';
import { useAudio } from '../store/AudioContext';

const ImportButton = () => {
  const { dispatch } = useAudio();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const url = URL.createObjectURL(file);
      let title = file.name.replace(/\.[^/.]+$/, "");
      let artist = 'Unknown Artist';
      let cover = '';
      let duration = 0;

      try {
        const metadata = await mm.parseBlob(file);
        if (metadata.common.title) title = metadata.common.title;
        if (metadata.common.artist) artist = metadata.common.artist;
        if (metadata.format.duration) duration = metadata.format.duration;

        const picture = metadata.common.picture?.[0];
        if (picture) {
          const blob = new Blob([new Uint8Array(picture.data)], { type: picture.format });
          cover = URL.createObjectURL(blob);
        }
      } catch (err) {
        console.warn('Metadata parse error', err);
      }

      const track = {
        id: crypto.randomUUID(),
        title,
        artist,
        cover,
        url,
        duration,
        blob: file,
      };

      await saveTrack(track);
      dispatch({ type: 'ADD_TRACK', payload: track });
    }
  };

  return (
    <label className="btn-retro flex items-center gap-2 cursor-pointer select-none">
      <Plus size={16} className="text-[#FF7A59]" />
      <span>IMPORT.EXE</span>
      <input type="file" multiple accept="audio/*" className="hidden" onChange={handleImport} />
    </label>
  );
};

export default ImportButton;