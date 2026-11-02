import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  FacilityPost,
  NewsArticle,
  ShopProduct,
  LiveStreamSession,
  LiveChatMessage,
  MatchFixture,
  MatchScorer
} from '../types';
import {
  ADMIN_EMAIL_REQUIRED,
  ADMIN_PASSWORD_REQUIRED,
  INITIAL_FIXTURES,
  CLUB_LOGO,
  CLUB_NAME
} from '../data/constants';

import { idbGet, idbSet, idbRemove, idbClear } from '../utils/storage';

export type AppView =
  | 'pistes'
  | 'fixtures'
  | 'news'
  | 'live'
  | 'shop'
  | 'admin'
  | 'profile'
  | 'post-detail'
  | 'product-detail'
  | 'news-detail';

interface AppContextType {
  currentUser: UserAccount | null;
  isAdmin: boolean;
  usersList: UserAccount[];
  facilityPosts: FacilityPost[];
  newsArticles: NewsArticle[];
  shopProducts: ShopProduct[];
  liveSessions: LiveStreamSession[];
  fixtures: MatchFixture[];
  activeLive: LiveStreamSession | null;
  currentView: AppView;
  selectedPostId: string | null;
  selectedProductId: string | null;
  selectedNewsId: string | null;
  viewHistory: { view: AppView; id?: string | null }[];
  canGoBack: boolean;

  // Navigation
  navigateTo: (view: AppView, targetId?: string | null) => void;
  goBack: () => void;

  // Auth
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (data: { fullName: string; email: string; phone: string; password: string; city?: string; role?: 'supporter' | 'joueur' | 'staff' }) => { success: boolean; message?: string };
  logout: () => void;
  deleteUserAccount: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;

  // Match Fixtures CRUD & Share to News
  createFixture: (fixture: Omit<MatchFixture, 'id' | 'createdAt'>) => void;
  updateFixture: (id: string, fixture: Partial<MatchFixture>) => void;
  deleteFixture: (id: string) => void;
  updateMatchScoreAndStatus: (id: string, params: { homeScore: number; awayScore: number; status: 'upcoming' | 'live' | 'finished'; minute?: string; scorers?: MatchScorer[]; summary?: string }) => void;
  publishMatchResultToNews: (fixtureId: string, customSummary?: string) => void;

  // Facility / Piste CRUD
  createFacilityPost: (post: Omit<FacilityPost, 'id' | 'createdAt' | 'likes' | 'commentsCount'>) => void;
  updateFacilityPost: (id: string, post: Partial<FacilityPost>) => void;
  deleteFacilityPost: (id: string) => void;
  likeFacilityPost: (id: string) => void;

  // News CRUD
  createNewsArticle: (news: Omit<NewsArticle, 'id' | 'publishedAt' | 'views'>) => void;
  updateNewsArticle: (id: string, news: Partial<NewsArticle>) => void;
  deleteNewsArticle: (id: string) => void;

  // Shop CRUD
  createShopProduct: (product: Omit<ShopProduct, 'id' | 'createdAt'>) => void;
  updateShopProduct: (id: string, product: Partial<ShopProduct>) => void;
  deleteShopProduct: (id: string) => void;

  // Live Stream
  startLiveStream: (params: { title: string; description?: string; opponent?: string; initialScore?: { lssb: number; opponentScore: number } }) => void;
  updateLiveScore: (lssb: number, opponentScore: number, minute?: string) => void;
  addLiveChatMessage: (text: string) => void;
  endLiveStream: (saveAsReplay: boolean) => void;

