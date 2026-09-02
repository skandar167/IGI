'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Printer,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Smartphone,
  Users,
  Building,
  Coins,
  LogIn,
  UserPlus,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const isAuthenticated = status === 'authenticated' && !!user;

  const modules = [
    {
      title: 'Inventaire & Amortissements',
      desc: "Gestion rigoureuse des immobilisations d'entreprise. Suivi des coûts d'acquisition et de la valeur nette amortie en Dinar Algérien (DA TTC).",
      icon: Boxes,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'Comptabilité & Actifs',
      href: '/assets',
      cta: 'Explorer le catalogue',
    },
    {
      title: 'Étiquettes QR Code Physiques',
      desc: "Générateur de planches d'étiquettes autocollantes A4 avec logo officiel et QR code unique par immobilisation.",
      icon: Printer,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Impression A4',
      href: '/labels',
      cta: 'Générer des planches',
    },
    {
      title: 'Scan Mobile & Signalement',
      desc: "Fiche scannée mobile-first depuis n'importe quel smartphone. Bouton « Signaler un problème » pour alerter la maintenance.",
      icon: Smartphone,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'Terrain & QR',
      href: '/assets/ast-v-001',
      cta: 'Voir une fiche scannée',
    },
    {
      title: 'Flotte Véhicules & Contrôles',
      desc: 'Suivi kilométrique et alertes préventives automatisées pour les contrôles techniques et échéances assurance.',
      icon: Truck,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Gestion de Flotte',
      href: '/vehicles',
      cta: 'Gérer la flotte',
    },
    {
      title: 'Tableau de Bord Stratégique',
      desc: 'KPI en temps réel, répartition financière par site et catégorie, alertes urgentes de maintenance.',
      icon: LayoutDashboard,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Pilotage & Décision',
      href: '/dashboard',
      cta: 'Ouvrir le tableau de bord',
    },
    {
      title: 'Gestion des Accès & Rôles',
      desc: 'Authentification sécurisée bcrypt. Tout nouveau collaborateur doit être approuvé par un administrateur.',
      icon: Users,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'Sécurité & Rôles',
      href: '/settings',
      cta: 'Gérer les utilisateurs',
    },
  ];

  const highlights = [
    { icon: Zap, label: 'Temps réel', desc: 'Données synchronisées instantanément' },
    { icon: Lock, label: 'Sécurisé', desc: 'Chiffrement bcrypt & accès contrôlés' },
    { icon: QrCode, label: 'QR Codes', desc: 'Étiquettes physiques uniques par bien' },
    { icon: Coins, label: 'DA TTC', desc: 'Devise comptable Dinar Algérien' },
  ];

  /* ─── AUTHENTICATED VIEW ─── */
  if (isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Plateforme Officielle Météor Pro — Inventaire &amp; QR Assets</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Bienvenue, {user?.name || 'Collaborateur'}&nbsp;!
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Météor Pro est la solution intégrée de traçabilité des immobilisations industrielles,
                logistiques et tertiaires.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Devise : <strong>Dinar Algérien (DA TTC)</strong></span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rôle : <strong>{user?.role || 'Employé'}</strong></span>
                </span>
                {user?.departement && (
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span>{user.departement}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Start */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-xs space-y-3 w-full md:w-72 shrink-0">
              <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Démarrage Rapide</p>
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center justify-between shadow-sm"
                >
                  <span>Tableau de bord</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/assets"
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold transition flex items-center justify-between"
                >
                  <span>Catalogue des biens</span>
                  <Boxes className="w-4 h-4" />
                </Link>
                <Link
                  href="/labels"
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold transition flex items-center justify-between"
                >
                  <span>Étiquettes QR</span>
                  <Printer className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Architecture des Modules Météor Pro
            </h2>
            <p className="text-xs text-slate-500">
              Découvrez les différentes fonctionnalités opérationnelles disponibles
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${m.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {m.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href={m.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      <span>{m.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Callout — admin only */}
        {user?.role === 'ADMIN' && (
          <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-950">
                  Politique de Sécurité &amp; Validation des Comptes
                </h3>
                <p className="text-xs text-amber-800 max-w-2xl leading-relaxed">
                  Tout nouveau collaborateur inscrit doit être formellement validé par un administrateur
                  depuis le panneau de configuration.
                </p>
              </div>
            </div>
            <Link
              href="/settings"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition shrink-0"
            >
              Vérifier les approbations
            </Link>
          </div>
        )}
      </div>
    );
  }

  /* ─── PUBLIC / GUEST LANDING PAGE ─── */
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plateforme Officielle Météor Pro — Version 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Gérez vos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                immobilisations
              </span>{' '}
              avec précision
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Météor Pro est la solution intégrée de traçabilité des actifs industriels, logistiques
              et tertiaires. Inventaire physique, étiquettes QR codes autocollantes, flotte de
              véhicules — tout en un seul endroit.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/40 transition hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Se connecter</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Demander un accès</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Strip */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{h.label}</p>
                  <p className="text-xs text-slate-500">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules Showcase */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Une plateforme complète
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Découvrez les modules opérationnels mis à disposition de vos équipes terrain et de gestion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition duration-200 flex flex-col space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${m.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {m.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — Access Policy */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Accès sur invitation</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pour garantir l&apos;intégrité de l&apos;inventaire et des données comptables de l&apos;entreprise,
                l&apos;accès à Météor Pro est réservé aux collaborateurs autorisés. Soumettez votre demande
                — un administrateur validera votre compte sous 24h.
              </p>
              <ul className="space-y-2">
                {[
                  "Inscription libre — aucune carte bancaire requise",
                  "Validation manuelle par l'administrateur",
                  "Accès immédiat après approbation",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg transition hover:-translate-y-0.5 whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span>Demander un accès</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl border border-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>Déjà un compte ? Se connecter</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
