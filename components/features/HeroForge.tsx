import React, { useState } from 'react';
import { generateHeroPortrait } from '../../services/geminiService';
import { GeneratedAsset, StoredCharacter } from '../../types';
import Spinner from '../common/Spinner';
import ErrorDisplay from '../common/ErrorDisplay';

interface HeroForgeProps {
    onCharacterCreated: (character: Omit<StoredCharacter, 'id'>) => void;
    characters: StoredCharacter[];
}

const HeroForge: React.FC<HeroForgeProps> = ({ onCharacterCreated, characters }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedAsset | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !imageFile) {
      setError("Please provide both a description and an image.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateHeroPortrait(prompt, imageFile);
      // FIX: Add an id to the result object to match the GeneratedAsset type.
      setResult({ ...response, id: Date.now().toString() });
      if(response.imageUrl) {
        onCharacterCreated({ description: prompt, imageUrl: response.imageUrl });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-dark-secondary rounded-lg shadow-lg p-6 space-y-4 h-full flex flex-col">
       <h2 className="text-3xl font-cinzel text-brand-gold border-b-2 border-brand-dark-ternary pb-2 text-center">The Hero Forge</h2>
       <p className="text-center text-brand-parchment/70">Transform a photo into a fantasy character portrait.</p>
        <div className="flex-grow space-y-4">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-brand-parchment/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-brand-dark hover:file:bg-yellow-600"
                disabled={isLoading}
            />
            {imagePreview && !result?.imageUrl && (
                <div className="mt-4">
                <img src={imagePreview} alt="Preview" className="rounded-lg max-h-48 mx-auto" />
                </div>
            )}
            <textarea
                className="w-full bg-brand-dark border border-brand-dark-ternary rounded-md p-3 text-brand-parchment focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition duration-200"
                rows={4}
                placeholder="e.g., A stoic elven ranger with silver hair and a longbow, ancient forest background."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
            />
        </div>
        <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim() || !imageFile}
            className="w-full bg-brand-gold hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-brand-dark font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-gold"
        >
            {isLoading ? 'Forging Character...' : 'Forge Portrait'}
        </button>

        {isLoading && <Spinner />}
        {error && <ErrorDisplay message={error} />}
        
        {result && result.imageUrl && (
            <div className="mt-4 p-4 bg-brand-dark rounded-lg animate-fade-in">
                <h3 className="text-xl font-cinzel text-brand-gold mb-2 text-center">New Portrait Forged!</h3>
                <img src={result.imageUrl} alt="Generated Character" className="rounded-lg w-full object-cover shadow-lg" />
            </div>
        )}

        {characters.length > 0 && (
            <div className="mt-6 border-t-2 border-brand-dark-ternary pt-4">
                <h3 className="text-xl font-cinzel text-brand-gold mb-3">Forged Heroes Roster</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {characters.map(char => (
                        <div key={char.id} className="flex items-center space-x-3 bg-brand-dark p-2 rounded-md">
                            <img src={char.imageUrl} alt={char.description} className="w-12 h-12 rounded-md object-cover flex-shrink-0"/>
                            <p className="text-sm text-brand-parchment/80 truncate flex-1">{char.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default HeroForge;