import React, { useState } from 'react';
import { Newspaper, Plus, ArrowRight, Trophy, MapPin, Calendar, Share2, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';
import { CLUB_NAME } from '../data/constants';
import { NewsArticle } from '../types';

export const NewsSection: React.FC = () => {
  const { newsArticles, isAdmin, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  const filteredNews = newsArticles.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Header with BackButton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <BackButton label="Retour" />
            <div>
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-zinc-950" />
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                  Actualités, Dépêches & Résultats de Matchs
                </h1>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                Dépêches officielles du club Lessouda Sportive (LSSB 2012) et comptes-rendus de rencontres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('fixtures')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-zinc-950" />
              <span>Calendrier des Matchs</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Rédiger une actualité</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto border-b border-zinc-200 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Toutes les dépêches ({newsArticles.length})
          </button>
          <button
            onClick={() => setSelectedCategory('resultat')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'resultat'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Résultats & Scores de Matchs
          </button>
          <button
            onClick={() => setSelectedCategory('communique')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'communique'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Communiqués officiels
          </button>
          <button
            onClick={() => setSelectedCategory('transfert')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'transfert'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            Effectif & Mercato
          </button>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="py-24 text-center bg-white border border-zinc-200 rounded-3xl p-8 my-8 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-black uppercase text-zinc-950 font-heading tracking-wider mb-2">
              Fil d'actualités vierge
            </h3>
            <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed mb-6">
              {isAdmin
                ? "Vous pouvez rédiger une annonce générale ou enregistrer le score d'un match depuis le calendrier pour le partager ici en un clic."
                : "Les annonces officielles et les résultats des matchs de Lessouda Sportive seront publiés ici prochainement."}
            </p>

            {isAdmin && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => navigateTo('fixtures')}
                  className="px-5 py-2.5 bg-zinc-950 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Aller aux Matchs pour publier un score</span>
                </button>
                <button
                  onClick={() => navigateTo('admin')}
                  className="px-5 py-2.5 bg-white border border-zinc-300 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-100 cursor-pointer"
                >
                  Rédiger un communiqué
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredNews.map((article) => (
              <article
                key={article.id}
                onClick={() => setReadingArticle(article)}
                className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-3xl overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md"
              >
                {/* If it's a Match Result, render rich score header */}
                {article.matchResult ? (
                  <div className="bg-zinc-50 p-5 border-b border-zinc-200">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500 mb-3">
                      <span className="flex items-center gap-1.5 text-zinc-950 font-bold">
                        <Trophy className="w-3.5 h-3.5" />
                        RÉSULTAT OFFICIEL
                      </span>
                      <span>{article.matchResult.date}</span>
                    </div>

                    <div className="grid grid-cols-7 items-center gap-2 py-2">
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                          <img src={article.matchResult.homeLogo} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-heading font-black text-xs uppercase text-zinc-950 line-clamp-1">
                          {article.matchResult.homeName}
                        </span>
                      </div>

                      <div className="col-span-1 text-center font-mono font-black text-xl text-zinc-950">
                        {article.matchResult.homeScore} - {article.matchResult.awayScore}
                      </div>

                      <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                        <span className="font-heading font-black text-xs uppercase text-zinc-950 line-clamp-1">
                          {article.matchResult.awayName}
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                          <img src={article.matchResult.awayLogo} alt="" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-52 bg-zinc-100 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {article.category}
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 font-heading leading-snug group-hover:text-zinc-700 transition-colors line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <span>{article.publishedAt}</span>
                    <span className="text-zinc-950 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Lire le compte-rendu <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <button
                onClick={() => setReadingArticle(null)}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                ← Retour aux actualités
              </button>
              <button
                onClick={() => setReadingArticle(null)}
                className="text-zinc-500 hover:text-zinc-950 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Match Scoreboard in reader if matchResult */}
            {readingArticle.matchResult && (
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl mb-6">
                <div className="grid grid-cols-7 items-center gap-4">
                  <div className="col-span-3 flex flex-col items-center text-center space-y-2">
                    <img src={readingArticle.matchResult.homeLogo} alt="" className="w-16 h-16 object-contain" />
                    <h4 className="font-heading font-black text-lg uppercase text-zinc-950">
                      {readingArticle.matchResult.homeName}
                    </h4>
                  </div>

                  <div className="col-span-1 text-center font-mono font-black text-4xl text-zinc-950">
                    {readingArticle.matchResult.homeScore} - {readingArticle.matchResult.awayScore}
                  </div>

                  <div className="col-span-3 flex flex-col items-center text-center space-y-2">
                    <img src={readingArticle.matchResult.awayLogo} alt="" className="w-16 h-16 object-contain" />
                    <h4 className="font-heading font-black text-lg uppercase text-zinc-950">
                      {readingArticle.matchResult.awayName}
                    </h4>
                  </div>
                </div>

                {readingArticle.matchResult.scorers && readingArticle.matchResult.scorers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 text-xs text-zinc-700">
                    <span className="font-bold text-zinc-950 block mb-1 uppercase">Buteurs de la rencontre :</span>
                    <div className="flex flex-wrap gap-2">
                      {readingArticle.matchResult.scorers.map((s, idx) => (
                        <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-zinc-300 font-medium">
                          ⚽ {s.player} ({s.minute})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 font-heading leading-tight">
                {readingArticle.title}
              </h2>

              <p className="text-xs text-zinc-500">
                Publié le {readingArticle.publishedAt} par {readingArticle.author}
              </p>

              <div className="text-sm text-zinc-700 leading-relaxed space-y-4 whitespace-pre-line pt-2">
                {readingArticle.content}
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-200 flex justify-end">
                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-5 py-2 bg-zinc-950 text-white font-black text-xs uppercase rounded-xl hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
