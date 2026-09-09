import { ExternalLink, Mail, ShieldAlert, Tag, Building2, Gavel } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface Opportunity {
  id: string;
  source_name: string;
  type: string;
  title: string;
  current_price: number;
  estimated_market_value: number;
  discount_percentage: number;
  location: string;
  source_url: string;
  contact_details: string;
  action_deadline: string;
}

export function OpportunityCard({ opp, isPro, index }: { opp: Opportunity; isPro: boolean; index: number }) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('sr-RS', { style: 'currency', currency: 'RSD', maximumFractionDigits: 0 }).format(val);
  };

  const Icon = opp.type === 'stecaj_alsu' ? Building2 : opp.type === 'izvrsenje_carina' ? Gavel : Tag;

  const profitPotential = opp.estimated_market_value - opp.current_price;
  
  // Ako je free nalog, i index >= 2, ceo card je blurrovan
  const isLocked = !isPro && index >= 2;

  return (
    <div className="relative bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-blue-500/30 transition-colors flex flex-col h-full group">
      
      <div className={cn("flex flex-col h-full transition-all", isLocked ? "filter blur-md opacity-70 pointer-events-none" : "")}>
        <div className="p-5 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{opp.source_name}</span>
                <p className="text-sm font-medium text-slate-500">{opp.location}</p>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-black border border-blue-200">
              -{opp.discount_percentage}%
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2" title={opp.title}>
            {opp.title}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Početna cena</p>
              <p className="font-mono text-lg font-bold text-slate-900">{formatCurrency(opp.current_price)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Tržišna vrednost</p>
              <p className="font-mono text-lg font-bold text-slate-400 line-through decoration-slate-300">{formatCurrency(opp.estimated_market_value)}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <span className="text-blue-500 font-bold">▲</span> Est. Profit: <span className="font-mono font-bold text-slate-800">{formatCurrency(profitPotential)}</span>
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          {isPro ? (
            <div className="flex flex-col gap-2">
              <a 
                href={opp.source_url} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Direktan link
              </a>
              <div className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-2.5 px-4 rounded-lg text-sm text-center font-medium shadow-sm">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{opp.contact_details}</span>
              </div>
            </div>
          ) : (
            <Link to="/pretplata" className="block relative group/btn">
              <div className="flex flex-col gap-2 filter blur-md opacity-50 group-hover/btn:blur-sm transition-all pointer-events-none">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg">
                  <ExternalLink className="h-4 w-4" />
                  Direktan link
                </button>
                <div className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-2.5 px-4 rounded-lg">
                  <Mail className="h-4 w-4" />
                  <span>info@primer.com</span>
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-sm font-bold text-slate-900 group-hover/btn:text-blue-600 transition-colors drop-shadow-sm">Otključaj kontakt</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 z-10 p-6 text-center">
          <div className="bg-white border border-slate-200 shadow-xl p-6 rounded-2xl flex flex-col items-center">
            <ShieldAlert className="h-10 w-10 text-blue-600 mb-3" />
            <h4 className="text-lg font-bold text-slate-900 mb-2">Limit Pregleda</h4>
            <p className="text-sm text-slate-600 mb-4">Kao Free korisnik, možete videti samo prve 2 objave. Pretplatite se za pristup celokupnoj bazi.</p>
            <Link to="/pretplata" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">
              Otključaj PRO (600 RSD)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
