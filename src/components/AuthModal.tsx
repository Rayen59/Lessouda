import React, { useState } from 'react';
import { Shield, UserPlus, LogIn, Lock, Mail, Phone, User, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLUB_NAME, CLUB_NAME_AR, CLUB_FOUNDED, CLUB_LOGO } from '../data/constants';

export const AuthModal: React.FC = () => {
  const { currentUser, login, register } = useApp();
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<'supporter' | 'joueur' | 'staff'>('supporter');
  const [password, setPassword] = useState('');

  // If user is already authenticated, do not show gate
  if (currentUser) {
    return null;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    const res = register({
      fullName,
      email,
      phone,
      password,
      city: city.trim() || 'Lessouda',
      role
    });

    if (!res.success) {
      setError(res.message || 'Une erreur est survenue lors de l\'inscription.');
    } else {
      setSuccess('Compte créé avec succès. Bienvenue sur le portail.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError('Veuillez saisir votre adresse e-mail et votre mot de passe.');
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setError(res.message || 'Identifiants invalides. Vérifiez vos informations.');
    } else {
      setSuccess('Connexion validée.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl overflow-y-auto">
      {/* Background subtle athletic lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-md my-8 bg-zinc-950 border border-zinc-800/90 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100">
        {/* Crest & Club Identity */}
        <div className="text-center mb-6">
          <div className="inline-block relative mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={CLUB_LOGO}
                alt={CLUB_NAME}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain filter drop-shadow-md"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('/public/')) {
                    target.src = '/public' + CLUB_LOGO;
                  }
                }}
              />
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-white text-zinc-950 px-2.5 py-0.5 rounded text-[10px] font-black tracking-widest shadow-lg uppercase font-heading">
              {CLUB_FOUNDED}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading mt-2">
            {CLUB_NAME}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-zinc-400 mt-0.5">
            {CLUB_NAME_AR}
          </p>
          <p className="mt-2 text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Création de compte obligatoire pour accéder au portail officiel du club.
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900/90 rounded-xl mb-6 border border-zinc-800">
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Créer un compte</span>
          </button>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Se connecter</span>
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-start gap-2.5 text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form: Register */}
        {tab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Nom complet *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Votre nom et prénom"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Votre numéro"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Ville / Région
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Lessouda / Sidi Bouzid"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Statut
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-all"
                >
                  <option value="supporter">Supporter</option>
                  <option value="joueur">Joueur</option>
                  <option value="staff">Staff technique</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Min. 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              Finaliser l'inscription et entrer
            </button>
          </form>
        ) : (
          /* Form: Login */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Adresse E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              Se connecter au portail
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-900 text-center text-[11px] text-zinc-400">
          Lessouda Sportive (LSSB) &copy; 2012 - {new Date().getFullYear()} · Tous droits réservés
        </div>
      </div>
    </div>
  );
};
