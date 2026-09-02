'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Asset, Category } from '@/lib/types';
import { Printer, CheckSquare, Square, Filter, QrCode, Sparkles, RefreshCw } from 'lucide-react';

export default function LabelsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [labelFormat, setLabelFormat] = useState<'a4-grid-8' | 'a4-grid-12' | 'compact'>('a4-grid-8');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/assets')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAssets(data.data);
          // By default, select all assets
          setSelectedAssetIds(data.data.map((a: Asset) => a.id));

          // Unique categories
          const cats: Category[] = [];
          const ids = new Set();
          data.data.forEach((a: Asset) => {
            if (a.category && !ids.has(a.category.id)) {
              ids.add(a.category.id);
              cats.push(a.category);
            }
          });
          setCategories(cats);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedAssetIds(assets.map((a) => a.id));
  };

  const deselectAll = () => {
    setSelectedAssetIds([]);
  };

  const filteredAssets = assets.filter((a) => {
    if (selectedCategory !== 'all' && a.categoryId !== selectedCategory) return false;
    return true;
  });

  const assetsToPrint = filteredAssets.filter((a) => selectedAssetIds.includes(a.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Control Header - Hidden during print */}
      <div className="no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Printer className="w-7 h-7 text-indigo-600" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Générateur de Planches d&apos;Étiquettes QR
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Imprimez des planches prêtes à découper ou des rouleaux autocollants à coller sur vos biens physiques.
            </p>
          </div>

          <button
            onClick={handlePrint}
            disabled={assetsToPrint.length === 0}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer la planche ({assetsToPrint.length})</span>
          </button>
        </div>

        {/* Filter & Selection Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">Toutes les catégories ({assets.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>

            <select
              value={labelFormat}
              onChange={(e) => setLabelFormat(e.target.value as any)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="a4-grid-8">Format Standard (A4 - 2x4 étiquettes)</option>
              <option value="a4-grid-12">Format Moyen (A4 - 3x4 étiquettes)</option>
              <option value="compact">Format Compact / Rouleau</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              Tout cocher
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              Tout décocher
            </button>
          </div>
        </div>

        {/* Quick check pill list */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {filteredAssets.map((a) => {
            const isSelected = selectedAssetIds.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => toggleSelect(a.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{a.numeroInventaire}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Sheet View */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        </div>
      ) : assetsToPrint.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
          Aucun bien sélectionné pour l&apos;impression.
        </div>
      ) : (
        <div className="print-page bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-lg">
          <div
            className={`grid gap-4 sm:gap-6 ${
              labelFormat === 'a4-grid-8'
                ? 'grid-cols-1 sm:grid-cols-2'
                : labelFormat === 'a4-grid-12'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {assetsToPrint.map((asset) => (
              <div
                key={asset.id}
                className="label-card border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-white flex items-center justify-between gap-3 relative overflow-hidden"
              >
                {/* Text Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="relative h-5 w-14 flex-shrink-0">
                      <Image
                        src="/logo.jpg"
                        alt="Météor Pro"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 truncate font-semibold">
                      {asset.category?.nom}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                    {asset.nom}
                  </h3>

                  <div className="pt-1">
                    <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded inline-block">
                      {asset.numeroInventaire}
                    </span>
                  </div>

                  {asset.vehicle && (
                    <p className="text-[11px] font-bold text-slate-700 pt-0.5">
                      Plaque : {asset.vehicle.immatriculation}
                    </p>
                  )}

                  <p className="text-[9px] text-slate-400 truncate">
                    Site : {asset.site}
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  {asset.qrCodeUrl ? (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 border border-slate-200 rounded-xl p-1 bg-white flex items-center justify-center">
                      <Image
                        src={asset.qrCodeUrl}
                        alt={`QR ${asset.nom}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                      QR N/A
                    </div>
                  )}
                  <span className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    Scanner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
