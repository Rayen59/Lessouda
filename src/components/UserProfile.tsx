import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, Shield, LogOut, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';
import { CLUB_NAME, CLUB_SHORT, CLUB_LOGO } from '../data/constants';

export const UserProfile: React.FC = () => {
  const { currentUser, logout, navigateTo, isAdmin } = useApp();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
          <BackButton label="Retour au site" />
          <h1 className="text-2xl font-black uppercase tracking-wider text-white font-heading">
            Mon Espace Membre Supporter
          </h1>
        </div>

        <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-800 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-2xl text-white font-heading shadow-inner">
              {currentUser.fullName.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black uppercase text-white font-heading">
                  {currentUser.fullName}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-950">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Membre vérifié de Lessouda Sportive (LSSB 2012)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-zinc-500 uppercase font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Adresse E-mail
              </span>
              <p className="text-sm font-medium text-white">{currentUser.email}</p>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-zinc-500 uppercase font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                Téléphone / WhatsApp
              </span>
              <p className="text-sm font-mono font-medium text-white">{currentUser.phone}</p>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-zinc-500 uppercase font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Ville / Résidence
              </span>
              <p className="text-sm font-medium text-white">{currentUser.city || 'Lessouda'}</p>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-zinc-500 uppercase font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Date d'inscription
              </span>
              <p className="text-sm font-medium text-white">{currentUser.createdAt}</p>
            </div>
          </div>

          {isAdmin && (
            <div className="p-4 bg-amber-950/40 border border-amber-900/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Privilèges Administrateur</h4>
                  <p className="text-[11px] text-zinc-400">Accès complet à la gestion des pistes, des lives, des utilisateurs et de la boutique.</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('admin')}
                className="px-3 py-1.5 bg-amber-400 text-zinc-950 font-bold text-xs uppercase rounded-lg hover:bg-amber-300 transition-colors"
              >
                Ouvrir Admin
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => navigateTo('pistes')}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-900/60 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
