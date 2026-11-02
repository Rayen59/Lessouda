import React from 'react';
import { Shield, Radio, Trophy, LogOut, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLUB_NAME, CLUB_SHORT, CLUB_LOGO } from '../data/constants';

export const Navbar: React.FC = () => {
  const { currentView, navigateTo, activeLive, isAdmin, currentUser, logout, fixtures } = useApp();
  const upcomingCount = fixtures.filter((f) => f.status === 'upcoming' || f.status === 'live').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-zinc-200 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Zone 1: Brand Wordmark & Crest */}
          <button
            onClick={() => navigateTo('pistes')}
            className="flex items-center gap-3 text-left focus:outline-none group shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-950 border border-zinc-300 p-0.5 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
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
              <span className="text-lg sm:text-xl font-black uppercase tracking-wider text-zinc-950 font-heading group-hover:text-zinc-700 transition-colors whitespace-nowrap">
                {CLUB_NAME}
              </span>
              <span className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase">
                {CLUB_SHORT} · FONDÉ EN 2012
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <button
              onClick={() => navigateTo('pistes')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'pistes' || currentView === 'post-detail'
                  ? 'text-zinc-950 border-b-2 border-zinc-950 font-black'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Terrains & Pistes
            </button>

            <button
              onClick={() => navigateTo('fixtures')}
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
                currentView === 'fixtures'
                  ? 'text-zinc-950 border-b-2 border-zinc-950 font-black'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-zinc-800" />
              <span>Matchs & Calendrier</span>
              {upcomingCount > 0 && (
                <span className="text-[10px] bg-zinc-900 text-white px-1.5 py-0.2 rounded-full font-mono">
                  {upcomingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('news')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'news' || currentView === 'news-detail'
                  ? 'text-zinc-950 border-b-2 border-zinc-950 font-black'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Actualités & Scores
            </button>

            <button
              onClick={() => navigateTo('live')}
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
                currentView === 'live'
                  ? 'text-zinc-950 border-b-2 border-zinc-950 font-black'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {activeLive && (
                <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              )}
              <span>Directs & Replays</span>
              {activeLive && (
                <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-300 px-1.5 rounded">
                  LIVE
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'shop' || currentView === 'product-detail'
                  ? 'text-zinc-950 border-b-2 border-zinc-950 font-black'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Boutique Officielle
            </button>

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className={`whitespace-nowrap flex items-center gap-1.5 transition-colors py-1 cursor-pointer ${
                  currentView === 'admin'
                    ? 'text-zinc-950 border-b-2 border-zinc-950 font-black'
                    : 'text-zinc-700 hover:text-zinc-950'
                }`}
              >
                <Shield className="w-4 h-4 text-zinc-950" />
                <span>Espace Admin</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser && (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin LSSB</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('profile')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 rounded-xl hover:bg-zinc-200 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="max-w-[100px] truncate hidden sm:inline">
                      {currentUser.fullName}
                    </span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-zinc-500 hover:text-red-600 hover:bg-zinc-100 rounded-xl border border-transparent hover:border-zinc-200 transition-colors cursor-pointer"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-zinc-200 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => navigateTo('pistes')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg font-semibold ${
              currentView === 'pistes' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600'
            }`}
          >
            Terrains
          </button>
          <button
            onClick={() => navigateTo('fixtures')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg font-semibold ${
              currentView === 'fixtures' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600'
            }`}
          >
            Matchs
          </button>
          <button
            onClick={() => navigateTo('news')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg font-semibold ${
              currentView === 'news' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600'
            }`}
          >
            Actualités
          </button>
          <button
            onClick={() => navigateTo('live')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg flex items-center gap-1 font-semibold ${
              currentView === 'live' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600'
            }`}
          >
            {activeLive && <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />}
            Directs
          </button>
          <button
            onClick={() => navigateTo('shop')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg font-semibold ${
              currentView === 'shop' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-600'
            }`}
          >
            Boutique
          </button>
          {isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className={`whitespace-nowrap px-3 py-1 rounded-lg flex items-center gap-1 font-semibold ${
                currentView === 'admin' ? 'bg-zinc-950 text-white font-bold' : 'text-zinc-900 font-bold'
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