  // Reset
  clearAllToBlank: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'lssb_current_user_v5',
  USERS: 'lssb_users_list_v5',
  FACILITIES: 'lssb_facilities_v5',
  NEWS: 'lssb_news_v5',
  SHOP: 'lssb_shop_v5',
  LIVES: 'lssb_lives_v5',
  FIXTURES: 'lssb_fixtures_v5',
  ACTIVE_LIVE: 'lssb_active_live_v5'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [facilityPosts, setFacilityPosts] = useState<FacilityPost[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FACILITIES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NEWS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [shopProducts, setShopProducts] = useState<ShopProduct[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHOP);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [liveSessions, setLiveSessions] = useState<LiveStreamSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIVES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [fixtures, setFixtures] = useState<MatchFixture[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FIXTURES);
      return stored ? JSON.parse(stored) : INITIAL_FIXTURES;
    } catch {
      return INITIAL_FIXTURES;
    }
  });

  const [activeLive, setActiveLive] = useState<LiveStreamSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_LIVE);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Async load large records from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const idbFacilities = await idbGet<FacilityPost[]>(STORAGE_KEYS.FACILITIES);
        if (isMounted && idbFacilities && idbFacilities.length > 0) {
          setFacilityPosts(idbFacilities);
        }

        const idbUsers = await idbGet<UserAccount[]>(STORAGE_KEYS.USERS);
        if (isMounted && idbUsers && idbUsers.length > 0) {
          setUsersList(idbUsers);
        }

        const idbNews = await idbGet<NewsArticle[]>(STORAGE_KEYS.NEWS);
        if (isMounted && idbNews && idbNews.length > 0) {
          setNewsArticles(idbNews);
        }

        const idbShop = await idbGet<ShopProduct[]>(STORAGE_KEYS.SHOP);
        if (isMounted && idbShop && idbShop.length > 0) {
          setShopProducts(idbShop);
        }

        const idbLives = await idbGet<LiveStreamSession[]>(STORAGE_KEYS.LIVES);
        if (isMounted && idbLives && idbLives.length > 0) {
          setLiveSessions(idbLives);
        }

        const idbFixtures = await idbGet<MatchFixture[]>(STORAGE_KEYS.FIXTURES);
        if (isMounted && idbFixtures && idbFixtures.length > 0) {
          setFixtures(idbFixtures);
        }
      } catch (err) {
        console.warn('Error reading from IndexedDB:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('pistes');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [viewHistory, setViewHistory] = useState<{ view: AppView; id?: string | null }[]>([]);

  // Safe sync state to both IndexedDB (high capacity) & LocalStorage (fast preview fallback)
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } catch {}
      idbSet(STORAGE_KEYS.CURRENT_USER, currentUser);
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      } catch {}
      idbRemove(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersList));
    } catch {}
    idbSet(STORAGE_KEYS.USERS, usersList);
  }, [usersList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilityPosts));
    } catch {}
    idbSet(STORAGE_KEYS.FACILITIES, facilityPosts);
  }, [facilityPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsArticles));
    } catch {}
    idbSet(STORAGE_KEYS.NEWS, newsArticles);
  }, [newsArticles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOP, JSON.stringify(shopProducts));
    } catch {}
    idbSet(STORAGE_KEYS.SHOP, shopProducts);
  }, [shopProducts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIVES, JSON.stringify(liveSessions));
    } catch {}
    idbSet(STORAGE_KEYS.LIVES, liveSessions);
  }, [liveSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FIXTURES, JSON.stringify(fixtures));
    } catch {}
    idbSet(STORAGE_KEYS.FIXTURES, fixtures);
  }, [fixtures]);

  useEffect(() => {
    if (activeLive) {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_LIVE, JSON.stringify(activeLive));
      } catch {}
      idbSet(STORAGE_KEYS.ACTIVE_LIVE, activeLive);
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_LIVE);
      } catch {}
      idbRemove(STORAGE_KEYS.ACTIVE_LIVE);
    }
  }, [activeLive]);

  const isAdmin = currentUser?.role === 'admin';

  const navigateTo = (view: AppView, targetId: string | null = null) => {
    if (view === currentView && (
      (view === 'post-detail' && targetId === selectedPostId) ||
      (view === 'product-detail' && targetId === selectedProductId) ||
      (view === 'news-detail' && targetId === selectedNewsId)
    )) {
      return;
    }

    setViewHistory((prev) => [
      ...prev,
      {
        view: currentView,
        id: currentView === 'post-detail' ? selectedPostId : currentView === 'product-detail' ? selectedProductId : selectedNewsId
      }
    ]);

    if (view === 'post-detail') setSelectedPostId(targetId);
    if (view === 'product-detail') setSelectedProductId(targetId);
    if (view === 'news-detail') setSelectedNewsId(targetId);

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (viewHistory.length === 0) {
      setCurrentView('pistes');
      return;
    }

    const nextHistory = [...viewHistory];
    const previous = nextHistory.pop()!;
    setViewHistory(nextHistory);

    setCurrentView(previous.view);
    if (previous.view === 'post-detail') setSelectedPostId(previous.id || null);
    else if (previous.view === 'product-detail') setSelectedProductId(previous.id || null);
    else if (previous.view === 'news-detail') setSelectedNewsId(previous.id || null);
    else {
      setSelectedPostId(null);
      setSelectedProductId(null);
      setSelectedNewsId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (cleanEmail === ADMIN_EMAIL_REQUIRED.toLowerCase() && cleanPass === ADMIN_PASSWORD_REQUIRED) {
      const adminUser: UserAccount = {
        id: 'admin-master',
        fullName: 'Administration Lessouda Sportive',
        email: ADMIN_EMAIL_REQUIRED,
        phone: 'Sécurisé',
        city: 'Lessouda, Sidi Bouzid',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toLocaleDateString('fr-FR'),
        lastLogin: new Date().toLocaleDateString('fr-FR')
      };

      setUsersList((prev) => {
        const filtered = prev.filter((u) => u.email.toLowerCase() !== ADMIN_EMAIL_REQUIRED.toLowerCase());
        return [adminUser, ...filtered];
      });

      setCurrentUser(adminUser);
      return { success: true };
    }

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      return { success: false, message: 'Aucun compte associé à cette adresse e-mail. Veuillez créer un compte.' };
    }

    if (existing.status === 'suspended') {
      return { success: false, message: 'Ce compte a été suspendu par l\'administration du club.' };
    }

    const updatedUser: UserAccount = {
      ...existing,
      lastLogin: new Date().toLocaleDateString('fr-FR')
    };

    setUsersList((prev) => prev.map((u) => (u.id === existing.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    return { success: true };
  };

  const register = (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    city?: string;
    role?: 'supporter' | 'joueur' | 'staff';
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();

    if (cleanEmail === ADMIN_EMAIL_REQUIRED.toLowerCase() && data.password.trim() === ADMIN_PASSWORD_REQUIRED) {
      return login(cleanEmail, data.password.trim());
    }

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Un compte avec cette adresse e-mail existe déjà. Veuillez vous connecter.' };
    }

    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      city: data.city?.trim() || 'Lessouda',
      role: data.role || 'supporter',
      status: 'active',
      createdAt: new Date().toLocaleDateString('fr-FR'),
      lastLogin: new Date().toLocaleDateString('fr-FR')
    };

    setUsersList((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('pistes');
    setViewHistory([]);
  };

  const deleteUserAccount = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId && u.role !== 'admin') {
          return {
            ...u,
            status: u.status === 'active' ? 'suspended' : 'active'
          };
        }
        return u;
      })
    );
  };

  // Match Fixtures Management
  const createFixture = (fixtureData: Omit<MatchFixture, 'id' | 'createdAt'>) => {
    const newFixture: MatchFixture = {
      ...fixtureData,
      id: 'fix-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setFixtures((prev) => [newFixture, ...prev]);
  };

  const updateFixture = (id: string, updates: Partial<MatchFixture>) => {
    setFixtures((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFixture = (id: string) => {
    setFixtures((prev) => prev.filter((f) => f.id !== id));
  };

  const updateMatchScoreAndStatus = (
    id: string,
    params: {
      homeScore: number;
      awayScore: number;
      status: 'upcoming' | 'live' | 'finished';
      minute?: string;
      scorers?: MatchScorer[];
      summary?: string;
    }
  ) => {
    setFixtures((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          score: { home: params.homeScore, away: params.awayScore },
          status: params.status,
          minute: params.minute || f.minute,
          scorers: params.scorers || f.scorers,
          summary: params.summary || f.summary
        };
      })
    );
  };

  // Share Match Result directly to News
  const publishMatchResultToNews = (fixtureId: string, customSummary?: string) => {
    const match = fixtures.find((f) => f.id === fixtureId);
    if (!match) return;

    const homeScore = match.score?.home ?? 0;
    const awayScore = match.score?.away ?? 0;
    const isLSSBHome = match.homeTeam.isLSSB;
    const lssbScore = isLSSBHome ? homeScore : awayScore;
    const oppScore = isLSSBHome ? awayScore : homeScore;
    const oppName = isLSSBHome ? match.awayTeam.name : match.homeTeam.name;

    const victory = lssbScore > oppScore;
    const draw = lssbScore === oppScore;
    const resultTitle = victory
      ? `Victoire de Lessouda Sportive (${homeScore} - ${awayScore}) face à ${oppName}`
      : draw
      ? `Match Nul (${homeScore} - ${awayScore}) entre Lessouda Sportive et ${oppName}`
      : `Résultat final : ${match.homeTeam.name} ${homeScore} - ${awayScore} ${match.awayTeam.name}`;

    const scorersText = match.scorers.length > 0
      ? `Buteurs de la rencontre : ${match.scorers.map((s) => `${s.player} (${s.minute})`).join(', ')}.`
      : '';

    const summaryText = customSummary || `${match.competition} · ${resultTitle}. Rencontre disputée à ${match.stadium}. ${scorersText}`;

    const newArticle: NewsArticle = {
      id: 'news-match-' + Date.now(),
      title: resultTitle,
      category: 'resultat',
      summary: summaryText,
      content: match.summary || `Compte-rendu officiel du match opposant ${match.homeTeam.name} et ${match.awayTeam.name}.\n\nScore final : ${match.homeTeam.name} ${homeScore} - ${awayScore} ${match.awayTeam.name}.\nStade : ${match.stadium}.\nDate : ${match.date} à ${match.time}.\n\n${scorersText}\n\nFélicitations aux joueurs pour leur détermination sur le terrain ! Allez les noir et blanc !`,
      imageUrl: match.homeTeam.logo || match.awayTeam.logo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200',
      author: 'Bureau Technique LSSB',
      publishedAt: "Aujourd'hui à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      pinned: true,
      views: 1,
      matchResult: {
        homeScore,
        awayScore,
        homeName: match.homeTeam.name,
        awayName: match.awayTeam.name,
        homeLogo: match.homeTeam.logo,
        awayLogo: match.awayTeam.logo,
        stadium: match.stadium,
        date: match.date,
        scorers: match.scorers
      }
    };

    setNewsArticles((prev) => [newArticle, ...prev]);
  };

  // Facility / Piste CRUD
  const createFacilityPost = (postData: Omit<FacilityPost, 'id' | 'createdAt' | 'likes' | 'commentsCount'>) => {
    const newPost: FacilityPost = {
      ...postData,
      id: 'post-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      commentsCount: 0
    };
    setFacilityPosts((prev) => [newPost, ...prev]);
  };

  const updateFacilityPost = (id: string, updates: Partial<FacilityPost>) => {
    setFacilityPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteFacilityPost = (id: string) => {
    setFacilityPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPostId === id) goBack();
  };

  const likeFacilityPost = (id: string) => {
    setFacilityPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  // News CRUD
  const createNewsArticle = (newsData: Omit<NewsArticle, 'id' | 'publishedAt' | 'views'>) => {
    const newArticle: NewsArticle = {
      ...newsData,
      id: 'news-' + Date.now(),
      publishedAt: "Aujourd'hui à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      views: 1
    };
    setNewsArticles((prev) => [newArticle, ...prev]);
  };

  const updateNewsArticle = (id: string, updates: Partial<NewsArticle>) => {
    setNewsArticles((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteNewsArticle = (id: string) => {
    setNewsArticles((prev) => prev.filter((n) => n.id !== id));
    if (selectedNewsId === id) goBack();
  };

  // Shop CRUD
  const createShopProduct = (prodData: Omit<ShopProduct, 'id' | 'createdAt'>) => {
    const newProduct: ShopProduct = {
      ...prodData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setShopProducts((prev) => [newProduct, ...prev]);
  };

  const updateShopProduct = (id: string, updates: Partial<ShopProduct>) => {
    setShopProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteShopProduct = (id: string) => {
    setShopProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProductId === id) goBack();
  };

  // Live Stream
  const startLiveStream = (params: {
    title: string;
    description?: string;
    opponent?: string;
    initialScore?: { lssb: number; opponentScore: number };
  }) => {
    const liveSession: LiveStreamSession = {
      id: 'live-' + Date.now(),
      title: params.title,
      description: params.description,
      status: 'live',
      startedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      viewerCount: 1,
      score: params.opponent ? {
        lssb: params.initialScore?.lssb || 0,
        opponent: params.opponent,
        opponentScore: params.initialScore?.opponentScore || 0,
        minute: "1'"
      } : undefined,
      isRecorded: false,
      chatMessages: [
        {
          id: 'welcome-msg',
          userName: 'Lessouda Sportive Officiel',
          text: 'Bienvenue sur le direct officiel du club ! Allez les noir et blanc !',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isAdmin: true
        }
      ]
    };

    setActiveLive(liveSession);
    navigateTo('live');
  };

  const updateLiveScore = (lssb: number, opponentScore: number, minute?: string) => {
    if (!activeLive || !activeLive.score) return;
    setActiveLive((prev) => {
      if (!prev || !prev.score) return prev;
      return {
        ...prev,
        score: {
          ...prev.score,
          lssb,
          opponentScore,
          minute: minute || prev.score.minute
        }
      };
    });
  };

  const addLiveChatMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: LiveChatMessage = {
      id: 'msg-' + Date.now(),
      userName: currentUser?.fullName || 'Supporter',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isAdmin: currentUser?.role === 'admin'
    };

    setActiveLive((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chatMessages: [...prev.chatMessages, newMsg]
      };
    });
  };

  const endLiveStream = (saveAsReplay: boolean) => {
    if (!activeLive) return;

    if (saveAsReplay) {
      const endedSession: LiveStreamSession = {
        ...activeLive,
        status: 'ended',
        endedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isRecorded: true,
        replayUrl: activeLive.replayUrl || '',
        recordingDuration: 'Enregistré en direct'
      };
      setLiveSessions((prev) => [endedSession, ...prev]);
    }

    setActiveLive(null);
  };

  const clearAllToBlank = () => {
    setFacilityPosts([]);
    setNewsArticles([]);
    setShopProducts([]);
    setLiveSessions([]);
    setFixtures([]);
    setActiveLive(null);
    idbClear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAdmin,
        usersList,
        facilityPosts,
        newsArticles,
        shopProducts,
        liveSessions,
        fixtures,
        activeLive,
        currentView,
        selectedPostId,
        selectedProductId,
        selectedNewsId,
        viewHistory,
        canGoBack: viewHistory.length > 0,
        navigateTo,
        goBack,
        login,
        register,
        logout,
        deleteUserAccount,
        toggleUserStatus,
        createFixture,
        updateFixture,
        deleteFixture,
        updateMatchScoreAndStatus,
        publishMatchResultToNews,
        createFacilityPost,
        updateFacilityPost,
        deleteFacilityPost,
        likeFacilityPost,
        createNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,
        createShopProduct,
        updateShopProduct,
        deleteShopProduct,
        startLiveStream,
        updateLiveScore,
        addLiveChatMessage,
        endLiveStream,
        clearAllToBlank
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
