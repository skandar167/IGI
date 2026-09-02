'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Asset } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, QrCode, ArrowRight, Truck, Wrench, Shield } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const [showQrPreview, setShowQrPreview] = useState(false);

  const fallbackPhoto =
    asset.photos && asset.photos.length > 0
      ? asset.photos[0]
      : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col group">
      {/* Top Image & Badges */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <Image
          src={fallbackPhoto}
          alt={asset.nom}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        <div className="absolute top-3 left-3">
          <StatusBadge statut={asset.statut} size="sm" />
        </div>

        {asset.category && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white border border-white/20">
            {asset.category.nom}
          </div>
        )}

        {/* QR Code Quick Trigger on image */}
        {asset.qrCodeUrl && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowQrPreview(true);
            }}
            className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 shadow-md transition hover:scale-105"
            title="Aperçu QR Code"
          >
            <QrCode className="w-4 h-4 text-indigo-600" />
          </button>
        )}

        <div className="absolute bottom-3 left-3 text-white">
          <span className="font-mono text-xs font-semibold bg-indigo-600/90 backdrop-blur-sm px-2 py-0.5 rounded text-white shadow-sm">
            {asset.numeroInventaire}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-indigo-600 transition">
            {asset.nom}
          </h3>
          {asset.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {asset.description}
            </p>
          )}
        </div>

        {/* Vehicle Highlights if applicable */}
        {asset.vehicle && (
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 tracking-wider">
                  {asset.vehicle.immatriculation}
                </span>
                <span className="text-slate-500 text-[11px] block">
                  {asset.vehicle.kilometrage.toLocaleString('fr-FR')} km
                </span>
              </div>
            </div>
            {asset.vehicle.dateProchainControle && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                CT {new Date(asset.vehicle.dateProchainControle).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="space-y-1.5 pt-1 text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{asset.site} {asset.batiment ? `• ${asset.batiment}` : ''}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Valeur estimée :</span>
            <span className="font-semibold text-slate-800">
              {asset.valeurActuelle.toLocaleString('fr-FR')} DA TTC
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <Link
            href={`/assets/${asset.id}/maintenance`}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Entretien ({asset.maintenanceLogs?.length || 0})</span>
          </Link>

          <Link
            href={`/assets/${asset.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-0.5 transition"
          >
            <span>Fiche bien</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* QR Code Quick Preview Modal */}
      {showQrPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowQrPreview(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{asset.nom}</h4>
              <p className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">
                {asset.numeroInventaire}
              </p>
            </div>

            {asset.qrCodeUrl && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-inner inline-block">
                <Image
                  src={asset.qrCodeUrl}
                  alt={`QR Code ${asset.nom}`}
                  width={180}
                  height={180}
                  className="mx-auto"
                />
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              Scannez ce code depuis un smartphone pour ouvrir la fiche instantanément.
            </p>

            <button
              onClick={() => setShowQrPreview(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
