import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Users,
  BarChart3,
  MapPin,
  Radio,
  ShoppingBag,
  Newspaper,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle,
  XCircle,
  Video,
  Camera,
  Play,
  Square,
  Upload,
  RefreshCw,
  Trophy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';
import { GalleryPicker } from './GalleryPicker';
import {
  AVAILABLE_EQUIPMENTS_LIST,
  CLUB_NAME,
  CLUB_SHORT
} from '../data/constants';
import { FacilityPost, ShopProduct, NewsArticle, UserAccount } from '../types';

type AdminTab = 'overview' | 'users' | 'facilities' | 'live' | 'shop' | 'news';

export const AdminSpace: React.FC = () => {
  const {
    usersList,
    facilityPosts,
    newsArticles,
    shopProducts,
    liveSessions,
    fixtures,
    activeLive,
    navigateTo,
    deleteUserAccount,
    toggleUserStatus,
    createFacilityPost,
    updateFacilityPost,
    deleteFacilityPost,
    createShopProduct,
    updateShopProduct,
    deleteShopProduct,
    createNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
    startLiveStream,
    updateLiveScore,
    endLiveStream,
    clearAllToBlank
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal / Form states for Facility
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [facilityTitle, setFacilityTitle] = useState('');
  const [facilityCategory, setFacilityCategory] = useState<FacilityPost['category']>('terrain_synthetique');
  const [facilityType, setFacilityType] = useState<'location' | 'media'>('location');
  const [facilityDescription, setFacilityDescription] = useState('');
  const [facilityImages, setFacilityImages] = useState<string[]>(['']);
  const [facilityVideoUrl, setFacilityVideoUrl] = useState('');
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [facilityPrice, setFacilityPrice] = useState<number>(50);
  const [facilityCapacity, setFacilityCapacity] = useState('');
  const [facilityDimensions, setFacilityDimensions] = useState('');

  // Modal for Shop
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [editingShopId, setEditingShopId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState<ShopProduct['category']>('maillot');
  const [productPrice, setProductPrice] = useState<number>(60);
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState<string[]>(['']);
  const [productSizes, setProductSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [productBadge, setProductBadge] = useState('Officiel LSSB');

  // Modal for News
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsArticle['category']>('communique');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsPinned, setNewsPinned] = useState(false);

  // Live broadcast state
  const [liveTitle, setLiveTitle] = useState('Direct Officiel Lessouda Sportive');
  const [liveOpponent, setLiveOpponent] = useState('');
  const [liveScoreLssb, setLiveScoreLssb] = useState(0);
  const [liveScoreOpponent, setLiveScoreOpponent] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setIsCameraActive(false);
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleLaunchLive = () => {
    startLiveStream({
      title: liveTitle,
      opponent: liveOpponent.trim() || undefined,
      initialScore: liveOpponent.trim() ? { lssb: liveScoreLssb, opponentScore: liveScoreOpponent } : undefined
    });
  };

  // Open Facility Create / Edit
  const handleOpenFacilityModal = (postToEdit?: FacilityPost) => {
    if (postToEdit) {
      setEditingFacilityId(postToEdit.id);
      setFacilityTitle(postToEdit.title);
      setFacilityCategory(postToEdit.category);
      setFacilityType(postToEdit.postType);
      setFacilityDescription(postToEdit.description);
      setFacilityImages(postToEdit.images.length > 0 ? postToEdit.images : ['']);
      setFacilityVideoUrl(postToEdit.videoUrl || '');
      setSelectedEquipments(postToEdit.availableEquipments || []);
      setFacilityPrice(postToEdit.pricingPerHour || 50);
      setFacilityCapacity(postToEdit.capacity || '');
      setFacilityDimensions(postToEdit.dimensions || '');
    } else {
      setEditingFacilityId(null);
      setFacilityTitle('');
      setFacilityCategory('terrain_synthetique');
      setFacilityType('location');
      setFacilityDescription('');
      setFacilityImages(['']);
      setFacilityVideoUrl('');
      setSelectedEquipments([]);
      setFacilityPrice(50);
      setFacilityCapacity('');
      setFacilityDimensions('');
    }
    setIsFacilityModalOpen(true);
  };

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityTitle.trim()) return;

    const cleanImages = facilityImages.filter((img) => img.trim().length > 0);
    const postPayload = {
      title: facilityTitle.trim(),
      category: facilityCategory,
      postType: facilityType,
      description: facilityDescription.trim(),
      images: cleanImages.length > 0 ? cleanImages : ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200'],
      videoUrl: facilityVideoUrl.trim() || undefined,
      availableEquipments: facilityType === 'location' ? selectedEquipments : [],
      pricingPerHour: facilityType === 'location' ? Number(facilityPrice) : undefined,
      capacity: facilityCapacity.trim() || undefined,
      dimensions: facilityDimensions.trim() || undefined,
      status: 'disponible' as const,
      authorName: 'Administration LSSB'
    };

    if (editingFacilityId) {
      updateFacilityPost(editingFacilityId, postPayload);
    } else {
      createFacilityPost(postPayload);
    }
    setIsFacilityModalOpen(false);
  };

  // Open Shop Create / Edit
  const handleOpenShopModal = (prodToEdit?: ShopProduct) => {
    if (prodToEdit) {
      setEditingShopId(prodToEdit.id);
      setProductName(prodToEdit.name);
      setProductCategory(prodToEdit.category);
      setProductPrice(prodToEdit.price);
      setProductDescription(prodToEdit.description);
      setProductImages(prodToEdit.images);
      setProductSizes(prodToEdit.sizes);
      setProductBadge(prodToEdit.badge || '');
    } else {
      setEditingShopId(null);
      setProductName('');
      setProductCategory('maillot');
      setProductPrice(65);
      setProductDescription('');
      setProductImages(['']);
      setProductSizes(['S', 'M', 'L', 'XL']);
      setProductBadge('Officiel LSSB');
    }
    setIsShopModalOpen(true);
  };

  const handleSaveShopProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const cleanImages = productImages.filter((img) => img.trim().length > 0);
    const payload = {
      name: productName.trim(),
      category: productCategory,
      price: Number(productPrice),
      description: productDescription.trim(),
      images: cleanImages.length > 0 ? cleanImages : ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1000'],
      sizes: productSizes,
      inStock: true,
      badge: productBadge.trim() || undefined
    };

    if (editingShopId) {
      updateShopProduct(editingShopId, payload);
    } else {
      createShopProduct(payload);
    }
    setIsShopModalOpen(false);
  };

  // Open News Create / Edit
  const handleOpenNewsModal = (newsToEdit?: NewsArticle) => {
    if (newsToEdit) {
      setEditingNewsId(newsToEdit.id);
      setNewsTitle(newsToEdit.title);
      setNewsCategory(newsToEdit.category);
      setNewsSummary(newsToEdit.summary);
      setNewsContent(newsToEdit.content);
      setNewsImageUrl(newsToEdit.imageUrl);
      setNewsPinned(!!newsToEdit.pinned);
    } else {
      setEditingNewsId(null);
      setNewsTitle('');
      setNewsCategory('communique');
      setNewsSummary('');
      setNewsContent('');
      setNewsImageUrl('');
      setNewsPinned(false);
    }
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    const payload = {
      title: newsTitle.trim(),
      category: newsCategory,
      summary: newsSummary.trim() || newsTitle.trim().slice(0, 100),
      content: newsContent.trim(),
      imageUrl: newsImageUrl.trim() || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200',
      author: 'Bureau Directeur LSSB',
      pinned: newsPinned
    };

    if (editingNewsId) {
      updateNewsArticle(editingNewsId, payload);
    } else {
      createNewsArticle(payload);
    }
    setIsNewsModalOpen(false);
  };

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 pb-20">
      {/* Top Banner - Clean White */}
      <div className="bg-white border-b border-zinc-200 py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton label="Retour au site" />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-950"></span>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                  Espace Administration Officiel LSSB
                </h1>
              </div>
              <p className="text-xs text-zinc-600">
                Gestion des comptes, des installations sportives, des directs, de la boutique et des actualités
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Confirmer la réinitialisation à l'état vierge de toutes les publications ?")) {
                clearAllToBlank();
              }
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-zinc-600 hover:text-red-600 bg-zinc-100 hover:bg-red-50 border border-zinc-200 hover:border-red-200 rounded-xl transition-colors cursor-pointer"
          >
            Réinitialiser à l'état vierge
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="border-b border-zinc-200 bg-white/95 sticky top-18 z-30 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Statistiques</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Comptes Créés ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('facilities')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'facilities'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Pistes & Terrains ({facilityPosts.length})</span>
            </button>

            <button
              onClick={() => navigateTo('fixtures')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-all whitespace-nowrap cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-zinc-950" />
              <span>Matchs & Calendrier ({fixtures.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'live'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Studio Live Direct</span>
              {activeLive && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Boutique & Maillots ({shopProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Actualités Club ({newsArticles.length})</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ================= TAB 1: OVERVIEW & STATS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Comptes Inscrits</span>
                  <Users className="w-4 h-4 text-zinc-800" />
                </div>
                <div className="text-3xl font-black text-zinc-950 font-heading">
                  {usersList.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">Inscriptions obligatoires</div>
              </div>

              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pistes & Terrains</span>
                  <MapPin className="w-4 h-4 text-zinc-800" />
                </div>
                <div className="text-3xl font-black text-zinc-950 font-heading">
                  {facilityPosts.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">Publications actives</div>
              </div>

              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Articles & News</span>
                  <Newspaper className="w-4 h-4 text-zinc-800" />
                </div>
                <div className="text-3xl font-black text-zinc-950 font-heading">
                  {newsArticles.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">Communiqués officiels</div>
              </div>

              <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-zinc-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Articles en Boutique</span>
                  <ShoppingBag className="w-4 h-4 text-zinc-800" />
                </div>
                <div className="text-3xl font-black text-zinc-950 font-heading">
                  {shopProducts.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">Vente en ligne</div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-wider text-zinc-950 font-heading flex items-center gap-2">
                  <Shield className="w-5 h-5 text-zinc-950" />
                  Administration du Portail Lessouda Sportive
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-2xl">
                  Vous disposez des droits complets pour configurer le site : créer des pistes d'athlétisme et terrains avec inventaire d'équipements, lancer des retransmissions en direct, publier des articles officiels et ajouter des maillots à la boutique.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => { setActiveTab('facilities'); handleOpenFacilityModal(); }}
                  className="px-4 py-2 bg-zinc-950 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  + Ajouter une piste
                </button>
                <button
                  onClick={() => { setActiveTab('shop'); handleOpenShopModal(); }}
                  className="px-4 py-2 bg-white border border-zinc-300 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  + Ajouter un maillot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: USERS LIST ================= */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-950 font-heading">
                  Tous les Comptes Créés ({usersList.length})
                </h2>
                <p className="text-xs text-zinc-600">
                  Comptes créés obligatoirement par les utilisateurs
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Recherche par nom, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white w-56"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:bg-white cursor-pointer"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="supporter">Supporters</option>
                  <option value="joueur">Joueurs</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-700">
                  <thead className="bg-zinc-100 uppercase tracking-wider text-[11px] text-zinc-600 border-b border-zinc-200 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Utilisateur</th>
                      <th className="py-3.5 px-4">E-mail</th>
                      <th className="py-3.5 px-4">Téléphone</th>
                      <th className="py-3.5 px-4">Ville</th>
                      <th className="py-3.5 px-4">Rôle</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                          Aucun compte enregistré dans la liste.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-zinc-950">
                            {u.fullName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-zinc-600">{u.email}</td>
                          <td className="py-3.5 px-4 font-mono text-zinc-600">{u.phone}</td>
                          <td className="py-3.5 px-4 text-zinc-600">{u.city || 'Lessouda'}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 border border-zinc-200 text-zinc-800">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-500">{u.createdAt}</td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              disabled={u.role === 'admin'}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                                u.status === 'active'
                                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-300'
                                  : 'text-red-700 bg-red-50 border border-red-300'
                              }`}
                            >
                              {u.status === 'active' ? 'Actif' : 'Suspendu'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Supprimer le compte de ${u.fullName} ?`)) {
                                    deleteUserAccount(u.id);
                                  }
                                }}
                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PISTES & TERRAINS ================= */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-950 font-heading">
                  Gestion des Terrains, Pistes & Médias ({facilityPosts.length})
                </h2>
                <p className="text-xs text-zinc-600">
                  Créer des locations avec équipements détaillés ou partager des photos/vidéos
                </p>
              </div>

              <button
                onClick={() => handleOpenFacilityModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouvelle Piste / Publication</span>
              </button>
            </div>

            {facilityPosts.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
                <MapPin className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-zinc-950 mb-1 uppercase font-heading">
                  Aucune piste enregistrée (Site vierge)
                </h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto mb-4">
                  Cliquez sur le bouton ci-dessous pour créer votre première piste d'athlétisme, terrain de foot ou publication média.
                </p>
                <button
                  onClick={() => handleOpenFacilityModal()}
                  className="px-5 py-2.5 bg-zinc-950 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
                >
                  Créer une piste
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilityPosts.map((post) => (
                  <div key={post.id} className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl overflow-hidden flex flex-col group shadow-xs">
                    <div className="relative h-48 bg-zinc-100 overflow-hidden">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-black/80 text-[10px] font-bold uppercase text-white rounded">
                          {post.postType === 'location' ? 'Location Équipée' : 'Média'}
                        </span>
                        {post.pricingPerHour && (
                          <span className="px-2 py-0.5 bg-white text-zinc-950 text-[10px] font-black rounded shadow-xs">
                            {post.pricingPerHour} DT/h
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-950 text-base font-heading mb-1 line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-zinc-600 line-clamp-2 mb-2">
                          {post.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">
                          {post.createdAt}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenFacilityModal(post)}
                            className="p-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded border border-zinc-200 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer "${post.title}" ?`)) {
                                deleteFacilityPost(post.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-zinc-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: LIVE STUDIO ================= */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-950 font-heading">
                  Studio Live Direct (Retransmission LSSB)
                </h2>
                <p className="text-xs text-zinc-600">
                  Démarrez un direct retransmis sur le site avec possibilité d'enregistrement
                </p>
              </div>

              {activeLive && (
                <button
                  onClick={() => {
                    const save = window.confirm("Arrêter la diffusion ? Souhaitez-vous enregistrer ce live dans l'Espace Replays ?");
                    handleStopCamera();
                    endLiveStream(save);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Arrêter le direct
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl overflow-hidden flex flex-col shadow-xs">
                <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                  />

                  {!isCameraActive && (
                    <div className="text-center p-6">
                      <Video className="w-12 h-12 text-zinc-500 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-white uppercase font-heading">
                        Caméra hors ligne
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                        Activez la caméra pour prévisualiser le flux ou lancez directement le live.
                      </p>
                      <button
                        onClick={handleStartCamera}
                        className="mt-3 px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs text-white rounded-xl font-semibold cursor-pointer"
                      >
                        Activer la caméra
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white border-t border-zinc-200 flex items-center justify-between">
                  <button
                    onClick={isCameraActive ? handleStopCamera : handleStartCamera}
                    className="px-3.5 py-1.5 text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl cursor-pointer"
                  >
                    {isCameraActive ? 'Désactiver caméra' : 'Activer caméra'}
                  </button>

                  {!activeLive ? (
                    <button
                      onClick={handleLaunchLive}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Démarrer le Direct
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const save = window.confirm("Arrêter la diffusion ? Sauvegarder dans les replays ?");
                        handleStopCamera();
                        endLiveStream(save);
                      }}
                      className="px-5 py-2.5 bg-zinc-950 text-white text-xs font-black uppercase rounded-xl cursor-pointer"
                    >
                      Arrêter
                    </button>
                  )}
                </div>
              </div>

              {/* Stream Settings */}
              <div className="bg-white border border-zinc-200 rounded-3xl p-5 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 font-heading">
                  Configuration du Live
                </h3>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Titre du direct *
                  </label>
                  <input
                    type="text"
                    value={liveTitle}
                    onChange={(e) => setLiveTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Adversaire (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={liveOpponent}
                    onChange={(e) => setLiveOpponent(e.target.value)}
                    placeholder="Ex: CS Bouzid"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: SHOP & MARKETING ================= */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-950 font-heading">
                  Place de Marketing & Maillots ({shopProducts.length})
                </h2>
                <p className="text-xs text-zinc-600">
                  Gérer les maillots et articles vendus en ligne aux supporters
                </p>
              </div>

              <button
                onClick={() => handleOpenShopModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ajouter un Article / Maillot</span>
              </button>
            </div>

            {shopProducts.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
                <ShoppingBag className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-zinc-950 mb-1 uppercase font-heading">
                  Boutique vierge (Aucun article en vente)
                </h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto mb-4">
                  Ajoutez les maillots officiels domicile et extérieur, vestes ou écharpes du club.
                </p>
                <button
                  onClick={() => handleOpenShopModal()}
                  className="px-5 py-2.5 bg-zinc-950 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
                >
                  Ajouter un produit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shopProducts.map((prod) => (
                  <div key={prod.id} className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl overflow-hidden flex flex-col group shadow-xs">
                    <div className="relative aspect-square bg-zinc-100 overflow-hidden">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-white text-zinc-950 font-black text-xs px-2 py-0.5 rounded shadow-sm border border-zinc-200">
                        {prod.price} DT
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-950 text-sm line-clamp-1 mb-1">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-semibold">
                          {prod.sizes.join(', ')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenShopModal(prod)}
                            className="p-1.5 text-zinc-700 hover:bg-zinc-100 rounded border border-zinc-200 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer "${prod.name}" ?`)) {
                                deleteShopProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-zinc-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: NEWS ================= */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-950 font-heading">
                  Rédaction des Actualités Officielles ({newsArticles.length})
                </h2>
                <p className="text-xs text-zinc-600">
                  Seul l'administrateur a le pouvoir de publier les communiqués du club
                </p>
              </div>

              <button
                onClick={() => handleOpenNewsModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Rédiger une Actualité</span>
              </button>
            </div>

            {newsArticles.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
                <Newspaper className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-zinc-950 mb-1 uppercase font-heading">
                  Aucun article publié (Site vierge)
                </h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto mb-4">
                  Rédigez les résultats de matchs, annonces de transferts ou déclarations officielles.
                </p>
                <button
                  onClick={() => handleOpenNewsModal()}
                  className="px-5 py-2.5 bg-zinc-950 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
                >
                  Rédiger une actualité
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles.map((article) => (
                  <div key={article.id} className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl overflow-hidden flex flex-col group shadow-xs">
                    <div className="relative h-44 bg-zinc-100 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-950 text-base font-heading mb-1 line-clamp-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          {article.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[11px] text-zinc-500">{article.publishedAt}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenNewsModal(article)}
                            className="p-1.5 text-zinc-700 hover:bg-zinc-100 rounded border border-zinc-200 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer "${article.title}" ?`)) {
                                deleteNewsArticle(article.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-zinc-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Facility */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <h3 className="text-xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                {editingFacilityId ? 'Modifier la Piste / Publication' : 'Créer une Piste / Location / Média'}
              </h3>
              <button
                onClick={() => setIsFacilityModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-950 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFacility} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Type de publication *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setFacilityType('location')}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      facilityType === 'location' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600'
                    }`}
                  >
                    Location avec équipements
                  </button>
                  <button
                    type="button"
                    onClick={() => setFacilityType('media')}
                    className={`py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      facilityType === 'media' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600'
                    }`}
                  >
                    Photos / Vidéos simple
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={facilityTitle}
                  onChange={(e) => setFacilityTitle(e.target.value)}
                  placeholder="Ex: Piste d'athlétisme 6 couloirs ou Terrain synthétique principal"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={facilityCategory}
                    onChange={(e) => setFacilityCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white cursor-pointer"
                  >
                    <option value="terrain_synthetique">Terrain Synthétique</option>
                    <option value="piste_athletisme">Piste d'Athlétisme</option>
                    <option value="terrain_naturel">Terrain Naturel</option>
                    <option value="salle_musculation">Salle de musculation</option>
                    <option value="media_entrainement">Séance d'entraînement</option>
                    <option value="media_match">Match officiel</option>
                  </select>
                </div>

                {facilityType === 'location' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                      Tarif de location (DT / h)
                    </label>
                    <input
                      type="number"
                      value={facilityPrice}
                      onChange={(e) => setFacilityPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              <GalleryPicker
                label="Photos de la piste / installation (depuis la galerie)"
                sublabel="Sélectionnez une ou plusieurs photos depuis votre galerie"
                acceptType="image"
                multiple={true}
                value={facilityImages.filter((img) => img.trim().length > 0)}
                onChange={(items) => setFacilityImages(items.length > 0 ? items : [''])}
              />

              <GalleryPicker
                label="Vidéo de la piste ou de la séance (depuis la galerie)"
                sublabel="Sélectionnez un fichier vidéo depuis votre galerie"
                acceptType="video"
                multiple={false}
                value={facilityVideoUrl ? [facilityVideoUrl] : []}
                onChange={(items) => setFacilityVideoUrl(items[0] || '')}
              />

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  required
                  rows={3}
                  value={facilityDescription}
                  onChange={(e) => setFacilityDescription(e.target.value)}
                  placeholder="Description des installations et conditions..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                />
              </div>

              {facilityType === 'location' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-2">
                    Équipements disponibles pour cette location
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-zinc-50 rounded-xl border border-zinc-300">
                    {AVAILABLE_EQUIPMENTS_LIST.map((equipment) => {
                      const isSelected = selectedEquipments.includes(equipment);
                      return (
                        <label
                          key={equipment}
                          className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer ${
                            isSelected ? 'bg-zinc-200 text-zinc-950 font-semibold' : 'text-zinc-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedEquipments([...selectedEquipments, equipment]);
                              } else {
                                setSelectedEquipments(selectedEquipments.filter((item) => item !== equipment));
                              }
                            }}
                            className="rounded bg-white border-zinc-300 text-zinc-950"
                          />
                          <span className="truncate">{equipment}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFacilityModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase rounded-xl shadow-sm cursor-pointer"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Shop */}
      {isShopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <h3 className="text-xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                {editingShopId ? 'Modifier le maillot' : 'Ajouter un maillot / article'}
              </h3>
              <button
                onClick={() => setIsShopModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-950 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShopProduct} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ex: Maillot Officiel Domicile 2026"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white cursor-pointer"
                  >
                    <option value="maillot">Maillot Officiel</option>
                    <option value="survetement">Survêtement</option>
                    <option value="accessoire">Accessoire / Écharpe</option>
                    <option value="equipement">Équipement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Prix (DT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900 font-mono focus:bg-white"
                  />
                </div>
              </div>

              <GalleryPicker
                label="Photo du maillot / article (depuis la galerie)"
                sublabel="Sélectionnez l'image du produit depuis votre galerie"
                acceptType="image"
                multiple={false}
                value={productImages.filter((img) => img.trim().length > 0)}
                onChange={(items) => setProductImages(items.length > 0 ? items : [''])}
              />

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Description du produit..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsShopModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase rounded-xl shadow-sm cursor-pointer"
                >
                  Ajouter à la boutique
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal News */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <h3 className="text-xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                {editingNewsId ? 'Modifier l\'actualité' : 'Publier une actualité officielle'}
              </h3>
              <button
                onClick={() => setIsNewsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-950 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Titre du communiqué *
                </label>
                <input
                  type="text"
                  required
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-sm text-zinc-900 focus:bg-white"
                />
              </div>

              <GalleryPicker
                label="Image d'illustration (depuis la galerie)"
                sublabel="Sélectionnez une photo depuis votre galerie"
                acceptType="image"
                multiple={false}
                value={newsImageUrl ? [newsImageUrl] : []}
                onChange={(items) => setNewsImageUrl(items[0] || '')}
              />

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Contenu officiel *
                </label>
                <textarea
                  required
                  rows={5}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-black uppercase rounded-xl shadow-sm cursor-pointer"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
