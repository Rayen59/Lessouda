import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { PistesFeed } from './components/PistesFeed';
import { MatchFixturesPage } from './components/MatchFixturesPage';
import { NewsSection } from './components/NewsSection';
import { LiveReplaySection } from './components/LiveReplaySection';
import { ShopSection } from './components/ShopSection';
import { AdminSpace } from './components/AdminSpace';
import { UserProfile } from './components/UserProfile';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentUser, currentView, isAdmin } = useApp();

  // Mandatory Authentication Gate - Clean, white dominant athletic style
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100/90 flex items-center justify-center p-4">
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {currentView === 'pistes' && <PistesFeed />}
        {currentView === 'fixtures' && <MatchFixturesPage />}
        {currentView === 'news' && <NewsSection />}
        {currentView === 'live' && <LiveReplaySection />}
        {currentView === 'shop' && <ShopSection />}
        {currentView === 'admin' && (isAdmin ? <AdminSpace /> : <PistesFeed />)}
        {currentView === 'profile' && <UserProfile />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
