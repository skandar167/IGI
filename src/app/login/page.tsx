'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { signIn } from 'next-auth/react';

const AVAILABLE_ACCOUNTS = [
  {
    role: 'Administrateur',
    email: 'admin@meteor-pro.dz',
    password: 'Admin2024!',
    badge: 'Admin',
    badgeColor: 'bg-rose-100 text-rose-700',
    desc: 'Accès complet & configuration',
  },
  {
    role: 'Gestionnaire de parc',
    email: 'gestionnaire@meteor-pro.dz',
    password: 'Gest2024!',
    badge: 'Gestionnaire',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    desc: 'Flotte, biens & maintenance',
  },
  {
    role: 'Agent terrain',
    email: 'employe@meteor-pro.dz',
    password: 'Emp2024!',
    badge: 'Employé',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    desc: 'Scan QR & signalements',
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Adresse e-mail ou mot de passe incorrect.');
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Une erreur est survenue lors de la connexion.');
      setLoading(false);
    }
  };

  const handlePreFill = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <div className="relative h-20 w-48 mx-auto">
            <Image
              src="/logo.jpg"
              alt="Météor Pro"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Météor Pro — Connexion
          </h1>
          <p className="text-xs text-slate-500">
            Portail sécurisé d&apos;inventaire des immobilisations et gestion QR Code
          </p>
        </div>

        {/* Credentials Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Adresse e-mail professionnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@meteor-pro.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span>Vérification des identifiants...</span>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Available Accounts reference card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>Comptes préconfigurés en base :</span>
          </div>

          <div className="space-y-2">
            {AVAILABLE_ACCOUNTS.map((acc) => (
              <div
                key={acc.email}
                className="p-3 rounded-2xl bg-white border border-slate-200/70 flex items-center justify-between text-xs gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{acc.role}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${acc.badgeColor}`}>
                      {acc.badge}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-600 select-all">
                    {acc.email}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Mot de passe : <span className="font-mono font-semibold text-slate-700">{acc.password}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePreFill(acc.email, acc.password)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] font-semibold text-slate-600 transition shrink-0 cursor-pointer"
                >
                  Remplir
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
