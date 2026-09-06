import React, { useState } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { uploadImageToStorage } from '../lib/storage.js';

interface ImageUploaderProps {
  bucket: 'product-images' | 'category-images' | 'brand-images' | 'homepage-banners';
  currentImages?: string[];
  onImagesChange: (urls: string[]) => void;
  single?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucket,
  currentImages = [],
  onImagesChange,
  single = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadImageToStorage(bucket, file);
    setIsUploading(false);

    if (res.success && res.url) {
      if (single) {
        onImagesChange([res.url]);
      } else {
        onImagesChange([...currentImages, res.url]);
      }
    } else {
      alert(res.error || 'Failed to upload image');
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (single) {
      onImagesChange([manualUrl.trim()]);
    } else {
      onImagesChange([...currentImages, manualUrl.trim()]);
    }
    setManualUrl('');
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(currentImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Current Previews */}
      <div className="flex flex-wrap gap-3 items-center">
        {currentImages.map((url, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden group bg-white shadow-xs">
            <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {(!single || currentImages.length === 0) && (
          <label className="w-20 h-20 border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white hover:bg-brand-50/30">
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] text-slate-500 font-semibold mt-1">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {/* Or Paste Direct Public Image URL */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Or paste direct image URL (https://...)"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};
