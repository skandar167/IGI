import { Role } from './types';

export interface SessionUser {
  id: string;
  nom: string;
  email: string;
  role: Role;
  departement?: string;
}
