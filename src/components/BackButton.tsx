import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ label = "Retour à la page précédente", className = "" }) => {
  const { goBack, canGoBack, currentView } = useApp();

  // If on top-level home and no history, don't show or show home indicator
  if (!canGoBack && currentView === 'pistes') {
    return null;
  }

  return (
    <button
      onClick={goBack}
      className={`group inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 rounded-lg backdrop-blur-sm transition-all duration-200 shadow-sm ${className}`}
      title="Revenir à la page précédente"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-zinc-400 group-hover:text-white" />
      <span className="whitespace-nowrap tracking-wide">{label}</span>
    </button>
  );
};
