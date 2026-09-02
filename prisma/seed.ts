import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données Neon / Postgres...');

  // 1. Catégories
  const categories = [
    { id: 'cat-vehicules', nom: 'Véhicules & Flotte', code: 'VEHICULE', icone: 'Car' },
    { id: 'cat-machines', nom: 'Machines & Équipements', code: 'MACHINE', icone: 'Cpu' },
    { id: 'cat-informatique', nom: 'Matériel Informatique', code: 'INFORMATIQUE', icone: 'Laptop' },
    { id: 'cat-mobilier', nom: 'Mobilier de Bureau', code: 'MOBILIER', icone: 'Armchair' },
    { id: 'cat-autre', nom: 'Autres Immobilisations', code: 'AUTRE', icone: 'Box' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Catégories seedées');

  // 2. Utilisateurs avec mots de passe hashés
  const adminHash = await bcrypt.hash('Admin2024!', 12);
  const gestHash = await bcrypt.hash('Gest2024!', 12);
  const empHash = await bcrypt.hash('Emp2024!', 12);

  const users = [
    {
      id: 'user-admin-1',
      nom: 'Alexandre Dupont',
      email: 'admin@meteor-pro.dz',
      passwordHash: adminHash,
      role: 'ADMIN' as const,
      departement: 'Direction des Opérations',
      estApprouve: true,
    },
    {
      id: 'user-gest-1',
      nom: 'Sophie Martin',
      email: 'gestionnaire@meteor-pro.dz',
      passwordHash: gestHash,
      role: 'GESTIONNAIRE' as const,
      departement: 'Services Généraux & Flotte',
      estApprouve: true,
    },
    {
      id: 'user-emp-1',
      nom: 'Thomas Leroy',
      email: 'employe@meteor-pro.dz',
      passwordHash: empHash,
      role: 'EMPLOYE' as const,
      departement: 'Maintenance & Logistique',
      estApprouve: true,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: u.passwordHash, nom: u.nom, role: u.role, departement: u.departement, estApprouve: u.estApprouve },
      create: u,
    });
  }
  console.log('✅ Utilisateurs seedés avec mots de passe bcrypt');

  // 3. Biens et Véhicules
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const now = new Date();
  const addDays = (days: number) => new Date(now.getTime() + days * 86400000);
  const subMonths = (months: number) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - months);
    return d;
  };

  // Bien 1 : Renault Master
  const qr1 = await QRCode.toDataURL(`${baseUrl}/assets/ast-v-001`);
  await prisma.asset.upsert({
    where: { id: 'ast-v-001' },
    update: {},
    create: {
      id: 'ast-v-001',
      nom: 'Renault Master III dCi 150 Grand Volume',
      numeroInventaire: 'IMM-2023-V01',
      description: 'Fourgon atelier avec outillage complet pour équipe d’intervention technique.',
      dateAcquisition: new Date('2023-03-15'),
      valeurAcquisition: 5850000,
      valeurActuelle: 4100000,
      fournisseur: 'Renault Pro+ Algérie',
      numeroFacture: 'FAC-REN-2023-9082',
      site: 'Site Usine Nord',
      batiment: 'Atelier Central',
      service: 'Maintenance Industrielle',
      statut: 'EN_SERVICE',
      photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
      documents: ['Certificat_Immatriculation.pdf'],
      qrCodeUrl: qr1,
      categoryId: 'cat-vehicules',
      responsableId: 'user-gest-1',
      vehicle: {
        create: {
          immatriculation: '16-12345-123',
          marque: 'Renault',
          modele: 'Master III 2.3 dCi',
          annee: 2023,
          typeCarburant: 'Diesel',
          kilometrage: 64250,
          dateDernierControle: subMonths(18),
          dateProchainControle: addDays(14), // URGENCE < 30j
          dateAssurance: subMonths(11),
          dateEcheanceAssurance: addDays(22), // URGENCE < 30j
          conducteurHabituelId: 'user-emp-1',
        },
      },
      maintenanceLogs: {
        create: [
          {
            date: subMonths(2),
            typeIntervention: 'Révision 60 000 km + Changement plaquettes',
            cout: 65000,
            prestataire: 'Garage Central',
            notes: 'Vidange, filtres huile/air/gasoil, plaquettes avant changées.',
          },
        ],
      },
    },
  });

  // Bien 2 : Peugeot e-208
  const qr2 = await QRCode.toDataURL(`${baseUrl}/assets/ast-v-002`);
  await prisma.asset.upsert({
    where: { id: 'ast-v-002' },
    update: {},
    create: {
      id: 'ast-v-002',
      nom: 'Peugeot 208 Électrique e-208 GT',
      numeroInventaire: 'IMM-2023-V02',
      description: 'Véhicule de liaison urbain zéro-émission affecté aux déplacements des coordinateurs de site.',
      dateAcquisition: new Date('2023-06-20'),
      valeurAcquisition: 4600000,
      valeurActuelle: 3680000,
      fournisseur: 'Peugeot Métropole',
      numeroFacture: 'PEUG-2023-047',
      site: 'Siège Social',
      batiment: 'Bâtiment Tertiaire A',
      service: 'Direction Générale',
      statut: 'EN_SERVICE',
      photos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'],
      documents: ['Carte_Grise_e208.pdf'],
      qrCodeUrl: qr2,
      categoryId: 'cat-vehicules',
      responsableId: 'user-admin-1',
      vehicle: {
        create: {
          immatriculation: '16-98765-123',
          marque: 'Peugeot',
          modele: 'e-208 GT 136ch',
          annee: 2023,
          typeCarburant: 'Électrique',
          kilometrage: 28400,
          dateDernierControle: subMonths(12),
          dateProchainControle: addDays(120),
          dateAssurance: subMonths(8),
          dateEcheanceAssurance: addDays(115),
          conducteurHabituelId: 'user-gest-1',
        },
      },
    },
  });

  // Bien 3 : Chariot élévateur Fenwick
  const qr3 = await QRCode.toDataURL(`${baseUrl}/assets/ast-m-001`);
  await prisma.asset.upsert({
    where: { id: 'ast-m-001' },
    update: {},
    create: {
      id: 'ast-m-001',
      nom: 'Chariot Élévateur Électrique Fenwick E16C',
      numeroInventaire: 'IMM-2022-M03',
      description: 'Chariot frontal électrique 3 roues, capacité 1.6T, mât triplex 4650 mm.',
      dateAcquisition: new Date('2022-09-10'),
      valeurAcquisition: 3800000,
      valeurActuelle: 2280000,
      fournisseur: 'Fenwick-Linde',
      numeroFacture: 'FEN-2022-991',
      site: 'Entrepôt Logistique',
      batiment: 'Quai Réception Hangar 2',
      service: 'Stockage & Expéditions',
      statut: 'EN_MAINTENANCE',
      photos: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'],
      documents: ['Manuel_Utilisateur_Fenwick.pdf'],
      qrCodeUrl: qr3,
      categoryId: 'cat-machines',
      responsableId: 'user-emp-1',
      incidentReports: {
        create: [
          {
            titre: 'Fuite hydraulique constatée au démarrage',
            description: 'Taches d’huile au sol sous le mât au poste de charge.',
            statut: 'EN_COURS',
            signalePar: 'Thomas Leroy',
          },
        ],
      },
    },
  });

  // Bien 4 : Serveur Dell
  const qr4 = await QRCode.toDataURL(`${baseUrl}/assets/ast-i-001`);
  await prisma.asset.upsert({
    where: { id: 'ast-i-001' },
    update: {},
    create: {
      id: 'ast-i-001',
      nom: 'Serveur Rack Dell PowerEdge R750xs 2U',
      numeroInventaire: 'IMM-2023-I12',
      description: 'Serveur d’infrastructure hébergeant la virtualisation locale et sauvegardes.',
      dateAcquisition: new Date('2023-01-18'),
      valeurAcquisition: 1950000,
      valeurActuelle: 1365000,
      fournisseur: 'Dell Technologies',
      numeroFacture: 'DELL-INV-88219',
      site: 'Siège Social',
      batiment: 'Salle Serveurs Sécurisée',
      service: 'DSI / Systèmes & Réseaux',
      statut: 'EN_SERVICE',
      photos: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'],
      documents: ['Garantie_ProSupport_Dell_5Ans.pdf'],
      qrCodeUrl: qr4,
      categoryId: 'cat-informatique',
      responsableId: 'user-admin-1',
    },
  });

  console.log('✅ Biens d’entreprise et QR codes seedés avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
