# 🏢 Crèche SaaS - Vue d'ensemble du Projet

## 📋 Table des Matières
1. [Architecture Générale](#architecture-générale)
2. [Stack Technologique](#stack-technologique)
3. [Modules Implémentés](#modules-implémentés)
4. [Flux de Données](#flux-de-données)
5. [Authentification & RBAC](#authentification--rbac)
6. [Base de Données](#base-de-données)

---

## 🏗️ Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Vue)                      │
│                   (À développer)                             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  NestJS API Backend                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Controllers (Routes)                                 │   │
│  │ - Public (Inscriptions)                              │   │
│  │ - Admin (Gestion)                                    │   │
│  │ - Parent (Tableau de bord)                           │   │
│  │ - Teacher (Gestion classe)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Services (Business Logic)                            │   │
│  │ - Inscriptions                                       │   │
│  │ - Parent Dashboard                                   │   │
│  │ - Events Management                                  │   │
│  │ - Presences                                          │   │
│  │ - Daily Summaries                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Guards & Middleware                                  │   │
│  │ - JWT Authentication                                 │   │
│  │ - RBAC (Role-Based Access Control)                   │   │
│  │ - Rate Limiting                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                            │
│  - Utilisateurs, Tuteurs, Familles                          │
│  - Enfants, Classes, Présences                              │
│  - Événements, Menus, Résumés                               │
│  - Inscriptions, Factures                                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Services Externes                              │
│  - Supabase Auth (Authentification)                         │
│  - Gmail SMTP (Emails)                                      │
│  - AWS S3 (Photos/Documents)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Technologique

### Backend
- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + Supabase Auth
- **Email**: Nodemailer (Gmail SMTP)
- **Validation**: class-validator, class-transformer
- **API Docs**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler

### Frontend (À développer)
- React ou Vue.js
- TypeScript
- Axios/Fetch pour API calls
- Tailwind CSS ou Material UI

### DevOps
- Docker (containerization)
- GitHub (version control)
- PostgreSQL (database)

---

## 📦 Modules Implémentés

### 1. **Inscriptions (Public + Admin)**
**Endpoints**:
- `POST /api/public/inscriptions` - Soumettre candidature
- `GET /api/admin/inscriptions` - Lister inscriptions
- `POST /api/admin/inscriptions/:id/accept` - Accepter + provisionner
- `PATCH /api/admin/inscriptions/:id/status` - Changer statut
- `PATCH /api/admin/inscriptions/:id/reject` - Rejeter

**Flux**:
```
Candidature → EN_COURS → ACTIF (crée Famille, Tuteur, Enfant, Utilisateur)
                      ↘ REJETEE
```

**Email Provisioning**:
- Génère mot de passe temporaire (12 caractères)
- Crée compte Supabase Auth
- Crée Utilisateur local (PARENT)
- Envoie email avec credentials

### 2. **Parent Dashboard**
**Endpoints**:
- `GET /api/parent/me` - Profil + enfants
- `PATCH /api/parent/me` - Modifier profil
- `POST /api/parent/me/change-password` - Changer mot de passe
- `GET /api/parent/enfants/:enfantId/presences` - Présences enfant
- `GET /api/parent/classes/:classeId/journal/latest` - Dernier résumé classe
- `GET /api/parent/events` - Événements visibles

**RBAC**: Parent voit uniquement ses enfants/sa famille

### 3. **Admin Events**
**Endpoints**:
- `POST /api/admin/events` - Créer événement
- `GET /api/admin/events` - Lister événements
- `PATCH /api/admin/events/:id` - Modifier
- `DELETE /api/admin/events/:id` - Supprimer

**Visibilité**: Parents voient événements de leurs classes

### 4. **Presences (Attendance)**
**Endpoints**:
- `POST /api/teacher/presences` - Enregistrer présence
- `GET /api/teacher/presences` - Lister présences
- `PATCH /api/teacher/presences/:id` - Modifier

**Statuts**: Present, Absent, Justifie

### 5. **Daily Summaries**
**Endpoints**:
- `POST /api/teacher/daily-summaries` - Créer résumé
- `GET /api/teacher/daily-summaries` - Lister
- `PATCH /api/teacher/daily-summaries/:id` - Modifier
- `POST /api/teacher/daily-summaries/:id/publish` - Publier

**Statuts**: Brouillon, Publié

### 6. **Menu du Jour**
**Endpoints**:
- `POST /api/teacher/menus` - Créer menu
- `GET /api/teacher/menus` - Lister menus
- `PATCH /api/teacher/menus/:id` - Modifier
- `POST /api/teacher/menus/:id/publish` - Publier

---

## 🔄 Flux de Données

### Flux d'Inscription
```
1. Parent soumet candidature
   ↓
2. Données stockées en JSON dans Inscription.payload
   ↓
3. Admin examine et accepte
   ↓
4. Système crée:
   - Famille (upsert par emailPrincipal)
   - Tuteur(s) (un par tuteur avec email)
   - Enfant (lié à famille)
   - Utilisateur(s) PARENT (un par tuteur)
   ↓
5. Email d'invitation envoyé avec:
   - Email de connexion
   - Mot de passe temporaire
   - Lien de connexion
   ↓
6. Parent se connecte et change mot de passe
```

### Flux Parent Dashboard
```
1. Parent se connecte (JWT)
   ↓
2. GET /parent/me récupère:
   - Profil tuteur
   - Liste enfants
   - Classe de chaque enfant
   ↓
3. Parent peut voir:
   - Présences de ses enfants
   - Résumés de classe (publiés)
   - Événements de ses classes
   - Menu du jour
```

---

## 🔐 Authentification & RBAC

### Rôles
```
PARENT      → Accès tableau de bord, voir ses enfants
ENSEIGNANT  → Gestion classe, présences, résumés
ADMIN       → Gestion complète (inscriptions, événements, utilisateurs)
```

### JWT Structure
```json
{
  "userId": "user_123",
  "email": "parent@example.com",
  "role": "PARENT",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Guards
- `JwtAuthGuard` - Valide JWT
- `RolesGuard` - Vérifie rôle utilisateur
- `ThrottlerGuard` - Rate limiting

---

## 💾 Base de Données

### Modèles Principaux

**Utilisateur**
```
- id (UUID)
- email (unique)
- prenom, nom
- role (PARENT, ENSEIGNANT, ADMIN)
- statut (INVITED, ACTIVE, DISABLED)
- authUserId (Supabase)
- tuteurId (si PARENT)
- tempPassword (première connexion)
```

**Tuteur**
```
- id (UUID)
- familleId
- lien (Mere, Pere, Proche, Tuteur, Autre)
- prenom, nom, email, telephone
- adresse
- principal (boolean)
```

**Enfant**
```
- id (UUID)
- familleId
- classeId
- prenom, nom, dateNaissance
- genre, photoUrl
```

**Inscription**
```
- id (UUID)
- statut (CANDIDATURE, EN_COURS, ACTIF, REJETEE)
- payload (JSON - données complètes)
- familleId, enfantId (après acceptation)
- notes
```

**Event**
```
- id (UUID)
- titre, description
- startAt, endAt
- classeId
- audience (CLASS, PARENTS_ALL)
- status (PUBLISHED, DRAFT)
```

---

## 📧 Système d'Email

### Configuration
- **Provider**: Gmail SMTP
- **Service**: Nodemailer
- **Templates**: HTML personnalisés

### Types d'Emails
1. **Invitation Utilisateur** - Credentials + lien connexion
2. **Notification Événement** - Annonce événement
3. **Résumé Journée** - Résumé publié
4. **Confirmation Inscription** - Après acceptation

---

## 🚀 Déploiement

### Environnements
- **DEV**: JWT local, emails en console
- **PROD**: Supabase JWT, emails réels

### Variables d'Environnement
```
DATABASE_URL=postgresql://...
JWT_SECRET=dev_secret
SUPABASE_URL=https://...
SUPABASE_KEY=...
GMAIL_USER=...
GMAIL_PASSWORD=...
NODE_ENV=development
```

---

## 📊 Statuts & Enums

### StatutInscription
- CANDIDATURE → EN_COURS → ACTIF
- CANDIDATURE → REJETEE
- EN_COURS → REJETEE

### StatutUtilisateur
- INVITED → ACTIVE → DISABLED

### StatutPresence
- Present, Absent, Justifie

### StatutMenu
- Brouillon, Publié

---

## 🔗 Ressources

- **GitHub**: github.com:wlw-tech/creche-saas.git
- **API Docs**: http://localhost:3000/api/docs
- **Postman Collections**: Voir fichiers `.postman_collection.json`

