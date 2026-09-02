'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, QrCode, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { INITIAL_ASSETS } from '@/lib/mockData';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number | undefined = undefined;

    if (isOpen) {
      setCameraError(null);
      setIsScanning(true);

      // Try camera stream
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((mediaStream) => {
            stream = mediaStream;
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play();
              setHasCamera(true);
            }
          })
          .catch((err) => {
            console.warn('Camera access error or denied:', err);
            setHasCamera(false);
            setCameraError('Accès caméra non disponible sur cet appareil ou non autorisé.');
          });
      } else {
        setHasCamera(false);
        setCameraError('Votre navigateur ne prend pas en charge l’accès direct à la caméra.');
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    // Check if entered code matches an ID or inventory number
    const trimmed = manualCode.trim();
    const matched = INITIAL_ASSETS.find(
      (a) =>
        a.id.toLowerCase() === trimmed.toLowerCase() ||
        a.numeroInventaire.toLowerCase() === trimmed.toLowerCase() ||
        (a.vehicle && a.vehicle.immatriculation.toLowerCase() === trimmed.toLowerCase())
    );

    onClose();
    if (matched) {
      router.push(`/assets/${matched.id}`);
    } else {
      router.push(`/assets/${trimmed}`);
    }
  };

  const handleQuickSelect = (assetId: string) => {
    onClose();
    router.push(`/assets/${assetId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Scanner un QR Code</h3>
              <p className="text-xs text-slate-500">Pointez l&apos;étiquette du bien ou entrez son code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Camera Viewfinder */}
          <div className="relative aspect-square max-h-64 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
            {hasCamera ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Visual scan frame */}
                <div className="absolute inset-8 border-2 border-indigo-500 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" />
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-indigo-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Viseur Caméra Prêt</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Sur un smartphone réel, l’appareil photo détecte le QR code instantanément.
                  </p>
                </div>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{cameraError} Vous pouvez saisir l&apos;identifiant ou choisir un bien de démonstration ci-dessous.</span>
            </div>
          )}

          {/* Manual Input */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Ou saisie manuelle (Numéro inventaire ou ID)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ex: IMM-2023-V01 ou ast-v-001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-1.5"
              >
                <span>Accéder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo QR Links */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Accès direct test (Biens de démonstration)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {INITIAL_ASSETS.slice(0, 3).map((ast) => (
                <button
                  key={ast.id}
                  onClick={() => handleQuickSelect(ast.id)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition group"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                      {ast.nom}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {ast.numeroInventaire} • {ast.site}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 flex-shrink-0 group-hover:translate-x-0.5 transition">
                    Voir fiche →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
