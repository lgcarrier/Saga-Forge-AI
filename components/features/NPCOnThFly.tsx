
import React, { useState } from 'react';
import GenerationPanel from '../common/GenerationPanel';
import { generateNPC } from '../../services/geminiService';
import { GeneratedAsset } from '../../types';

const renderJsonData = (data: Record<string, any>) => (
    <div className="text-left space-y-2 bg-brand-dark p-4 rounded-md">
        {Object.entries(data).map(([key, value]) => (
            <div key={key}>
                <p className="font-bold capitalize text-brand-gold">{key}:</p>
                <p className="text-brand-parchment/80 whitespace-pre-wrap">{String(value)}</p>
            </div>
        ))}
    </div>
);

const NPCOnTheFly: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedAsset | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateNPC(prompt);
      // FIX: Add an id to the result object to match the GeneratedAsset type.
      setResult({ ...response, id: Date.now().toString() });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
        <GenerationPanel
          title="NPC-on-the-Fly"
          placeholder="e.g., A shifty goblin merchant with a strange accent"
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          // FIX: Removed invalid 'result' prop. GenerationPanel does not accept it.
          buttonText="Forge NPC"
        />
        {/* FIX: Added rendering logic for the generated result below the panel. */}
        {result && (
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 bg-brand-dark-secondary p-4 rounded-lg">
                <div className="p-4 bg-brand-dark rounded-lg animate-fade-in space-y-4">
                    {result.imageUrl && <img src={result.imageUrl} alt="Generated NPC" className="rounded-lg w-full object-cover shadow-lg" />}
                    {result.jsonData && renderJsonData(result.jsonData)}
                </div>
            </div>
        )}
    </div>
  );
};

export default NPCOnTheFly;