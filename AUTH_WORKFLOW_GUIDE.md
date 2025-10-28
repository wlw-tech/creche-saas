# 🔐 Guide Complet - Workflow d'Authentification et Gestion des Utilisateurs

## 📋 Table des Matières

1. [Architecture](#architecture)
2. [Configuration ENV](#configuration-env)
3. [Endpoints](#endpoints)
4. [Exemples curl/Postman](#exemples-curlpostman)
5. [Critères d'Acceptation](#critères-dacceptation)

---

## 🏗️ Architecture

### Modèle de Données

```
Utilisateur {
  id: UUID
  email: String @unique
  prenom: String
  nom: String
  role: ADMIN | ENSEIGNANT | PARENT
  statut: INVITED | ACTIVE | DISABLED
  authUserId: String? (Supabase)
  tuteurId: String? (Lien si PARENT)
  inviteLe: DateTime?
  activeLe: DateTime?
  dernierAcces: DateTime?
}
```

### Flux d'Authentification

**DEV:**
```
POST /auth/login (email/password)
  ↓
Valider contre .env (ADMIN_EMAIL, ADMIN_PASSWORD)
  ↓
Générer JWT local
  ↓
Retourner token + userId + role
```

**PROD:**
```
Supabase Auth (magic link / OAuth)
  ↓
JWT Supabase
  ↓
Guard valide JWT + lookup Utilisateur
  ↓
RolesGuard vérifie rôle + statut
```

### Flux d'Inscription

```
1. POST /public/inscriptions (public)
   → Crée Famille, Tuteur(s), Enfant, Inscription (Candidature)

2. POST /inscriptions/:id/accept (ADMIN)
   → Accepte inscription (Actif)
   → Crée Utilisateur PARENT pour chaque tuteur avec email
   → Envoie invitation Supabase

3. PATCH /inscriptions/:id/reject (ADMIN)
   → Rejette inscription (Inactif)
```

### Flux d'Invitation Enseignant

```
POST /admin/users/teachers/invite (ADMIN)
  ↓
Crée Utilisateur (ENSEIGNANT, INVITED)
  ↓
Crée invitation Supabase
  ↓
Envoie email avec magic link
```

---

## ⚙️ Configuration ENV

Copier `.env.example` → `.env` et remplir:

```bash
# DEV
DATABASE_URL=postgresql://user:password@localhost:5432/creche
NODE_ENV=development
ADMIN_EMAIL=admin@wlw.ma
ADMIN_PASSWORD=change_me
JWT_SECRET=super_secret_dev_key

# PROD (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json
JWT_AUDIENCE=authenticated
JWT_ISSUER=https://your-project.supabase.co/auth/v1
```

---

## 🔌 Endpoints

### 1. Authentification

#### POST /auth/login (DEV)

**Description:** Connexion admin en développement

**Body:**
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

**Réponse (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

---

### 2. Gestion des Utilisateurs (ADMIN)

#### POST /admin/users/teachers/invite

**Description:** Inviter un enseignant

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "prof@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678"
}
```

**Réponse (201):**
```json
{
  "utilisateurId": "usr_789",
  "email": "prof@wlw.ma",
  "statut": "INVITED",
  "invited": true
}
```

---

#### GET /admin/users

**Description:** Lister les utilisateurs

**Query Params:**
- `role`: ADMIN | ENSEIGNANT | PARENT
- `statut`: INVITED | ACTIVE | DISABLED
- `q`: Recherche (email/prénom/nom)
- `page`: Numéro de page (défaut: 1)
- `limit`: Résultats par page (défaut: 10)

**Réponse (200):**
```json
{
  "data": [
    {
      "id": "usr_123",
      "email": "prof@wlw.ma",
      "prenom": "Ahmed",
      "nom": "Dupont",
      "role": "ENSEIGNANT",
      "statut": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

#### PATCH /admin/users/:id/status

**Description:** Mettre à jour le statut d'un utilisateur

**Body:**
```json
{
  "statut": "ACTIVE"
}
```

**Réponse (200):**
```json
{
  "id": "usr_789",
  "email": "prof@wlw.ma",
  "statut": "ACTIVE",
  "activeLe": "2025-10-28T12:00:00Z"
}
```

---

### 3. Gestion des Inscriptions (ADMIN)

#### POST /inscriptions/:id/accept

**Description:** Accepter une inscription et provisionner les comptes parents

**Body:**
```json
{
  "notes": "Inscription acceptée"
}
```

**Réponse (200):**
```json
{
  "inscriptionId": "insc_123",
  "statut": "Actif",
  "familleId": "fam_123",
  "enfantId": "enf_123",
  "tuteurs": [
    {
      "tuteurId": "t1",
      "email": "p1@mail.com",
      "invite": "sent",
      "utilisateurId": "u1"
    },
    {
      "tuteurId": "t2",
      "email": "p2@mail.com",
      "invite": "missing_email"
    }
  ]
}
```

---

#### PATCH /inscriptions/:id/reject

**Description:** Rejeter une inscription

**Body:**
```json
{
  "raison": "Capacité atteinte"
}
```

**Réponse (200):**
```json
{
  "inscriptionId": "insc_123",
  "statut": "Inactif",
  "raison": "Capacité atteinte"
}
```

---

## 📝 Exemples curl/Postman

### 1. Connexion Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wlw.ma",
    "password": "change_me"
  }'
```

**Réponse:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

---

### 2. Inviter un Enseignant

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/admin/users/teachers/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prof@wlw.ma",
    "prenom": "Ahmed",
    "nom": "Dupont",
    "telephone": "+212612345678"
  }'
```

---

### 3. Lister les Utilisateurs

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:3000/api/admin/users?role=ENSEIGNANT&statut=ACTIVE" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Accepter une Inscription

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
INSCRIPTION_ID="insc_123"

curl -X POST http://localhost:3000/api/inscriptions/$INSCRIPTION_ID/accept \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Inscription acceptée"
  }'
```

---

### 5. Rejeter une Inscription

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
INSCRIPTION_ID="insc_123"

curl -X PATCH http://localhost:3000/api/inscriptions/$INSCRIPTION_ID/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raison": "Capacité atteinte"
  }'
```

---

## ✅ Critères d'Acceptation

### AC1: Authentification DEV
- [ ] POST /auth/login accepte email/password
- [ ] Génère JWT valide
- [ ] Retourne userId, role, email

### AC2: Invitation Enseignant
- [ ] POST /admin/users/teachers/invite crée Utilisateur (ENSEIGNANT, INVITED)
- [ ] Crée invitation Supabase (mock en DEV)
- [ ] Retourne utilisateurId, email, statut

### AC3: Acceptation Inscription
- [ ] POST /inscriptions/:id/accept change statut → Actif
- [ ] Crée Utilisateur PARENT pour chaque tuteur avec email
- [ ] Retourne tuteurs avec statut d'invitation

### AC4: RBAC
- [ ] Guard JWT valide token
- [ ] RolesGuard vérifie rôle (ADMIN pour /admin/*)
- [ ] Refuse si statut != ACTIVE

### AC5: Swagger
- [ ] Tous les endpoints documentés
- [ ] Exemples de payload/réponse
- [ ] Descriptions en français

### AC6: Code Prêt
- [ ] Compilable sans erreurs
- [ ] TODO indiqués pour Supabase/email
- [ ] Testable avec curl/Postman

---

## 🚀 Commandes Utiles

```bash
# Démarrer le serveur
pnpm start:dev

# Générer Prisma Client
pnpm prisma generate

# Exécuter les migrations
pnpm prisma migrate dev

# Ouvrir Prisma Studio
pnpm prisma studio

# Lancer les tests
pnpm test:e2e

# Consulter Swagger
# http://localhost:3000/docs
```

---

**Prêt pour la production! 🎉**

