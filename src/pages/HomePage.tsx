import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { OpportunityCard } from '../components/OpportunityCard';
import { Search, Filter } from 'lucide-react';

export function HomePage({ session, profile }: { session: any, profile: any }) {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const isPro = !!profile?.is_pro;

  useEffect(() => {
    fetchOpportunities();
  }, [category, city]);

  const fetchOpportunities = async () => {
    setLoading(true);
    let query = supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }
    if (city) {
      query = query.ilike('location', `%${city}%`);
    }

    const { data } = await query;
    if (data) {
      setOpportunities(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-12 md:py-20 border-b border-slate-200">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
          Kupuj robu ispod cene. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            60%+ popusta.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Zvanični izvor podataka o stečajevima, carinskim zaplenama i outlet rasprodajama u Srbiji.
        </p>
      </section>

      {/* Filters */}
      <section className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 w-full md:w-auto">
          <Filter className="h-5 w-5" />
          <span className="font-semibold">Filteri:</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Sve kategorije</option>
            <option value="alati_masine">Alati i Mašine</option>
            <option value="gradjevina">Građevina</option>
            <option value="obuca_odeca">Obuća i Odeća</option>
            <option value="tehnika">Tehnika</option>
          </select>

          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pretraži grad..." 
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-full font-medium placeholder-slate-400"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Feed */}
      <section>
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Učitavanje prilika...</div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">Nema pronađenih prilika za ove filtere.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, index) => (
              <OpportunityCard key={opp.id} opp={opp} isPro={isPro} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
