import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';

export function AdminPage({ session }: { session: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Manual Entry form state
  const [newOpp, setNewOpp] = useState({
    title: '', source_name: 'Manual Entry', type: 'manual', category: 'ostalo',
    current_price: '', estimated_market_value: '', discount_percentage: '',
    location: '', source_url: '', contact_details: ''
  });

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'hadzilazicl@gmail.com';

  if (!session || session.user.email !== adminEmail) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 Zabranjen Pristup</h1>
        <p className="text-slate-600 font-medium">Nemate administrativne privilegije.</p>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setUsers(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, action: 'pro' | 'ban' | 'free') => {
    try {
      const res = await fetch(`/api/admin/users/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail: session.user.email })
      });
      if (res.ok) fetchUsers();
      else alert('Greška pri ažuriranju');
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const opp = {
      ...newOpp,
      current_price: parseFloat(newOpp.current_price),
      estimated_market_value: parseFloat(newOpp.estimated_market_value),
      discount_percentage: parseFloat(newOpp.discount_percentage)
    };
    
    const { error } = await supabase.from('opportunities').insert(opp);
    if (error) alert('Greška: ' + error.message);
    else {
      alert('Prilika uspešno dodata!');
      setNewOpp({
        title: '', source_name: 'Manual Entry', type: 'manual', category: 'ostalo',
        current_price: '', estimated_market_value: '', discount_percentage: '',
        location: '', source_url: '', contact_details: ''
      });
    }
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-extrabold text-slate-900">Admin Panel</h1>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Upravljanje Korisnicima</h2>
        {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mb-4">{error}</p>}
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Pro ističe</th>
                <th className="p-4 text-right">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={4} className="p-4 text-center font-medium text-slate-500">Učitavanje...</td></tr> : users.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-700 font-medium">{user.email}</td>
                  <td className="p-4">
                    {user.status === 'banned' ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold border border-red-200">BANNED</span> : 
                     user.is_pro ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-200">PRO</span> : 
                     <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold border border-slate-200">Free</span>}
                  </td>
                  <td className="p-4 text-slate-500">
                    {user.pro_expires_at ? new Date(user.pro_expires_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => updateStatus(user.id, 'pro')} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold transition-colors">PRO (30d)</button>
                    <button onClick={() => updateStatus(user.id, 'free')} className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition-colors">Free</button>
                    <button onClick={() => updateStatus(user.id, 'ban')} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-semibold transition-colors">Ban</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Ručni Unos Prilike</h2>
        <form onSubmit={handleManualEntry} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Naziv" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.title} onChange={e => setNewOpp({...newOpp, title: e.target.value})} />
          <input required placeholder="Kategorija (alati_masine, gradjevina...)" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.category} onChange={e => setNewOpp({...newOpp, category: e.target.value})} />
          <input required type="number" placeholder="Početna cena" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.current_price} onChange={e => setNewOpp({...newOpp, current_price: e.target.value})} />
          <input required type="number" placeholder="Tržišna vrednost" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.estimated_market_value} onChange={e => setNewOpp({...newOpp, estimated_market_value: e.target.value})} />
          <input required type="number" placeholder="Popust %" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.discount_percentage} onChange={e => setNewOpp({...newOpp, discount_percentage: e.target.value})} />
          <input required placeholder="Grad / Lokacija" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.location} onChange={e => setNewOpp({...newOpp, location: e.target.value})} />
          <input required placeholder="Izvorni URL (Link)" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.source_url} onChange={e => setNewOpp({...newOpp, source_url: e.target.value})} />
          <input required placeholder="Kontakt podaci" className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 focus:ring-1 focus:ring-blue-500 outline-none" value={newOpp.contact_details} onChange={e => setNewOpp({...newOpp, contact_details: e.target.value})} />
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-sm transition-colors mt-2">Dodaj Priliku</button>
          </div>
        </form>
      </section>
    </div>
  );
}
