import { FacilityPost, NewsArticle, ShopProduct, LiveStreamSession, UserAccount, MatchFixture } from '../types';

export const CLUB_NAME = "Lessouda Sportive";
export const CLUB_SHORT = "LSSB";
export const CLUB_NAME_AR = "لسودة الرياضية بسيدي بوزيد";
export const CLUB_FOUNDED = 2012;
export const CLUB_LOCATION = "Lessouda, Sidi Bouzid, Tunisie";
export const CLUB_WHATSAPP_NUMBER = "96160285";

// Official club logo path from user's uploaded attachment
export const CLUB_LOGO = "/assets/aistudio/1793651133012_93fa152e.jpg";

// Admin secret verification (Secure & Private)
export const ADMIN_EMAIL_REQUIRED = "adminnimdalessouda321@gmail.com";
export const ADMIN_PASSWORD_REQUIRED = "lessoudaaduossel123";

// Standard equipment catalog for rental posts
export const AVAILABLE_EQUIPMENTS_LIST = [
  "Éclairage nocturne LED homologué",
  "Vestiaires chauffés avec douches individuelles",
  "Ballons de match officiels FIFA",
  "Chasubles et matériel d'entraînement (plots, cônes)",
  "Chronométrage électronique & tableau de score",
  "Tribunes supporters (500 places)",
  "Système de sonorisation & micros",
  "Trousse médicale de premiers secours",
  "Piste tartan d'athlétisme 6 couloirs",
  "Gazon synthétique dernière génération certifié",
  "Gazon naturel entretenu",
  "Espace buvette et rafraîchissements",
  "Parking privé sécurisé",
  "Sécurité et gardiennage sur site"
];

// Preset opponent clubs for Tunisia competitions with high-res badges
export const PRESET_OPPONENT_TEAMS = [
  {
    name: "Club Olympique Sidi Bouzid",
    shortName: "EOSB",
    logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80"
  },
  {
    name: "Avenir Sportif de Kasserine",
    shortName: "ASK",
    logo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&auto=format&fit=crop&q=80"
  },
  {
    name: "Étoile Sportive de Feriana",
    shortName: "ESF",
    logo: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=300&auto=format&fit=crop&q=80"
  },
  {
    name: "El Gawafel Sportives de Gafsa",
    shortName: "EGSG",
    logo: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&auto=format&fit=crop&q=80"
  },
  {
    name: "Croissant Sportif Chebbien",
    shortName: "CS Chebba",
    logo: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80"
  }
];

// Competitions
export const COMPETITION_PRESETS = [
  "Championnat de Tunisie (Ligue 3)",
  "Coupe de Tunisie",
  "Match Amical International / Local",
  "Tournoi Régional de Sidi Bouzid",
  "Match de Préparation Saisonnière"
];

// Default initial states
export const INITIAL_NEWS: NewsArticle[] = [];
export const INITIAL_FACILITIES: FacilityPost[] = [];
export const INITIAL_PRODUCTS: ShopProduct[] = [];
export const INITIAL_REPLAYS: LiveStreamSession[] = [];
export const INITIAL_USERS: UserAccount[] = [];
export const INITIAL_FIXTURES: MatchFixture[] = [];
