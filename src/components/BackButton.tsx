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
      className={`group inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 rounded-xl transition-all duration-200 shadow-xs cursor-pointer ${className}`}
      title="Revenir à la page précédente"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-zinc-500 group-hover:text-zinc-950" />
      <span className="whitespace-nowrap tracking-wide">{label}</span>
    </button>
  );
};
