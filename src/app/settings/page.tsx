import React from 'react';
import { dbService } from '@/lib/db';
import {
  Settings,
  Users,
  Building,
  Tag,
  Database,
  Shield,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { UserManagementTable } from '@/components/UserManagementTable';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const users = await dbService.getUsers();
  const categories = await dbService.getCategories();
  const isPrismaActive = await dbService.isPrismaActive();

  const sites = [
    { nom: 'Siège Social Lyon', type: 'Tertiaire & Direction', adresse: '69007 Lyon' },
    { nom: 'Site Usine Nord', type: 'Production & Ateliers', adresse: '59000 Lille' },
    { nom: 'Entrepôt Logistique Marseille', type: 'Plateforme Expéditions', adresse: '13015 Marseille' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Paramètres &amp; Administration
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Gestion des utilisateurs, des droits d&apos;accès, des catégories d&apos;immobilisations et de l&apos;infrastructure.
        </p>
      </div>

      {/* Database & Neon Status */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Infrastructure Base de Données</h2>
              <p className="text-xs text-slate-500">PostgreSQL hébergé sur Neon Serverless</p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isPrismaActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isPrismaActive ? 'Connectée via DATABASE_URL' : 'Mode Mémoire Démo (Prêt pour Neon)'}
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Déploiement Vercel :</strong> Lorsque le projet est lié à l&apos;intégration Neon dans Vercel (onglet Storage), la variable <code>DATABASE_URL</code> est automatiquement configurée.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Migrations Prisma :</strong> Les tables <code>User</code>, <code>Asset</code>, <code>Vehicle</code>, <code>MaintenanceLog</code> sont configurées dans <code>prisma/schema.prisma</code>.
            </span>
          </div>
        </div>
      </div>

      {/* Users and Roles Management */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2>Gestion des Utilisateurs &amp; Approbations</h2>
        </div>
        <p className="text-xs text-slate-500">
          Validez les demandes d&apos;accès des nouveaux collaborateurs et gérez les droits d&apos;accès à la plateforme.
        </p>

        <UserManagementTable initialUsers={users} />
      </div>

      {/* Categories */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Tag className="w-5 h-5 text-indigo-600" />
          <h2>Catégories d&apos;Immobilisations</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {categories.map((c) => (
            <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-sm block">{c.nom}</span>
                <span className="text-slate-400 font-mono text-[11px]">Code : {c.code}</span>
              </div>
              <span className="text-xs text-indigo-600 font-semibold bg-white px-2 py-1 rounded border border-slate-200">
                Actif
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sites */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Building className="w-5 h-5 text-indigo-600" />
          <h2>Sites et Établissements</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {sites.map((s) => (
            <div key={s.nom} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-900 text-sm block">{s.nom}</span>
              <p className="text-slate-500">{s.type}</p>
              <p className="text-slate-400 font-mono">{s.adresse}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
