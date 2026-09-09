import { Navigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { generateIpsQr } from '../lib/ipsQr';
import { Mail, CheckCircle2 } from 'lucide-react';

export function PretplataPage({ session }: { session: any }) {
  if (!session) {
    return <Navigate to="/prijava" replace />;
  }

  const userId = session.user.id;
  const userEmail = session.user.email;
  const qrString = generateIpsQr(userId);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Otključaj PRO Pristup</h1>
        <p className="text-lg text-slate-600">Ostvari neograničen pristup svim direktnim linkovima i kontaktima za samo <strong className="text-slate-900">600 RSD mesečno</strong>.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Instrukcije */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">1</span> 
            Uplata članarine
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1 font-medium">Broj računa (Primalac)</p>
              <p className="font-mono text-lg text-slate-900">160-5300102410531-56</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1 font-medium">Iznos</p>
              <p className="font-mono text-lg text-slate-900">600 RSD</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1 font-medium">Svrha uplate</p>
              <p className="font-mono text-lg text-slate-900">Pretplata Pricedrop</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 mb-1 font-bold">Poziv na broj (Vaš ID)</p>
              <p className="font-mono text-lg text-blue-800 truncate" title={userId}>{userId}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-200">
            <p className="text-sm text-slate-600 mb-4 text-center font-medium">Ili jednostavno skenirajte IPS kod u aplikaciji vaše banke:</p>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <QRCode value={qrString} size={200} />
            </div>
          </div>
        </div>

        {/* Potvrda */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">2</span> 
            Potvrda uplate
          </h2>
          
          <div className="flex-1">
            <p className="text-slate-600 mb-6">
              Nakon što izvršite uplatu, pošaljite nam email kako bismo vam odmah aktivirali PRO status.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                <span className="text-slate-700 font-medium">Pristup svim izvornim linkovima (ALSU, e-Aukcija)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                <span className="text-slate-700 font-medium">Kontakt podaci stečajnih upravnika i izvršitelja</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-blue-600 shrink-0" />
                <span className="text-slate-700 font-medium">Bez skrivenih troškova i provizija</span>
              </li>
            </ul>
          </div>

          <a 
            href={`mailto:hadzilazicl@gmail.com?subject=Aktivacija PRO naloga&body=Pozdrav, uplatio sam članarinu za nalog ${userEmail}, pošaljite mi potvrdu aktivacije.`}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-sm"
          >
            <Mail className="h-5 w-5" />
            Pošaljite potvrdu na email
          </a>
        </div>
      </div>
    </div>
  );
}
