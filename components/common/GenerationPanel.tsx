import React from 'react';
import Spinner from './Spinner';
import ErrorDisplay from './ErrorDisplay';

interface GenerationPanelProps {
  title: string;
  placeholder: string;
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
  children?: React.ReactNode;
  buttonText?: string;
}

const GenerationPanel: React.FC<GenerationPanelProps> = ({
  title,
  placeholder,
  prompt,
  setPrompt,
  onGenerate,
  isLoading,
  error,
  children,
  buttonText = "Forge"
}) => {
  return (
    <div className="bg-brand-dark-secondary rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-2xl font-cinzel text-brand-gold border-b-2 border-brand-dark-ternary pb-2">{title}</h3>
      <div className="space-y-4">
        {children}
        <textarea
          className="w-full bg-brand-dark border border-brand-dark-ternary rounded-md p-3 text-brand-parchment focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition duration-200"
          rows={3}
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className="w-full bg-brand-gold hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-brand-dark font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-gold"
      >
        {isLoading ? 'Forging...' : buttonText}
      </button>

      {isLoading && <Spinner />}
      {error && <ErrorDisplay message={error} />}
    </div>
  );
};

export default GenerationPanel;