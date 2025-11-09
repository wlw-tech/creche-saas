# API Tableau de Bord Parent & Événements de Classe

## Vue d'ensemble

Cette API fournit les endpoints pour:
1. **Tableau de bord Parent** - Gestion du profil, présences, résumés de classe, événements
2. **Gestion des Événements (Admin)** - CRUD complet sur les événements de classe

## Authentification

Tous les endpoints nécessitent un JWT Bearer token dans le header `Authorization`:
```
Authorization: Bearer <jwt_token>
```

## RBAC (Role-Based Access Control)

- **PARENT**: Accès uniquement à sa famille et ses enfants
- **ADMIN**: Accès complet aux événements

---

## Endpoints Parent

### 1. GET /parent/me
**Description**: Récupérer mon profil (tuteur + enfants)

**Authentification**: JWT (PARENT)

**Réponse (200)**:
```json
{
  "id": "user_123",
  "email": "parent@example.com",
  "prenom": "Jean",
  "nom": "Dupont",
  "telephone": "06 12 34 56 78",
  "adresse": "Rue Atlas, Marrakech",
  "langue": "fr",
  "tuteurId": "tuteur_123",
  "familleId": "fam_123",
  "enfants": [
    {
      "id": "enf_1",
      "prenom": "Alice",
      "nom": "Dupont",
      "dateNaissance": "2020-05-15",
      "classeId": "cls_1"
    }
  ]
}
```

**Erreurs**:
- `404 NOT_FOUND`: Tuteur non trouvé

---

### 2. PATCH /parent/me
**Description**: Modifier mon profil (téléphone, adresse)

**Authentification**: JWT (PARENT)

**Body**:
```json
{
  "telephone": "06 12 34 56 78",
  "adresse": "Rue Atlas, Marrakech"
}
```

**Réponse (200)**:
```json
{
  "id": "tuteur_123",
  "prenom": "Jean",
  "nom": "Dupont",
  "telephone": "06 12 34 56 78",
  "adresse": "Rue Atlas, Marrakech"
}
```

---

### 3. POST /parent/me/change-password
**Description**: Changer mon mot de passe

**Authentification**: JWT (PARENT)

**Body (DEV)**:
```json
{
  "newPassword": "NewPassword123!"
}
```

**Réponse (200)**:
```json
{
  "message": "Mot de passe changé avec succès"
}
```

---

### 4. GET /parent/enfants/:enfantId/presences
**Description**: Récupérer les présences de mon enfant

**Authentification**: JWT (PARENT)

**Query Parameters**:
- `dateMin` (optional): Date minimale (ISO 8601)
- `dateMax` (optional): Date maximale (ISO 8601)
- `page` (optional, default=1): Numéro de page
- `pageSize` (optional, default=30): Éléments par page

**Exemple**:
```
GET /parent/enfants/enf_1/presences?dateMin=2025-11-01&dateMax=2025-11-09&page=1&pageSize=30
```

**Réponse (200)**:
```json
{
  "data": [
    {
      "id": "pres_1",
      "date": "2025-11-09",
      "statut": "Present",
      "arriveeA": "08:30",
      "departA": "17:00"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 30,
    "total": 100,
    "hasNext": true
  }
}
```

**Erreurs**:
- `403 FORBIDDEN`: Cet enfant ne vous appartient pas

---

### 5. GET /parent/classes/:classeId/journal/latest
**Description**: Récupérer le dernier résumé publié de la classe

**Authentification**: JWT (PARENT)

**Réponse (200)**:
```json
{
  "id": "journal_1",
  "date": "2025-11-09",
  "activites": "Jeux libres, peinture",
  "apprentissages": "Couleurs, formes",
  "humeurGroupe": "Excellente",
  "observations": "Groupe très actif",
  "publieLe": "2025-11-09T17:00:00Z"
}
```

**Erreurs**:
- `403 FORBIDDEN`: Vous n'avez pas d'enfant dans cette classe
- `404 NOT_FOUND`: Aucun résumé publié trouvé

---

### 6. GET /parent/events
**Description**: Récupérer mes événements (classes de mes enfants)

**Authentification**: JWT (PARENT)

**Query Parameters**:
- `dateFrom` (optional, default="today"): Date de début (ISO 8601 ou "today")
- `page` (optional, default=1): Numéro de page
- `pageSize` (optional, default=20): Éléments par page

**Exemple**:
```
GET /parent/events?dateFrom=today&page=1&pageSize=20
```

**Réponse (200)**:
```json
{
  "data": [
    {
      "id": "evt_1",
      "titre": "Réunion parents-enseignants",
      "description": "Salle bleue",
      "startAt": "2025-11-30T14:00:00Z",
      "endAt": "2025-11-30T16:00:00Z",
      "classeId": "cls_1"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "hasNext": true
  }
}
```

