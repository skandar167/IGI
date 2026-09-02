import React from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db';
import {
  Boxes,
  TrendingUp,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Calendar,
  Truck,
  ArrowRight,
  Printer,
  ShieldCheck,
  Building,
  DollarSign,
  PlusCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const metrics = await dbService.getDashboardMetrics();
  const isPrismaConnected = await dbService.isPrismaActive();

  const amortisationTaux =
    metrics.totalValeurAcquisition > 0
      ? Math.round(
          ((metrics.totalValeurAcquisition - metrics.totalValeurActuelle) /
            metrics.totalValeurAcquisition) *
            100
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tableau de bord
            </h1>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                isPrismaConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isPrismaConnected ? '🟢 Base Neon Connectée' : '🟡 Mode Démo Local Actif'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Supervision du parc d&apos;immobilisations, alertes de maintenance et traçabilité QR code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/labels"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Planches Étiquettes</span>
          </Link>
          <Link
            href="/assets/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-200 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter une immobilisation</span>
          </Link>
        </div>
      </div>

      {/* Critical Alerts Banner if urgent CT/Insurance < 30 days */}
      {metrics.upcomingAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  {metrics.urgentAlertsCount > 0
                    ? `⚠️ ${metrics.urgentAlertsCount} échéance(s) critique(s) sous 30 jours !`
                    : 'Échéances de contrôles techniques & assurances'}
                </h2>
                <Link
                  href="/vehicles"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Gérer la flotte</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Les véhicules suivants requièrent un passage au contrôle technique ou le renouvellement de police d&apos;assurance.
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {metrics.upcomingAlerts.slice(0, 3).map((al) => (
                  <Link
                    key={al.id}
                    href={`/assets/${al.assetId}`}
                    className="bg-white/90 hover:bg-white rounded-xl p-3 border border-amber-200 shadow-xs flex items-center justify-between group transition"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {al.immatriculation || al.assetNom}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {al.label} • {new Date(al.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                        al.urgent
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {al.daysLeft <= 0
                        ? 'Expiré !'
                        : `J-${al.daysLeft}`}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Assets */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Biens
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {metrics.totalAssets}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="inline-flex items-center text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {metrics.assetsEnService} en service
              </span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">
                {metrics.assetsEnMaintenance} en révision
              </span>
            </div>
          </div>
        </div>

        {/* Total Acquisition Value */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Valeur Brute (Achat)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {metrics.totalValeurAcquisition.toLocaleString('fr-FR')} DA
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Coût total d&apos;acquisition historique (TTC)
            </p>
          </div>
        </div>

        {/* Net Amortized Value */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Valeur Nette Estimée
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-indigo-600">
              {metrics.totalValeurActuelle.toLocaleString('fr-FR')} DA
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Amortissement global constaté (TTC): <span className="font-semibold text-slate-700">-{amortisationTaux}%</span>
            </p>
          </div>
        </div>

        {/* Maintenance / Issues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Maintien &amp; Alertes
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900">
              {metrics.assetsEnMaintenance + metrics.urgentAlertsCount}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Interventions ou contrôles requis à court terme
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Breakdown & Site Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Répartition du Parc par Catégorie
              </h2>
              <p className="text-xs text-slate-500">
                Volume d&apos;immobilisations et valeur résiduelle
              </p>
            </div>
            <Link
              href="/assets"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Inventaire complet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {metrics.categoryStats.map((cat) => {
              const pct =
                metrics.totalAssets > 0
                  ? Math.round((cat.count / metrics.totalAssets) * 100)
                  : 0;

              return (
                <div key={cat.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {cat.category} ({cat.count})
                    </span>
                    <span className="text-slate-500 font-medium">
                      {cat.valeur.toLocaleString('fr-FR')} DA TTC ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sites Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">
              Répartition par Site
            </h2>
            <p className="text-xs text-slate-500">Localisation géographique des biens</p>
          </div>

          <div className="space-y-3">
            {metrics.siteStats.map((st) => (
              <div
                key={st.site}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800">{st.site}</p>
                    <p className="text-[11px] text-slate-500">{st.count} immobilisation(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-indigo-600">
                    {st.valeur.toLocaleString('fr-FR')} DA TTC
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Incidents / Problem reports from QR scans */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">
              Derniers Signalements &amp; Pannes remontées par Scan QR
            </h2>
            <p className="text-xs text-slate-500">
              Alertes soumises sur le terrain par les employés depuis leur smartphone
            </p>
          </div>
        </div>

        {metrics.recentIncidents.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            Aucun incident ouvert actuellement. Tout le parc est opérationnel !
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {metrics.recentIncidents.map((inc) => (
              <div key={inc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{inc.titre}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                      {inc.statut}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{inc.description}</p>
                  <p className="text-[11px] text-slate-400">
                    Signalé par : <span className="text-slate-600">{inc.signalePar || 'Anonyme'}</span> • {new Date(inc.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Link
                  href={`/assets/${inc.assetId}`}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-center"
                >
                  <span>Voir fiche</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
