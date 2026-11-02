import React, { useState } from 'react';
import {
  MapPin,
  Check,
  MessageCircle,
  Play,
  Heart,
  Plus,
  Trophy,
  Flame,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';
import {
  CLUB_NAME,
  CLUB_SHORT,
  CLUB_NAME_AR,
  CLUB_LOGO,
  CLUB_WHATSAPP_NUMBER
} from '../data/constants';
import { FacilityPost } from '../types';

export const PistesFeed: React.FC = () => {
  const { facilityPosts, navigateTo, isAdmin, likeFacilityPost, fixtures } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalPost, setActiveModalPost] = useState<FacilityPost | null>(null);
  const [chantActive, setChantActive] = useState(false);

  const nextMatch = fixtures.find((f) => f.status === 'upcoming' || f.status === 'live');

  const filteredPosts = facilityPosts.filter((post) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'location') return post.postType === 'location';
    if (selectedCategory === 'media') return post.postType === 'media';
    return post.category === selectedCategory;
  });

  const handleOpenWhatsAppReservation = (post: FacilityPost) => {
    const text = encodeURIComponent(
      `Bonjour Lessouda Sportive (LSSB), je souhaite réserver l'installation : "${post.title}". Merci de m'indiquer les créneaux disponibles.`
    );
    window.open(`https://wa.me/216${CLUB_WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handlePlaySupporterChant = () => {
    setChantActive(true);
    setTimeout(() => setChantActive(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 pb-20">
      {/* Dynamic Animated Club Marquee Strip - Light & Crisp */}
      <div className="bg-white border-b border-zinc-200 py-2.5 overflow-hidden select-none shadow-xs">
        <div className="flex whitespace-nowrap text-[11px] font-black uppercase tracking-widest text-zinc-700 gap-8">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping"></span>
            PORTAIL OFFICIEL LESSOUDA SPORTIVE (LSSB 2012)
          </span>
          <span className="text-zinc-400">·</span>
          <span>STADE MUNICIPAL DE LESSOUDA</span>
          <span className="text-zinc-400">·</span>
          <span className="text-zinc-950 font-black">LES GUERRIERS NOIR ET BLANC DE SIDI BOUZID</span>
          <span className="text-zinc-400">·</span>
          <span>SAISON SPORTIVE 2026</span>
          <span className="text-zinc-400">·</span>
          <span>ENSEMBLE POUR LA VICTOIRE</span>
        </div>
      </div>

      {/* High-Energy Athletic Hero Section - White Dominant */}
      <section className="relative border-b border-zinc-200 bg-gradient-to-b from-white via-slate-50 to-zinc-100/60 overflow-hidden py-12 sm:py-16">
        {/* Subtle athletic pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Column: Brand & Club Energy */}
            <div className="flex-1 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-zinc-300 rounded-full text-xs text-zinc-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping"></span>
                <span className="font-black tracking-wider uppercase text-zinc-900">Club Fondé en 2012 · Sidi Bouzid</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-zinc-950 font-heading leading-none">
                  {CLUB_NAME}
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-zinc-600 font-heading">
                  {CLUB_NAME_AR}
                </p>
              </div>

              <p className="text-sm text-zinc-600 max-w-xl leading-relaxed">
                Le bastion sportif de Lessouda. Suivez les matchs en direct, organisez vos locations de terrains et pistes d'athlétisme avec équipements complets et portez fièrement le maillot noir et blanc.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigateTo('fixtures')}
                  className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer group"
                >
                  <Trophy className="w-4 h-4 text-white" />
                  <span>Calendrier des Matchs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-3 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Boutique Officielle
                </button>

                {/* Interactive Supporter Chant Button */}
                <button
                  onClick={handlePlaySupporterChant}
                  className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    chantActive
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-md scale-105'
                      : 'bg-white border-zinc-300 text-zinc-700 hover:text-zinc-950 hover:border-zinc-400'
                  }`}
                  title="Cri de ralliement LSSB"
                >
                  <Volume2 className={`w-4 h-4 ${chantActive ? 'animate-bounce text-white' : 'text-zinc-700'}`} />
                  <span>{chantActive ? 'Allez Lessouda ! 👏' : 'Cri du Club'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Crest Anchor with Animated Match Preview */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative group">
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-zinc-950 border-4 border-white p-3 shadow-xl flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105">
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
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-950 text-white border border-zinc-800 px-4 py-0.5 rounded-full text-[11px] font-black tracking-widest shadow-md uppercase whitespace-nowrap font-heading">
                  LSSB 2012
                </div>
              </div>

              {/* Quick Next Match Card in Hero */}
              {nextMatch ? (
                <div
                  onClick={() => navigateTo('fixtures')}
                  className="mt-6 p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 text-xs cursor-pointer hover:border-zinc-400 hover:shadow-md transition-all shadow-xs group max-w-xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                    <img src={nextMatch.awayTeam.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-500 block">Prochain Match</span>
                    <span className="text-zinc-950 font-black uppercase font-heading text-sm group-hover:text-zinc-800">
                      vs {nextMatch.awayTeam.isLSSB ? nextMatch.homeTeam.name : nextMatch.awayTeam.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-mono">{nextMatch.date} à {nextMatch.time}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              ) : (
                <div
                  onClick={() => navigateTo('fixtures')}
                  className="mt-6 p-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 cursor-pointer hover:text-zinc-950 hover:border-zinc-400 transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Trophy className="w-4 h-4 text-zinc-950" />
                  <span>Consulter le calendrier des matchs</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-zinc-950 font-heading">
              Installations, Pistes d'Athlétisme & Médias ({facilityPosts.length})
            </h2>
            <p className="text-xs text-zinc-600">
              Terrains aux normes, pistes d'entraînement et équipements sportifs à Lessouda
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedCategory('location')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'location' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Terrains & Pistes
            </button>
            <button
              onClick={() => setSelectedCategory('media')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'media' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Médias
            </button>
          </div>
        </div>

        {/* Empty state if no posts yet */}
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center bg-white border border-zinc-200 rounded-3xl p-8 my-8 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-black uppercase text-zinc-950 font-heading tracking-wider mb-2">
              Installations & Pistes en cours de publication
            </h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed mb-6">
              {isAdmin
                ? "Vous pouvez créer de nouvelles pistes d'athlétisme et terrains en sélectionnant photos, vidéos et équipements disponibles."
                : "Les détails des pistes d'athlétisme et terrains seront mis en ligne très prochainement."}
            </p>

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publier une piste dans l'Espace Admin</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 shadow-xs hover:shadow-md"
              >
                <div
                  onClick={() => setActiveModalPost(post)}
                  className="relative h-56 bg-zinc-100 cursor-pointer overflow-hidden"
                >
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white rounded-md">
                      {post.postType === 'location' ? 'Location Équipée' : 'Média Officiel'}
                    </span>
                    {post.pricingPerHour && (
                      <span className="px-2.5 py-1 bg-white text-zinc-950 font-black text-xs rounded-md shadow-sm">
                        {post.pricingPerHour} DT / h
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white font-heading leading-tight line-clamp-1">
                      {post.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>

                  {post.availableEquipments && post.availableEquipments.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-zinc-950" />
                        Équipements inclus ({post.availableEquipments.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {post.availableEquipments.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => likeFacilityPost(post.id)}
                      className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950"
                    >
                      <Heart className="w-4 h-4 text-zinc-400 hover:text-red-500 transition-colors" />
                      <span className="font-semibold">{post.likes}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalPost(post)}
                        className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl transition-colors cursor-pointer"
                      >
                        Détails
                      </button>

                      {post.postType === 'location' && (
                        <button
                          onClick={() => handleOpenWhatsAppReservation(post)}
                          className="px-3.5 py-1.5 text-xs font-black bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Réserver</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal Detail - Crisp Light Style */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <button
                onClick={() => setActiveModalPost(null)}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                ← Fermer
              </button>
              <span className="text-xs font-mono font-bold text-zinc-500">LSSB 2012</span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 mb-6">
              <img
                src={activeModalPost.images[0]}
                alt={activeModalPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-black uppercase text-zinc-950 font-heading">
                  {activeModalPost.title}
                </h2>
                {activeModalPost.pricingPerHour && (
                  <span className="text-xl font-black text-zinc-950 font-heading">
                    {activeModalPost.pricingPerHour} DT / heure
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                {activeModalPost.description}
              </p>

              {activeModalPost.availableEquipments && activeModalPost.availableEquipments.length > 0 && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                  <h4 className="text-xs uppercase font-bold text-zinc-900 tracking-wider flex items-center gap-2">
                    <Check className="w-4 h-4 text-zinc-950" />
                    Équipements inclus pour cette location
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalPost.availableEquipments.map((eq, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 shrink-0"></span>
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  onClick={() => setActiveModalPost(null)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleOpenWhatsAppReservation(activeModalPost)}
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Réserver sur WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
