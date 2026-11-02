export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  role: 'admin' | 'supporter' | 'joueur' | 'staff';
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin: string;
}

export interface FacilityPost {
  id: string;
  title: string;
  category: 'piste_athletisme' | 'terrain_synthetique' | 'terrain_naturel' | 'salle_musculation' | 'media_entrainement' | 'media_match';
  postType: 'location' | 'media';
  description: string;
  images: string[];
  videoUrl?: string;
  availableEquipments: string[];
  pricingPerHour?: number;
  capacity?: string;
  dimensions?: string;
  status: 'disponible' | 'reserve' | 'maintenance';
  createdAt: string;
  authorName: string;
  likes: number;
  commentsCount: number;
}

export interface MatchScoreDetails {
  homeScore: number;
  awayScore: number;
  homeName: string;
  awayName: string;
  homeLogo: string;
  awayLogo: string;
  stadium: string;
  date: string;
  scorers?: { player: string; minute: string; team: 'home' | 'away' }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'communique' | 'resultat' | 'transfert' | 'academie' | 'evenement';
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  pinned?: boolean;
  views: number;
  matchResult?: MatchScoreDetails;
}

export interface MatchScorer {
  player: string;
  minute: string;
  team: 'home' | 'away';
}

export interface MatchFixture {
  id: string;
  competition: string;
  round?: string;
  homeTeam: {
    name: string;
    logo: string;
    isLSSB: boolean;
  };
  awayTeam: {
    name: string;
    logo: string;
    isLSSB: boolean;
  };
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  stadium: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  minute?: string;
  ticketPrice?: string;
  ticketInfo?: string;
  referee?: string;
  scorers: MatchScorer[];
  summary?: string;
  createdAt: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  category: 'maillot' | 'survetement' | 'accessoire' | 'equipement';
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  inStock: boolean;
  badge?: string;
  createdAt: string;
}

export interface LiveChatMessage {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}

export interface LiveStreamSession {
  id: string;
  title: string;
  description?: string;
  status: 'live' | 'ended';
  startedAt: string;
  endedAt?: string;
  viewerCount: number;
  score?: {
    lssb: number;
    opponent: string;
    opponentScore: number;
    minute?: string;
  };
  streamUrl?: string;
  isRecorded: boolean;
  replayUrl?: string;
  recordingDuration?: string;
  chatMessages: LiveChatMessage[];
}
