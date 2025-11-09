# 👨‍👩‍👧 Parent Dashboard - Guide Complet

## 🔐 Problème d'Autorisation - Solution

### Problème
```
GET /api/parent/me → 403 Forbidden (Unauthorized)
```

### Cause
Le JWT ne contient pas le `userId` correctement ou le token n'est pas valide.

### Solution

#### 1. Vérifier le JWT Token
Le token doit contenir:
```json
{
  "userId": "user_123",
  "email": "parent@example.com",
  "role": "PARENT",
  "iat": 1234567890,
  "exp": 1234571490
}
```

#### 2. Générer un JWT Valide (DEV)
```bash
# Utiliser un JWT decoder en ligne: https://jwt.io

# Payload:
{
  "userId": "user_123",
  "email": "parent@example.com",
  "role": "PARENT"
}

# Secret: dev_secret
```

#### 3. Utiliser le JWT dans les Requêtes
```bash
curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  http://localhost:3000/api/parent/me
```

#### 4. Postman - Ajouter le Token
1. Ouvrir Postman
2. Aller à l'onglet "Authorization"
3. Sélectionner "Bearer Token"
4. Coller le token dans le champ "Token"

---

## 📊 Endpoints Parent Dashboard

### 1. GET /api/parent/me
**Description**: Récupérer mon profil + mes enfants

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse (200)**:
```json
{
  "id": "user_123",
  "email": "parent@example.com",
  "prenom": "Sara",
  "nom": "El Idrissi",
  "telephone": "+212612345678",
  "adresse": "Rue Atlas, Marrakech",
  "langue": "fr",
  "tuteurId": "tuteur_123",
  "familleId": "fam_123",
  "enfants": [
    {
      "id": "enf_1",
      "prenom": "Mohammed Amine",
      "nom": "Bennani",
      "dateNaissance": "2022-06-14",
      "classeId": "cls_1"
    }
  ]
}
```

**Erreurs**:
- `401 Unauthorized` - Token manquant ou invalide
- `403 Forbidden` - Rôle non autorisé (doit être PARENT)
- `404 Not Found` - Tuteur non trouvé

---

### 2. PATCH /api/parent/me
**Description**: Modifier mon profil

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body**:
```json
{
  "telephone": "+212612345678",
  "adresse": "Rue Atlas, Marrakech"
}
```

**Réponse (200)**:
```json
{
  "id": "tuteur_123",
  "prenom": "Sara",
  "nom": "El Idrissi",
  "telephone": "+212612345678",
  "adresse": "Rue Atlas, Marrakech"
}
```

---

### 3. GET /api/parent/enfants/:enfantId/presences
**Description**: Récupérer les présences de mon enfant

**Parameters**:
- `enfantId` (path) - ID de l'enfant
- `dateMin` (query) - Date minimum (YYYY-MM-DD)
- `dateMax` (query) - Date maximum (YYYY-MM-DD)
- `page` (query) - Numéro de page (default: 1)
- `pageSize` (query) - Éléments par page (default: 30)

**URL**:
```
GET /api/parent/enfants/enf_1/presences?dateMin=2025-11-01&dateMax=2025-11-30&page=1&pageSize=30
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

---

### 4. GET /api/parent/classes/:classeId/menu
**Description**: Récupérer le menu du jour d'une classe

**Parameters**:
- `classeId` (path) - ID de la classe
- `date` (query) - Date (YYYY-MM-DD, default: aujourd'hui)

**URL**:
```
GET /api/parent/classes/cls_1/menu?date=2025-11-09
```

**Réponse (200)**:
```json
{
  "id": "menu_1",
  "date": "2025-11-09",
  "entree": "Salade",
  "plat": "Poulet, riz, légumes",
  "dessert": "Fruit",
  "statut": "Publie",
  "publieLe": "2025-11-09T08:00:00Z"
}
```

---

### 5. GET /api/parent/enfants/:enfantId/resume
**Description**: Récupérer le résumé quotidien de mon enfant

**Parameters**:
- `enfantId` (path) - ID de l'enfant
- `date` (query) - Date (YYYY-MM-DD, default: aujourd'hui)

**URL**:
```
GET /api/parent/enfants/enf_1/resume?date=2025-11-09
```

**Réponse (200)**:
```json
{
  "id": "resume_1",
  "date": "2025-11-09",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "observations": [
    "Très actif et joyeux",
    "A bien mangé",
    "Sieste de 2h"
  ],
  "creeLe": "2025-11-09T17:00:00Z",
  "modifieLe": "2025-11-09T17:00:00Z"
}
```

---

### 6. GET /api/parent/classes/:classeId/journal/latest
**Description**: Récupérer le dernier résumé publié de la classe

**URL**:
```
GET /api/parent/classes/cls_1/journal/latest
```

**Réponse (200)**:
```json
{
  "id": "journal_1",
  "date": "2025-11-09",
  "activites": "Jeux libres, peinture, chansons",
  "apprentissages": "Couleurs, formes, nombres",
  "humeurGroupe": "Excellente",
  "observations": "Groupe très actif",
  "publieLe": "2025-11-09T17:00:00Z"
}
```

---

### 7. GET /api/parent/events
**Description**: Récupérer mes événements

**Parameters**:
- `page` (query) - Numéro de page (default: 1)
- `pageSize` (query) - Éléments par page (default: 20)
- `dateFrom` (query) - Date de début (default: aujourd'hui)

**URL**:
```
GET /api/parent/events?page=1&pageSize=20
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

## 🔍 Trouver les IDs

### Trouver enfant_id
1. Appeler `GET /api/parent/me`
2. Récupérer `enfants[0].id`

### Trouver classe_id
1. Appeler `GET /api/parent/me`
2. Récupérer `enfants[0].classeId`

---

## 🧪 Exemple Complet - cURL

```bash
# 1. Récupérer mon profil
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:3000/api/parent/me

# 2. Récupérer les présences de mon enfant
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:3000/api/parent/enfants/enf_1/presences?dateMin=2025-11-01&dateMax=2025-11-30"

# 3. Récupérer le menu du jour
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:3000/api/parent/classes/cls_1/menu?date=2025-11-09"

# 4. Récupérer le résumé de mon enfant
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:3000/api/parent/enfants/enf_1/resume?date=2025-11-09"

# 5. Récupérer mes événements
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:3000/api/parent/events"
```

---

## 📋 Checklist - Avant de Tester

- [ ] JWT Token valide avec `userId`, `email`, `role: PARENT`
- [ ] Parent créé via inscription acceptée
- [ ] Enfant lié à la famille du parent
- [ ] Classe assignée à l'enfant
- [ ] Menu publié pour la date
- [ ] Résumé publié pour la date
- [ ] Événement créé pour la classe

---

## 🐛 Dépannage

### 403 Forbidden
- Vérifier que le JWT contient `role: PARENT`
- Vérifier que le `userId` existe en base de données
- Vérifier que le tuteur est lié à l'utilisateur

### 404 Not Found
- Vérifier que l'enfant existe
- Vérifier que l'enfant appartient à la famille du parent
- Vérifier que la classe existe

### Pas de données
- Vérifier que le menu/résumé est publié (statut: "Publie")
- Vérifier la date (format: YYYY-MM-DD)
- Vérifier la pagination (page >= 1)

