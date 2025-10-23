
import React, { useState } from 'react';
import type { CivitaiModel } from '../types';
import { generateImageWithGemini } from '../services/geminiService';
import { SparklesIcon, LoaderIcon } from './icons/Icons';

interface GenerationPanelProps {
  model: CivitaiModel | null;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({ model }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt || !model) {
      setError("Please select a model and enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const fullPrompt = `Photorealistic image, ${prompt}, using the style of the AI model "${model.name}". High detail, cinematic lighting.`;

    try {
      const imageUrl = await generateImageWithGemini(fullPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSafeDescription = (description: string | null) => {
    if (!description) return 'No description available.';
    // Basic sanitization to prevent rendering raw HTML
    const div = document.createElement('div');
    div.innerHTML = description;
    return div.textContent || div.innerText || 'No description available.';
  }

  if (!model) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">Select a Model</h3>
          <p className="mt-1 text-sm text-gray-500">Choose a model from the browser to get started.</p>
        </div>
      </div>
    );
  }

  const previewImageUrl = model.modelVersions?.[0]?.images?.[0]?.url || `https://picsum.photos/seed/${model.id}/400/500`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Info & Generation Result */}
        <div className="flex flex-col space-y-4">
          <img src={previewImageUrl} alt={model.name} className="rounded-lg w-full aspect-[4/5] object-cover bg-gray-700" />
          <div className="bg-gray-700/50 rounded-lg p-4 h-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <LoaderIcon className="w-12 h-12 animate-spin text-indigo-400" />
                <p className="mt-4 text-gray-300">Generating your masterpiece...</p>
                <p className="text-sm text-gray-500">This may take a moment.</p>
              </div>
            ) : generatedImage ? (
                <img src={generatedImage} alt="Generated image" className="rounded-lg w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-400">Your generated image will appear here.</p>
              </div>
            )}
          </div>
        </div>
        {/* Controls & Details */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-indigo-300">{model.name}</h2>
            <p className="text-sm text-gray-400">by {model.creator?.username || 'Unknown'} • <span className="font-semibold">{model.type}</span></p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg text-sm text-gray-300 max-h-48 overflow-y-auto">
             <p>{getSafeDescription(model.description)}</p>
          </div>
          <div className="flex-grow flex flex-col space-y-4">
             <textarea
                placeholder={`A vibrant cityscape in the style of ${model.name}...`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none flex-grow"
              />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt}
              className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="h-5 w-5 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" /> Generate Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
