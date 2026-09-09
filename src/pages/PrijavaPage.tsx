import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

export function PrijavaPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-slate-200 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Prijava</h2>
      <p className="text-slate-500 text-center mb-8">Prijavite se na vaš nalog.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email adresa</label>
          <input
            type="email"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Lozinka</label>
          <input
            type="password"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
        >
          {loading ? 'Prijavljivanje...' : 'Prijavi se'}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-500 text-sm">
        Nemate nalog? <Link to="/registracija" className="text-blue-600 font-semibold hover:underline">Registrujte se</Link>
      </p>
    </div>
  );
}
