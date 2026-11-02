import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Video as VideoIcon, Upload, Trash2, X, Plus, Film } from 'lucide-react';

interface GalleryPickerProps {
  label: string;
  sublabel?: string;
  acceptType?: 'image' | 'video' | 'both';
  multiple?: boolean;
  value: string[]; // array of base64 or URL strings
  onChange: (items: string[]) => void;
  maxFiles?: number;
}

export const GalleryPicker: React.FC<GalleryPickerProps> = ({
  label,
  sublabel = "Sélectionnez depuis la galerie de votre téléphone ou ordinateur",
  acceptType = 'image',
  multiple = false,
  value,
  onChange,
  maxFiles = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const acceptMime =
    acceptType === 'image'
      ? 'image/*'
      : acceptType === 'video'
      ? 'video/*'
      : 'image/*,video/*';

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const readPromises: Promise<string>[] = [];

    const fileList = Array.from(files).slice(0, multiple ? maxFiles - value.length : 1);

    for (const file of fileList) {
      const promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error("Format non lisible"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      readPromises.push(promise);
    }

    Promise.all(readPromises)
      .then((newItems) => {
        if (multiple) {
          onChange([...value, ...newItems]);
        } else {
          onChange([newItems[0]]);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la lecture des fichiers de la galerie", err);
      })
      .finally(() => {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (multiple) {
      onChange([...value, urlInput.trim()]);
    } else {
      onChange([urlInput.trim()]);
    }
    setUrlInput('');
    setShowUrlField(false);
  };

  const isVideo = (url: string) => {
    return (
      url.startsWith('data:video/') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov')
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
            {label}
          </label>
          {sublabel && (
            <p className="text-[10px] text-zinc-400 mt-0.5">{sublabel}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="text-[10px] text-zinc-400 hover:text-white underline"
        >
          {showUrlField ? "Masquer saisie URL" : "Ou coller une URL"}
        </button>
      </div>

      {/* Hidden native file input for gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMime}
        multiple={multiple}
        onChange={handleFilesSelected}
        className="hidden"
      />

      {/* Gallery Button & Drop area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative border-2 border-dashed border-zinc-700/80 hover:border-white bg-zinc-900/60 hover:bg-zinc-900/90 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200"
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-lg">
            {acceptType === 'video' ? (
              <Film className="w-5 h-5 text-white" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </div>

          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-heading block">
              {isProcessing ? "Chargement en cours..." : "Ouvrir la Galerie"}
            </span>
            <span className="text-[11px] text-zinc-400 block">
              {acceptType === 'video'
                ? "Cliquez pour choisir une vidéo depuis votre appareil"
                : acceptType === 'both'
                ? "Cliquez pour choisir des photos ou vidéos depuis votre appareil"
                : "Cliquez pour sélectionner des photos depuis votre galerie"}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-zinc-950 font-bold text-[10px] uppercase tracking-wider rounded-lg shadow mt-1">
            <Upload className="w-3 h-3" />
            <span>Sélectionner depuis la galerie</span>
          </div>
        </div>
      </div>

      {/* URL Input option if toggled */}
      {showUrlField && (
        <form onSubmit={handleAddUrl} className="flex gap-2 p-2 bg-zinc-900 rounded-xl border border-zinc-800">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... (Lien direct de l'image ou vidéo)"
            className="flex-1 px-3 py-1.5 bg-black border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-white text-zinc-950 text-xs font-bold rounded-lg"
          >
            Ajouter
          </button>
        </form>
      )}

      {/* Previews Grid from Gallery */}
      {value.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase text-zinc-400 block">
            Fichier(s) sélectionné(s) ({value.length}) :
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {value.map((item, idx) => (
              <div
                key={idx}
                className="relative aspect-video sm:aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group/thumb shadow"
              >
                {isVideo(item) ? (
                  <video
                    src={item}
                    controls={false}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={item}
                    alt={`Galerie ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-red-600 text-white rounded-md transition-colors shadow"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Video tag indicator */}
                {isVideo(item) && (
                  <div className="absolute bottom-1.5 left-1.5 bg-black/80 text-[9px] font-mono font-bold text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                    <VideoIcon className="w-2.5 h-2.5" />
                    <span>VIDÉO</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
