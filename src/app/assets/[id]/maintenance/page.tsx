'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Asset } from '@/lib/types';
import { AddMaintenanceModal } from '@/components/AddMaintenanceModal';
import {
  ArrowLeft,
  Wrench,
  Plus,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function AssetMaintenancePage({
  params,
}: {
  params: { id: string };
}) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAsset = async () => {
    try {
      const res = await fetch(`/api/assets/${params.id}`);
      const json = await res.json();
      if (json.success) {
        setAsset(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-sm font-semibold text-slate-700">Bien introuvable</p>
      </div>
    );
  }

  const logs = asset.maintenanceLogs || [];
  const totalCost = logs.reduce((sum, l) => sum + (l.cout || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/assets/${params.id}`}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Carnet d&apos;Entretien &amp; Maintenance
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {asset.nom} • <span className="font-mono font-bold text-indigo-600">{asset.numeroInventaire}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle intervention</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Interventions
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {logs.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Interventions consignées</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Coût Cumulé Maintenance
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-2">
            {totalCost.toLocaleString('fr-FR')} DA TTC
          </div>
          <p className="text-xs text-slate-500 mt-1">Dépenses totales de remise en état</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Dernière Intervention
          </span>
          <div className="text-sm font-bold text-slate-900 mt-2 truncate">
            {logs.length > 0 ? logs[0].typeIntervention : 'Aucune'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {logs.length > 0 ? new Date(logs[0].date).toLocaleDateString('fr-FR') : 'N/A'}
          </p>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Historique chronologique</h2>
          <span className="text-xs text-slate-400">{logs.length} entrée(s)</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-medium">Aucun entretien enregistré</p>
            <p className="text-xs text-slate-400">
              Cliquez sur &quot;Nouvelle intervention&quot; pour consigner une révision ou un contrôle technique.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="p-5 hover:bg-slate-50/50 transition space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{log.typeIntervention}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      • {new Date(log.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className="font-extrabold text-indigo-600 text-sm">
                    {log.cout > 0 ? `${log.cout.toLocaleString('fr-FR')} DA TTC` : '0 DA'}
                  </span>
                </div>

                {log.notes && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {log.notes}
                  </p>
                )}

                {log.prestataire && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Building className="w-3.5 h-3.5" />
                    <span>Prestataire : <strong className="text-slate-600">{log.prestataire}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AddMaintenanceModal
        assetId={asset.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAsset}
      />
    </div>
  );
}
