'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Check, Loader2 } from 'lucide-react';

interface ReportIncidentModalProps {
  assetId: string;
  assetNom: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  assetId,
  assetNom,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [signalePar, setSignalePar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/assets/${assetId}/incident`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre,
          description,
          signalePar: signalePar || 'Agent terrain (Scan QR)',
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onSuccess();
          onClose();
        }, 1200);
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-slate-900">Signaler un dysfonctionnement</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Signalement transmis !</h4>
            <p className="text-xs text-slate-600">
              L&apos;alerte a été transmise aux gestionnaires du parc. Merci pour votre vigilance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Bien concerné :</p>
              <p className="text-sm font-bold text-slate-800">{assetNom}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Objet du problème <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ex: Témoin moteur allumé, Fuite hydraulique, Écran cassé..."
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description détaillée <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Circonstances, bruits anormaux, localisation exacte du problème..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Votre nom / Contact (optionnel)
              </label>
              <input
                type="text"
                placeholder="ex: Thomas Leroy - 06 12 34 56 78"
                value={signalePar}
                onChange={(e) => setSignalePar(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
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
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <span>Envoyer l&apos;alerte</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
