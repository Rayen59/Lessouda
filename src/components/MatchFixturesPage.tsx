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
    <div className="min-h-screen bg-slate-50 text-zinc-900 pb-20">
      {/* Top Athletic Header - Clean White */}
      <div className="bg-white border-b border-zinc-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackButton label="Retour au club" />
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-zinc-950" />
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                  Calendrier & Organisation des Matchs
                </h1>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                Rencontres officielles de Lessouda Sportive, billetterie, résultats et scores en direct
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => handleOpenCreateFixture()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Organiser un Match</span>
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* ================= DYNAMIC FEATURED MATCH BANNER - WHITE DOMINANT ================= */}
        {nextUpcomingMatch && (
          <section className="relative rounded-3xl overflow-hidden border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-zinc-100 border border-zinc-300 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-800">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                <span>{nextUpcomingMatch.competition}</span>
              </div>

              {/* Opposing Teams Face-off */}
              <div className="w-full max-w-3xl grid grid-cols-3 items-center gap-4 py-4">
                {/* Home Team */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-zinc-50 border-2 border-zinc-200 p-2 shadow-xs flex items-center justify-center overflow-hidden">
                    <img
                      src={nextUpcomingMatch.homeTeam.logo}
                      alt={nextUpcomingMatch.homeTeam.name}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-2xl uppercase text-zinc-950 tracking-wide">
                    {nextUpcomingMatch.homeTeam.name}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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
                      <div className="text-3xl sm:text-5xl font-black font-mono text-zinc-950 tracking-widest">
                        {nextUpcomingMatch.score?.home ?? 0} - {nextUpcomingMatch.score?.away ?? 0}
                      </div>
                    </div>
                  ) : nextUpcomingMatch.status === 'finished' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Score Final</span>
                      <div className="text-3xl sm:text-5xl font-black font-mono text-zinc-950 tracking-widest">
                        {nextUpcomingMatch.score?.home ?? 0} - {nextUpcomingMatch.score?.away ?? 0}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-zinc-950 text-white font-black text-sm flex items-center justify-center shadow-md font-heading">
                        VS
                      </div>
                      <div className="mt-2 text-xs font-mono font-bold text-zinc-800 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200">
                        {nextUpcomingMatch.time}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{nextUpcomingMatch.date}</span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-zinc-50 border-2 border-zinc-200 p-2 shadow-xs flex items-center justify-center overflow-hidden">
                    <img
                      src={nextUpcomingMatch.awayTeam.logo}
                      alt={nextUpcomingMatch.awayTeam.name}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-2xl uppercase text-zinc-950 tracking-wide">
                    {nextUpcomingMatch.awayTeam.name}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Extérieur
                  </span>
                </div>
              </div>

              {/* Stadium & Location */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-800" />
                  {nextUpcomingMatch.stadium}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-zinc-800" />
                  {nextUpcomingMatch.ticketPrice || 'Entrée Supporters Gratuite'}
                </span>
              </div>

              {/* Admin quick score update on the featured match */}
              {isAdmin && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleOpenScoreModal(nextUpcomingMatch)}
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
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
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-2xl border border-zinc-200 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Tous ({fixtures.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'upcoming' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              À venir ({fixtures.filter((f) => f.status === 'upcoming' || f.status === 'live').length})
            </button>
            <button
              onClick={() => setActiveTab('finished')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'finished' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Terminés ({fixtures.filter((f) => f.status === 'finished').length})
            </button>
          </div>

          <span className="text-xs font-mono font-bold text-zinc-500">
            Saison 2026
          </span>
        </div>

        {/* Matches Grid */}
        {filteredFixtures.length === 0 ? (
          <div className="py-20 text-center bg-white border border-zinc-200 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
            <Trophy className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase text-zinc-950 font-heading tracking-wider mb-1">
              Aucun match programmé pour le moment
            </h3>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed mb-5">
              {isAdmin
                ? "Vous pouvez planifier des rencontres amicales ou officielles en choisissant l'adversaire, les logos et le stade."
                : "Les prochaines rencontres officielles de Lessouda Sportive seront annoncées ici."}
            </p>

            {isAdmin && (
              <button
                onClick={() => handleOpenCreateFixture()}
                className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow transition-colors inline-flex items-center gap-2 cursor-pointer"
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
                className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  {/* Top competition strip */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 text-xs">
                    <span className="font-bold text-zinc-700 uppercase tracking-wider">
                      {fixture.competition}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        fixture.status === 'live'
                          ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                          : fixture.status === 'finished'
                          ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          : 'bg-zinc-950 text-white'
                      }`}
                    >
                      {fixture.status === 'live' ? 'En Direct' : fixture.status === 'finished' ? 'Terminé' : 'À venir'}
                    </span>
                  </div>

                  {/* Face to face cards */}
                  <div className="grid grid-cols-7 items-center gap-2 py-6">
                    {/* Home Team */}
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={fixture.homeTeam.logo}
                          alt={fixture.homeTeam.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-heading font-black text-sm uppercase text-zinc-950 line-clamp-2">
                        {fixture.homeTeam.name}
                      </span>
                    </div>

                    {/* Middle Score / Time */}
                    <div className="col-span-1 text-center">
                      {fixture.status === 'finished' || fixture.status === 'live' ? (
                        <div className="font-mono font-black text-xl text-zinc-950">
                          {fixture.score?.home ?? 0} - {fixture.score?.away ?? 0}
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                          {fixture.time}
                        </span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="col-span-3 flex items-center justify-end gap-3 text-right">
                      <span className="font-heading font-black text-sm uppercase text-zinc-950 line-clamp-2">
                        {fixture.awayTeam.name}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0">
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
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-1 mb-4">
                      <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                        Buteurs :
                      </span>
                      {fixture.scorers.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-zinc-800 text-[11px] font-medium">
                          <span>⚽ {s.player}</span>
                          <span className="font-mono text-zinc-500">{s.minute}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stadium info */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-800" />
                      {fixture.stadium}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-800" />
                      {fixture.date}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                {isAdmin ? (
                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenScoreModal(fixture)}
                      className="px-3 py-1.5 bg-zinc-950 text-white font-bold text-xs uppercase rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Score & Partager dans News</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenCreateFixture(fixture)}
                        className="p-1.5 text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-lg border border-zinc-200 cursor-pointer"
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
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-zinc-200 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Pronostic supporter :</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setUserPredictions({ ...userPredictions, [fixture.id]: 'home' })}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                          userPredictions[fixture.id] === 'home'
                            ? 'bg-zinc-950 text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
                        }`}
                      >
                        1 (Victoire LSSB)
                      </button>
                      <button
                        onClick={() => setUserPredictions({ ...userPredictions, [fixture.id]: 'draw' })}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                          userPredictions[fixture.id] === 'draw'
                            ? 'bg-zinc-950 text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
                        }`}
                      >
                        Nul
                      </button>
                      <button
                        onClick={() => setUserPredictions({ ...userPredictions, [fixture.id]: 'away' })}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                          userPredictions[fixture.id] === 'away'
                            ? 'bg-zinc-950 text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <h3 className="text-xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                {editingFixtureId ? 'Modifier la Rencontre' : 'Organiser un Nouveau Match'}
              </h3>
              <button
                onClick={() => setIsFixtureModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-950 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFixture} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Compétition *
                </label>
                <select
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                >
                  {COMPETITION_PRESETS.map((comp) => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                  Lieu du match pour Lessouda Sportive
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsLSSBHome(true)}
                    className={`py-2 rounded-lg cursor-pointer ${isLSSBHome ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600'}`}
                  >
                    À Domicile (Lessouda)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLSSBHome(false)}
                    className={`py-2 rounded-lg cursor-pointer ${!isLSSBHome ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600'}`}
                  >
                    À l'Extérieur (Déplacement)
                  </button>
                </div>
              </div>

              {/* Opponent Selection with presets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase text-zinc-700">
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
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        opponentName === opp.name
                          ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
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
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                />

                <GalleryPicker
                  label="Logo de l'équipe adverse (depuis la galerie)"
                  sublabel="Sélectionnez le blason de l'adversaire depuis votre galerie de photos"
                  acceptType="image"
                  multiple={false}
                  value={opponentLogo ? [opponentLogo] : []}
                  onChange={(items) => setOpponentLogo(items[0] || '')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Date du match *
                  </label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 font-mono focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Heure du coup d'envoi *
                  </label>
                  <input
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Stade / Terrain
                  </label>
                  <input
                    type="text"
                    value={stadium}
                    onChange={(e) => setStadium(e.target.value)}
                    placeholder="Stade Municipal de Lessouda"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                    Accès / Billetterie
                  </label>
                  <input
                    type="text"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    placeholder="Entrée Gratuite"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFixtureModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase rounded-xl shadow cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 bg-white border border-zinc-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-zinc-900 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h3 className="text-xl font-black uppercase tracking-wider text-zinc-950 font-heading">
                Score & Partage du Résultat dans News
              </h3>
              <button
                onClick={() => setIsScoreModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-950 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {sharedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{sharedNotice}</span>
              </div>
            )}

            {/* Score inputs */}
            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex items-center justify-between gap-4">
              <div className="text-center flex-1">
                <span className="text-xs font-bold text-zinc-950 block mb-1 uppercase font-heading">
                  {scoreFixture.homeTeam.name}
                </span>
                <input
                  type="number"
                  min="0"
                  value={homeScoreInput}
                  onChange={(e) => setHomeScoreInput(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 bg-white border border-zinc-300 rounded-lg text-center font-mono font-black text-2xl text-zinc-950 mx-auto block shadow-xs"
                />
              </div>

              <span className="font-heading font-black text-xl text-zinc-400">
                -
              </span>

              <div className="text-center flex-1">
                <span className="text-xs font-bold text-zinc-950 block mb-1 uppercase font-heading">
                  {scoreFixture.awayTeam.name}
                </span>
                <input
                  type="number"
                  min="0"
                  value={awayScoreInput}
                  onChange={(e) => setAwayScoreInput(Number(e.target.value))}
                  className="w-16 px-2 py-1.5 bg-white border border-zinc-300 rounded-lg text-center font-mono font-black text-2xl text-zinc-950 mx-auto block shadow-xs"
                />
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                Statut de la rencontre
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMatchStatusInput('upcoming')}
                  className={`py-2 rounded-lg cursor-pointer ${matchStatusInput === 'upcoming' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600'}`}
                >
                  À Venir
                </button>
                <button
                  type="button"
                  onClick={() => setMatchStatusInput('live')}
                  className={`py-2 rounded-lg cursor-pointer ${matchStatusInput === 'live' ? 'bg-red-600 text-white shadow-xs' : 'text-zinc-600'}`}
                >
                  En Direct
                </button>
                <button
                  type="button"
                  onClick={() => setMatchStatusInput('finished')}
                  className={`py-2 rounded-lg cursor-pointer ${matchStatusInput === 'finished' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600'}`}
                >
                  Terminé
                </button>
              </div>
            </div>

            {/* Scorers adding */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase text-zinc-700">
                Ajouter des Buteurs
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nom du joueur"
                  value={scorerPlayer}
                  onChange={(e) => setScorerPlayer(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Minute (ex: 35')"
                  value={scorerMinute}
                  onChange={(e) => setScorerMinute(e.target.value)}
                  className="w-24 px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 font-mono focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddScorer}
                  className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  + Ajouter
                </button>
              </div>

              {tempScorers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tempScorers.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 border border-zinc-200 rounded-lg text-xs text-zinc-800"
                    >
                      <span>⚽ {s.player} ({s.minute})</span>
                      <button
                        type="button"
                        onClick={() => setTempScorers(tempScorers.filter((_, idx) => idx !== i))}
                        className="text-zinc-400 hover:text-red-600 cursor-pointer ml-1"
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
              <label className="block text-[11px] font-bold uppercase text-zinc-700 mb-1">
                Résumé du match & Commentaires pour les supporters
              </label>
              <textarea
                rows={3}
                value={matchSummaryInput}
                onChange={(e) => setMatchSummaryInput(e.target.value)}
                placeholder="Décrivez les moments forts, l'engagement des joueurs et l'ambiance au stade..."
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:bg-white"
              />
            </div>

            {/* Actions: Save Score OR One-Click Share into News Section! */}
            <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveScoreAndStatus}
                className="w-full sm:w-auto px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Sauvegarder le score seul
              </button>

              <button
                type="button"
                onClick={handlePublishToNewsDirectly}
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
