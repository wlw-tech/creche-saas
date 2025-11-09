# 📋 Module Inscriptions - Documentation Complète

## 🎯 Vue d'ensemble

Le module **Inscriptions** gère le processus complet d'inscription des enfants à la crèche, du formulaire de candidature à l'acceptation et la création des données associées.

### Statuts d'inscription
- **CANDIDATURE** : Formulaire soumis, en attente de traitement
- **EN_COURS** : Dossier en cours de vérification
- **ACTIF** : Inscription acceptée et enfant actif
- **REJETEE** : Inscription rejetée

---

## 📡 Endpoints

### 1️⃣ PUBLIC - Créer une candidature

**Endpoint:** `POST /api/public/inscriptions`

**Authentification:** ❌ Non requise

**Description:** Permet à un parent de soumettre une candidature d'inscription

**Body:**
```json
{
  "enfant": {
    "prenom": "Mohammed Amine",
    "nom": "Bennani",
    "dateNaissance": "2022-06-14"
  },
  "mere": {
    "prenom": "Sara",
    "nom": "El Idrissi",
    "email": "sara@mail.com",
    "telephone": "+212612345678"
  },
  "pere": {
    "prenom": "Youssef",
    "nom": "Bennani",
    "email": "youssef@mail.com",
    "telephone": "+212687654321"
  },
  "personnesAutorisees": [
    {
      "prenom": "Grand-mère",
      "nom": "Bennani",
      "telephone": "+212611111111"
    }
  ],
  "sante": {
    "allergies": "Arachides",
    "medicaments": "Aucun",
    "observations": "Aucune"
  },
  "reglementAccepte": true
}
```

**Response (201):**
```json
{
  "id": "uuid-inscription",
  "statut": "CANDIDATURE",
  "createdAt": "2025-11-09T12:00:00Z"
}
```

---

### 2️⃣ ADMIN - Lister les inscriptions

**Endpoint:** `GET /api/admin/inscriptions`

**Authentification:** ✅ JWT + ADMIN

**Query Parameters:**
- `statut` (optional): CANDIDATURE | EN_COURS | ACTIF | REJETEE
- `q` (optional): Recherche par nom/email
- `dateMin` (optional): Date minimum (ISO 8601)
- `dateMax` (optional): Date maximum (ISO 8601)
- `page` (optional): Numéro de page (défaut: 1)
- `pageSize` (optional): Taille de page (défaut: 25)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "statut": "CANDIDATURE",
      "payload": { /* données du formulaire */ },
      "notes": null,
      "createdAt": "2025-11-09T12:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 25,
  "hasNext": false
}
```

---

### 3️⃣ ADMIN - Récupérer une inscription

**Endpoint:** `GET /api/admin/inscriptions/:id`

**Authentification:** ✅ JWT + ADMIN

**Response (200):**
```json
{
  "id": "uuid",
  "statut": "CANDIDATURE",
  "payload": {
    "enfant": { /* ... */ },
    "mere": { /* ... */ },
    "pere": { /* ... */ }
  },
  "familleId": null,
  "enfantId": null,
  "notes": null,
  "createdAt": "2025-11-09T12:00:00Z",
  "updatedAt": "2025-11-09T12:00:00Z"
}
```

---

### 4️⃣ ADMIN - Mettre à jour le statut

**Endpoint:** `PATCH /api/admin/inscriptions/:id/status`

**Authentification:** ✅ JWT + ADMIN

**Body:**
```json
{
  "statut": "EN_COURS",
  "notes": "En cours de vérification des documents"
}
```

**Response (200):** Inscription mise à jour

---

### 5️⃣ ADMIN - Rejeter une inscription

**Endpoint:** `PATCH /api/admin/inscriptions/:id/reject`

**Authentification:** ✅ JWT + ADMIN

**Body:**
```json
{
  "raison": "Dossier incomplet - documents manquants"
}
```

**Response (200):** Inscription rejetée avec raison

---

### 6️⃣ ADMIN - Accepter et provisionner

**Endpoint:** `POST /api/admin/inscriptions/:id/accept`

**Authentification:** ✅ JWT + ADMIN

**Description:** Accepte l'inscription et crée:
- La Famille
- Les Tuteurs (Mère, Père)
- L'Enfant

**Response (201):**
```json
{
  "inscriptionId": "uuid",
  "statut": "ACTIF",
  "familleId": "uuid-famille",
  "enfantId": "uuid-enfant",
  "tuteurs": [
    {
      "tuteurId": "uuid",
      "email": "sara@mail.com",
      "lien": "Mere"
    }
  ]
}
```

---

## 🔄 Flux d'inscription

```
1. Parent soumet candidature
   ↓
2. Admin reçoit candidature (CANDIDATURE)
   ↓
3. Admin met à jour statut (EN_COURS)
   ↓
4. Admin accepte ou rejette
   ├─ Si accepté → Crée Famille, Tuteurs, Enfant (ACTIF)
   └─ Si rejeté → Marque comme REJETEE
```

---

## ⚠️ Codes d'erreur

| Code | Message | Cause |
|------|---------|-------|
| 400 | Validation error | Données invalides |
| 401 | Unauthorized | Token manquant/invalide |
| 403 | Forbidden | Accès non autorisé (non-admin) |
| 404 | Not found | Inscription inexistante |
| 409 | Invalid transition | Transition de statut invalide |
| 500 | Provisioning failed | Erreur lors de la création des données |

---

## 🧪 Tester avec Postman

1. Importer `Creche-Inscriptions.postman_collection.json`
2. Définir les variables:
   - `accessToken`: Token JWT d'un admin
   - `inscriptionId`: ID d'une inscription
3. Tester les endpoints dans l'ordre

---

## 📊 Modèle de données

### Inscription
```prisma
model Inscription {
  id        String            @id @default(uuid())
  statut    StatutInscription @default(CANDIDATURE)
  payload   Json              @default("{}")
  enfantId  String?
  familleId String?
  notes     String?
  createdAt DateTime          @default(now())
  updatedAt DateTime          @default(now()) @updatedAt

  enfant  Enfant?  @relation(fields: [enfantId], references: [id])
  famille Famille? @relation(fields: [familleId], references: [id])

  @@index([statut])
  @@index([createdAt])
}
```

---

## 🔐 Contrôle d'accès (RBAC)

| Endpoint | PARENT | ENSEIGNANT | ADMIN |
|----------|--------|-----------|-------|
| POST /public/inscriptions | ✅ | ✅ | ✅ |
| GET /admin/inscriptions | ❌ | ❌ | ✅ |
| GET /admin/inscriptions/:id | ❌ | ❌ | ✅ |
| PATCH /admin/inscriptions/:id/status | ❌ | ❌ | ✅ |
| PATCH /admin/inscriptions/:id/reject | ❌ | ❌ | ✅ |
| POST /admin/inscriptions/:id/accept | ❌ | ❌ | ✅ |


