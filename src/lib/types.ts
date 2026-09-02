export type Role = 'ADMIN' | 'GESTIONNAIRE' | 'EMPLOYE';

export type AssetStatus = 'EN_SERVICE' | 'EN_MAINTENANCE' | 'HORS_SERVICE' | 'CEDE';

export interface User {
  id: string;
  nom: string;
  email: string;
  password?: string;
  role: Role;
  departement?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  nom: string;
  code: 'VEHICULE' | 'MACHINE' | 'INFORMATIQUE' | 'MOBILIER' | 'AUTRE';
  icone?: string;
}

export interface Vehicle {
  id: string;
  assetId: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  typeCarburant: 'Diesel' | 'Essence' | 'Électrique' | 'Hybride' | 'Autre';
  kilometrage: number;
  dateDernierControle?: string;
  dateProchainControle?: string;
  dateAssurance?: string;
  dateEcheanceAssurance?: string;
  conducteurHabituelId?: string;
  conducteurHabituel?: {
    id: string;
    nom: string;
    email: string;
  };
}

export interface MaintenanceLog {
  id: string;
  assetId: string;
  date: string;
  typeIntervention: string;
  cout: number;
  prestataire?: string;
  notes?: string;
  documentUrl?: string;
  createdAt: string;
}

export interface IncidentReport {
  id: string;
  assetId: string;
  date: string;
  titre: string;
  description: string;
  statut: 'OUVERT' | 'EN_COURS' | 'RESOLU';
  signalePar?: string;
  userId?: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  nom: string;
  numeroInventaire: string;
  description?: string;
  dateAcquisition: string;
  valeurAcquisition: number;
  valeurActuelle: number;
  fournisseur?: string;
  numeroFacture?: string;
  site: string;
  batiment?: string;
  service?: string;
  statut: AssetStatus;
  photos: string[];
  documents: string[];
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;

  categoryId: string;
  category?: Category;

  responsableId?: string;
  responsable?: {
    id: string;
    nom: string;
    email: string;
    departement?: string;
  };

  vehicle?: Vehicle;
  maintenanceLogs?: MaintenanceLog[];
  incidentReports?: IncidentReport[];
}

export interface DashboardMetrics {
  totalAssets: number;
  totalValeurAcquisition: number;
  totalValeurActuelle: number;
  assetsEnService: number;
  assetsEnMaintenance: number;
  assetsHorsService: number;
  urgentAlertsCount: number;
  categoryStats: {
    category: string;
    code: string;
    count: number;
    valeur: number;
  }[];
  siteStats: {
    site: string;
    count: number;
    valeur: number;
  }[];
  upcomingAlerts: {
    id: string;
    assetId: string;
    assetNom: string;
    immatriculation?: string;
    type: 'CONTROLE_TECHNIQUE' | 'ASSURANCE' | 'MAINTENANCE';
    label: string;
    date: string;
    daysLeft: number;
    urgent: boolean;
  }[];
  recentIncidents: IncidentReport[];
}
