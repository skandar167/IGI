'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Asset, Category } from '@/lib/types';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';

export default function EditAssetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [nom, setNom] = useState('');
  const [numeroInventaire, setNumeroInventaire] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [statut, setStatut] = useState('EN_SERVICE');
  const [site, setSite] = useState('');
  const [batiment, setBatiment] = useState('');
  const [service, setService] = useState('');
  const [valeurAcquisition, setValeurAcquisition] = useState('');
  const [valeurActuelle, setValeurActuelle] = useState('');
  const [fournisseur, setFournisseur] = useState('');
  const [numeroFacture, setNumeroFacture] = useState('');

  // Vehicle states
  const [kilometrage, setKilometrage] = useState('');
  const [dateProchainControle, setDateProchainControle] = useState('');
  const [dateEcheanceAssurance, setDateEcheanceAssurance] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/assets/${params.id}`).then((r) => r.json()),
      fetch('/api/assets').then((r) => r.json()),
    ]).then(([assetRes, allRes]) => {
      if (assetRes.success && assetRes.data) {
        const a: Asset = assetRes.data;
        setAsset(a);
        setNom(a.nom);
        setNumeroInventaire(a.numeroInventaire);
        setCategoryId(a.categoryId);
        setDescription(a.description || '');
        setStatut(a.statut);
        setSite(a.site);
        setBatiment(a.batiment || '');
        setService(a.service || '');
        setValeurAcquisition(a.valeurAcquisition.toString());
        setValeurActuelle(a.valeurActuelle.toString());
        setFournisseur(a.fournisseur || '');
        setNumeroFacture(a.numeroFacture || '');

        if (a.vehicle) {
          setKilometrage(a.vehicle.kilometrage.toString());
          if (a.vehicle.dateProchainControle) {
            setDateProchainControle(a.vehicle.dateProchainControle.split('T')[0]);
          }
          if (a.vehicle.dateEcheanceAssurance) {
            setDateEcheanceAssurance(a.vehicle.dateEcheanceAssurance.split('T')[0]);
          }
        }
      }

      if (allRes.success) {
        const cats: Category[] = [];
        const ids = new Set();
        allRes.data.forEach((x: any) => {
          if (x.category && !ids.has(x.category.id)) {
            ids.add(x.category.id);
            cats.push(x.category);
          }
        });
        setCategories(cats);
      }
      setIsLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        nom,
        numeroInventaire,
        description,
        statut,
        site,
        batiment,
        service,
        categoryId,
        valeurAcquisition: parseFloat(valeurAcquisition) || 0,
        valeurActuelle: parseFloat(valeurActuelle) || 0,
        fournisseur,
        numeroFacture,
      };

      if (asset?.vehicle) {
        payload.vehicle = {
          ...asset.vehicle,
          kilometrage: parseInt(kilometrage) || asset.vehicle.kilometrage,
          dateProchainControle: dateProchainControle ? new Date(dateProchainControle).toISOString() : undefined,
          dateEcheanceAssurance: dateEcheanceAssurance ? new Date(dateEcheanceAssurance).toISOString() : undefined,
        };
      }

      const res = await fetch(`/api/assets/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/assets/${params.id}`);
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette immobilisation ?')) {
      return;
    }

    try {
      const res = await fetch(`/api/assets/${params.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/assets');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/assets/${params.id}`}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Modifier la fiche
            </h1>
            <p className="text-xs text-slate-500">Mise à jour des caractéristiques et du statut</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Supprimer</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Désignation</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro d&apos;inventaire
              </label>
              <input
                type="text"
                required
                value={numeroInventaire}
                onChange={(e) => setNumeroInventaire(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Statut</label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="EN_SERVICE">En service</option>
                <option value="EN_MAINTENANCE">En maintenance</option>
                <option value="HORS_SERVICE">Hors service</option>
                <option value="CEDE">Cédé / Rebuté</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Site</label>
              <input
                type="text"
                required
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bâtiment / Zone</label>
              <input
                type="text"
                value={batiment}
                onChange={(e) => setBatiment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Valeur Achat (DA TTC)</label>
              <input
                type="number"
                step="0.01"
                value={valeurAcquisition}
                onChange={(e) => setValeurAcquisition(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Valeur Actuelle (DA TTC)</label>
              <input
                type="number"
                step="0.01"
                value={valeurActuelle}
                onChange={(e) => setValeurActuelle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {asset?.vehicle && (
              <>
                <div className="sm:col-span-2 pt-2 border-t border-slate-100 font-bold text-xs text-indigo-700">
                  Données Véhicule
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kilométrage</label>
                  <input
                    type="number"
                    value={kilometrage}
                    onChange={(e) => setKilometrage(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prochain Contrôle Technique</label>
                  <input
                    type="date"
                    value={dateProchainControle}
                    onChange={(e) => setDateProchainControle(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/assets/${params.id}`}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
