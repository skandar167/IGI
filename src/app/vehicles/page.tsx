'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Asset } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Truck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Gauge,
  Plus,
} from 'lucide-react';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/assets')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const v = data.data.filter((a: Asset) => !!a.vehicle);
          setVehicles(v);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const nowMs = Date.now();
  const getDaysLeft = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - nowMs;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.nom.toLowerCase().includes(q) ||
      (v.vehicle && v.vehicle.immatriculation.toLowerCase().includes(q)) ||
      (v.vehicle && v.vehicle.marque.toLowerCase().includes(q)) ||
      (v.vehicle && v.vehicle.modele.toLowerCase().includes(q))
    );
  });

  const totalKm = vehicles.reduce((sum, v) => sum + (v.vehicle?.kilometrage || 0), 0);
  const urgentCt = vehicles.filter((v) => {
    const d = getDaysLeft(v.vehicle?.dateProchainControle);
    return d !== null && d <= 30;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-7 h-7 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestion de la Flotte Automobile
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Suivi kilométrique, échéances de contrôle technique et assurances des véhicules d&apos;entreprise.
          </p>
        </div>

        <Link
          href="/assets/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un véhicule</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Véhicules Roulants
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {vehicles.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Fourgons, utilitaires et véhicules de liaison</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Kilométrage Flotte Cumulé
          </span>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">
            {totalKm.toLocaleString('fr-FR')} km
          </div>
          <p className="text-xs text-slate-500 mt-1">Total parcouru par l&apos;ensemble du parc</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${urgentCt > 0 ? 'bg-amber-500/10 border-amber-300' : 'bg-white border-slate-200/80'}`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Alertes Contrôle Technique
          </span>
          <div className={`text-3xl font-extrabold mt-2 ${urgentCt > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
            {urgentCt} critique(s)
          </div>
          <p className="text-xs text-slate-500 mt-1">Échéance à moins de 30 jours</p>
        </div>
      </div>

      {/* Filter search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par immatriculation, marque, modèle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs sm:text-sm focus:outline-none"
        />
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Plaque &amp; Modèle</th>
                <th className="py-3 px-4">Carburant</th>
                <th className="py-3 px-4">Kilométrage</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Prochain CT</th>
                <th className="py-3 px-4">Assurance</th>
                <th className="py-3 px-4">Site / Affectation</th>
                <th className="py-3 px-4 text-right">Fiche QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => {
                const ctDays = getDaysLeft(a.vehicle?.dateProchainControle);
                const assDays = getDaysLeft(a.vehicle?.dateEcheanceAssurance);

                return (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded shadow-xs">
                          {a.vehicle?.immatriculation}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {a.vehicle?.marque} {a.vehicle?.modele}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Année {a.vehicle?.annee} • {a.numeroInventaire}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {a.vehicle?.typeCarburant}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {a.vehicle?.kilometrage.toLocaleString('fr-FR')} km
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge statut={a.statut} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      {a.vehicle?.dateProchainControle ? (
                        <div>
                          <span className="font-semibold text-slate-800">
                            {new Date(a.vehicle.dateProchainControle).toLocaleDateString('fr-FR')}
                          </span>
                          {ctDays !== null && (
                            <span
                              className={`block text-[10px] font-bold ${
                                ctDays <= 15
                                  ? 'text-rose-600'
                                  : ctDays <= 30
                                  ? 'text-amber-600'
                                  : 'text-emerald-600'
                              }`}
                            >
                              {ctDays <= 0 ? 'Expiré !' : `(Dans ${ctDays} j)`}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">Non renseigné</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {a.vehicle?.dateEcheanceAssurance ? (
                        <div>
                          <span className="font-semibold text-slate-800">
                            {new Date(a.vehicle.dateEcheanceAssurance).toLocaleDateString('fr-FR')}
                          </span>
                          {assDays !== null && (
                            <span
                              className={`block text-[10px] font-bold ${
                                assDays <= 30 ? 'text-rose-600' : 'text-slate-500'
                              }`}
                            >
                              {assDays <= 0 ? 'Expiré !' : `(Dans ${assDays} j)`}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">Non renseigné</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{a.site}</div>
                      <div className="text-[11px] text-slate-400">{a.responsable?.nom || 'Sans conducteur'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/assets/${a.id}`}
                        className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Fiche</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
