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

  // Mandatory Authentication Gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black">
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
