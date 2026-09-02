import { User, Role } from './types';
import { INITIAL_USERS } from './mockData';

export const DEMO_ACCOUNTS = {
  ADMIN: INITIAL_USERS[0],
  GESTIONNAIRE: INITIAL_USERS[1],
  EMPLOYE: INITIAL_USERS[2],
};

export interface SessionUser {
  id: string;
  nom: string;
  email: string;
  role: Role;
  departement?: string;
}

const STORAGE_KEY = 'meteor_pro_active_user';

export function getStoredUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_ACCOUNTS.ADMIN; // Default demo active user for seamless testing
    return JSON.parse(raw);
  } catch {
    return DEMO_ACCOUNTS.ADMIN;
  }
}

export function setStoredUser(user: SessionUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  // Dispatch custom event for UI reactivity
  window.dispatchEvent(new Event('auth-change'));
}
