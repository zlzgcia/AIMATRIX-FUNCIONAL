
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchModels } from '../services/civitaiService';
import type { CivitaiModel } from '../types';
import { ModelCard } from './ModelCard';
import { SearchIcon, LoaderIcon } from './icons/Icons';

interface ModelBrowserProps {
  onSelectModel: (model: CivitaiModel) => void;
  selectedModelId?: number | null;
}

const MODEL_TYPES = ['Checkpoint', 'LORA', 'TextualInversion', 'Hypernetwork', 'AestheticGradient', 'Controlnet', 'Poses'];

export const ModelBrowser: React.FC<ModelBrowserProps> = ({ onSelectModel, selectedModelId }) => {
  const [models, setModels] = useState<CivitaiModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modelType, setModelType] = useState('Checkpoint');
  
  const debounceTimeout = useRef<number | null>(null);

  const fetchModels = useCallback(async (query: string, type: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedModels = await searchModels(query, type);
      setModels(fetchedModels);
    } catch (err) {
      setError('Failed to load models. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    // Initial fetch
    fetchModels('', 'Checkpoint');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = window.setTimeout(() => {
      fetchModels(e.target.value, modelType);
    }, 500);
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModelType(e.target.value);
    fetchModels(searchQuery, e.target.value);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-indigo-300">Model Browser</h2>
      <div className="space-y-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <select
          value={modelType}
          onChange={handleTypeChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {MODEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoaderIcon className="h-8 w-8 animate-spin text-indigo-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {models.filter(m => m.modelVersions?.[0]?.images?.length > 0).map(model => (
              <ModelCard 
                key={model.id} 
                model={model} 
                onSelect={() => onSelectModel(model)}
                isSelected={selectedModelId === model.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
