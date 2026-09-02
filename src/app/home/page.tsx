'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Printer,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Wrench,
  Users,
  Building,
  Coins,
} from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const modules = [
    {
      title: 'Inventaire & Amortissements',
      desc: 'Gestion rigoureuse des immobilisations d’entreprise. Suivi des coûts d’acquisition historiques et de la valeur nette actuelle amortie, exprimés en Dinar Algérien (DA TTC).',
      icon: Boxes,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'Comptabilité & Actifs',
      href: '/assets',
      cta: 'Explorer le catalogue',
    },
    {
      title: 'Étiquettes QR Code Physiques',
      desc: 'Générateur de planches d’étiquettes autocollantes au format standard A4. Chaque étiquette intègre le logo officiel Météor Pro et le QR code unique de l’immobilisation.',
      icon: Printer,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Impression A4',
      href: '/labels',
      cta: 'Générer des planches',
    },
    {
      title: 'Scan Mobile & Signalement Pannes',
      desc: 'Fiche scannée mobile-first consultable immédiatement depuis la caméra de n’importe quel smartphone. Bouton direct « Signaler un problème » pour alerter le service maintenance.',
      icon: Smartphone,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'Terrain & QR',
      href: '/assets/ast-v-001',
      cta: 'Voir une fiche scannée',
    },
    {
      title: 'Flotte Véhicules & Contrôles J-30',
      desc: 'Suivi kilométrique, motorisations et alertes automatisées préventives pour les Contrôles Techniques et les échéances d’assurance automobile avec compte à rebours.',
      icon: Truck,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Gestion de Flotte',
      href: '/vehicles',
      cta: 'Gérer la flotte',
    },
    {
      title: 'Tableau de Bord Stratégique',
      desc: 'Indicateurs clés de performance (KPI) en temps réel, répartition financière par site d’exploitation et par catégorie, et alertes urgentes de maintenance.',
      icon: LayoutDashboard,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Pilotage & Décision',
      href: '/dashboard',
      cta: 'Ouvrir le tableau de bord',
    },
    {
      title: 'Gestion des Accès & Approbation',
      desc: 'Système d’authentification sécurisé par hachage cryptographique bcrypt. Tout nouvel utilisateur doit être approuvé par un administrateur avant activation de son compte.',
      icon: Users,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'Sécurité & Rôles',
      href: '/settings',
      cta: 'Gérer les utilisateurs',
    },
  ];

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
              Bienvenue, {user?.name || 'Collaborateur'} !
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Météor Pro est la solution intégrée de traçabilité des immobilisations industrielles, logistiques et tertiaires. Gérez l&apos;inventaire physique, éditez vos planches d&apos;étiquettes QR codes autocollantes et pilotez vos parcs de véhicules avec précision.
            </p>

            {/* Badges bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Devise comptable : <strong>Dinar Algérien (DA TTC)</strong></span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rôle actif : <strong>{user?.role || 'Employé'}</strong></span>
              </span>

              {user?.departement && (
                <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/15 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span>{user.departement}</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Start Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-xs space-y-3 w-full md:w-72 shrink-0">
            <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Démarrage Rapide
            </p>
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

      {/* Modules Presentation Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Architecture des Modules Météor Pro
          </h2>
          <p className="text-xs text-slate-500">
            Découvrez les différentes fonctionnalités opérationnelles mises à disposition de vos équipes
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

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {m.desc}
                  </p>
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

      {/* Security & Approvals Callout */}
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
              Pour garantir l&apos;intégrité de l&apos;inventaire matériel et des données comptables de l&apos;entreprise, tout nouveau collaborateur inscrit doit être formellement validé par un administrateur depuis le panneau de configuration.
            </p>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <Link
            href="/settings"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition shrink-0"
          >
            Vérifier les approbations
          </Link>
        )}
      </div>
    </div>
  );
}
