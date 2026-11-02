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
      `Bonjour Lessouda Sportive (LSSB), je souhaite obtenir des informations pour réserver l'installation : "${post.title}". Merci de m'indiquer les disponibilités et tarifs.`
    );
    window.open(`https://wa.me/216${CLUB_WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const handlePlaySupporterChant = () => {
    setChantActive(true);
    setTimeout(() => setChantActive(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
      {/* Dynamic Animated Club Marquee Strip */}
      <div className="bg-zinc-950 border-b border-zinc-800/80 py-2 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-pulse text-[11px] font-black uppercase tracking-widest text-zinc-400 gap-8">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            PORTAIL OFFICIEL LESSOUDA SPORTIVE (LSSB 2012)
          </span>
          <span>·</span>
          <span>STADE MUNICIPAL DE LESSOUDA</span>
          <span>·</span>
          <span className="text-white">LES GUERRIERS NOIR ET BLANC DE SIDI BOUZID</span>
          <span>·</span>
          <span>SAISON OFFICIELLE 2026</span>
          <span>·</span>
          <span>ENSEMBLE POUR LA VICTOIRE</span>
        </div>
      </div>

      {/* High-Energy Athletic Hero Section */}
      <section className="relative border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black overflow-hidden py-12 sm:py-16">
        {/* Animated Stadium Floodlight ambient effect */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Column: Brand & Club Energy */}
            <div className="flex-1 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/90 border border-zinc-700/80 rounded-full text-xs text-zinc-200 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span className="font-bold tracking-wider uppercase">Club Fondé en 2012 · Sidi Bouzid</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-heading leading-none">
                  {CLUB_NAME}
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-zinc-300 font-heading">
                  {CLUB_NAME_AR}
                </p>
              </div>

              <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
                Le bastion sportif de Lessouda. Retrouvez le calendrier officiel des matchs, organisez vos locations de terrains et pistes d'athlétisme et soutenez nos couleurs noir et blanc.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigateTo('fixtures')}
                  className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center gap-2 cursor-pointer group"
                >
                  <Trophy className="w-4 h-4 text-zinc-950" />
                  <span>Calendrier des Matchs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                >
                  Boutique Officielle
                </button>

                {/* Interactive Supporter Chant Button */}
                <button
                  onClick={handlePlaySupporterChant}
                  className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    chantActive
                      ? 'bg-white text-zinc-950 border-white shadow-lg scale-105'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                  title="Acclamation des supporters LSSB"
                >
                  <Volume2 className={`w-4 h-4 ${chantActive ? 'animate-bounce' : ''}`} />
                  <span>{chantActive ? 'Allez Lessouda ! 👏' : 'Cri du Club'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Crest Anchor with Animated Match Preview */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-zinc-900/90 border-2 border-zinc-700 p-3 shadow-2xl flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={CLUB_LOGO}
                    alt={CLUB_NAME}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-2xl"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('/public/')) {
                        target.src = '/public' + CLUB_LOGO;
                      }
                    }}
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-zinc-950 px-3.5 py-0.5 rounded-full text-[11px] font-black tracking-widest shadow-xl uppercase whitespace-nowrap font-heading">
                  LSSB 2012
                </div>
              </div>

              {/* Quick Next Match Card in Hero */}
              {nextMatch ? (
                <div
                  onClick={() => navigateTo('fixtures')}
                  className="mt-6 p-4 bg-zinc-950/90 border border-zinc-800 rounded-2xl flex items-center gap-4 text-xs cursor-pointer hover:border-zinc-600 transition-all shadow-xl group max-w-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center shrink-0">
                    <img src={nextMatch.awayTeam.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-400 block">Prochain Match</span>
                    <span className="text-white font-black uppercase font-heading text-sm group-hover:text-zinc-200">
                      vs {nextMatch.awayTeam.isLSSB ? nextMatch.homeTeam.name : nextMatch.awayTeam.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-mono">{nextMatch.date} à {nextMatch.time}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all ml-auto" />
                </div>
              ) : (
                <div
                  onClick={() => navigateTo('fixtures')}
                  className="mt-6 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 cursor-pointer hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-white" />
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading">
              Installations, Pistes d'Athlétisme & Médias ({facilityPosts.length})
            </h2>
            <p className="text-xs text-zinc-400">
              Terrains aux normes, pistes d'entraînement et équipements sportifs à Lessouda
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedCategory('location')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'location' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Terrains & Pistes
            </button>
            <button
              onClick={() => setSelectedCategory('media')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'media' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Médias
            </button>
          </div>
        </div>

        {/* Empty state if no posts yet */}
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center bg-zinc-950 border border-zinc-800/80 rounded-3xl p-8 my-8 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-black uppercase text-white font-heading tracking-wider mb-2">
              Installations & Pistes en cours de publication
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
              {isAdmin
                ? "Vous pouvez créer de nouvelles pistes d'athlétisme et terrains en sélectionnant photos, vidéos et équipements disponibles."
                : "Les détails des pistes d'athlétisme et terrains seront mis en ligne très prochainement."}
            </p>

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
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
                className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-3xl overflow-hidden flex flex-col group transition-all duration-300 shadow-md"
              >
                <div
                  onClick={() => setActiveModalPost(post)}
                  className="relative h-56 bg-zinc-900 cursor-pointer overflow-hidden"
                >
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-zinc-700 text-[10px] font-bold uppercase tracking-wider text-white rounded-md">
                      {post.postType === 'location' ? 'Location Équipée' : 'Média Officiel'}
                    </span>
                    {post.pricingPerHour && (
                      <span className="px-2.5 py-1 bg-white text-zinc-950 font-black text-xs rounded-md shadow">
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
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>

                  {post.availableEquipments && post.availableEquipments.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-white" />
                        Équipements inclus ({post.availableEquipments.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {post.availableEquipments.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => likeFacilityPost(post.id)}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                    >
                      <Heart className="w-4 h-4 text-zinc-500 hover:text-red-500 transition-colors" />
                      <span>{post.likes}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalPost(post)}
                        className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
                      >
                        Détails
                      </button>

                      {post.postType === 'location' && (
                        <button
                          onClick={() => handleOpenWhatsAppReservation(post)}
                          className="px-3.5 py-1.5 text-xs font-bold bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl transition-colors flex items-center gap-1.5 shadow"
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

      {/* Modal Detail */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <button
                onClick={() => setActiveModalPost(null)}
                className="text-xs font-semibold text-zinc-400 hover:text-white"
              >
                ← Fermer
              </button>
              <span className="text-xs font-mono text-zinc-400">LSSB 2012</span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-6">
              <img
                src={activeModalPost.images[0]}
                alt={activeModalPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-black uppercase text-white font-heading">
                  {activeModalPost.title}
                </h2>
                {activeModalPost.pricingPerHour && (
                  <span className="text-xl font-black text-white font-heading">
                    {activeModalPost.pricingPerHour} DT / heure
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                {activeModalPost.description}
              </p>

              {activeModalPost.availableEquipments && activeModalPost.availableEquipments.length > 0 && (
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-2">
                  <h4 className="text-xs uppercase font-bold text-white tracking-wider flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" />
                    Équipements inclus pour cette location
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalPost.availableEquipments.map((eq, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                        <span>{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  onClick={() => setActiveModalPost(null)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleOpenWhatsAppReservation(activeModalPost)}
                  className="px-5 py-2 bg-white text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-2 cursor-pointer"
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
