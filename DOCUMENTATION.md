# PetitsPas — Documentation Technique & Fonctionnelle

> Application SaaS de gestion de crèche — version multi-rôles (Admin / Enseignant / Parent)

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Stack technologique](#stack-technologique)
4. [Sécurité](#sécurité)
5. [Fonctionnalités par rôle](#fonctionnalités-par-rôle)
   - [5.1 Espace Admin](#51-espace-admin)
   - [5.2 Espace Enseignant](#52-espace-enseignant)
   - [5.3 Espace Parent](#53-espace-parent)
   - [5.4 Formulaire d'inscription public](#54-formulaire-dinscription-public)
6. [Modèle de données (Prisma)](#modèle-de-données-prisma)
7. [API REST — Endpoints principaux](#api-rest--endpoints-principaux)
8. [Internationalisation (i18n)](#internationalisation-i18n)
9. [Déploiement](#déploiement)
10. [Variables d'environnement](#variables-denvironnement)
11. [Développement local](#développement-local)

---

## Vue d'ensemble

**PetitsPas** est une plateforme web SaaS destinée à la gestion d'une crèche ou garderie. Elle permet de gérer :

- Les **inscriptions** des enfants (formulaire public multi-étapes)
- Le **suivi quotidien** (présences, résumé de journée, journal de classe)
- Les **menus** hebdomadaires publiés par l'administration
- Les **événements** de la crèche
- Les **profils de santé** des enfants (allergies, intolérances, restrictions alimentaires)
- La **communication** entre l'administration et les parents

L'application est **bilingue** (français / arabe) avec support RTL complet.

---

## Architecture technique

```
┌─────────────────────────────────────────────────────────┐
│                       FRONTEND                          │
│   Next.js 16 (App Router) — Vercel / hébergement       │
│   Port local : 3001                                     │
│                                                         │
│  ┌──────────┐  ┌────────────┐  ┌───────────────────┐   │
│  │  Admin   │  │ Enseignant │  │     Parent        │   │
│  │ /admin/* │  │ /teacher/* │  │   /parent (SPA)   │   │
│  └──────────┘  └────────────┘  └───────────────────┘   │
│                                                         │
│  Inscription publique : /[locale]/inscriptions          │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS / REST (axios)
                      │ JWT Bearer token
┌─────────────────────▼───────────────────────────────────┐
│                       BACKEND                           │
│   NestJS 11 — Render.com                               │
│   Port local : 3000   Préfixe : /api                   │
│                                                         │
│  Modules : Auth · Users · Inscriptions · Classes       │
│            Enfants · Menus · Events · Présences        │
│            Résumés · Règlement · Parent · Teacher      │
└─────────────────────┬───────────────────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼───────────────────────────────────┐
│   PostgreSQL — Render.com (managed database)            │
└─────────────────────────────────────────────────────────┘
```

---

## Stack technologique

### Backend (`creche-api/`)

| Technologie | Version | Rôle |
|-------------|---------|------|
| **NestJS** | 11 | Framework Node.js — modules, guards, pipes |
| **Prisma ORM** | 6.17 | Accès base de données, migrations |
| **PostgreSQL** | managed | Base de données relationnelle |
| **JWT** (`@nestjs/jwt`) | — | Authentification stateless |
| **bcrypt** | — | Hachage des mots de passe |
| **class-validator** | — | Validation des DTOs (whitelist + forbidNonWhitelisted) |
| **@nestjs/swagger** | 11 | Documentation API auto-générée (`/api/docs`) |
| **@nestjs/throttler** | 6 | Rate limiting anti-abus |
| **Nodemailer** | — | Envoi d'emails (confirmation inscription, accès parent) |
| **TypeScript** | 5 | Typage statique |

### Frontend (`creche-frontend/`)

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 16 | Framework React (App Router, SSR/CSR) |
| **React** | 19 | UI library |
| **Tailwind CSS** | 4 | Utility-first CSS |
| **shadcn/ui** | — | Composants UI (Radix UI primitives) |
| **next-intl** | 4 | Internationalisation (fr / ar) |
| **axios** | 1.13 | Client HTTP vers le backend |
| **lucide-react** | 0.554 | Icônes |
| **react-hook-form** | 7 | Formulaires |
| **zod** | 4 | Validation des schémas côté client |
| **zustand** | 5 | State management global |
| **recharts** | 3 | Graphiques (présences) |
| **TypeScript** | 5 | Typage statique |

---

## Sécurité

### Authentification

- **JWT Bearer tokens** : chaque requête API inclut un header `Authorization: Bearer <token>`.
- Tokens signés avec une `JWT_SECRET` définie en variable d'environnement (jamais exposée).
- Durée de vie configurable (par défaut 7 jours).

### Autorisation (Rôles)

Trois rôles distincts dans le système :

| Rôle | Accès |
|------|-------|
| `ADMIN` | Tout — gestion des inscriptions, classes, menus, utilisateurs, présences |
| `ENSEIGNANT` | Classe assignée — journal, résumés, présences |
| `PARENT` | Ses enfants uniquement — profil, présences, menus publiés, événements |

- Chaque route est protégée par `JwtAuthGuard` (vérification du token).
- Les routes sensibles ajoutent `RolesGuard` avec `@Roles('ADMIN')` ou `@Roles('ENSEIGNANT')`.
- Les parents ne peuvent accéder qu'aux données de **leurs propres enfants** (vérification `famille.tuteurs → utilisateur.id`).

### Validation des données

- `ValidationPipe` global avec `whitelist: true` et `forbidNonWhitelisted: true` : toute propriété non déclarée dans un DTO est **rejetée** (protection contre l'injection de champs).
- `transform: true` : conversion automatique des types primitifs.
- Validation côté client avec `zod` (formulaires).

### Protection contre les abus

- **Rate limiting** via `@nestjs/throttler` : limite le nombre de requêtes par IP.
- Validation de la taille et du type des fichiers uploadés (photos : max 5 Mo, JPEG/PNG/WEBP).

### Données sensibles

- Mots de passe **hachés avec bcrypt** (jamais stockés en clair).
- Photos d'enfants stockées en base64 dans le payload JSON (acceptable pour de petites images).
- Endpoint règlement intérieur en lecture seule, sans authentification (`/api/public/reglement-interieur`).
- Variables d'environnement séparées pour dev/prod — jamais committées.

### CORS

- Backend configuré avec CORS strict : seul le domaine frontend autorisé en production.

---

## Fonctionnalités par rôle

### 5.1 Espace Admin

Accessible via `/[locale]/admin/*`

#### Tableau de bord

- Vue statistique globale (nb enfants, inscriptions en attente, présences du jour)

#### Gestion des inscriptions (`/admin/inscriptions`)

- Liste paginée et filtrée des candidatures
- Statuts : `CANDIDATURE` → `EN_COURS` → `ACTIF` ou `REJETEE`
- **Accepter une inscription** : crée automatiquement Famille, Tuteur(s), Enfant, ProfilSante, Delegations
- Voir le dossier complet (données du formulaire sauvegardées en JSON `payload`)
- Rejeter avec motif

#### Gestion des enfants (`/admin/enfants`)

- Liste avec recherche et filtres par classe
- Fiche détaillée enfant :
  - Informations générales (prénom, nom, genre, classe, photo)
  - **Fiche santé** : allergies, intolérances, tags, restrictions alimentaires, taille/poids
  - **Historique des présences** avec statistiques (paginated)
  - **Personnes autorisées** (délégations) — ajout / suppression
  - Parents / tuteurs
  - Dossier d'inscription
- Modifier la fiche enfant inline (modal responsive)

#### Gestion des classes (`/admin/classes`)

- Créer / modifier / supprimer des classes
- Niveaux : TPS / PS / MS / GS
- Assigner des enseignants à une classe (multi-sélection)

#### Gestion des menus (`/admin/menus`)

- Vue semaine (tableau desktop / cartes mobile)
- Créer les menus par jour (Collation matin, Repas déjeuner, Goûter)
- Remplir toute la semaine en un clic
- **Publier un menu** (statut `Publie` = visible aux parents)
- **Publier la semaine** : publie tous les brouillons en un clic
- À l'enregistrement : case "Publier immédiatement" cochée par défaut
- Supprimer la semaine

#### Gestion des événements (`/admin/events`)

- Créer des événements avec titre, date, heure, description
- Visibilité par classe ou globale

#### Gestion des utilisateurs (`/admin/utilisateurs`)

- Liste de tous les comptes (Admin / Enseignant / Parent)
- Fiche détaillée par utilisateur
- Modifier le profil enseignant (fonction, spécialité, téléphone)

#### Règlement intérieur (`/admin/reglement-interieur`)

- Éditeur markdown avec prévisualisation
- Versioning (numéro de version + date de modification)

#### Journal de classe (`/admin/journal`)

- Voir et créer les journaux pédagogiques de chaque classe

---

### 5.2 Espace Enseignant

Accessible via `/[locale]/teacher`

#### Tableau de bord principal

- Vue de la classe assignée
- Liste des enfants avec photos
- **Saisie des présences** du jour (Présent / Absent par enfant)
- Soumission groupée avec résumé
- Voir les présences déjà enregistrées

#### Résumé de journée (`/teacher/summary`)

- Saisir un résumé quotidien par enfant :
  - Humeur, Sieste, Appétit, Participation
  - Observations textuelles
- Journal de classe : activités, apprentissages, observations globales

#### Fiche enfant enseignant (`/teacher/attendance/[id]`)

- Fiche simplifiée avec infos santé et délégations

---

### 5.3 Espace Parent

Accessible via `/[locale]/parent` — **SPA mobile-first** avec navigation par onglets

#### Onglet Accueil

- Bonjour personnalisé avec prénom parent
- Photo de l'enfant et classe
- **Résumé du jour** : humeur, sieste, appétit, participation + observations
  - Navigation par date (↑↓ jours)
  - État vide clair : "Résumé de journée pas encore disponible"
- Message de la classe (journal pédagogique)
- Aperçu des 2 prochains événements

#### Onglet Présence

- Statut du jour (Présent ✅ / Absent ❌ / Inconnu ❓)
- Résumé de journée avec navigation par date
- **Historique des présences** paginé avec filtre par mois
- Statistiques : nb présent / absent / total

#### Onglet Enfant

- Photo, nom, classe, date de naissance, enseignants
- **Personnes autorisées** : voir, ajouter, modifier, supprimer
- **Profil santé** : allergies, intolérances, tags, restriction alimentaire
  - Créer / modifier / supprimer le profil santé
  - Gestion des allergies et intolérances inline

#### Onglet Menu

- **Menu du jour** avec collation matin, repas, goûter
- **Menus de la semaine** (lundi → dimanche de la semaine en cours)
  - Mise en avant du jour actuel
  - Texte complet sans troncature (responsive)
  - État vide si aucun menu publié

#### Onglet Événements

- Liste de tous les événements à venir
- Date, heure, description

#### Profil / Paramètres

- Modifier téléphone et adresse
- Changer le mot de passe

---

### 5.4 Formulaire d'inscription public

Accessible via `/[locale]/inscriptions` — **5 étapes**

| Étape | Contenu |
|-------|---------|
| **1 — Enfant** | Prénom, nom, date de naissance, genre, photo, classe souhaitée |
| **2 — Parents** | Mère et/ou père : prénom, nom, email, téléphone, CIN, adresse. Désignation du responsable principal. Déclaration sur l'honneur |
| **3 — Personnes autorisées** | Sans restriction ou liste de personnes (nom, lien, téléphone, CIN) |
| **4 — Santé** | Tags maladies / allergies / intolérances / suivi. Restriction alimentaire. Taille/poids. Antécédents. Médicaments |
| **5 — Règlement** | Affichage du règlement intérieur (chargé depuis l'API). Double confirmation obligatoire |

- Soumission → email de confirmation au parent
- Données sauvegardées en JSON dans `Inscription.payload` (approche audit log)

---

## Modèle de données (Prisma)

```
Utilisateur ──┬── Tuteur ── Famille ──┬── Enfant ──┬── Classe ──── Enseignant
              │                        │            ├── ProfilSante ──┬── Allergie
              └── Enseignant           │            │                 ├── Intolerance
                                       │            │                 └── AutorisationMedicament
                                       │            ├── Delegation
                                       │            ├── Presence
                                       │            ├── DailyResume
                                       │            └── Inscription ── payload (JSON)
                                       │
                                       Menu (global, statut: Brouillon|Publie)
                                       Event (global ou par classe)
                                       JournalClasse (par classe, par jour)
                                       ReglementInterieur (singleton)
```

**Entités clés :**

| Modèle | Description |
|--------|-------------|
| `Utilisateur` | Compte de connexion (email + mdp hashé + rôle) |
| `Famille` | Groupe familial avec email principal |
| `Tuteur` | Parent/tuteur d'une famille |
| `Enfant` | Enfant inscrit à la crèche |
| `Classe` | Groupe d'enfants (TPS/PS/MS/GS) avec enseignants |
| `Enseignant` | Profil professionnel lié à un Utilisateur |
| `ProfilSante` | Fiche médicale de l'enfant |
| `Inscription` | Candidature d'inscription (payload JSON complet) |
| `Presence` | Enregistrement de présence par jour par enfant |
| `DailyResume` | Résumé de journée par enseignant par enfant |
| `Menu` | Menu journalier (collationMatin / repas / gouter) |
| `Delegation` | Personne autorisée à récupérer un enfant |

---

## API REST — Endpoints principaux

Base URL : `https://creche-backend-2.onrender.com/api`
Documentation Swagger : `/api/docs`

### Authentification

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| `POST` | `/auth/login` | Public | Connexion (retourne JWT) |
| `POST` | `/auth/change-password` | Auth | Changer son mot de passe |

### Inscriptions

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| `POST` | `/public/inscriptions` | Public | Soumettre une candidature |
| `GET` | `/admin/inscriptions` | Admin | Lister les inscriptions |
| `POST` | `/admin/inscriptions/:id/accept` | Admin | Accepter → créer les entités |
| `POST` | `/admin/inscriptions/:id/reject` | Admin | Rejeter avec motif |

### Menus

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| `GET` | `/menus` | Auth | Liste (parents : publiés seulement) |
| `POST` | `/menus` | Admin | Créer un menu (brouillon) |
| `PATCH` | `/menus/:id` | Admin | Modifier un menu |
| `POST` | `/menus/:id/publish` | Admin | Publier |
| `POST` | `/menus/:id/unpublish` | Admin | Dépublier |
| `DELETE` | `/menus/:id` | Admin | Supprimer (brouillon uniquement) |

### Présences

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| `GET` | `/classes/:id/presences` | Auth | Présences d'une classe (filtrable) |
| `POST` | `/classes/:id/presences/batch` | Enseignant | Enregistrement groupé |
| `GET` | `/parent/enfants/:id/presences` | Parent | Présences de son enfant |

### Résumés de journée

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| `GET` | `/enfants/:id/resume` | Auth | Résumé pour une date |
| `POST` | `/enfants/:id/resume` | Enseignant | Créer/mettre à jour |
| `GET` | `/parent/enfants/:id/resume` | Parent | Résumé pour son enfant |

### Santé enfant (parent)

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| `GET` | `/parent/enfants/:id/sante` | Parent | Profil santé |
| `PUT` | `/parent/enfants/:id/sante` | Parent | Créer/mettre à jour |
| `DELETE` | `/parent/enfants/:id/sante` | Parent | Supprimer |

### Délégations (parent)

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| `GET` | `/parent/enfants/:id/delegations` | Parent | Liste |
| `POST` | `/parent/enfants/:id/delegations` | Parent | Ajouter |
| `PATCH` | `/parent/enfants/:id/delegations/:dId` | Parent | Modifier |
| `DELETE` | `/parent/enfants/:id/delegations/:dId` | Parent | Supprimer |

---

## Internationalisation (i18n)

- Géré par **next-intl** avec routing basé sur les locales dans l'URL : `/fr/...` et `/ar/...`
- Fichiers de traductions :
  - `creche-frontend/src/messages/fr.json` (français)
  - `creche-frontend/src/messages/ar.json` (arabe)
- Support **RTL** complet pour l'arabe (attribut `dir="rtl"` sur `<html>`)
- Composants UI adaptés (marges, padding, alignements inversés)

---

## Déploiement

### Backend — Render.com

- Service **Web** sur Render.com connecté au repository GitHub `wlw-tech/creche-backend`
- Auto-deploy sur push vers `main`
- Base de données PostgreSQL managée Render (même région)
- URL : `https://creche-backend-2.onrender.com`

> ⚠️ Le **tier gratuit** Render met le service en veille après inactivité. Premier appel après veille peut prendre 30–60 secondes.

### Frontend — Vercel (ou similaire)

- Repository GitHub `wlw-tech/creche-frontend`
- Build command : `npm run build`
- Output directory : `.next`

### Migrations base de données

```bash
# Depuis creche-api/
npx prisma migrate deploy   # En production
npx prisma migrate dev      # En développement
npx prisma generate         # Régénérer le client Prisma
```

> ⚠️ Sur Windows, arrêter le serveur NestJS avant `prisma generate` (DLL verrouillée).

---

## Variables d'environnement

### Backend (`creche-api/.env`)

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
JWT_SECRET="votre_secret_jwt_très_long_et_aléatoire"
JWT_EXPIRATION="7d"

# Email (Nodemailer)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="no-reply@petitspas.ma"
SMTP_PASS="mot_de_passe_smtp"
EMAIL_FROM="PetitsPas <no-reply@petitspas.ma>"

# URL frontend (pour les liens dans les emails)
FRONTEND_URL="https://votre-frontend.vercel.app"

# Environnement
NODE_ENV="production"
PORT=3000
```

### Frontend (`creche-frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="https://creche-backend-2.onrender.com/api"
```

---

## Développement local

### Prérequis

- Node.js 20+
- pnpm (gestionnaire de paquets)
- PostgreSQL local ou accès Render

### Backend

```bash
cd creche-api
pnpm install
cp .env.example .env   # Configurer DATABASE_URL et JWT_SECRET
npx prisma migrate dev
npx prisma generate
pnpm start:dev         # Lance sur http://localhost:3000
```

### Frontend

```bash
cd creche-frontend
pnpm install
cp .env.local.example .env.local   # Configurer NEXT_PUBLIC_API_URL
pnpm dev                           # Lance sur http://localhost:3001
```

### Comptes de test

Après les migrations, créer un compte admin via l'API ou un seed :

```bash
# Exemple de seed (à adapter selon votre setup)
cd creche-api
npx ts-node prisma/seed.ts
```

---

## Notes importantes pour les développeurs

### Workflow inscriptions

```
Formulaire public → POST /public/inscriptions
  → Inscription{statut: CANDIDATURE, payload: {...}}
  → Email de confirmation envoyé au parent

Admin accepte → POST /admin/inscriptions/:id/accept
  → Crée Famille (upsert par email)
  → Crée Tuteur(s) avec cin, adresse
  → Crée Enfant avec classeId, photo
  → Crée ProfilSante avec allergies, intolérances, tags
  → Crée Delegation(s) (personnes autorisées)
  → Crée compte Utilisateur PARENT + envoie email avec mot de passe temporaire
  → Inscription{statut: ACTIF}
```

### Gestion des menus

- Les menus sont **globaux** (pas liés à une classe spécifique).
- Statut `Brouillon` → invisible aux parents.
- Statut `Publie` → visible à tous les parents.
- Depuis l'admin, la case **"Publier immédiatement"** est cochée par défaut à l'enregistrement.

### Résumés de journée

- Un résumé par enfant par date.
- Créé/mis à jour par l'enseignant de la classe.
- Accessible en lecture au parent pour ses propres enfants.

---

*Documentation générée le 10 mars 2026 — Version application : Sprint 4*
