'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Asset } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { ReportIncidentModal } from '@/components/ReportIncidentModal';
import { AddMaintenanceModal } from '@/components/AddMaintenanceModal';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  QrCode,
  AlertTriangle,
  Wrench,
  Calendar,
  MapPin,
  Truck,
  Shield,
  Clock,
  Printer,
  Edit3,
  CheckCircle2,
  Lock,
  UserCheck,
  FileText,
  DollarSign,
  ChevronRight,
  Share2,
} from 'lucide-react';

export default function AssetScannedDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const fetchAsset = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/assets/${params.id}`);
      const json = await res.json();
      if (json.success) {
        setAsset(json.data);
      } else {
        setError(json.error || 'Bien introuvable');
      }
    } catch (err: any) {
      setError('Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700">Lecture de la fiche scannée...</p>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Bien non répertorié</h2>
        <p className="text-xs text-slate-500">
          Ce QR code ou identifiant ({params.id}) ne correspond à aucun matériel actif dans l&apos;inventaire.
        </p>
        <Link
          href="/assets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>
      </div>
    );
  }

  const isPublicUser = !currentUser;
  const isElevated = currentUser?.role === 'ADMIN' || currentUser?.role === 'GESTIONNAIRE';

  const photo =
    asset.photos && asset.photos.length > 0
      ? asset.photos[0]
      : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  // Check vehicle deadlines
  const nowMs = Date.now();
  let ctDaysLeft = null;
  let assDaysLeft = null;
  if (asset.vehicle?.dateProchainControle) {
    ctDaysLeft = Math.ceil(
      (new Date(asset.vehicle.dateProchainControle).getTime() - nowMs) / (1000 * 60 * 60 * 24)
    );
  }
  if (asset.vehicle?.dateEcheanceAssurance) {
    assDaysLeft = Math.ceil(
      (new Date(asset.vehicle.dateEcheanceAssurance).getTime() - nowMs) / (1000 * 60 * 60 * 24)
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/assets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inventaire</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Print sticker button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs"
            title="Afficher / Imprimer QR Code"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
          </button>

          {isElevated && (
            <Link
              href={`/assets/${asset.id}/edit`}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs"
              title="Modifier la fiche"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
            </Link>
          )}
        </div>
      </div>

      {/* Public View Notification Banner */}
      {isPublicUser && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              <strong>Fiche publique simplifiée.</strong> Connectez-vous pour voir les données financières et comptables complètes.
            </span>
          </div>
          <Link
            href="/login"
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg whitespace-nowrap shadow-xs"
          >
            Connexion
          </Link>
        </div>
      )}

      {/* Hero Header Card (Mobile-First) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* Photo Container with overlay */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950">
          <Image
            src={photo}
            alt={asset.nom}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/30" />

          {/* Badges on Photo */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <StatusBadge statut={asset.statut} size="md" />
          </div>

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
            {asset.category?.nom || 'Bien'}
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="font-mono text-xs font-bold bg-indigo-600 px-2.5 py-0.5 rounded-md text-white shadow-sm inline-block mb-1.5">
              {asset.numeroInventaire}
            </span>
            <h1 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm">
              {asset.nom}
            </h1>
          </div>
        </div>

        {/* Immediate Key Information Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="truncate">
              <span className="font-bold text-slate-800 block truncate">{asset.site}</span>
              <span className="text-[11px] text-slate-500 block truncate">
                {asset.batiment ? `${asset.batiment}` : 'Site principal'} {asset.service ? `• ${asset.service}` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 justify-end sm:justify-start">
            <UserCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="truncate text-right sm:text-left">
              <span className="font-bold text-slate-800 block truncate">
                {asset.responsable?.nom || 'Non assigné'}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {asset.responsable?.departement || 'Responsable'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons on Field */}
        <div className="p-4 sm:p-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm border border-rose-200 shadow-xs transition active:scale-98"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Signaler un problème</span>
          </button>

          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm border border-indigo-200 shadow-xs transition active:scale-98"
          >
            <Wrench className="w-4 h-4 text-indigo-600" />
            <span>Ajouter entretien</span>
          </button>
        </div>
      </div>

      {/* Vehicle Block (if Vehicle) */}
      {asset.vehicle && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-base">Fiche Flotte Automobile</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {asset.vehicle.marque} {asset.vehicle.modele} ({asset.vehicle.annee})
            </span>
          </div>

          {/* French License Plate Badge */}
          <div className="flex items-center justify-center p-3 bg-slate-900 rounded-2xl shadow-inner">
            <div className="bg-white px-6 py-2 rounded-lg border-2 border-slate-800 flex items-center gap-3 shadow-md">
              <div className="bg-blue-700 text-white font-bold text-[10px] px-1 rounded flex flex-col items-center">
                <span>F</span>
              </div>
              <span className="font-mono text-2xl font-black text-slate-900 tracking-wider">
                {asset.vehicle.immatriculation}
              </span>
              <div className="w-3 h-3 rounded-full bg-blue-700" />
            </div>
          </div>

          {/* Telemetry and Deadlines */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Kilométrage</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {asset.vehicle.kilometrage.toLocaleString('fr-FR')} km
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Carburant</span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {asset.vehicle.typeCarburant}
              </span>
            </div>

            {/* CT Deadline */}
            <div className={`p-3 rounded-xl border ${
              ctDaysLeft !== null && ctDaysLeft <= 30
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Contrôle Tech.</span>
              <span className="font-extrabold text-xs mt-0.5 block">
                {asset.vehicle.dateProchainControle
                  ? new Date(asset.vehicle.dateProchainControle).toLocaleDateString('fr-FR')
                  : 'N/A'}
              </span>
              {ctDaysLeft !== null && (
                <span className={`text-[10px] font-bold block mt-0.5 ${ctDaysLeft <= 30 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {ctDaysLeft <= 0 ? 'Expiré !' : `(J-${ctDaysLeft})`}
                </span>
              )}
            </div>

            {/* Insurance Deadline */}
            <div className={`p-3 rounded-xl border ${
              assDaysLeft !== null && assDaysLeft <= 30
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Assurance</span>
              <span className="font-extrabold text-xs mt-0.5 block">
                {asset.vehicle.dateEcheanceAssurance
                  ? new Date(asset.vehicle.dateEcheanceAssurance).toLocaleDateString('fr-FR')
                  : 'N/A'}
              </span>
              {assDaysLeft !== null && (
                <span className={`text-[10px] font-bold block mt-0.5 ${assDaysLeft <= 30 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {assDaysLeft <= 0 ? 'Expiré !' : `(J-${assDaysLeft})`}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Financial and Amortization block (Restricted if public) */}
      {!isPublicUser && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-base">Valeur &amp; Amortissement</h2>
            </div>
            <span className="text-xs text-slate-400">Facture: {asset.numeroFacture || 'N/A'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Date d&apos;Achat</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {new Date(asset.dateAcquisition).toLocaleDateString('fr-FR')}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Valeur Achat TTC</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {asset.valeurAcquisition.toLocaleString('fr-FR')} DA
              </span>
            </div>

            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 col-span-2 sm:col-span-1">
              <span className="text-indigo-600 block text-[10px] font-bold uppercase">Valeur Nette Actuelle (TTC)</span>
              <span className="font-black text-indigo-700 text-base mt-0.5 block">
                {asset.valeurActuelle.toLocaleString('fr-FR')} DA
              </span>
            </div>
          </div>

          {asset.fournisseur && (
            <p className="text-xs text-slate-500 pt-1">
              Fournisseur référencé : <span className="font-semibold text-slate-700">{asset.fournisseur}</span>
            </p>
          )}
        </div>
      )}

      {/* Maintenance History section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">Historique de Maintenance</h2>
          </div>
          <Link
            href={`/assets/${asset.id}/maintenance`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Voir carnet complet</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {(!asset.maintenanceLogs || asset.maintenanceLogs.length === 0) ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Aucun entretien enregistré pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {asset.maintenanceLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{log.typeIntervention}</span>
                  <span className="font-semibold text-indigo-600">
                    {log.cout > 0 ? `${log.cout.toLocaleString('fr-FR')} DA TTC` : 'Inclus garantie'}
                  </span>
                </div>
                {log.notes && <p className="text-slate-500 text-[11px]">{log.notes}</p>}
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{new Date(log.date).toLocaleDateString('fr-FR')}</span>
                  {log.prestataire && <span>{log.prestataire}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Incidents / Issues */}
      {asset.incidentReports && asset.incidentReports.length > 0 && (
        <div className="bg-rose-50/50 rounded-3xl p-5 border border-rose-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-bold text-slate-900 text-base">Signalements en cours ({asset.incidentReports.length})</h2>
          </div>

          <div className="space-y-2">
            {asset.incidentReports.map((inc) => (
              <div key={inc.id} className="bg-white p-3 rounded-xl border border-rose-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{inc.titre}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                    {inc.statut}
                  </span>
                </div>
                <p className="text-slate-600">{inc.description}</p>
                <p className="text-[10px] text-slate-400">
                  Remonté le {new Date(inc.createdAt).toLocaleDateString('fr-FR')} par {inc.signalePar || 'Anonyme'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code Modal for Printing or Scanning */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Étiquette QR Code
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
              <div>
                <p className="font-black text-slate-900 text-base">{asset.nom}</p>
                <p className="font-mono text-xs font-bold text-indigo-600">
                  {asset.numeroInventaire}
                </p>
              </div>

              {asset.qrCodeUrl && (
                <div className="bg-white p-3 rounded-xl shadow-inner border border-slate-200 inline-block">
                  <Image
                    src={asset.qrCodeUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              )}

              <p className="text-[11px] text-slate-500">
                Imprimez cette étiquette et collez-la directement sur le bien.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer l&apos;étiquette</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for Problem reporting & Maintenance logging */}
      <ReportIncidentModal
        assetId={asset.id}
        assetNom={asset.nom}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={fetchAsset}
      />

      <AddMaintenanceModal
        assetId={asset.id}
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onSuccess={fetchAsset}
      />
    </div>
  );
}
