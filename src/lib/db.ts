import { PrismaClient } from '@prisma/client';
import { Asset, Category, DashboardMetrics, IncidentReport, MaintenanceLog, User, Vehicle } from './types';
import { INITIAL_ASSETS, INITIAL_CATEGORIES, INITIAL_USERS } from './mockData';
import { generateQrDataUrl, getAssetScanUrl } from './qrcode';

// Global Prisma instance declaration
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL
    ? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : undefined);

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

// In-Memory store fallback when DATABASE_URL is not set or during initial setup
let mockCategories: Category[] = [...INITIAL_CATEGORIES];
let mockUsers: User[] = [...INITIAL_USERS];
let mockAssets: Asset[] = [...INITIAL_ASSETS];

// Initialize QR codes for mock assets on first load
let initializedMockQr = false;
async function ensureMockQrCodes() {
  if (initializedMockQr || process.env.DATABASE_URL) return;
  for (const asset of mockAssets) {
    if (!asset.qrCodeUrl) {
      const scanUrl = getAssetScanUrl(asset.id);
      asset.qrCodeUrl = await generateQrDataUrl(scanUrl);
    }
  }
  initializedMockQr = true;
}

let prismaActiveCache: { active: boolean; checkedAt: number } | null = null;

export const dbService = {
  async isPrismaActive(): Promise<boolean> {
    if (!prisma || !process.env.DATABASE_URL) return false;
    const now = Date.now();
    if (prismaActiveCache && now - prismaActiveCache.checkedAt < 60000) {
      return prismaActiveCache.active;
    }
    try {
      await prisma.$queryRaw`SELECT 1`;
      prismaActiveCache = { active: true, checkedAt: now };
      return true;
    } catch {
      prismaActiveCache = { active: false, checkedAt: now };
      return false;
    }
  },

  async getCategories(): Promise<Category[]> {
    if (await dbService.isPrismaActive()) {
      const cats = await prisma!.category.findMany();
      return cats as Category[];
    }
    return mockCategories;
  },

  async getUsers(): Promise<User[]> {
    if (await dbService.isPrismaActive()) {
      const users = await prisma!.user.findMany();
      return users.map((u) => ({
        id: u.id,
        nom: u.nom,
        email: u.email,
        role: u.role as any,
        departement: u.departement || undefined,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      }));
    }
    return mockUsers;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    if (await dbService.isPrismaActive()) {
      const u = await prisma!.user.findUnique({
        where: { email: normalized },
      });
      if (!u) return null;
      return {
        id: u.id,
        nom: u.nom,
        email: u.email,
        passwordHash: u.passwordHash,
        role: u.role as any,
        departement: u.departement || undefined,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      };
    }
    const found = mockUsers.find((u) => u.email.toLowerCase() === normalized);
    return found || null;
  },

  async getAssets(filters?: {
    categoryId?: string;
    site?: string;
    statut?: string;
    search?: string;
  }): Promise<Asset[]> {
    await ensureMockQrCodes();

    if (await dbService.isPrismaActive()) {
      const whereClause: any = {};
      if (filters?.categoryId && filters.categoryId !== 'all') {
        whereClause.categoryId = filters.categoryId;
      }
      if (filters?.site && filters.site !== 'all') {
        whereClause.site = filters.site;
      }
      if (filters?.statut && filters.statut !== 'all') {
        whereClause.statut = filters.statut;
      }
      if (filters?.search) {
        whereClause.OR = [
          { nom: { contains: filters.search, mode: 'insensitive' } },
          { numeroInventaire: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { vehicle: { immatriculation: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      const assets = await prisma!.asset.findMany({
        where: whereClause,
        include: {
          category: true,
          responsable: true,
          vehicle: {
            include: { conducteurHabituel: true },
          },
          maintenanceLogs: { orderBy: { date: 'desc' } },
          incidentReports: { orderBy: { date: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return assets.map((a) => ({
        id: a.id,
        nom: a.nom,
        numeroInventaire: a.numeroInventaire,
        description: a.description || undefined,
        dateAcquisition: a.dateAcquisition.toISOString(),
        valeurAcquisition: a.valeurAcquisition,
        valeurActuelle: a.valeurActuelle,
        fournisseur: a.fournisseur || undefined,
        numeroFacture: a.numeroFacture || undefined,
        site: a.site,
        batiment: a.batiment || undefined,
        service: a.service || undefined,
        statut: a.statut as any,
        photos: a.photos,
        documents: a.documents,
        qrCodeUrl: a.qrCodeUrl || undefined,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
        categoryId: a.categoryId,
        category: a.category as Category,
        responsableId: a.responsableId || undefined,
        responsable: a.responsable
          ? {
              id: a.responsable.id,
              nom: a.responsable.nom,
              email: a.responsable.email,
              departement: a.responsable.departement || undefined,
            }
          : undefined,
        vehicle: a.vehicle
          ? {
              id: a.vehicle.id,
              assetId: a.vehicle.assetId,
              immatriculation: a.vehicle.immatriculation,
              marque: a.vehicle.marque,
              modele: a.vehicle.modele,
              annee: a.vehicle.annee,
              typeCarburant: a.vehicle.typeCarburant as any,
              kilometrage: a.vehicle.kilometrage,
              dateDernierControle: a.vehicle.dateDernierControle?.toISOString(),
              dateProchainControle: a.vehicle.dateProchainControle?.toISOString(),
              dateAssurance: a.vehicle.dateAssurance?.toISOString(),
              dateEcheanceAssurance: a.vehicle.dateEcheanceAssurance?.toISOString(),
              conducteurHabituelId: a.vehicle.conducteurHabituelId || undefined,
              conducteurHabituel: a.vehicle.conducteurHabituel
                ? {
                    id: a.vehicle.conducteurHabituel.id,
                    nom: a.vehicle.conducteurHabituel.nom,
                    email: a.vehicle.conducteurHabituel.email,
                  }
                : undefined,
            }
          : undefined,
        maintenanceLogs: a.maintenanceLogs.map((m) => ({
          id: m.id,
          assetId: m.assetId,
          date: m.date.toISOString(),
          typeIntervention: m.typeIntervention,
          cout: m.cout,
          prestataire: m.prestataire || undefined,
          notes: m.notes || undefined,
          documentUrl: m.documentUrl || undefined,
          createdAt: m.createdAt.toISOString(),
        })),
        incidentReports: a.incidentReports.map((i) => ({
          id: i.id,
          assetId: i.assetId,
          date: i.date.toISOString(),
          titre: i.titre,
          description: i.description,
          statut: i.statut as any,
          signalePar: i.signalePar || undefined,
          userId: i.userId || undefined,
          createdAt: i.createdAt.toISOString(),
        })),
      }));
    }

    // Fallback in-memory filter
    let results = [...mockAssets];

    if (filters?.categoryId && filters.categoryId !== 'all') {
      results = results.filter((a) => a.categoryId === filters.categoryId);
    }
    if (filters?.site && filters.site !== 'all') {
      results = results.filter((a) => a.site === filters.site);
    }
    if (filters?.statut && filters.statut !== 'all') {
      results = results.filter((a) => a.statut === filters.statut);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.nom.toLowerCase().includes(q) ||
          a.numeroInventaire.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          (a.vehicle && a.vehicle.immatriculation.toLowerCase().includes(q))
      );
    }

    // Attach relations
    return results.map((asset) => {
      const cat = mockCategories.find((c) => c.id === asset.categoryId);
      const user = mockUsers.find((u) => u.id === asset.responsableId);
      return {
        ...asset,
        category: cat,
        responsable: user
          ? { id: user.id, nom: user.nom, email: user.email, departement: user.departement }
          : undefined,
      };
    });
  },

  async getAssetById(id: string): Promise<Asset | null> {
    await ensureMockQrCodes();

    if (await dbService.isPrismaActive()) {
      const asset = await prisma!.asset.findUnique({
        where: { id },
        include: {
          category: true,
          responsable: true,
          vehicle: { include: { conducteurHabituel: true } },
          maintenanceLogs: { orderBy: { date: 'desc' } },
          incidentReports: { orderBy: { date: 'desc' } },
        },
      });

      if (!asset) return null;

      return {
        id: asset.id,
        nom: asset.nom,
        numeroInventaire: asset.numeroInventaire,
        description: asset.description || undefined,
        dateAcquisition: asset.dateAcquisition.toISOString(),
        valeurAcquisition: asset.valeurAcquisition,
        valeurActuelle: asset.valeurActuelle,
        fournisseur: asset.fournisseur || undefined,
        numeroFacture: asset.numeroFacture || undefined,
        site: asset.site,
        batiment: asset.batiment || undefined,
        service: asset.service || undefined,
        statut: asset.statut as any,
        photos: asset.photos,
        documents: asset.documents,
        qrCodeUrl: asset.qrCodeUrl || undefined,
        createdAt: asset.createdAt.toISOString(),
        updatedAt: asset.updatedAt.toISOString(),
        categoryId: asset.categoryId,
        category: asset.category as Category,
        responsableId: asset.responsableId || undefined,
        responsable: asset.responsable
          ? {
              id: asset.responsable.id,
              nom: asset.responsable.nom,
              email: asset.responsable.email,
              departement: asset.responsable.departement || undefined,
            }
          : undefined,
        vehicle: asset.vehicle
          ? {
              id: asset.vehicle.id,
              assetId: asset.vehicle.assetId,
              immatriculation: asset.vehicle.immatriculation,
              marque: asset.vehicle.marque,
              modele: asset.vehicle.modele,
              annee: asset.vehicle.annee,
              typeCarburant: asset.vehicle.typeCarburant as any,
              kilometrage: asset.vehicle.kilometrage,
              dateDernierControle: asset.vehicle.dateDernierControle?.toISOString(),
              dateProchainControle: asset.vehicle.dateProchainControle?.toISOString(),
              dateAssurance: asset.vehicle.dateAssurance?.toISOString(),
              dateEcheanceAssurance: asset.vehicle.dateEcheanceAssurance?.toISOString(),
              conducteurHabituelId: asset.vehicle.conducteurHabituelId || undefined,
              conducteurHabituel: asset.vehicle.conducteurHabituel
                ? {
                    id: asset.vehicle.conducteurHabituel.id,
                    nom: asset.vehicle.conducteurHabituel.nom,
                    email: asset.vehicle.conducteurHabituel.email,
                  }
                : undefined,
            }
          : undefined,
        maintenanceLogs: asset.maintenanceLogs.map((m) => ({
          id: m.id,
          assetId: m.assetId,
          date: m.date.toISOString(),
          typeIntervention: m.typeIntervention,
          cout: m.cout,
          prestataire: m.prestataire || undefined,
          notes: m.notes || undefined,
          documentUrl: m.documentUrl || undefined,
          createdAt: m.createdAt.toISOString(),
        })),
        incidentReports: asset.incidentReports.map((i) => ({
          id: i.id,
          assetId: i.assetId,
          date: i.date.toISOString(),
          titre: i.titre,
          description: i.description,
          statut: i.statut as any,
          signalePar: i.signalePar || undefined,
          userId: i.userId || undefined,
          createdAt: i.createdAt.toISOString(),
        })),
      };
    }

    const asset = mockAssets.find((a) => a.id === id);
    if (!asset) return null;

    const cat = mockCategories.find((c) => c.id === asset.categoryId);
    const user = mockUsers.find((u) => u.id === asset.responsableId);
    let driver = undefined;
    if (asset.vehicle?.conducteurHabituelId) {
      const dUser = mockUsers.find((u) => u.id === asset.vehicle!.conducteurHabituelId);
      if (dUser) driver = { id: dUser.id, nom: dUser.nom, email: dUser.email };
    }

    return {
      ...asset,
      category: cat,
      responsable: user
        ? { id: user.id, nom: user.nom, email: user.email, departement: user.departement }
        : undefined,
      vehicle: asset.vehicle
        ? {
            ...asset.vehicle,
            conducteurHabituel: driver,
          }
        : undefined,
    };
  },

  async createAsset(data: {
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
    statut: any;
    categoryId: string;
    responsableId?: string;
    photos?: string[];
    documents?: string[];
    vehicle?: {
      immatriculation: string;
      marque: string;
      modele: string;
      annee: number;
      typeCarburant: any;
      kilometrage: number;
      dateDernierControle?: string;
      dateProchainControle?: string;
      dateAssurance?: string;
      dateEcheanceAssurance?: string;
      conducteurHabituelId?: string;
    };
  }): Promise<Asset> {
    const assetId = `ast-${Date.now()}`;
    const scanUrl = getAssetScanUrl(assetId);
    const qrCodeUrl = await generateQrDataUrl(scanUrl);

    if (await dbService.isPrismaActive()) {
      const created = await prisma!.asset.create({
        data: {
          id: assetId,
          nom: data.nom,
          numeroInventaire: data.numeroInventaire,
          description: data.description,
          dateAcquisition: new Date(data.dateAcquisition),
          valeurAcquisition: Number(data.valeurAcquisition),
          valeurActuelle: Number(data.valeurActuelle),
          fournisseur: data.fournisseur,
          numeroFacture: data.numeroFacture,
          site: data.site,
          batiment: data.batiment,
          service: data.service,
          statut: data.statut,
          photos: data.photos || [],
          documents: data.documents || [],
          qrCodeUrl,
          categoryId: data.categoryId,
          responsableId: data.responsableId || undefined,
          vehicle: data.vehicle
            ? {
                create: {
                  immatriculation: data.vehicle.immatriculation,
                  marque: data.vehicle.marque,
                  modele: data.vehicle.modele,
                  annee: Number(data.vehicle.annee),
                  typeCarburant: data.vehicle.typeCarburant,
                  kilometrage: Number(data.vehicle.kilometrage),
                  dateDernierControle: data.vehicle.dateDernierControle
                    ? new Date(data.vehicle.dateDernierControle)
                    : null,
                  dateProchainControle: data.vehicle.dateProchainControle
                    ? new Date(data.vehicle.dateProchainControle)
                    : null,
                  dateAssurance: data.vehicle.dateAssurance
                    ? new Date(data.vehicle.dateAssurance)
                    : null,
                  dateEcheanceAssurance: data.vehicle.dateEcheanceAssurance
                    ? new Date(data.vehicle.dateEcheanceAssurance)
                    : null,
                  conducteurHabituelId: data.vehicle.conducteurHabituelId || undefined,
                },
              }
            : undefined,
        },
        include: {
          category: true,
          responsable: true,
          vehicle: true,
        },
      });

      return (await dbService.getAssetById(created.id))!;
    }

    const newAsset: Asset = {
      id: assetId,
      nom: data.nom,
      numeroInventaire: data.numeroInventaire,
      description: data.description,
      dateAcquisition: data.dateAcquisition,
      valeurAcquisition: Number(data.valeurAcquisition),
      valeurActuelle: Number(data.valeurActuelle),
      fournisseur: data.fournisseur,
      numeroFacture: data.numeroFacture,
      site: data.site,
      batiment: data.batiment,
      service: data.service,
      statut: data.statut,
      photos: data.photos || [],
      documents: data.documents || [],
      qrCodeUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categoryId: data.categoryId,
      responsableId: data.responsableId,
      maintenanceLogs: [],
      incidentReports: [],
      vehicle: data.vehicle
        ? {
            id: `veh-${Date.now()}`,
            assetId,
            immatriculation: data.vehicle.immatriculation,
            marque: data.vehicle.marque,
            modele: data.vehicle.modele,
            annee: Number(data.vehicle.annee),
            typeCarburant: data.vehicle.typeCarburant,
            kilometrage: Number(data.vehicle.kilometrage),
            dateDernierControle: data.vehicle.dateDernierControle,
            dateProchainControle: data.vehicle.dateProchainControle,
            dateAssurance: data.vehicle.dateAssurance,
            dateEcheanceAssurance: data.vehicle.dateEcheanceAssurance,
            conducteurHabituelId: data.vehicle.conducteurHabituelId,
          }
        : undefined,
    };

    mockAssets.unshift(newAsset);
    return (await dbService.getAssetById(assetId))!;
  },

  async updateAsset(id: string, data: Partial<Asset>): Promise<Asset | null> {
    if (await dbService.isPrismaActive()) {
      await prisma!.asset.update({
        where: { id },
        data: {
          nom: data.nom,
          numeroInventaire: data.numeroInventaire,
          description: data.description,
          valeurAcquisition: data.valeurAcquisition,
          valeurActuelle: data.valeurActuelle,
          fournisseur: data.fournisseur,
          numeroFacture: data.numeroFacture,
          site: data.site,
          batiment: data.batiment,
          service: data.service,
          statut: data.statut as any,
          categoryId: data.categoryId,
          responsableId: data.responsableId || undefined,
        },
      });

      if (data.vehicle) {
        await prisma!.vehicle.upsert({
          where: { assetId: id },
          create: {
            assetId: id,
            immatriculation: data.vehicle.immatriculation,
            marque: data.vehicle.marque,
            modele: data.vehicle.modele,
            annee: Number(data.vehicle.annee),
            typeCarburant: data.vehicle.typeCarburant,
            kilometrage: Number(data.vehicle.kilometrage),
            dateDernierControle: data.vehicle.dateDernierControle
              ? new Date(data.vehicle.dateDernierControle)
              : null,
            dateProchainControle: data.vehicle.dateProchainControle
              ? new Date(data.vehicle.dateProchainControle)
              : null,
            dateAssurance: data.vehicle.dateAssurance
              ? new Date(data.vehicle.dateAssurance)
              : null,
            dateEcheanceAssurance: data.vehicle.dateEcheanceAssurance
              ? new Date(data.vehicle.dateEcheanceAssurance)
              : null,
            conducteurHabituelId: data.vehicle.conducteurHabituelId || undefined,
          },
          update: {
            immatriculation: data.vehicle.immatriculation,
            marque: data.vehicle.marque,
            modele: data.vehicle.modele,
            annee: Number(data.vehicle.annee),
            typeCarburant: data.vehicle.typeCarburant,
            kilometrage: Number(data.vehicle.kilometrage),
            dateDernierControle: data.vehicle.dateDernierControle
              ? new Date(data.vehicle.dateDernierControle)
              : null,
            dateProchainControle: data.vehicle.dateProchainControle
              ? new Date(data.vehicle.dateProchainControle)
              : null,
            dateAssurance: data.vehicle.dateAssurance
              ? new Date(data.vehicle.dateAssurance)
              : null,
            dateEcheanceAssurance: data.vehicle.dateEcheanceAssurance
              ? new Date(data.vehicle.dateEcheanceAssurance)
              : null,
            conducteurHabituelId: data.vehicle.conducteurHabituelId || undefined,
          },
        });
      }

      return dbService.getAssetById(id);
    }

    const idx = mockAssets.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    mockAssets[idx] = {
      ...mockAssets[idx],
      ...data,
      updatedAt: new Date().toISOString(),
      vehicle: data.vehicle
        ? {
            ...mockAssets[idx].vehicle,
            ...data.vehicle,
            id: mockAssets[idx].vehicle?.id || `veh-${Date.now()}`,
            assetId: id,
          }
        : mockAssets[idx].vehicle,
    };

    return dbService.getAssetById(id);
  },

  async deleteAsset(id: string): Promise<boolean> {
    if (await dbService.isPrismaActive()) {
      await prisma!.asset.delete({ where: { id } });
      return true;
    }
    const idx = mockAssets.findIndex((a) => a.id === id);
    if (idx !== -1) {
      mockAssets.splice(idx, 1);
      return true;
    }
    return false;
  },

  async addMaintenanceLog(
    assetId: string,
    data: {
      date: string;
      typeIntervention: string;
      cout: number;
      prestataire?: string;
      notes?: string;
      documentUrl?: string;
    }
  ): Promise<MaintenanceLog> {
    if (await dbService.isPrismaActive()) {
      const created = await prisma!.maintenanceLog.create({
        data: {
          assetId,
          date: new Date(data.date),
          typeIntervention: data.typeIntervention,
          cout: Number(data.cout),
          prestataire: data.prestataire,
          notes: data.notes,
          documentUrl: data.documentUrl,
        },
      });
      return {
        id: created.id,
        assetId: created.assetId,
        date: created.date.toISOString(),
        typeIntervention: created.typeIntervention,
        cout: created.cout,
        prestataire: created.prestataire || undefined,
        notes: created.notes || undefined,
        documentUrl: created.documentUrl || undefined,
        createdAt: created.createdAt.toISOString(),
      };
    }

    const log: MaintenanceLog = {
      id: `mnt-${Date.now()}`,
      assetId,
      date: data.date,
      typeIntervention: data.typeIntervention,
      cout: Number(data.cout),
      prestataire: data.prestataire,
      notes: data.notes,
      documentUrl: data.documentUrl,
      createdAt: new Date().toISOString(),
    };

    const asset = mockAssets.find((a) => a.id === assetId);
    if (asset) {
      if (!asset.maintenanceLogs) asset.maintenanceLogs = [];
      asset.maintenanceLogs.unshift(log);
    }

    return log;
  },

  async reportIncident(
    assetId: string,
    data: {
      titre: string;
      description: string;
      signalePar?: string;
      userId?: string;
    }
  ): Promise<IncidentReport> {
    if (await dbService.isPrismaActive()) {
      const created = await prisma!.incidentReport.create({
        data: {
          assetId,
          titre: data.titre,
          description: data.description,
          signalePar: data.signalePar,
          userId: data.userId || undefined,
        },
      });
      return {
        id: created.id,
        assetId: created.assetId,
        date: created.date.toISOString(),
        titre: created.titre,
        description: created.description,
        statut: created.statut as any,
        signalePar: created.signalePar || undefined,
        userId: created.userId || undefined,
        createdAt: created.createdAt.toISOString(),
      };
    }

    const report: IncidentReport = {
      id: `inc-${Date.now()}`,
      assetId,
      date: new Date().toISOString(),
      titre: data.titre,
      description: data.description,
      statut: 'OUVERT',
      signalePar: data.signalePar,
      userId: data.userId,
      createdAt: new Date().toISOString(),
    };

    const asset = mockAssets.find((a) => a.id === assetId);
    if (asset) {
      if (!asset.incidentReports) asset.incidentReports = [];
      asset.incidentReports.unshift(report);
    }

    return report;
  },

  async getVehicles(): Promise<Asset[]> {
    const assets = await dbService.getAssets();
    return assets.filter((a) => !!a.vehicle);
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const assets = await dbService.getAssets();
    const categories = await dbService.getCategories();

    let totalAcq = 0;
    let totalAct = 0;
    let enService = 0;
    let enMaint = 0;
    let horsService = 0;

    const catMap: Record<string, { count: number; valeur: number }> = {};
    const siteMap: Record<string, { count: number; valeur: number }> = {};
    const alerts: DashboardMetrics['upcomingAlerts'] = [];
    const recentIncidents: IncidentReport[] = [];

    const nowMs = Date.now();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    for (const a of assets) {
      totalAcq += a.valeurAcquisition;
      totalAct += a.valeurActuelle;

      if (a.statut === 'EN_SERVICE') enService++;
      else if (a.statut === 'EN_MAINTENANCE') enMaint++;
      else if (a.statut === 'HORS_SERVICE') horsService++;

      // Category breakdown
      const catName = a.category?.nom || 'Autre';
      if (!catMap[catName]) catMap[catName] = { count: 0, valeur: 0 };
      catMap[catName].count++;
      catMap[catName].valeur += a.valeurActuelle;

      // Site breakdown
      const siteName = a.site || 'Non assigné';
      if (!siteMap[siteName]) siteMap[siteName] = { count: 0, valeur: 0 };
      siteMap[siteName].count++;
      siteMap[siteName].valeur += a.valeurActuelle;

      // Incidents collection
      if (a.incidentReports) {
        recentIncidents.push(...a.incidentReports);
      }

      // Check upcoming alerts on vehicles
      if (a.vehicle) {
        if (a.vehicle.dateProchainControle) {
          const ctDate = new Date(a.vehicle.dateProchainControle).getTime();
          const diffMs = ctDate - nowMs;
          const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (daysLeft <= 45) {
            alerts.push({
              id: `alert-ct-${a.id}`,
              assetId: a.id,
              assetNom: a.nom,
              immatriculation: a.vehicle.immatriculation,
              type: 'CONTROLE_TECHNIQUE',
              label: 'Contrôle Technique',
              date: a.vehicle.dateProchainControle,
              daysLeft,
              urgent: daysLeft <= 30,
            });
          }
        }

        if (a.vehicle.dateEcheanceAssurance) {
          const assDate = new Date(a.vehicle.dateEcheanceAssurance).getTime();
          const diffMs = assDate - nowMs;
          const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (daysLeft <= 45) {
            alerts.push({
              id: `alert-ass-${a.id}`,
              assetId: a.id,
              assetNom: a.nom,
              immatriculation: a.vehicle.immatriculation,
              type: 'ASSURANCE',
              label: 'Échéance Assurance',
              date: a.vehicle.dateEcheanceAssurance,
              daysLeft,
              urgent: daysLeft <= 30,
            });
          }
        }
      }
    }

    alerts.sort((x, y) => x.daysLeft - y.daysLeft);
    recentIncidents.sort(
      (x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()
    );

    const categoryStats = categories.map((c) => ({
      category: c.nom,
      code: c.code,
      count: catMap[c.nom]?.count || 0,
      valeur: catMap[c.nom]?.valeur || 0,
    }));

    const siteStats = Object.keys(siteMap).map((site) => ({
      site,
      count: siteMap[site].count,
      valeur: siteMap[site].valeur,
    }));

    return {
      totalAssets: assets.length,
      totalValeurAcquisition: totalAcq,
      totalValeurActuelle: totalAct,
      assetsEnService: enService,
      assetsEnMaintenance: enMaint,
      assetsHorsService: horsService,
      urgentAlertsCount: alerts.filter((al) => al.urgent).length,
      categoryStats,
      siteStats,
      upcomingAlerts: alerts,
      recentIncidents: recentIncidents.slice(0, 5),
    };
  },
};
