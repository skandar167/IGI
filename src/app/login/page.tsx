'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { DEMO_ACCOUNTS, setStoredUser, SessionUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickLogin = (user: SessionUser) => {
    setStoredUser(user);
    router.push('/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Match against demo users or log as admin
    const found = Object.values(DEMO_ACCOUNTS).find((u) => u.email === email);
    if (found) {
      setStoredUser(found);
    } else {
      setStoredUser({
        id: 'user-custom',
        nom: email.split('@')[0] || 'Utilisateur',
        email,
        role: 'EMPLOYE',
      });
    }
    router.push('/dashboard');
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
            Plateforme d&apos;inventaire et de gestion des immobilisations par QR Code
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Comptes de Démonstration (Accès 1-Clic) :</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickLogin(DEMO_ACCOUNTS.ADMIN)}
              className="w-full p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-indigo-100 flex items-center justify-between text-left text-xs transition shadow-xs group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-indigo-600">
                  Alexandre Dupont (Administrateur)
                </span>
                <span className="text-[11px] text-slate-500">Direction &amp; Contrôle total</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                Admin
              </span>
            </button>

            <button
              onClick={() => handleQuickLogin(DEMO_ACCOUNTS.GESTIONNAIRE)}
              className="w-full p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-indigo-100 flex items-center justify-between text-left text-xs transition shadow-xs group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-indigo-600">
                  Sophie Martin (Gestionnaire de parc)
                </span>
                <span className="text-[11px] text-slate-500">Flotte &amp; Services Généraux</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                Gestionnaire
              </span>
            </button>

            <button
              onClick={() => handleQuickLogin(DEMO_ACCOUNTS.EMPLOYE)}
              className="w-full p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-indigo-100 flex items-center justify-between text-left text-xs transition shadow-xs group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-indigo-600">
                  Thomas Leroy (Agent terrain)
                </span>
                <span className="text-[11px] text-slate-500">Scan &amp; Signalement pannes</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Employé
              </span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@entreprise.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Se connecter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
