# 🛠️ Technology Stack - Crèche SaaS

## 📚 Vue d'ensemble

Ce document décrit les technologies utilisées pour implémenter l'API Crèche SaaS, en particulier pour les fonctionnalités d'**Email Provisioning** et **Inscriptions**.

---

## 🏗️ Backend - NestJS

### Framework Principal
- **NestJS** (v9+) - Framework TypeScript pour Node.js
- **TypeScript** - Langage de programmation typé
- **Express** - Serveur HTTP sous-jacent

### Avantages NestJS
```
✅ Architecture modulaire et scalable
✅ Décorateurs pour configuration simple
✅ Injection de dépendances intégrée
✅ Guards et Middleware natifs
✅ Support Swagger/OpenAPI
✅ Excellent pour les APIs REST
```

### Structure du Projet
```
creche-api/
├── src/
│   ├── modules/
│   │   ├── inscriptions/      # Gestion des inscriptions
│   │   ├── parent/            # Tableau de bord parent
│   │   ├── admin/             # Gestion admin
│   │   ├── events/            # Événements
│   │   └── ...
│   ├── common/
│   │   ├── guards/            # JWT, RBAC
│   │   ├── decorators/        # @Roles, @Auth
│   │   ├── services/          # Email, Supabase
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma      # Modèle de données
│   └── app.module.ts          # Module racine
├── dist/                       # Code compilé
└── package.json
```

---

## 💾 Base de Données - PostgreSQL + Prisma

### PostgreSQL
- **Version**: 12+
- **Avantages**:
  - Relationnel et robuste
  - Support JSON natif
  - Transactions ACID
  - Scalabilité

### Prisma ORM
- **Rôle**: Couche d'accès aux données
- **Avantages**:
  ```
  ✅ Type-safe queries
  ✅ Migrations automatiques
  ✅ Relations simplifiées
  ✅ Seed data
  ✅ Studio GUI
  ```

### Modèles Principaux
```prisma
model Utilisateur {
  id          String @id @default(uuid())
  email       String @unique
  role        RoleUtilisateur
  tuteurId    String? @unique
  tempPassword String?
  authUserId  String? @unique
  tuteur      Tuteur? @relation(fields: [tuteurId])
}

model Tuteur {
  id        String @id @default(uuid())
  familleId String
  email     String? @unique
  prenom    String?
  nom       String?
  famille   Famille @relation(fields: [familleId])
  utilisateur Utilisateur?
}

model Inscription {
  id        String @id @default(uuid())
  statut    StatutInscription
  payload   Json  // Données brutes du formulaire
  familleId String?
  enfantId  String?
}
```

---

## 📧 Email - Nodemailer + Gmail SMTP

### Configuration
```typescript
// src/common/services/email.service.ts

import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});
```

### Flux d'Email Provisioning
```
1. Admin accepte inscription
   ↓
2. Service génère mot de passe temporaire
   ↓
3. Crée compte Supabase Auth
   ↓
4. Crée Utilisateur local
   ↓
5. Envoie email via Nodemailer
   ├─ Email: parent@example.com
   ├─ Mot de passe: [GENERATED]
   └─ Lien: http://localhost:3000/login
```

### Template Email
```html
<h2>Bienvenue à la Crèche WLW!</h2>
<p>Vous avez été invité(e) en tant que PARENT</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Mot de passe temporaire:</strong> {{tempPassword}}</p>
<p><a href="{{loginUrl}}">Se connecter</a></p>
<p>Après votre première connexion, veuillez changer votre mot de passe.</p>
```

### Avantages Nodemailer
```
✅ Support SMTP natif
✅ Intégration Gmail simple
✅ Templates HTML
✅ Gestion des erreurs
✅ Async/await
```

---

## 🔐 Authentification - JWT + Supabase

### JWT (JSON Web Token)
```typescript
// Payload
{
  "userId": "user_123",
  "email": "parent@example.com",
  "role": "PARENT",
  "iat": 1234567890,
  "exp": 1234571490
}

// Signature: HS256 (dev) ou RS256 (prod)
```

### Supabase Auth
- **Rôle**: Authentification en production
- **Avantages**:
  ```
  ✅ OAuth intégré
  ✅ JWT automatique
  ✅ Gestion des sessions
  ✅ MFA support
  ✅ Gratuit jusqu'à 50k utilisateurs
  ```

