import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Plus,
  Edit3,
  Trash2,
  Share2,
  Flame,
  CheckCircle,
  Radio,
  ArrowRight,
  Send,
  Ticket,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from './BackButton';
import { GalleryPicker } from './GalleryPicker';
import {
  CLUB_NAME,
  CLUB_SHORT,
  CLUB_LOGO,
  PRESET_OPPONENT_TEAMS,
  COMPETITION_PRESETS
} from '../data/constants';
import { MatchFixture, MatchScorer } from '../types';

export const MatchFixturesPage: React.FC = () => {
  const {
    fixtures,
    isAdmin,
    createFixture,
    updateFixture,
    deleteFixture,
    updateMatchScoreAndStatus,
    publishMatchResultToNews,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'finished'>('all');

  // Modal Create / Edit Fixture
  const [isFixtureModalOpen, setIsFixtureModalOpen] = useState(false);
  const [editingFixtureId, setEditingFixtureId] = useState<string | null>(null);
  const [competition, setCompetition] = useState(COMPETITION_PRESETS[0]);
  const [isLSSBHome, setIsLSSBHome] = useState(true);
  const [opponentName, setOpponentName] = useState('Club Olympique Sidi Bouzid');
  const [opponentLogo, setOpponentLogo] = useState(PRESET_OPPONENT_TEAMS[0].logo);
  const [matchDate, setMatchDate] = useState('2026-11-15');
  const [matchTime, setMatchTime] = useState('15:00');
  const [stadium, setStadium] = useState('Stade Municipal de Lessouda');
  const [ticketPrice, setTicketPrice] = useState('Entrée Gratuite');

  // Modal Score & Publish to News
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [scoreFixture, setScoreFixture] = useState<MatchFixture | null>(null);
  const [homeScoreInput, setHomeScoreInput] = useState(0);
  const [awayScoreInput, setAwayScoreInput] = useState(0);
  const [matchStatusInput, setMatchStatusInput] = useState<'upcoming' | 'live' | 'finished'>('finished');
  const [scorerPlayer, setScorerPlayer] = useState('');
  const [scorerMinute, setScorerMinute] = useState('');
  const [scorerTeam, setScorerTeam] = useState<'home' | 'away'>('home');
  const [tempScorers, setTempScorers] = useState<MatchScorer[]>([]);
  const [matchSummaryInput, setMatchSummaryInput] = useState('');
  const [sharedNotice, setSharedNotice] = useState<string | null>(null);

  // Predictions state for supporters
  const [userPredictions, setUserPredictions] = useState<Record<string, 'home' | 'draw' | 'away'>>({});

  const filteredFixtures = fixtures.filter((f) => {
    if (activeTab === 'upcoming') return f.status === 'upcoming' || f.status === 'live';
    if (activeTab === 'finished') return f.status === 'finished';
    return true;
  });

  const nextUpcomingMatch = fixtures.find((f) => f.status === 'upcoming' || f.status === 'live');

  const handleOpenCreateFixture = (fixtureToEdit?: MatchFixture) => {
    if (fixtureToEdit) {
      setEditingFixtureId(fixtureToEdit.id);
      setCompetition(fixtureToEdit.competition);
      setIsLSSBHome(fixtureToEdit.homeTeam.isLSSB);
      const opp = fixtureToEdit.homeTeam.isLSSB ? fixtureToEdit.awayTeam : fixtureToEdit.homeTeam;
      setOpponentName(opp.name);
      setOpponentLogo(opp.logo);
      setMatchDate(fixtureToEdit.date);
      setMatchTime(fixtureToEdit.time);
      setStadium(fixtureToEdit.stadium);
      setTicketPrice(fixtureToEdit.ticketPrice || 'Entrée Gratuite');
    } else {
      setEditingFixtureId(null);
      setCompetition(COMPETITION_PRESETS[0]);
      setIsLSSBHome(true);
      setOpponentName(PRESET_OPPONENT_TEAMS[0].name);
      setOpponentLogo(PRESET_OPPONENT_TEAMS[0].logo);
      setMatchDate('2026-11-15');
      setMatchTime('15:00');
      setStadium('Stade Municipal de Lessouda');
      setTicketPrice('Entrée Gratuite');
    }
    setIsFixtureModalOpen(true);
  };

  const handleSaveFixture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentName.trim()) return;

    const lssbTeam = {
      name: CLUB_NAME,
      logo: CLUB_LOGO,
      isLSSB: true
    };

    const oppTeam = {
      name: opponentName.trim(),
      logo: opponentLogo.trim() || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300',
      isLSSB: false
    };

    const payload = {
      competition,
      homeTeam: isLSSBHome ? lssbTeam : oppTeam,
      awayTeam: isLSSBHome ? oppTeam : lssbTeam,
      date: matchDate,
      time: matchTime,
      stadium: stadium.trim() || 'Stade Municipal de Lessouda',
      status: 'upcoming' as const,
      ticketPrice: ticketPrice.trim() || 'Entrée Gratuite',
      scorers: []
    };

    if (editingFixtureId) {
      updateFixture(editingFixtureId, payload);
    } else {
      createFixture(payload);
    }

    setIsFixtureModalOpen(false);
  };

  const handleOpenScoreModal = (fixture: MatchFixture) => {
    setScoreFixture(fixture);
    setHomeScoreInput(fixture.score?.home ?? 0);
    setAwayScoreInput(fixture.score?.away ?? 0);
    setMatchStatusInput(fixture.status);
    setTempScorers(fixture.scorers || []);
    setMatchSummaryInput(fixture.summary || '');
    setSharedNotice(null);
    setIsScoreModalOpen(true);
  };

  const handleAddScorer = () => {
    if (!scorerPlayer.trim() || !scorerMinute.trim()) return;
    setTempScorers((prev) => [
      ...prev,
      {
        player: scorerPlayer.trim(),
        minute: scorerMinute.trim().includes("'") ? scorerMinute.trim() : `${scorerMinute.trim()}'`,
        team: scorerTeam
      }
    ]);
    setScorerPlayer('');
    setScorerMinute('');
  };

  const handleSaveScoreAndStatus = () => {
    if (!scoreFixture) return;
    updateMatchScoreAndStatus(scoreFixture.id, {
      homeScore: Number(homeScoreInput),
      awayScore: Number(awayScoreInput),
      status: matchStatusInput,
      scorers: tempScorers,
      summary: matchSummaryInput.trim()
    });
    setIsScoreModalOpen(false);
  };

  const handlePublishToNewsDirectly = () => {
    if (!scoreFixture) return;
    // First update the score
    updateMatchScoreAndStatus(scoreFixture.id, {
      homeScore: Number(homeScoreInput),
      awayScore: Number(awayScoreInput),
      status: matchStatusInput,
      scorers: tempScorers,
      summary: matchSummaryInput.trim()
    });

    // Then publish to news
    publishMatchResultToNews(scoreFixture.id, matchSummaryInput.trim());
    setSharedNotice("Résultat du match partagé avec succès dans les Actualités du club !");
    setTimeout(() => {
      setIsScoreModalOpen(false);
      navigateTo('news');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
      {/* Top Athletic Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton label="Retour au club" />
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-white" />
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading">
                  Calendrier & Organisation des Matchs
                </h1>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Rencontres officielles de Lessouda Sportive, billetterie, résultats et scores en direct
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => handleOpenCreateFixture()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Organiser un Match</span>
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* ================= DYNAMIC FEATURED MATCH BANNER ================= */}
        {nextUpcomingMatch && (
          <section className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 sm:p-10 shadow-2xl">
            {/* Athletic stadium glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-700/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>{nextUpcomingMatch.competition}</span>
              </div>

              {/* Opposing Teams Face-off */}
              <div className="w-full max-w-3xl grid grid-cols-3 items-center gap-4 py-4">
                {/* Home Team */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-zinc-900 border-2 border-zinc-700/80 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src={nextUpcomingMatch.homeTeam.logo}
                      alt={nextUpcomingMatch.homeTeam.name}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-2xl uppercase text-white tracking-wide">
                    {nextUpcomingMatch.homeTeam.name}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Domicile
                  </span>
                </div>

                {/* Center VS & Score or Time */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  {nextUpcomingMatch.status === 'live' ? (
                    <div className="flex flex-col items-center">
                      <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider rounded-md animate-pulse mb-1">
                        EN DIRECT
                      </span>
                      <div className="text-3xl sm:text-5xl font-black font-mono text-white tracking-widest">
                        {nextUpcomingMatch.score?.home ?? 0} - {nextUpcomingMatch.score?.away ?? 0}
                      </div>
                    </div>
                  ) : nextUpcomingMatch.status === 'finished' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Score Final</span>
                      <div className="text-3xl sm:text-5xl font-black font-mono text-white tracking-widest">
                        {nextUpcomingMatch.score?.home ?? 0} - {nextUpcomingMatch.score?.away ?? 0}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white text-zinc-950 font-black text-sm flex items-center justify-center shadow-2xl font-heading">
                        VS
                      </div>
                      <div className="mt-2 text-xs font-mono font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
                        {nextUpcomingMatch.time}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{nextUpcomingMatch.date}</span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-zinc-900 border-2 border-zinc-700/80 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src={nextUpcomingMatch.awayTeam.logo}
                      alt={nextUpcomingMatch.awayTeam.name}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-2xl uppercase text-white tracking-wide">
                    {nextUpcomingMatch.awayTeam.name}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Extérieur
                  </span>
                </div>
              </div>

              {/* Stadium & Location */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-white" />
                  {nextUpcomingMatch.stadium}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-white" />
                  {nextUpcomingMatch.ticketPrice || 'Entrée Supporters Gratuite'}
                </span>
              </div>

              {/* Admin quick score update on the featured match */}
              {isAdmin && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleOpenScoreModal(nextUpcomingMatch)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Mettre à jour le Score & Partager dans News</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tous les matchs ({fixtures.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'upcoming' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Matchs à venir ({fixtures.filter((f) => f.status === 'upcoming' || f.status === 'live').length})
            </button>
            <button
              onClick={() => setActiveTab('finished')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'finished' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Résultats terminés ({fixtures.filter((f) => f.status === 'finished').length})
            </button>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            Saison 2026
          </span>
        </div>

        {/* Matches Grid */}
        {filteredFixtures.length === 0 ? (
          <div className="py-20 text-center bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-w-xl mx-auto shadow-2xl">
            <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase text-white font-heading tracking-wider mb-1">
              Aucun match programmé pour le moment
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed mb-5">
              {isAdmin
                ? "Vous pouvez planifier des rencontres amicales ou officielles en sélectionnant votre équipe et l'adversaire avec logos et stade."
                : "Les prochaines rencontres officielles de Lessouda Sportive seront annoncées ici."}
            </p>

            {isAdmin && (
              <button
                onClick={() => handleOpenCreateFixture()}
                className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Planifier une première rencontre</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFixtures.map((fixture) => (
              <article
                key={fixture.id}
                className="bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Top competition strip */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-900 text-xs">
                    <span className="font-bold text-zinc-300 uppercase tracking-wider">
                      {fixture.competition}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        fixture.status === 'live'
                          ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                          : fixture.status === 'finished'
                          ? 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                          : 'bg-white text-zinc-950'
                      }`}
                    >
                      {fixture.status === 'live' ? 'En Direct' : fixture.status === 'finished' ? 'Terminé' : 'À venir'}
                    </span>
                  </div>

                  {/* Face to face cards */}
                  <div className="grid grid-cols-7 items-center gap-2 py-6">
                    {/* Home Team */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={fixture.homeTeam.logo}
                          alt={fixture.homeTeam.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-heading font-black text-sm uppercase text-white line-clamp-2">
                        {fixture.homeTeam.name}
                      </span>
                    </div>

                    {/* Middle Score / Time */}
                    <div className="col-span-1 text-center">
                      {fixture.status === 'finished' || fixture.status === 'live' ? (
                        <div className="font-mono font-black text-xl text-white">
                          {fixture.score?.home ?? 0} - {fixture.score?.away ?? 0}
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-1 rounded">
                          {fixture.time}
                        </span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="col-span-3 flex items-center justify-end gap-3 text-right">
                      <span className="font-heading font-black text-sm uppercase text-white line-clamp-2">
                        {fixture.awayTeam.name}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={fixture.awayTeam.logo}
                          alt={fixture.awayTeam.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scorers list if any */}
                  {fixture.scorers && fixture.scorers.length > 0 && (
                    <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs space-y-1 mb-4">
                      <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                        Buteurs :
                      </span>
                      {fixture.scorers.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-zinc-300 text-[11px]">
                          <span>⚽ {s.player}</span>
                          <span className="font-mono text-zinc-400">{s.minute}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stadium info */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-900">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {fixture.stadium}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {fixture.date}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                {isAdmin ? (
                  <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenScoreModal(fixture)}
                      className="px-3 py-1.5 bg-white text-zinc-950 font-bold text-xs uppercase rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Score & Partager dans News</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenCreateFixture(fixture)}
                        className="p-1.5 text-zinc-300 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
                        title="Modifier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Supprimer cette rencontre ?")) {
                            deleteFixture(fixture.id);
                          }
                        }}
                        className="p-1.5 text-red-400 hover:bg-zinc-900 rounded-lg border border-zinc-800"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Pronostic supporter :</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setUserPredictions({ ...userPredictions, [fixture.id]: 'home' })}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          userPredictions[fixture.id] === 'home'
                            ? 'bg-white text-zinc-950 shadow'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        1 (Victoire LSSB)
                      </button>
                      <button
                        onClick={() => setUserPredictions({ ...userPredictions, [fixture.id]: 'draw' })}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          userPredictions[fixture.id] === 'draw'
                            ? 'bg-white text-zinc-950 shadow'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        Nul
                      </button>
                      <button
                        onClick={() => setUserPredictions({ ...userPredictions, [fixture.id]: 'away' })}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          userPredictions[fixture.id] === 'away'
                            ? 'bg-white text-zinc-950 shadow'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        2
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ================= MODAL: CREATE / EDIT FIXTURE ================= */}
      {isFixtureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <h3 className="text-xl font-black uppercase tracking-wider text-white font-heading">
                {editingFixtureId ? 'Modifier la Rencontre' : 'Organiser un Nouveau Match'}
              </h3>
              <button
                onClick={() => setIsFixtureModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFixture} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                  Compétition *
                </label>
                <select
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                >
                  {COMPETITION_PRESETS.map((comp) => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                  Lieu du match pour Lessouda Sportive
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsLSSBHome(true)}
                    className={`py-2 rounded-lg ${isLSSBHome ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400'}`}
                  >
                    À Domicile (Lessouda)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLSSBHome(false)}
                    className={`py-2 rounded-lg ${!isLSSBHome ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400'}`}
                  >
                    À l'Extérieur (Déplacement)
                  </button>
                </div>
              </div>

              {/* Opponent Selection with presets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase text-zinc-400">
                  Équipe Adverse *
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {PRESET_OPPONENT_TEAMS.map((opp) => (
                    <button
                      type="button"
                      key={opp.name}
                      onClick={() => {
                        setOpponentName(opp.name);
                        setOpponentLogo(opp.logo);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                        opponentName === opp.name
                          ? 'bg-zinc-800 text-white border-zinc-600 font-bold'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {opp.shortName}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder="Nom de l'équipe adverse"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />

                <GalleryPicker
                  label="Logo de l'équipe adverse (depuis la galerie)"
                  sublabel="Choisissez le logo de l'adversaire depuis votre galerie"
                  acceptType="image"
                  multiple={false}
                  value={opponentLogo ? [opponentLogo] : []}
                  onChange={(items) => setOpponentLogo(items[0] || '')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                    Date du match *
                  </label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                    Heure du coup d'envoi *
                  </label>
                  <input
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                    Stade / Terrain
                  </label>
                  <input
                    type="text"
                    value={stadium}
                    onChange={(e) => setStadium(e.target.value)}
                    placeholder="Stade Municipal de Lessouda"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                    Accès / Billetterie
                  </label>
                  <input
                    type="text"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="Entrée Gratuite"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFixtureModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-zinc-950 font-black text-xs uppercase rounded-xl shadow cursor-pointer"
                >
                  {editingFixtureId ? 'Sauvegarder' : 'Créer le match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: UPDATE SCORE & PUBLISH TO NEWS ================= */}
      {isScoreModalOpen && scoreFixture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-xl font-black uppercase tracking-wider text-white font-heading">
                Score & Partage du Résultat dans News
              </h3>
              <button
                onClick={() => setIsScoreModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {sharedNotice && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{sharedNotice}</span>
              </div>
            )}

            {/* Score inputs */}
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between gap-4">
              <div className="text-center flex-1">
                <span className="text-xs font-bold text-white block mb-1 uppercase font-heading">
                  {scoreFixture.homeTeam.name}
                </span>
                <input
                  type="number"
                  min="0"
                  value={homeScoreInput}
                  onChange={(e) => setHomeScoreInput(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 bg-black border border-zinc-700 rounded-lg text-center font-mono font-black text-2xl text-white mx-auto block"
                />
              </div>

              <span className="font-heading font-black text-xl text-zinc-500">
                -
              </span>

              <div className="text-center flex-1">
                <span className="text-xs font-bold text-white block mb-1 uppercase font-heading">
                  {scoreFixture.awayTeam.name}
                </span>
                <input
                  type="number"
                  min="0"
                  value={awayScoreInput}
                  onChange={(e) => setAwayScoreInput(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 bg-black border border-zinc-700 rounded-lg text-center font-mono font-black text-2xl text-white mx-auto block"
                />
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                Statut de la rencontre
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMatchStatusInput('upcoming')}
                  className={`py-2 rounded-lg ${matchStatusInput === 'upcoming' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400'}`}
                >
                  À Venir
                </button>
                <button
                  type="button"
                  onClick={() => setMatchStatusInput('live')}
                  className={`py-2 rounded-lg ${matchStatusInput === 'live' ? 'bg-red-600 text-white shadow' : 'text-zinc-400'}`}
                >
                  En Direct
                </button>
                <button
                  type="button"
                  onClick={() => setMatchStatusInput('finished')}
                  className={`py-2 rounded-lg ${matchStatusInput === 'finished' ? 'bg-white text-zinc-950 shadow' : 'text-zinc-400'}`}
                >
                  Terminé
                </button>
              </div>
            </div>

            {/* Scorers adding */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase text-zinc-400">
                Ajouter des Buteurs
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nom du joueur"
                  value={scorerPlayer}
                  onChange={(e) => setScorerPlayer(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Minute (ex: 35')"
                  value={scorerMinute}
                  onChange={(e) => setScorerMinute(e.target.value)}
                  className="w-24 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddScorer}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl"
                >
                  + Ajouter
                </button>
              </div>

              {tempScorers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tempScorers.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300"
                    >
                      <span>⚽ {s.player} ({s.minute})</span>
                      <button
                        type="button"
                        onClick={() => setTempScorers(tempScorers.filter((_, idx) => idx !== i))}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Match Summary / Commentary */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                Résumé du match & Commentaires pour les supporters
              </label>
              <textarea
                rows={3}
                value={matchSummaryInput}
                onChange={(e) => setMatchSummaryInput(e.target.value)}
                placeholder="Décrivez les moments forts, l'engagement des joueurs et l'ambiance au stade..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
              />
            </div>

            {/* Actions: Save Score OR One-Click Share into News Section! */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveScoreAndStatus}
                className="w-full sm:w-auto px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold rounded-xl transition-colors"
              >
                Sauvegarder le score seul
              </button>

              <button
                type="button"
                onClick={handlePublishToNewsDirectly}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Publier le Résultat dans News</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
