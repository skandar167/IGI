'use client';

import React, { useState } from 'react';
import { User, Role } from '@/lib/types';
import { Check, X, Shield, Clock, Trash2, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

interface Props {
  initialUsers: User[];
}

export function UserManagementTable({ initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleApproval = async (user: User, newStatus: boolean) => {
    setLoadingId(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estApprouve: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, estApprouve: newStatus } : u))
        );
        showNotification(
          newStatus
            ? `Compte de ${user.nom} approuvé avec succès !`
            : `Accès de ${user.nom} suspendu.`
        );
      } else {
        showNotification(json.error || 'Erreur lors de la mise à jour', 'error');
      }
    } catch {
      showNotification('Erreur réseau', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${user.nom} (${user.email}) ?`)) {
      return;
    }
    setLoadingId(user.id);
    try {
      const res = await fetch(`/api/users/${user.id}/approve`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        showNotification(`Compte de ${user.nom} supprimé.`);
      } else {
        showNotification(json.error || 'Erreur lors de la suppression', 'error');
      }
    } catch {
      showNotification('Erreur réseau', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const pendingCount = users.filter((u) => u.estApprouve === false).length;

  const filteredUsers = users.filter((u) => {
    if (filter === 'PENDING') return u.estApprouve === false;
    if (filter === 'APPROVED') return u.estApprouve === true;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter Tabs & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous ({users.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              filter === 'PENDING'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>En attente</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'APPROVED'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approuvés ({users.filter((u) => u.estApprouve === true).length})
          </button>
        </div>

        {pendingCount > 0 && (
          <p className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{pendingCount} collaborateur(s) attendent votre validation</span>
          </p>
        )}
      </div>

      {/* Users List */}
      <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Aucun utilisateur dans cette catégorie.
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isPending = u.estApprouve === false;
            const isLoading = loadingId === u.id;

            return (
              <div
                key={u.id}
                className="p-4 bg-white hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{u.nom}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                        u.role === 'ADMIN'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : u.role === 'GESTIONNAIRE'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {u.role}
                    </span>
                    {isPending ? (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>En attente</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Approuvé</span>
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 font-mono text-[11px]">
                    {u.email} • {u.departement || 'Sans département'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPending ? (
                    <button
                      onClick={() => handleToggleApproval(u, true)}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isLoading ? '...' : 'Approuver'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleApproval(u, false)}
                      disabled={isLoading || u.role === 'ADMIN'}
                      title={u.role === 'ADMIN' ? 'Impossible de suspendre un administrateur' : 'Suspendre l’accès'}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 font-medium text-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>Suspendre</span>
                    </button>
                  )}

                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleDeleteUser(u)}
                      disabled={isLoading}
                      title="Supprimer définitivement"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
