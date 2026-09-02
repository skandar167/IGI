import React from 'react';
import { AssetStatus } from '@/lib/types';
import { CheckCircle2, Wrench, AlertTriangle, Archive } from 'lucide-react';

interface StatusBadgeProps {
  statut: AssetStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ statut, size = 'md', showIcon = true }) => {
  const configs = {
    EN_SERVICE: {
      label: 'En service',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    EN_MAINTENANCE: {
      label: 'En maintenance',
      bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: Wrench,
      dot: 'bg-amber-500',
    },
    HORS_SERVICE: {
      label: 'Hors service',
      bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      icon: AlertTriangle,
      dot: 'bg-rose-500',
    },
    CEDE: {
      label: 'Cédé / Rebuté',
      bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: Archive,
      dot: 'bg-slate-400',
    },
  };

  const config = configs[statut] || configs.EN_SERVICE;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon ? (
        <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
