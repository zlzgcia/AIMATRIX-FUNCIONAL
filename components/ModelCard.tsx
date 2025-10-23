
import React from 'react';
import type { CivitaiModel } from '../types';

interface ModelCardProps {
  model: CivitaiModel;
  onSelect: () => void;
  isSelected: boolean;
}

const getPreviewImageUrl = (model: CivitaiModel): string => {
  const firstVersion = model.modelVersions?.[0];
  const firstImage = firstVersion?.images?.[0];
  // Prefer a non-NSFW image if possible
  const safeImage = firstVersion?.images?.find(img => img.nsfw === 'None');
  return safeImage?.url || firstImage?.url || `https://picsum.photos/seed/${model.id}/300/400`;
};


export const ModelCard: React.FC<ModelCardProps> = ({ model, onSelect, isSelected }) => {
  const imageUrl = getPreviewImageUrl(model);

  return (
    <div
      onClick={onSelect}
      className={`bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ease-in-out ${isSelected ? 'border-indigo-500 shadow-indigo-500/30' : 'border-transparent hover:border-indigo-600/50'}`}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={imageUrl}
          alt={model.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h3 className="font-bold text-sm leading-tight truncate">{model.name}</h3>
          <p className="text-xs text-gray-300 truncate">by {model.creator?.username || 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
};
