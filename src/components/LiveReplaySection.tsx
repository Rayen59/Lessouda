import React, { useState } from 'react';
import {
  Radio,
  Play,
  Users,
  MessageSquare,
  Send,
  Video,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';
import { CLUB_NAME, CLUB_SHORT, CLUB_LOGO } from '../data/constants';
import { LiveStreamSession } from '../types';

export const LiveReplaySection: React.FC = () => {
  const {
    activeLive,
    liveSessions,
    isAdmin,
    addLiveChatMessage,
    endLiveStream,
    navigateTo
  } = useApp();

  const [chatInput, setChatInput] = useState('');
  const [playingReplay, setPlayingReplay] = useState<LiveStreamSession | null>(null);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addLiveChatMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header with BackButton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <BackButton label="Retour" />
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-white" />
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading">
                  Directs & Espace Rediffusions LSSB
                </h1>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Retransmissions des matchs, entraînements et archives vidéo de Lessouda Sportive
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigateTo('admin')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow shrink-0"
            >
              <Radio className="w-4 h-4 text-zinc-950" />
              <span>Studio Live Admin</span>
            </button>
          )}
        </div>

        {/* ================= ACTIVE LIVE BROADCAST ================= */}
        {activeLive ? (
          <section className="mt-8 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Live Header Status */}
            <div className="bg-zinc-900/90 px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white font-black text-[11px] uppercase tracking-wider rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  EN DIRECT
                </span>
                <span className="text-sm font-bold text-white uppercase font-heading">
                  {activeLive.title}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Users className="w-4 h-4" />
                <span className="font-mono font-bold">{activeLive.viewerCount} spectateur(s)</span>
              </div>
            </div>

            {/* Live Player & Supporter Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Broadcast Screen */}
              <div className="lg:col-span-2 relative aspect-video bg-black flex flex-col justify-between p-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/60 to-black/80 pointer-events-none" />

                {/* Scoreboard Ticker */}
                {activeLive.score && (
                  <div className="relative z-10 self-center bg-black/90 backdrop-blur-md border border-zinc-800 rounded-xl px-5 py-2 shadow-2xl flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 p-0.5 flex items-center justify-center">
                        <img
                          src={CLUB_LOGO}
                          alt={CLUB_SHORT}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-heading font-black text-sm uppercase text-white">
                        {CLUB_SHORT}
                      </span>
                    </div>

                    <div className="font-mono font-extrabold text-xl text-white px-2.5 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                      {activeLive.score.lssb} - {activeLive.score.opponentScore}
                    </div>

                    <span className="font-heading font-black text-sm uppercase text-zinc-300">
                      {activeLive.score.opponent}
                    </span>
                  </div>
                )}

                {/* Center Brand */}
                <div className="relative z-10 self-center text-center my-auto">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900/90 border border-zinc-700 p-2 mx-auto mb-3 shadow-2xl flex items-center justify-center">
                    <img
                      src={CLUB_LOGO}
                      alt={CLUB_NAME}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-heading tracking-wide">
                    {activeLive.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                    Diffusion officielle en direct depuis les installations de Lessouda Sportive.
                  </p>
                </div>

                {/* Bottom Controls */}
                <div className="relative z-10 flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-900">
                  <span className="font-mono">Flux HD 1080p</span>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        const save = window.confirm("Arrêter la diffusion ? Enregistrer dans l'Espace Replays ?");
                        endLiveStream(save);
                      }}
                      className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-red-900/50 rounded text-xs font-bold"
                    >
                      Arrêter le Live (Admin)
                    </button>
                  )}
                </div>
              </div>

              {/* Supporter Live Chat */}
              <div className="border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-950 flex flex-col h-96 lg:h-auto">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Discussion Supporters</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {activeLive.chatMessages.map((msg) => (
                    <div key={msg.id} className="text-xs">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`font-bold ${msg.isAdmin ? 'text-amber-400' : 'text-zinc-300'}`}>
                          {msg.userName}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-zinc-300 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="p-3 border-t border-zinc-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-white text-zinc-950 rounded-lg hover:bg-zinc-200 transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </section>
        ) : (
          /* Empty Standby State */
          <div className="mt-8 p-8 bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                <Radio className="w-7 h-7 text-zinc-500" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase text-white font-heading">
                  Aucun direct en cours
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
                  Dès que l'administrateur lance une diffusion (match officiel, entraînement ou point presse), le flux vidéo s'affichera directement ici.
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shrink-0 shadow-lg"
              >
                Lancer un Live
              </button>
            )}
          </div>
        )}

        {/* ================= ESPACE REDIFFUSIONS & REPLAYS ================= */}
        <section className="mt-14">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wider text-white font-heading flex items-center gap-2">
                <Video className="w-6 h-6 text-white" />
                Espace Rediffusions & Replays
              </h2>
              <p className="text-xs text-zinc-400">
                Vidéos et enregistrements des lives conservés selon la décision de l'administration
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {liveSessions.length} rediffusion(s)
            </span>
          </div>

          {liveSessions.length === 0 ? (
            <div className="py-20 text-center bg-zinc-950 border border-zinc-800/80 rounded-3xl p-8">
              <Video className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1 uppercase font-heading">
                Aucune rediffusion enregistrée
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Cet espace est actuellement vierge. Lorsque l'administrateur termine un live et choisit de le sauvegarder, il reste accessible ici en replay.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSessions.map((replay) => (
                <div
                  key={replay.id}
                  onClick={() => setPlayingReplay(replay)}
                  className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden flex flex-col group cursor-pointer transition-all duration-300 shadow-md"
                >
                  <div className="relative aspect-video bg-zinc-900 overflow-hidden flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-110">
                      <Play className="w-5 h-5 fill-zinc-950 ml-0.5" />
                    </div>
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-zinc-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      REPLAY
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-white text-base font-heading line-clamp-1 group-hover:text-zinc-200 transition-colors">
                        {replay.title}
                      </h3>
                      {replay.description && (
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                          {replay.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
                      <span>Diffusé le {replay.startedAt}</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        Visionner <Play className="w-3 h-3 fill-white" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Replay Player Modal */}
      {playingReplay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <button
                onClick={() => setPlayingReplay(null)}
                className="text-xs font-semibold text-zinc-400 hover:text-white"
              >
                ← Quitter la rediffusion
              </button>
              <span className="text-xs font-mono text-zinc-400">
                Rediffusion Lessouda Sportive
              </span>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-5">
              {playingReplay.replayUrl ? (
                <video
                  src={playingReplay.replayUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-zinc-900">
                  <Video className="w-12 h-12 text-zinc-600 mb-2" />
                  <p className="text-sm font-bold text-white uppercase font-heading">
                    Enregistrement de la session
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cette session a été enregistrée lors du direct officiel.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black uppercase text-white font-heading">
                {playingReplay.title}
              </h2>
              {playingReplay.description && (
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {playingReplay.description}
                </p>
              )}
              <div className="pt-4 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={() => setPlayingReplay(null)}
                  className="px-5 py-2 bg-white text-zinc-950 font-bold uppercase rounded-xl hover:bg-zinc-200 text-xs"
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
