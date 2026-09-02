'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Printer,
  Settings,
  QrCode,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';
import { DEMO_ACCOUNTS, getStoredUser, setStoredUser, SessionUser } from '@/lib/auth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    const handleAuthChange = () => setCurrentUser(getStoredUser());
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const switchRole = (user: SessionUser) => {
    setStoredUser(user);
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/assets', label: 'Immobilisations', icon: Boxes },
    { href: '/vehicles', label: 'Flotte Véhicules', icon: Truck },
    { href: '/labels', label: 'Étiquettes QR', icon: Printer },
    { href: '/settings', label: 'Paramètres', icon: Settings },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Admin', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'GESTIONNAIRE':
        return { label: 'Gestionnaire', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'EMPLOYE':
        return { label: 'Employé', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Invité Public', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="relative h-11 w-24 sm:w-28 flex items-center justify-center transition group-hover:scale-105">
                  <Image
                    src="/logo.jpg"
                    alt="Météor Pro"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                      MÉTÉOR<span className="text-indigo-600">PRO</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      QR ASSETS
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 hidden sm:block">
                    Inventaire &amp; Gestion des Immobilisations
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Scan QR Button */}
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95 qr-scan-trigger"
                title="Scanner un QR code physique"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">Scanner QR</span>
              </button>

              {/* New Asset Button */}
              <Link
                href="/assets/new"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau bien</span>
              </Link>

              {/* User Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {currentUser?.nom ? currentUser.nom.charAt(0) : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {currentUser?.nom || 'Invité'}
                    </p>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400">Rôle actif actuel :</p>
                      <p className="text-sm font-bold text-slate-900">{currentUser?.nom}</p>
                      <p className="text-xs text-slate-500">{currentUser?.departement}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Changer de profil (Démo 1-Clic)
                      </p>
                      <button
                        onClick={() => switchRole(DEMO_ACCOUNTS.ADMIN)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-rose-50 hover:text-rose-900 transition text-left"
                      >
                        <span className="font-semibold text-slate-800">Admin (Alexandre)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">Admin</span>
                      </button>
                      <button
                        onClick={() => switchRole(DEMO_ACCOUNTS.GESTIONNAIRE)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-900 transition text-left"
                      >
                        <span className="font-semibold text-slate-800">Gestionnaire (Sophie)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">Gestionnaire</span>
                      </button>
                      <button
                        onClick={() => switchRole(DEMO_ACCOUNTS.EMPLOYE)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-emerald-50 hover:text-emerald-900 transition text-left"
                      >
                        <span className="font-semibold text-slate-800">Employé (Thomas)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Employé</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 px-2">
                      <button
                        onClick={() => {
                          setStoredUser(null);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100 transition"
                      >
                        Tester la vue publique (Déconnexion)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/assets/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau bien</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Floating QR Scanner Modal */}
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </>
  );
};
