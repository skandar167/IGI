# Prompt pour Meteor Pro — Plateforme "Inventaire des Immobilisations d'Entreprise" (QR Code)

## Contexte

Application web full stack permettant à une entreprise de gérer l'**inventaire de ses immobilisations** (véhicules, machines, équipements, mobilier de bureau, matériel informatique, etc.), avec un **QR code ou code-barres physique collé sur chaque bien**. En scannant le code depuis un smartphone, l'utilisateur accède **directement à la fiche complète du bien** dans le système, sans avoir à chercher manuellement.

---

## 1. Principe de fonctionnement du QR code

1. Chaque bien (ex : véhicule) possède un identifiant unique dans la base de données.
2. Un QR code (ou code-barres) est généré automatiquement, encodant une URL du type :
   `https://[domaine]/assets/{id}`
3. Ce QR code est imprimé sur une étiquette et collé/apposé sur le bien physique (ex : pare-brise du véhicule).
4. Un employé scanne le QR code avec l'appareil photo de son téléphone (aucune app spécifique requise) → le navigateur s'ouvre directement sur la fiche du bien.
5. Selon le rôle de l'utilisateur connecté, la fiche affiche plus ou moins d'informations (agent terrain vs administrateur).

---

## 2. Stack technique demandée

- **Frontend** : Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui — responsive mobile-first (les scans se font depuis un téléphone)
- **Backend** : API routes Next.js
- **Base de données** : PostgreSQL via Prisma ORM, hébergée sur **Neon** (base serverless gratuite, intégrable nativement à Vercel via l'onglet Storage)
- **Génération QR code** : librairie `qrcode` (génération d'image PNG/SVG côté serveur, imprimable)
- **Génération code-barres (option)** : `jsbarcode` si un format code-barres classique est préféré au QR
- **Authentification** : NextAuth.js (rôles : admin, gestionnaire de parc, employé/consultation)
- **Stockage fichiers** : photos des biens, factures, carnets d'entretien
- **Export** : PDF (fiche bien + étiquette QR imprimable), CSV/Excel (inventaire complet)

---

## 3. Modèle de données (Prisma schema à générer)

### User
- id, nom, email, mot de passe (hashé), rôle (admin / gestionnaire / employé), département

### Asset (bien / immobilisation — table générique)
- id (UUID, utilisé dans l'URL du QR code)
- nom, catégorie (véhicule, machine/équipement, informatique, mobilier, autre)
- numéro d'inventaire interne
- description
- date d'acquisition, valeur d'acquisition, valeur actuelle (amortissement)
- fournisseur, numéro de facture
- localisation (site, bâtiment, service)
- responsable/affecté à (FK User ou département)
- statut (en service, en maintenance, hors service, cédé)
- photos[]
- documents[] (facture, garantie)
- qr_code_url (référence de l'image générée)
- date de création, dernière mise à jour

### Vehicle (extension spécifique aux véhicules, liée à Asset)
- asset_id (FK)
- immatriculation
- marque, modèle, année
- type de carburant
- kilométrage actuel
- date dernier contrôle technique / prochaine échéance
- date assurance / échéance assurance
- conducteur habituel (FK User, optionnel)

### MaintenanceLog (historique d'entretien/maintenance)
- id, asset_id (FK), date, type d'intervention (entretien, réparation, contrôle technique), coût, prestataire, notes, document (facture)

### Category
- id, nom, icône

---

## 4. Fonctionnalités attendues

### Gestion des biens (back-office)
- CRUD complet sur les biens (véhicules, équipements, matériel, mobilier)
- Génération automatique du QR code à la création d'un bien
- Impression d'étiquettes QR (format prêt à imprimer, avec nom du bien + numéro d'inventaire)
- Upload de photos et documents (facture, carte grise, garantie)
- Historique de maintenance par bien (pour les véhicules et équipements)
- Recherche et filtres (catégorie, statut, site, responsable)

### Scan QR code (fonctionnalité clé)
- Page `/assets/[id]` optimisée mobile, accessible directement après scan
- Affichage immédiat : nom, catégorie, statut, localisation, photo principale
- Pour les véhicules : immatriculation, kilométrage, prochaine échéance (assurance/contrôle technique)
- Bouton d'accès rapide à l'historique de maintenance
- Si l'utilisateur n'est pas connecté : affichage d'une fiche simplifiée (infos publiques) + invitation à se connecter pour le détail complet
- Option : bouton "Signaler un problème" accessible directement depuis la fiche scannée (ex : un employé scanne le véhicule et signale une panne)

### Tableau de bord
- Nombre total de biens par catégorie
- Valeur totale du parc (brute et après amortissement)
- Alertes : contrôles techniques et assurances arrivant à échéance, maintenances à prévoir
- Répartition des biens par site/service (graphique)

### Rapports & export
- Export CSV/Excel de l'inventaire complet
- Génération PDF d'une fiche bien (avec QR code inclus)
- Génération PDF d'une planche d'étiquettes QR (plusieurs biens à imprimer d'un coup)

### Interface
- Back-office desktop (gestion complète)
- Vue mobile optimisée pour la fiche scannée (c'est l'écran le plus consulté sur le terrain)

---

## 5. Pages à générer

1. `/login` — connexion
2. `/dashboard` — vue d'ensemble, alertes, statistiques
3. `/assets` — liste des biens (filtrable par catégorie/site/statut)
4. `/assets/new` — création d'un bien (génère automatiquement le QR code)
5. `/assets/[id]` — fiche du bien (page cible du scan QR, mobile-first)
6. `/assets/[id]/edit` — modification
7. `/assets/[id]/maintenance` — historique d'entretien
8. `/vehicles` — vue dédiée parc automobile (échéances, kilométrage)
9. `/labels` — génération/impression des étiquettes QR
10. `/settings` — gestion des utilisateurs, catégories, sites

---

## 6. Configuration base de données et déploiement (Neon + Vercel)

Le projet doit être structuré pour permettre ce flux de mise en production, dans cet ordre :

1. **Générer le code du projet** (Next.js + Prisma) sans base de données déjà connectée. Le `schema.prisma` doit utiliser une variable d'environnement générique :
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```
2. **Déploiement initial sur Vercel** : le projet doit pouvoir être poussé sur GitHub puis importé sur Vercel (New Project → Import from GitHub) même sans base de données connectée à ce stade (le build ne doit pas planter s'il n'y a pas encore de `DATABASE_URL` — prévoir un `.env.example` clair).
3. **Connexion de la base après le premier déploiement** : une fois le projet visible sur Vercel, ajout de l'intégration Postgres (Neon) depuis l'onglet **Storage** → **Connect a Project** → sélection du projet → environnements Production/Preview/Development cochés → **Connect**. Vercel injecte automatiquement `DATABASE_URL` (ou le préfixe choisi) dans les variables d'environnement du projet.
4. **Migration du schéma** : en local, créer un fichier `.env` avec l'URL récupérée depuis Vercel (Settings → Environment Variables), puis exécuter :
   ```bash
   npx prisma migrate dev --name init
   ```
   Cette commande crée toutes les tables (Asset, Vehicle, MaintenanceLog, User, Category) dans la base Neon.
5. **Seed des données de démonstration** : prévoir un script `prisma/seed.ts` exécutable via `npx prisma db seed`, pour peupler quelques biens de test dès l'installation.
6. **Redéploiement** : chaque `git push` redéploie automatiquement sur Vercel, la base restant connectée en permanence (aucune reconfiguration nécessaire).

**Important pour Meteor Pro** : générer le projet de façon à ce qu'il fonctionne aussi bien en local (avec une base Postgres locale ou Neon directement) qu'après ce flux de connexion différée sur Vercel — ne pas coder en dur d'URL de connexion, tout doit passer par `process.env.DATABASE_URL`.

---

## 7. Livrables attendus de Meteor Pro

- Code source complet (frontend + backend + schema Prisma)
- Fichier `.env.example` avec `DATABASE_URL` en placeholder (aucune valeur en dur)
- Migrations de base de données prêtes à exécuter (`prisma migrate dev`)
- Script de seed (`prisma/seed.ts`) avec données de démonstration réalistes : quelques véhicules, un équipement, un compte admin
- Génération fonctionnelle des QR codes (avec lien direct vers la fiche du bien)
- README avec instructions d'installation en local **et** de déploiement Vercel + Neon (dans l'ordre décrit en section 6)
- Application fonctionnelle en local via `npm run dev`, testable en scannant un QR généré avec un téléphone (via IP locale ou tunnel type ngrok)

---

*Merci de générer une application complète, prête à l'emploi, avec une architecture propre, modulaire, et une page fiche-bien réellement optimisée pour un accès mobile via scan QR code.*
