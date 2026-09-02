# 📦 Meteor Pro — Plateforme "Inventaire des Immobilisations d'Entreprise" (QR Code)

Application web full-stack professionnelle permettant à une entreprise de gérer l'**inventaire de ses immobilisations** (véhicules, machines, équipements, mobilier, parc informatique), avec génération automatique et scan physique de **QR codes** directement reliés aux fiches des biens.

---

## 🌟 Points Forts & Fonctionnalités

1. **Génération & Impression d'étiquettes QR Code** :
   - Chaque bien possède un QR Code vectoriel unique encodant l'URL directe de sa fiche (`/assets/[id]`).
   - Page `/labels` : générateur de planches d'étiquettes A4 prêtes à imprimer (`@media print` optimisé pour découpe ou papier autocollant).
2. **Fiche Bien Scannée Mobile-First (`/assets/[id]`)** :
   - Conçue spécifiquement pour une consultation rapide sur smartphone sur le terrain.
   - Affichage immédiat : photo, statut opérationnel, catégorie, responsable et localisation.
   - **Extension Véhicules** : immatriculation grand format (plaque française), kilométrage, suivi des échéances de contrôle technique et d'assurance avec alertes colorées.
   - **Bouton d'action rapide "Signaler un problème"** : permet à un employé de remonter une panne ou un dysfonctionnement en 10 secondes depuis le terrain.
   - **Mode Public / Visiteur** : affichage public restreint pour les utilisateurs non authentifiés, avec invitation à se connecter pour les détails financiers.
3. **Tableau de Bord Supervision (`/dashboard`)** :
   - Nombre total de biens, valeur brute d'acquisition et valeur nette après amortissement.
   - Alertes critiques automatiques pour les contrôles techniques et assurances expirant dans moins de 30 jours.
   - Graphiques de répartition par catégorie et par site.
   - Flux des derniers incidents remontés par scan.
4. **Flotte Véhicules (`/vehicles`)** :
   - Vue dédiée au parc automobile : suivi kilométrique, types de carburant, échéances réglementaires.
5. **Carnet d'Entretien & Maintenance (`/assets/[id]/maintenance`)** :
   - Historique complet des révisions, vidanges et réparations avec calcul du coût cumulé par bien.
6. **Scanner Caméra Intégré** :
   - Accessible depuis n'importe quel écran via le bouton "Scanner QR" avec viseur caméra direct ou sélecteur de test rapide.
7. **Export & Reporting** :
   - Export CSV complet compatible Excel avec encodage UTF-8 BOM.

---

## 🛠️ Stack Technique

- **Frontend & Backend** : [Next.js 14](https://nextjs.org/) (App Router, React Server Components & Route Handlers)
- **Langage** : TypeScript
- **Styles & UI** : Tailwind CSS, Lucide React Icons
- **Base de données & ORM** : PostgreSQL via [Prisma ORM](https://www.prisma.io/), prêt pour [Neon Serverless](https://neon.tech/)
- **Génération QR Code** : `qrcode` (PNG base64 et SVG)

---

## 🚀 Démarrage Rapide en Local

### 1. Installation des dépendances

```bash
npm install
```

### 2. Générer le client Prisma

```bash
npx prisma generate
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

> **💡 Remarque :** En local, l'application intègre un mode de données simulé réaliste (véhicules avec alertes CT, chariots élévateurs, serveurs, etc.) qui fonctionne **immédiatement sans aucune configuration préalable de base de données**.

---

## ☁️ Déploiement en Production (Vercel + Neon Postgres)

Le projet respecte scrupuleusement le cycle de mise en production différé :

### Étape 1 : Déploiement initial sur Vercel (sans base de données)

1. Poussez le projet sur votre dépôt GitHub :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Meteor Pro QR Assets"
   git branch -M main
   git remote add origin https://github.com/votre-compte/votre-depot.git
   git push -u origin main
   ```
2. Rendez-vous sur votre tableau de bord [Vercel](https://vercel.com/) :
   - Cliquez sur **Add New...** → **Project**
   - Importez votre dépôt GitHub.
   - Le build s'exécute avec succès (`npm run build`) même sans base de données connectée.

### Étape 2 : Connexion de la base Neon PostgreSQL sur Vercel

1. Dans le projet déployé sur Vercel, rendez-vous dans l'onglet **Storage**.
2. Cliquez sur **Connect Database** → choisissez **Postgres (Neon Serverless)**.
3. Sélectionnez votre projet et cochez les environnements :
   - `Production`
   - `Preview`
   - `Development`
4. Cliquez sur **Connect**. Vercel injecte automatiquement la variable `DATABASE_URL` sécurisée.

### Étape 3 : Migration du schéma Prisma

1. Récupérez la valeur de `DATABASE_URL` depuis Vercel (dans **Settings** → **Environment Variables**).
2. Ajoutez cette variable dans votre fichier `.env` local :
   ```env
   DATABASE_URL="postgresql://user:password@ep-xyz.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   ```
3. Exécutez la migration pour créer les tables sur Neon :
   ```bash
   npx prisma migrate dev --name init
   ```
   *(ou `npm run prisma:push`)*

### Étape 4 : Peupler les données de démonstration (Seed)

Exécutez le script de seed préparé pour injecter les véhicules, utilisateurs et équipements initiaux :

```bash
npm run prisma:seed
```

### Étape 5 : Redéploiement continu

À chaque nouveau `git push` sur votre branche principale, Vercel redéploiera l'application en restant connecté en permanence à votre base Neon.

---

## 📱 Tester le Scan QR Code depuis un Smartphone

Pour scanner physiquement un QR code affiché sur votre écran d'ordinateur depuis un smartphone connecté au même réseau Wi-Fi :

1. Démarrez Next.js sur votre IP locale :
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
2. Dans le fichier `.env`, configurez votre adresse IP locale :
   ```env
   NEXT_PUBLIC_APP_URL="http://192.168.1.X:3000"
   ```
3. Imprimez ou affichez les étiquettes depuis `/labels`.
4. Ouvrez l'appareil photo de votre smartphone et visez le QR Code : la fiche s'ouvre instantanément !