### Flux d'Authentification
```
1. Parent reçoit email avec credentials
   ↓
2. Parent se connecte (POST /auth/login-user)
   ├─ Email + mot de passe temporaire
   └─ Retourne JWT
   ↓
3. Parent utilise JWT pour accéder aux endpoints
   ├─ Header: Authorization: Bearer <JWT>
   └─ Guard vérifie JWT
   ↓
4. Parent change mot de passe
   └─ Mot de passe stocké en hash
```

### Guards
```typescript
// JWT Auth Guard
@UseGuards(JwtAuthGuard)
async getMe(@Req() req) {
  // req.user = { userId, email, role }
}

// RBAC Guard
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PARENT')
async getMyProfile() {
  // Vérifie que l'utilisateur a le rôle PARENT
}
```

---

## 🔄 Flux d'Inscription Complet

### 1. Soumission (Public)
```
POST /public/inscriptions
├─ Payload: { famille, tuteurs, enfant, classeIdSouhaitee }
├─ Validation: class-validator
└─ Stockage: Inscription.payload (JSON)
```

### 2. Examen (Admin)
```
GET /admin/inscriptions?statut=CANDIDATURE
├─ Filtre par statut
├─ Pagination
└─ Formatage de la réponse
```

### 3. Acceptation (Admin)
```
POST /admin/inscriptions/:id/accept
├─ Transaction Prisma:
│  ├─ Crée Famille (upsert)
│  ├─ Crée Tuteur(s)
│  ├─ Crée Enfant
│  └─ Met à jour Inscription
├─ Hors transaction:
│  ├─ Crée Supabase user
│  ├─ Crée Utilisateur local
│  └─ Envoie email
└─ Retourne: { familleId, enfantId, invitedTuteurs }
```

### 4. Provisioning (Email)
```
Pour chaque tuteur avec email:
├─ Générer mot de passe (12 caractères)
├─ Créer Supabase user
├─ Créer Utilisateur local (PARENT)
├─ Envoyer email d'invitation
└─ Mettre à jour statut
```

---

## 🛡️ Sécurité

### Validation
```typescript
// DTOs avec class-validator
export class CreateInscriptionDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  prenom: string;

  @ValidateNested()
  @Type(() => TuteurDto)
  tuteurs: TuteurDto[];
}
```

### Mot de Passe Temporaire
```typescript
private generateTempPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
```

### Transactions
```typescript
// Atomicité garantie
const result = await this.prisma.$transaction(async (tx) => {
  // Toutes les opérations réussissent ou échouent ensemble
  const famille = await tx.famille.create(...);
  const tuteur = await tx.tuteur.create(...);
  const enfant = await tx.enfant.create(...);
  return { famille, tuteur, enfant };
});
```

---

## 📊 Validation & Erreurs

### Codes HTTP
```
200 OK              - Succès
201 Created         - Ressource créée
400 Bad Request     - Validation échouée
401 Unauthorized    - Token manquant/invalide
403 Forbidden       - Accès refusé (RBAC)
404 Not Found       - Ressource inexistante
409 Conflict        - Statut incompatible
500 Server Error    - Erreur serveur
```

### Exemple Erreur
```json
{
  "statusCode": 400,
  "message": "Aucun tuteur avec email trouvé",
  "error": "Bad Request"
}
```

---

## 🚀 Déploiement

### Environnements
```
DEV:
├─ JWT local (dev_secret)
├─ Emails en console
└─ Base de données locale

PROD:
├─ Supabase JWT
├─ Emails réels (Gmail)
└─ PostgreSQL cloud
```

### Variables d'Environnement
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=dev_secret
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
GMAIL_USER=xxx@gmail.com
GMAIL_PASSWORD=xxx
NODE_ENV=development
```

---

## 📦 Dépendances Principales

```json
{
  "@nestjs/common": "^9.0.0",
  "@nestjs/core": "^9.0.0",
  "@nestjs/swagger": "^6.0.0",
  "@prisma/client": "^4.0.0",
  "jsonwebtoken": "^9.0.0",
  "nodemailer": "^6.9.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0"
}
```

---

## 🔗 Ressources

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Nodemailer Docs**: https://nodemailer.com
- **JWT.io**: https://jwt.io

