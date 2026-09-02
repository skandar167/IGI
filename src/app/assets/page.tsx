'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Asset, Category } from '@/lib/types';
import { AssetCard } from '@/components/AssetCard';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Search,
  Filter,
  Download,
  Plus,
  LayoutGrid,
  List,
  QrCode,
  Truck,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSite, setSelectedSite] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory !== 'all') params.set('categoryId', selectedCategory);
      if (selectedStatus !== 'all') params.set('statut', selectedStatus);
      if (selectedSite !== 'all') params.set('site', selectedSite);

      const res = await fetch(`/api/assets?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setAssets(json.data);
      }
    } catch (err) {
      console.error('Error loading assets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/assets')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAssets(data.data);
          // Extract unique categories
          const cats: Category[] = [];
          const catIds = new Set();
          data.data.forEach((a: Asset) => {
            if (a.category && !catIds.has(a.category.id)) {
              catIds.add(a.category.id);
              cats.push(a.category);
            }
          });
          setCategories(cats);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssets();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedStatus, selectedSite]);

  // Unique sites for filter
  const sites = Array.from(new Set(assets.map((a) => a.site).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventaire des Immobilisations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Catalogue complet des biens matériels, matériels roulants et équipements avec QR code associé.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/api/export/csv"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold shadow-xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </a>

          <Link
            href="/assets/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau bien</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher nom, n° inventaire, immatriculation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="EN_SERVICE">En service</option>
              <option value="EN_MAINTENANCE">En maintenance</option>
              <option value="HORS_SERVICE">Hors service</option>
              <option value="CEDE">Cédé / Rebuté</option>
            </select>
          </div>

          {/* Site filter */}
          <div>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">Tous les sites</option>
              {sites.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View toggle & count bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            {isLoading ? 'Chargement...' : `${assets.length} bien(s) répertorié(s)`}
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Tableau compact"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Assets Content */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
          <p className="text-sm font-medium">Chargement de l&apos;inventaire...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Aucun bien trouvé</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Aucune immobilisation ne correspond à vos critères de recherche ou de filtre.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSelectedSite('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Bien &amp; N° Inventaire</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4">Site / Localisation</th>
                  <th className="py-3 px-4">Valeur Nette</th>
                  <th className="py-3 px-4 text-center">QR Code</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{a.nom}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-indigo-600 font-semibold">
                          {a.numeroInventaire}
                        </span>
                        {a.vehicle && (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            <Truck className="w-3 h-3 text-indigo-600" />
                            {a.vehicle.immatriculation}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {a.category?.nom || 'Autre'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge statut={a.statut} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{a.site}</div>
                      {a.batiment && (
                        <div className="text-[11px] text-slate-400">{a.batiment}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {a.valeurActuelle.toLocaleString('fr-FR')} DA TTC
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {a.qrCodeUrl && (
                        <div className="w-8 h-8 rounded border border-slate-200 bg-white p-0.5 mx-auto overflow-hidden">
                          <Image
                            src={a.qrCodeUrl}
                            alt="QR"
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/assets/${a.id}`}
                        className="font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Consulter
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
