
import React, { useState } from 'react';
import { ModelBrowser } from './components/ModelBrowser';
import { GenerationPanel } from './components/GenerationPanel';
import type { CivitaiModel } from './types';

function App() {
  const [selectedModel, setSelectedModel] = useState<CivitaiModel | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21.5v-2.5M12 19l2-1m-2 1l-2-1" />
              </svg>
              <h1 className="text-xl font-bold ml-3 tracking-wider">AI Model Matrix</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <ModelBrowser onSelectModel={setSelectedModel} selectedModelId={selectedModel?.id} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <GenerationPanel model={selectedModel} />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 mt-8 border-t border-gray-800 text-gray-500 text-sm">
        <p>Powered by Civitai & Gemini API</p>
      </footer>
    </div>
  );
}

export default App;
