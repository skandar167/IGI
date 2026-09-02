'use client';

import React, { useState } from 'react';
import { Wrench, X, Loader2 } from 'lucide-react';

interface AddMaintenanceModalProps {
  assetId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddMaintenanceModal: React.FC<AddMaintenanceModalProps> = ({
  assetId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [typeIntervention, setTypeIntervention] = useState('Entretien régulier / Vidange');
  const [cout, setCout] = useState('');
  const [prestataire, setPrestataire] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeIntervention.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/assets/${assetId}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date(date).toISOString(),
          typeIntervention,
          cout: parseFloat(cout) || 0,
          prestataire,
          notes,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-indigo-600">
            <Wrench className="w-5 h-5" />
            <h3 className="font-bold text-slate-900">Enregistrer un entretien</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Coût TTC (DA)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={cout}
                onChange={(e) => setCout(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type d&apos;intervention <span className="text-rose-500">*</span>
            </label>
            <select
              value={typeIntervention}
              onChange={(e) => setTypeIntervention(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="Entretien régulier / Vidange">Entretien régulier / Vidange</option>
              <option value="Contrôle technique périodique">Contrôle technique périodique</option>
              <option value="Réparation mécanique">Réparation mécanique</option>
              <option value="Changement pneumatiques">Changement pneumatiques</option>
              <option value="Révision système / Firmware">Révision système / Firmware</option>
              <option value="Remplacement pièces d’usure">Remplacement pièces d’usure</option>
              <option value="Autre intervention">Autre intervention</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prestataire / Garage / Technicien
            </label>
            <input
              type="text"
              placeholder="ex: Garage Central, Fenwick Service..."
              value={prestataire}
              onChange={(e) => setPrestataire(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observations &amp; détails des travaux
            </label>
            <textarea
              rows={3}
              placeholder="Pièces remplacées, garanties, prochaines recommandations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>Ajouter l&apos;entrée</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