---

## Endpoints Admin - Événements

### 1. POST /admin/events
**Description**: Créer un événement

**Authentification**: JWT (ADMIN)

**Body**:
```json
{
  "titre": "Réunion parents-enseignants",
  "description": "Salle bleue",
  "startAt": "2025-11-30T14:00:00Z",
  "endAt": "2025-11-30T16:00:00Z",
  "classeId": "cls_1"
}
```

**Réponse (201)**:
```json
{
  "id": "evt_1",
  "titre": "Réunion parents-enseignants",
  "description": "Salle bleue",
  "startAt": "2025-11-30T14:00:00Z",
  "endAt": "2025-11-30T16:00:00Z",
  "classeId": "cls_1",
  "status": "PUBLISHED",
  "createdAt": "2025-11-09T10:00:00Z"
}
```

**Erreurs**:
- `400 BAD_REQUEST`: startAt doit être avant endAt
- `404 NOT_FOUND`: Classe non trouvée

---

### 2. GET /admin/events
**Description**: Lister les événements

**Authentification**: JWT (ADMIN)

**Query Parameters**:
- `classeId` (optional): Filtrer par classe
- `dateMin` (optional): Date minimale
- `dateMax` (optional): Date maximale
- `page` (optional, default=1): Numéro de page
- `pageSize` (optional, default=20): Éléments par page

**Réponse (200)**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "hasNext": true
  }
}
```

---

### 3. GET /admin/events/:id
**Description**: Récupérer un événement

**Authentification**: JWT (ADMIN)

**Réponse (200)**:
```json
{
  "id": "evt_1",
  "titre": "Réunion parents-enseignants",
  "description": "Salle bleue",
  "startAt": "2025-11-30T14:00:00Z",
  "endAt": "2025-11-30T16:00:00Z",
  "classeId": "cls_1",
  "status": "PUBLISHED",
  "createdAt": "2025-11-09T10:00:00Z",
  "updatedAt": "2025-11-09T10:00:00Z"
}
```

---

### 4. PATCH /admin/events/:id
**Description**: Modifier un événement

**Authentification**: JWT (ADMIN)

**Body**:
```json
{
  "titre": "Réunion parents-enseignants (mise à jour)",
  "description": "Salle bleue - Mise à jour"
}
```

**Réponse (200)**:
```json
{
  "id": "evt_1",
  "titre": "Réunion parents-enseignants (mise à jour)",
  "description": "Salle bleue - Mise à jour",
  "startAt": "2025-11-30T14:00:00Z",
  "endAt": "2025-11-30T16:00:00Z",
  "classeId": "cls_1",
  "status": "PUBLISHED",
  "updatedAt": "2025-11-09T11:00:00Z"
}
```

---

### 5. DELETE /admin/events/:id
**Description**: Supprimer un événement

**Authentification**: JWT (ADMIN)

**Réponse (200)**:
```json
{
  "message": "Événement supprimé avec succès"
}
```

---

## Exemples cURL

### Parent: Mon profil
```bash
curl -H "Authorization: Bearer <parent_jwt>" \
  http://localhost:3000/api/parent/me
```

### Parent: Modifier mon profil
```bash
curl -X PATCH \
  -H "Authorization: Bearer <parent_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"telephone":"06 12 34 56 78","adresse":"Rue Atlas, Marrakech"}' \
  http://localhost:3000/api/parent/me
```

### Parent: Présences de mon enfant
```bash
curl -H "Authorization: Bearer <parent_jwt>" \
  "http://localhost:3000/api/parent/enfants/enf_1/presences?dateMin=2025-11-01&dateMax=2025-11-09"
```

### Admin: Créer un événement
```bash
curl -X POST \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "titre":"Réunion parents-enseignants",
    "description":"Salle bleue",
    "startAt":"2025-11-30T14:00:00Z",
    "endAt":"2025-11-30T16:00:00Z",
    "classeId":"cls_1"
  }' \
  http://localhost:3000/api/admin/events
```

---

## Critères d'acceptation

✅ **P1**: Un parent voit uniquement sa famille / ses enfants (403 sinon)
✅ **P2**: PATCH /parent/me ne modifie que ses champs autorisés
✅ **P3**: Changement de mot de passe déclenché proprement
✅ **P4**: Présences filtrées par date/pagination, temps Africa/Casablanca
✅ **P5**: Journal "latest" retourne uniquement publié
✅ **P6**: Événements ADMIN CRUD + visibles côté parent selon classe
✅ **P7**: Swagger documenté; erreurs claires (400/403/404)

