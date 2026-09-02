'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Category, User } from '@/lib/types';
import {
  ArrowLeft,
  Boxes,
  Truck,
  Building,
  DollarSign,
  FileText,
  Camera,
  Check,
  Loader2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function NewAssetPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [nom, setNom] = useState('');
  const [numeroInventaire, setNumeroInventaire] = useState(
    `IMM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [dateAcquisition, setDateAcquisition] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [valeurAcquisition, setValeurAcquisition] = useState('');
  const [valeurActuelle, setValeurActuelle] = useState('');
  const [fournisseur, setFournisseur] = useState('');
  const [numeroFacture, setNumeroFacture] = useState('');
  const [site, setSite] = useState('Siège Social Lyon');
  const [batiment, setBatiment] = useState('');
  const [service, setService] = useState('');
  const [statut, setStatut] = useState('EN_SERVICE');
  const [responsableId, setResponsableId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Vehicle-specific fields
  const [isVehicle, setIsVehicle] = useState(false);
  const [immatriculation, setImmatriculation] = useState('');
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [annee, setAnnee] = useState(new Date().getFullYear().toString());
  const [typeCarburant, setTypeCarburant] = useState('Diesel');
  const [kilometrage, setKilometrage] = useState('0');
  const [dateProchainControle, setDateProchainControle] = useState('');
  const [dateEcheanceAssurance, setDateEcheanceAssurance] = useState('');

  useEffect(() => {
    // Load categories
    fetch('/api/assets')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const cats: Category[] = [];
          const catIds = new Set();
          data.data.forEach((a: any) => {
            if (a.category && !catIds.has(a.category.id)) {
              catIds.add(a.category.id);
              cats.push(a.category);
            }
          });
          setCategories(cats);
          if (cats.length > 0) {
            setCategoryId(cats[0].id);
            if (cats[0].code === 'VEHICULE') setIsVehicle(true);
          }
        }
      });
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategoryId(val);
    const cat = categories.find((c) => c.id === val);
    setIsVehicle(cat?.code === 'VEHICULE');
  };

  const handleAcquisitionChange = (val: string) => {
    setValeurAcquisition(val);
    // Suggest 80% current value if not entered
    const num = parseFloat(val);
    if (!isNaN(num) && !valeurActuelle) {
      setValeurActuelle((num * 0.8).toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !numeroInventaire || !categoryId) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        nom,
        numeroInventaire,
        description,
        dateAcquisition: new Date(dateAcquisition).toISOString(),
        valeurAcquisition: parseFloat(valeurAcquisition) || 0,
        valeurActuelle: parseFloat(valeurActuelle) || parseFloat(valeurAcquisition) || 0,
        fournisseur,
        numeroFacture,
        site,
        batiment,
        service,
        statut,
        categoryId,
        responsableId: responsableId || undefined,
        photos: photoUrl ? [photoUrl] : [],
      };

      if (isVehicle) {
        payload.vehicle = {
          immatriculation: immatriculation.toUpperCase(),
          marque,
          modele,
          annee: parseInt(annee) || 2024,
          typeCarburant,
          kilometrage: parseInt(kilometrage) || 0,
          dateProchainControle: dateProchainControle
            ? new Date(dateProchainControle).toISOString()
            : undefined,
          dateEcheanceAssurance: dateEcheanceAssurance
            ? new Date(dateEcheanceAssurance).toISOString()
            : undefined,
        };
      }

      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data?.id) {
        router.push(`/assets/${data.data.id}`);
      } else {
        alert(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/assets"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Enregistrer une nouvelle immobilisation
          </h1>
          <p className="text-xs text-slate-500">
            Un QR Code scannable et une fiche dédiée seront automatiquement générés.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 : Informations Générales */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Boxes className="w-4 h-4" />
            <span>Informations Principales</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Désignation du bien <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ex: Chariot élévateur frontal 2.5T, MacBook Pro M3, Renault Master..."
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numéro d&apos;inventaire interne <span className="text-rose-500">*</span>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catégorie <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description / Caractéristiques techniques
              </label>
              <textarea
                rows={2}
                placeholder="Spécifications, accessoires, état général..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Statut initial</label>
              <select
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="EN_SERVICE">En service (Opérationnel)</option>
                <option value="EN_MAINTENANCE">En révision / maintenance</option>
                <option value="HORS_SERVICE">Hors service</option>
                <option value="CEDE">Cédé / Déclassé</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Photo du bien (optionnel)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2 : Spécifique Véhicule (si catégorie Véhicules) */}
        {isVehicle && (
          <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-200 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Truck className="w-4 h-4" />
              <span>Détails Véhicule &amp; Suivi Flotte</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Immatriculation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required={isVehicle}
                  placeholder="ex: AB-123-CD"
                  value={immatriculation}
                  onChange={(e) => setImmatriculation(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold uppercase tracking-wider rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Marque</label>
                <input
                  type="text"
                  placeholder="ex: Renault, Peugeot, Toyota..."
                  value={marque}
                  onChange={(e) => setMarque(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modèle &amp; Version</label>
                <input
                  type="text"
                  placeholder="ex: Master dCi 150, 208 GT..."
                  value={modele}
                  onChange={(e) => setModele(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Carburant</label>
                <select
                  value={typeCarburant}
                  onChange={(e) => setTypeCarburant(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Essence">Essence</option>
                  <option value="Électrique">Électrique (EV)</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Autre">Autre (GPL / Bioéthanol)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kilométrage actuel</label>
                <input
                  type="number"
                  placeholder="0"
                  value={kilometrage}
                  onChange={(e) => setKilometrage(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Année</label>
                <input
                  type="number"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prochain Contrôle Technique
                </label>
                <input
                  type="date"
                  value={dateProchainControle}
                  onChange={(e) => setDateProchainControle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Échéance Assurance
                </label>
                <input
                  type="date"
                  value={dateEcheanceAssurance}
                  onChange={(e) => setDateEcheanceAssurance(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3 : Localisation & Affectation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Building className="w-4 h-4" />
            <span>Localisation &amp; Affectation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Site / Usine / Entrepôt <span className="text-rose-500">*</span>
              </label>
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
                placeholder="ex: Atelier Nord, Bâtiment B, Hangar 2..."
                value={batiment}
                onChange={(e) => setBatiment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service / Département</label>
              <input
                type="text"
                placeholder="ex: Maintenance, Logistique, Bureau d’études..."
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4 : Données Financières & Comptables */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <DollarSign className="w-4 h-4" />
            <span>Données Financières &amp; Amortissement</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date d&apos;acquisition
              </label>
              <input
                type="date"
                required
                value={dateAcquisition}
                onChange={(e) => setDateAcquisition(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valeur d&apos;acquisition (DA TTC)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={valeurAcquisition}
                onChange={(e) => handleAcquisitionChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valeur actuelle estimée (DA TTC)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={valeurActuelle}
                onChange={(e) => setValeurActuelle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fournisseur</label>
              <input
                type="text"
                placeholder="ex: Dell, Renault Pro, Steelcase..."
                value={fournisseur}
                onChange={(e) => setFournisseur(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">N° de Facture</label>
              <input
                type="text"
                placeholder="ex: FAC-2024-8841"
                value={numeroFacture}
                onChange={(e) => setNumeroFacture(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/assets"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Création du bien &amp; QR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Créer et générer le QR Code</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
