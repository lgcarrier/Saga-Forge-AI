import React, { useState, useCallback } from 'react';
import { ToolTab, StoredCharacter, GeneratedAsset } from './types';
import HeroForge from './components/features/HeroForge';
import Worldview from './components/features/Worldview';
import NPCOnTheFly from './components/features/NPCOnTheFly';
import MonsterMenagerie from './components/features/MonsterMenagerie';
import Armoury from './components/features/Armoury';
import Canvas from './components/features/Canvas';
import { WorldviewIcon, NpcIcon, MonsterIcon, ArmouryIcon, CanvasIcon } from './components/icons/Icons';

interface TabButtonProps {
    label: ToolTab;
    activeTab: ToolTab;
    setActiveTab: (tab: ToolTab) => void;
    children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ label, activeTab, setActiveTab, children }) => (
    <button
        onClick={() => setActiveTab(label)}
        className={`flex-1 p-3 text-sm md:text-base font-cinzel transition-colors duration-300 flex flex-col items-center justify-center space-y-2 ${
        activeTab === label
            ? 'bg-brand-dark-secondary text-brand-gold border-b-2 border-brand-gold'
            : 'text-brand-parchment/60 hover:bg-brand-dark-ternary hover:text-brand-parchment'
        }`}
    >
        {children}
        <span className="hidden md:inline">{label}</span>
    </button>
);


const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ToolTab>(ToolTab.Worldview);
    const [createdCharacters, setCreatedCharacters] = useState<StoredCharacter[]>([]);
    const [worldviewAssets, setWorldviewAssets] = useState<GeneratedAsset[]>([]);
    const [npcAssets, setNpcAssets] = useState<GeneratedAsset[]>([]);
    const [monsterAssets, setMonsterAssets] = useState<GeneratedAsset[]>([]);
    const [armouryAssets, setArmouryAssets] = useState<GeneratedAsset[]>([]);
    const [canvasAssets, setCanvasAssets] = useState<GeneratedAsset[]>([]);

    const handleCharacterCreated = useCallback((character: Omit<StoredCharacter, 'id'>) => {
        const newCharacter = { ...character, id: Date.now().toString() };
        setCreatedCharacters(prev => [newCharacter, ...prev]);
        setActiveTab(ToolTab.Canvas); // Switch to canvas after character creation
    }, []);

    const addAsset = (setter: React.Dispatch<React.SetStateAction<GeneratedAsset[]>>) => 
        (asset: Omit<GeneratedAsset, 'id'>) => {
            setter(prev => [{ ...asset, id: Date.now().toString() }, ...prev]);
        };

    const renderActiveTab = () => {
        switch (activeTab) {
        case ToolTab.Worldview:
            return <Worldview characters={createdCharacters} assets={worldviewAssets} onAssetGenerated={addAsset(setWorldviewAssets)} />;
        case ToolTab.NPC:
            return <NPCOnTheFly characters={createdCharacters} assets={npcAssets} onAssetGenerated={addAsset(setNpcAssets)} />;
        case ToolTab.Monster:
            return <MonsterMenagerie characters={createdCharacters} assets={monsterAssets} onAssetGenerated={addAsset(setMonsterAssets)} />;
        case ToolTab.Armoury:
            return <Armoury characters={createdCharacters} assets={armouryAssets} onAssetGenerated={addAsset(setArmouryAssets)} />;
        case ToolTab.Canvas:
            return <Canvas characters={createdCharacters} assets={canvasAssets} onAssetGenerated={addAsset(setCanvasAssets)} />;
        default:
            return null;
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark text-brand-parchment font-roboto">
            <header className="py-4 bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-10">
                <h1 className="text-4xl md:text-5xl font-cinzel text-center text-brand-gold">
                    Saga Forge <span className="text-brand-parchment">AI</span>
                </h1>
            </header>
            
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <HeroForge onCharacterCreated={handleCharacterCreated} characters={createdCharacters} />
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="flex flex-col h-full">
                            <h2 className="text-3xl font-cinzel text-brand-gold mb-4 text-center lg:text-left">Live DM Tools</h2>
                            <div className="bg-brand-dark-ternary rounded-t-lg flex overflow-hidden">
                               <TabButton label={ToolTab.Worldview} activeTab={activeTab} setActiveTab={setActiveTab}><WorldviewIcon className="w-6 h-6" /></TabButton>
                               <TabButton label={ToolTab.NPC} activeTab={activeTab} setActiveTab={setActiveTab}><NpcIcon className="w-6 h-6" /></TabButton>
                               <TabButton label={ToolTab.Monster} activeTab={activeTab} setActiveTab={setActiveTab}><MonsterIcon className="w-6 h-6" /></TabButton>
                               <TabButton label={ToolTab.Armoury} activeTab={activeTab} setActiveTab={setActiveTab}><ArmouryIcon className="w-6 h-6" /></TabButton>
                               <TabButton label={ToolTab.Canvas} activeTab={activeTab} setActiveTab={setActiveTab}><CanvasIcon className="w-6 h-6" /></TabButton>
                            </div>
                            <div className="flex-grow">
                                {renderActiveTab()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;