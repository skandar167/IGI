'use client';

import React, { useState } from 'react';
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
  ChevronDown,
  Plus,
  LogOut,
  LogIn,
  User,
  Home,
} from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';
import { useSession, signOut } from 'next-auth/react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentUser = session?.user as any;

  const navLinks = [
    { href: '/home', label: 'Accueil', icon: Home },
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
        return { label: 'Invité', color: 'bg-slate-100 text-slate-700 border-slate-200' };
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95 qr-scan-trigger cursor-pointer"
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

              {/* User Dropdown / Login Button */}
              {status === 'authenticated' && currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">
                        {currentUser?.name || currentUser?.email}
                      </p>
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-400">Connecté en tant que :</p>
                        <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                        <p className="text-xs text-slate-500 font-mono truncate">{currentUser?.email}</p>
                        {currentUser?.departement && (
                          <p className="text-[11px] text-slate-400 mt-1">{currentUser.departement}</p>
                        )}
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut({ callbackUrl: '/login' });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-semibold hover:bg-indigo-100 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
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
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                href="/assets/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau bien</span>
              </Link>
              {status === 'authenticated' && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Floating QR Scanner Modal */}
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </>
  );
};
