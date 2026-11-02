import { CLUB_NAME, CLUB_NAME_AR, CLUB_FOUNDED, CLUB_LOGO, CLUB_WHATSAPP_NUMBER } from '../data/constants';
import { useApp } from '../context/AppContext';
import { MessageCircle, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, isAdmin } = useApp();

  return (
    <footer className="bg-white border-t border-zinc-200 text-zinc-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-200">
          {/* Col 1: Club Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-300 p-0.5 overflow-hidden flex items-center justify-center shadow-xs">
                <img
                  src={CLUB_LOGO}
                  alt={CLUB_NAME}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-heading font-black text-zinc-950 text-base uppercase tracking-wider">
                  {CLUB_NAME}
                </h4>
                <p className="text-[11px] font-semibold text-zinc-500">{CLUB_NAME_AR}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 max-w-sm leading-relaxed">
              Club sportif fondé en {CLUB_FOUNDED} à Sidi Bouzid (Lessouda). Représentation officielle, développement des talents, locations de terrains et retransmissions de matchs.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-zinc-950 text-xs">Navigation</h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => navigateTo('pistes')} className="hover:text-zinc-950 transition-colors cursor-pointer">
                  Terrains & Pistes d'athlétisme
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('fixtures')} className="hover:text-zinc-950 transition-colors cursor-pointer">
                  Matchs & Calendrier officiel
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('news')} className="hover:text-zinc-950 transition-colors cursor-pointer">
                  Actualités & Communiqués
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('live')} className="hover:text-zinc-950 transition-colors cursor-pointer">
                  Directs & Replays des matchs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-zinc-950 transition-colors cursor-pointer">
                  Boutique officielle des maillots
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & WhatsApp */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-zinc-950 text-xs">Contact & Commandes</h5>
            <p className="text-xs text-zinc-600">
              Pour toute réservation de terrain ou commande de maillots :
            </p>
            <a
              href={`https://wa.me/216${CLUB_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-xs rounded-xl transition-colors font-bold shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp : +216 {CLUB_WHATSAPP_NUMBER}</span>
            </a>
            <div className="pt-2">
              <span className="text-[11px] text-zinc-500 block font-medium">Sidi Bouzid, Lessouda · Tunisie</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-medium">
          <div>
            &copy; {new Date().getFullYear()} {CLUB_NAME} (LSSB). Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                className="hover:text-zinc-950 flex items-center gap-1 transition-colors cursor-pointer font-bold"
              >
                <Shield className="w-3.5 h-3.5 text-zinc-950" />
                <span>Panneau Administrateur</span>
              </button>
            )}
            <span className="font-bold text-zinc-800">Couleurs Officielles : Noir & Blanc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
