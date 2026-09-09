import { Link } from 'react-router-dom';
import { LogOut, Activity, UserCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Navbar({ session, profile }: { session: any, profile: any }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-t-4 border-t-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-slate-900">Pricedrop</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <UserCircle2 className="h-5 w-5 text-slate-400" />
                  {profile?.is_pro ? (
                    <span className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      PRO Korisnik
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      Free Nalog
                    </span>
                  )}
                </div>

                <Link to="/pretplata" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  Pretplata
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Odjava</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/prijava" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  Prijava
                </Link>
                <Link
                  to="/registracija"
                  className="text-sm font-bold bg-blue-600 text-white shadow-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Registracija
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
