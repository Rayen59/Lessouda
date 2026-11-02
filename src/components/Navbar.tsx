import React from 'react';
import { Shield, Radio, Trophy, LogOut, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLUB_NAME, CLUB_SHORT, CLUB_LOGO } from '../data/constants';

export const Navbar: React.FC = () => {
  const { currentView, navigateTo, activeLive, isAdmin, currentUser, logout, fixtures } = useApp();
  const upcomingCount = fixtures.filter((f) => f.status === 'upcoming' || f.status === 'live').length;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark & Crest */}
          <button
            onClick={() => navigateTo('pistes')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-900 border border-zinc-800 p-0.5 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              <img
                src={CLUB_LOGO}
                alt={CLUB_SHORT}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('/public/')) {
                    target.src = '/public' + CLUB_LOGO;
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-heading group-hover:text-zinc-200 transition-colors whitespace-nowrap">
                {CLUB_NAME}
              </span>
              <span className="text-[11px] font-semibold text-zinc-400 tracking-widest uppercase">
                {CLUB_SHORT} · 2012
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => navigateTo('pistes')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'pistes' || currentView === 'post-detail'
                  ? 'text-white border-b-2 border-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Terrains & Pistes
            </button>

            <button
              onClick={() => navigateTo('fixtures')}
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
                currentView === 'fixtures'
                  ? 'text-white border-b-2 border-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Matchs & Calendrier</span>
              {upcomingCount > 0 && (
                <span className="text-[10px] bg-zinc-800 text-white px-1.5 py-0.2 rounded-full font-mono">
                  {upcomingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('news')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'news' || currentView === 'news-detail'
                  ? 'text-white border-b-2 border-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Actualités
            </button>

            <button
              onClick={() => navigateTo('live')}
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
                currentView === 'live'
                  ? 'text-white border-b-2 border-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {activeLive && (
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              )}
              <span>Directs & Replays</span>
              {activeLive && (
                <span className="text-[10px] font-bold text-red-400 bg-red-950/80 border border-red-800 px-1.5 rounded">
                  LIVE
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'shop' || currentView === 'product-detail'
                  ? 'text-white border-b-2 border-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Boutique Officielle
            </button>

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className={`whitespace-nowrap flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
                  currentView === 'admin'
                    ? 'text-white border-b-2 border-white font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-white" />
                <span>Espace Admin</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1 Primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser && (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl transition-colors shadow cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin LSSB</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('profile')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="max-w-[100px] truncate hidden sm:inline">
                      {currentUser.fullName}
                    </span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-xl border border-transparent hover:border-zinc-800 transition-colors cursor-pointer"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-between py-2.5 border-t border-zinc-900 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => navigateTo('pistes')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg ${
              currentView === 'pistes' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400'
            }`}
          >
            Terrains
          </button>
          <button
            onClick={() => navigateTo('fixtures')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg ${
              currentView === 'fixtures' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400'
            }`}
          >
            Matchs
          </button>
          <button
            onClick={() => navigateTo('news')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg ${
              currentView === 'news' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400'
            }`}
          >
            Actualités
          </button>
          <button
            onClick={() => navigateTo('live')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg flex items-center gap-1 ${
              currentView === 'live' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400'
            }`}
          >
            {activeLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
            Directs
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg ${
              currentView === 'shop' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400'
            }`}
          >
            Boutique
          </button>
          {isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className={`whitespace-nowrap px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                currentView === 'admin' ? 'bg-white text-zinc-950 font-bold' : 'text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
