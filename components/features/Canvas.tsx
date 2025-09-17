import React, { useState } from 'react';
import GenerationPanel from '../common/GenerationPanel';
import { generateCanvasScene } from '../../services/geminiService';
import { GeneratedAsset, StoredCharacter } from '../../types';

interface CanvasProps {
    characters: StoredCharacter[];
    assets: GeneratedAsset[];
    onAssetGenerated: (asset: Omit<GeneratedAsset, 'id'>) => void;
}

const Canvas: React.FC<CanvasProps> = ({ characters, assets, onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default to the most recently created character, if available.
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
      characters.length > 0 ? characters[0].id : null
  );

  React.useEffect(() => {
    // Auto-select the newest character when the list updates and no character is selected
    if (!selectedCharacterId && characters.length > 0) {
      setSelectedCharacterId(characters[0].id);
    }
  }, [characters, selectedCharacterId]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const selectedCharacter = characters.find(c => c.id === selectedCharacterId);
        const response = await generateCanvasScene(prompt, selectedCharacter);
        onAssetGenerated(response);
        setPrompt('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <GenerationPanel
          title="The Canvas"
          placeholder="Describe the full scene. e.g., '...facing a dragon in a cavern filled with treasure.'"
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          buttonText="Render Scene"
      >
          {characters.length > 0 && (
              <div className="flex items-center space-x-3 p-2 bg-brand-dark rounded-lg">
                  <label htmlFor="character-select-canvas" className="font-bold text-brand-parchment flex-shrink-0">Feature Hero:</label>
                  <select
                      id="character-select-canvas"
                      value={selectedCharacterId ?? 'none'}
                      onChange={(e) => setSelectedCharacterId(e.target.value === 'none' ? null : e.target.value)}
                      className="w-full bg-brand-dark-ternary border border-brand-dark-ternary rounded-md p-2 text-brand-parchment focus:ring-2 focus:ring-brand-gold"
                  >
                      <option value="none">None</option>
                      {characters.map(char => (
                          <option key={char.id} value={char.id}>{char.description}</option>
                      ))}
                  </select>
              </div>
          )}
      </GenerationPanel>
      
      {assets.length > 0 && (
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 bg-brand-dark-secondary p-4 rounded-lg">
            <h3 className="text-xl font-cinzel text-brand-gold sticky top-0 bg-brand-dark-secondary pb-2">Rendered Scenes</h3>
            {assets.map(asset => (
                <div key={asset.id} className="p-4 bg-brand-dark rounded-lg animate-fade-in space-y-4">
                    {asset.imageUrl && <img src={asset.imageUrl} alt="Rendered Scene" className="rounded-lg w-full object-cover shadow-lg" />}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Canvas;