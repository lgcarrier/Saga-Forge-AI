import React, { useState } from 'react';
import GenerationPanel from '../common/GenerationPanel';
import { generateArmouryItem } from '../../services/geminiService';
import { GeneratedAsset, StoredCharacter } from '../../types';

interface ArmouryProps {
    characters: StoredCharacter[];
    assets: GeneratedAsset[];
    onAssetGenerated: (asset: Omit<GeneratedAsset, 'id'>) => void;
}

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

const Armoury: React.FC<ArmouryProps> = ({ characters, assets, onAssetGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const selectedCharacter = characters.find(c => c.id === selectedCharacterId);
      const response = await generateArmouryItem(prompt, selectedCharacter);
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
        title="The Armoury"
        placeholder="e.g., A shortsword that whispers secrets in the dark"
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        error={error}
        buttonText="Forge Item"
      >
        {characters.length > 0 && (
            <div className="flex items-center space-x-3 p-2 bg-brand-dark rounded-lg">
                <label htmlFor="character-select-armoury" className="font-bold text-brand-parchment flex-shrink-0">Feature Hero:</label>
                <select
                    id="character-select-armoury"
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
            <h3 className="text-xl font-cinzel text-brand-gold sticky top-0 bg-brand-dark-secondary pb-2">Generated Items</h3>
            {assets.map(asset => (
                <div key={asset.id} className="p-4 bg-brand-dark rounded-lg animate-fade-in space-y-4">
                    {asset.imageUrl && <img src={asset.imageUrl} alt="Generated Item" className="rounded-lg w-full object-cover shadow-lg" />}
                    {asset.jsonData && renderJsonData(asset.jsonData)}
                    {asset.text && <p className="text-brand-parchment/90 whitespace-pre-wrap">{asset.text}</p>}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Armoury;