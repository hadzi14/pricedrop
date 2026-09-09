import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PrijavaPage } from './pages/PrijavaPage';
import { RegistracijaPage } from './pages/RegistracijaPage';
import { PretplataPage } from './pages/PretplataPage';
import { AdminPage } from './pages/AdminPage';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30">
      <Navbar session={session} profile={profile} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage session={session} profile={profile} />} />
          <Route path="/prijava" element={<PrijavaPage />} />
          <Route path="/registracija" element={<RegistracijaPage />} />
          <Route path="/pretplata" element={<PretplataPage session={session} />} />
          <Route path="/admin" element={<AdminPage session={session} />} />
        </Routes>
      </main>
    </div>
  );
}
