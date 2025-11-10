# 📚 Documentation Complète des Endpoints - Crèche SaaS API

## 🎯 Vue d'Ensemble

Cette documentation contient **tous les endpoints** de l'API avec:
- ✅ Méthode HTTP et chemin
- ✅ Rôles requis et RBAC
- ✅ Paramètres de requête
- ✅ Corps de requête (REQUEST BODY)
- ✅ Réponses de succès (200, 201)
- ✅ Codes d'erreur et messages

---

## 🔐 Authentification

### Identifiants Admin (DEV)
```
Email: admin@wlw.ma
Password: change_me
```

### Rôles Disponibles
- **ADMIN**: Accès complet
- **ENSEIGNANT**: Accès aux classes assignées
- **PARENT**: Accès aux enfants et infos publiques

### Statuts Utilisateur
- **INVITED**: En attente d'activation
- **ACTIVE**: Utilisateur actif
- **DISABLED**: Utilisateur désactivé

---

## 📋 Table des Endpoints

| Catégorie | Endpoint | Méthode | Rôle |
|-----------|----------|---------|------|
| **Auth** | `/api/auth/login` | POST | Public |
| | `/api/auth/login-user` | POST | Public |
| | `/api/auth/change-password` | POST | Authentifié |
| **Admin/Users** | `/api/admin/users` | POST | ADMIN |
| | `/api/admin/users` | GET | ADMIN |
| | `/api/admin/users/:id` | GET | ADMIN |
| | `/api/admin/users/:id/status` | PATCH | ADMIN |
| | `/api/admin/users/:id` | DELETE | ADMIN |
| **Admin/Classes** | `/api/admin/classes` | POST | ADMIN |
| | `/api/admin/classes` | GET | ADMIN |
| | `/api/admin/classes/:id` | GET | ADMIN |
| | `/api/admin/classes/:id` | PATCH | ADMIN |
| | `/api/admin/classes/:id` | DELETE | ADMIN |
| | `/api/admin/classes/:id/enfants` | GET | ADMIN |
| | `/api/admin/classes/:id/enseignants/:id` | POST | ADMIN |
| | `/api/admin/classes/:id/enseignants/:id` | DELETE | ADMIN |
| **Presences** | `/api/presences` | GET | ADMIN/ENSEIGNANT/PARENT |
| | `/api/presences` | POST | ADMIN/ENSEIGNANT |
| | `/api/presences/class` | POST | ADMIN/ENSEIGNANT |
| **Menus** | `/api/menus` | POST | ADMIN |
| | `/api/menus` | GET | Authentifié |
| | `/api/menus/today` | GET | Public |
| | `/api/menus/:id` | GET | Authentifié |
| | `/api/menus/:id` | PATCH | ADMIN |
| | `/api/menus/:id/publish` | POST | ADMIN |
| | `/api/menus/:id` | DELETE | ADMIN |
| **Daily-Resumes** | `/api/daily-resumes` | POST | ADMIN/ENSEIGNANT |
| | `/api/daily-resumes` | GET | ADMIN/ENSEIGNANT/PARENT |
| | `/api/daily-resumes/:id` | GET | ADMIN/ENSEIGNANT/PARENT |
| | `/api/daily-resumes/:id` | PATCH | ADMIN/ENSEIGNANT |
| | `/api/daily-resumes/:id/publish` | POST | ADMIN/ENSEIGNANT |
| | `/api/daily-resumes/:id` | DELETE | ADMIN/ENSEIGNANT |
| **Parent** | `/api/parent/me` | GET | PARENT |
| | `/api/parent/me` | PATCH | PARENT |
| | `/api/parent/enfants/:id/presences` | GET | PARENT |
| | `/api/parent/classes/:id/menu` | GET | PARENT |
| | `/api/parent/enfants/:id/resume` | GET | PARENT |
| | `/api/parent/classes/:id/journal/latest` | GET | PARENT |
| | `/api/parent/events` | GET | PARENT |

---

## 🔐 AUTH ENDPOINTS

### POST /api/auth/login
**Connexion Admin (DEV uniquement)**

**Rôle Requis**: Public

**Request Body**:
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

**Success (200)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

**Errors**:
- `400`: Email ou mot de passe incorrect
- `400`: Endpoint non disponible en production

---

### POST /api/auth/login-user
**Connexion Utilisateur (Enseignant/Parent)**

**Rôle Requis**: Public

**Request Body**:
```json
{
  "email": "teacher@example.com",
  "password": "tempPassword123"
}
```

**Success (200)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "usr_123",
  "role": "ENSEIGNANT",
  "email": "teacher@example.com"
}
```

**Errors**:
- `400`: Email ou mot de passe incorrect
- `400`: Utilisateur non trouvé

---

### POST /api/auth/change-password
**Changer le mot de passe**

**Rôle Requis**: ADMIN, ENSEIGNANT, PARENT (authentifié)

**Request Body**:
```json
{
  "oldPassword": "tempPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Success (200)**:
```json
{
  "success": true,
  "message": "Mot de passe changé avec succès"
}
```

**Errors**:
- `400`: Ancien mot de passe incorrect
- `400`: Les mots de passe ne correspondent pas
- `401`: Non authentifié

---

## 👥 ADMIN/USERS ENDPOINTS

### POST /api/admin/users
**Créer un utilisateur (Enseignant ou Parent)**

**Rôle Requis**: ADMIN

**Request Body**:
```json
{
  "email": "teacher@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT"
}
```

**Success (201)**:
```json
{
  "utilisateurId": "usr_789",
  "email": "teacher@example.com",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "invited": true
}
```

**Errors**:
- `400`: Email déjà utilisé
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### GET /api/admin/users
**Lister les utilisateurs**

**Rôle Requis**: ADMIN

**Query Parameters**:
- `role`: ADMIN | ENSEIGNANT | PARENT (optionnel)
- `statut`: INVITED | ACTIVE | DISABLED (optionnel)
- `q`: Recherche par email/prénom/nom (optionnel)
- `page`: Numéro de page (optionnel, défaut: 1)
- `limit`: Nombre d'éléments par page (optionnel, défaut: 10)

**Success (200)**:
```json
{
  "data": [
    {
      "id": "usr_123",
      "email": "prof@mail.com",
      "prenom": "Ahmed",
      "nom": "Dupont",
      "role": "ENSEIGNANT",
      "statut": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

**Errors**:
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### GET /api/admin/users/:id
**Obtenir un utilisateur**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "id": "usr_123",
  "email": "prof@mail.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "ACTIVE",
  "creeLe": "2025-11-01T10:00:00Z"
}
```

**Errors**:
- `404`: Utilisateur non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### PATCH /api/admin/users/:id/status
**Mettre à jour le statut d'un utilisateur**

**Rôle Requis**: ADMIN

**Request Body**:
```json
{
  "statut": "ACTIVE"
}
```

**Success (200)**:
```json
{
  "id": "usr_123",
  "email": "prof@mail.com",
  "statut": "ACTIVE",
  "activeLe": "2025-11-01T10:00:00Z"
}
```

**Errors**:
- `404`: Utilisateur non trouvé
- `400`: Statut invalide
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### DELETE /api/admin/users/:id
**Supprimer un utilisateur**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "message": "Utilisateur supprimé avec succès",
  "id": "usr_123"
}
```

**Errors**:
- `404`: Utilisateur non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

## ⚙️ ADMIN/CLASSES ENDPOINTS

### POST /api/admin/classes
**Créer une classe**

**Rôle Requis**: ADMIN

**Request Body**:
```json
{
  "nom": "Petite Section",
  "capacite": 15,
  "trancheAge": "2-3 ans",
  "active": true
}
```

**Success (201)**:
```json
{
  "id": "cls_123",
  "nom": "Petite Section",
  "capacite": 15,
  "trancheAge": "2-3 ans",
  "active": true,
  "creeLe": "2025-11-01T10:00:00Z"
}
```

**Errors**:
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### GET /api/admin/classes
**Lister toutes les classes**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
[
  {
    "id": "cls_123",
    "nom": "Petite Section",
    "capacite": 15,
    "trancheAge": "2-3 ans",
    "active": true
  }
]
```

**Errors**:
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### GET /api/admin/classes/:id
**Obtenir une classe**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "id": "cls_123",
  "nom": "Petite Section",
  "capacite": 15,
  "trancheAge": "2-3 ans",
  "active": true,
  "enseignants": [
    {
      "id": "ens_1",
      "utilisateur": {
        "prenom": "Ahmed",
        "nom": "Dupont"
      }
    }
  ]
}
```

**Errors**:
- `404`: Classe non trouvée
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### PATCH /api/admin/classes/:id
**Modifier une classe**

**Rôle Requis**: ADMIN

**Request Body**:
```json
{
  "nom": "Petite Section A",
  "capacite": 20
}
```

**Success (200)**:
```json
{
  "id": "cls_123",
  "nom": "Petite Section A",
  "capacite": 20,
  "trancheAge": "2-3 ans",
  "active": true
}
```

**Errors**:
- `404`: Classe non trouvée
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### DELETE /api/admin/classes/:id
**Supprimer une classe**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "message": "Classe supprimée avec succès",
  "id": "cls_123"
}
```

**Errors**:
- `404`: Classe non trouvée
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### GET /api/admin/classes/:classeId/enfants
**Voir tous les enfants d'une classe avec statut de présence**

**Rôle Requis**: ADMIN

**Query Parameters**:
- `date`: Date pour filtrer les présences (optionnel, format: YYYY-MM-DD)

**Success (200)**:
```json
{
  "data": [
    {
      "id": "enf_1",
      "prenom": "Alice",
      "nom": "Dupont",
      "dateNaissance": "2020-05-15",
      "presenceAujourdhui": {
        "id": "pres_1",
        "date": "2025-11-09",
        "statut": "Present",
        "arriveeA": "08:30",
        "departA": "17:00"
      }
    }
  ],
  "total": 15,
  "presents": 14,
  "absents": 1
}
```

**Errors**:
- `404`: Classe non trouvée
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### POST /api/admin/classes/:classeId/enseignants/:enseignantId
**Assigner un enseignant à une classe**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "message": "Enseignant assigné à la classe avec succès",
  "enseignantId": "ens_123",
  "utilisateurId": "usr_456",
  "classeId": "cls_789",
  "classe": {
    "id": "cls_789",
    "nom": "Petite Section"
  }
}
```

**Errors**:
- `404`: Utilisateur ou classe non trouvé
- `400`: L'utilisateur n'est pas un enseignant
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### DELETE /api/admin/classes/:classeId/enseignants/:enseignantId
**Retirer un enseignant d'une classe**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "message": "Enseignant retiré de la classe avec succès"
}
```

**Errors**:
- `404`: Enseignant ou classe non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

## 📍 PRESENCES ENDPOINTS

### GET /api/presences
**Récupérer les présences**

**Rôle Requis**: ADMIN, ENSEIGNANT, PARENT

**RBAC**:
- ADMIN: Toutes les présences
- ENSEIGNANT: Présences de ses classes
- PARENT: Présences de ses enfants

**Query Parameters**:
- `enfantId`: Filtrer par enfant (optionnel)
- `classeId`: Filtrer par classe (optionnel)
- `dateMin`: Date minimum (optionnel, format: YYYY-MM-DD)
- `dateMax`: Date maximum (optionnel, format: YYYY-MM-DD)
- `statut`: Present | Absent | Justifie (optionnel)
- `page`: Numéro de page (optionnel, défaut: 1)
- `pageSize`: Nombre d'éléments par page (optionnel, défaut: 30)

**Success (200)**:
```json
{
  "data": [
    {
      "id": "pres_1",
      "date": "2025-11-09",
      "statut": "Present",
      "arriveeA": "08:30",
      "departA": "17:00",
      "enfant": {
        "id": "enf_1",
        "prenom": "Alice",
        "nom": "Dupont"
      }
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

**Errors**:
- `401`: Non authentifié
- `403`: Accès refusé

---

### POST /api/presences
**Enregistrer une présence**

**Rôle Requis**: ADMIN, ENSEIGNANT

**RBAC**:
- ADMIN: Peut enregistrer pour tous les enfants
- ENSEIGNANT: Peut enregistrer pour ses classes

**Request Body**:
```json
{
  "enfantId": "enf_1",
  "date": "2025-11-09",
  "statut": "Present",
  "arriveeA": "08:30",
  "departA": "17:00"
}
```

**Success (201)**:
```json
{
  "id": "pres_1",
  "date": "2025-11-09",
  "statut": "Present",
  "arriveeA": "08:30",
  "departA": "17:00",
  "enfantId": "enf_1"
}
```

**Errors**:
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé
- `404`: Enfant non trouvé

---

### POST /api/presences/class
**Enregistrer les présences d'une classe**

**Rôle Requis**: ADMIN, ENSEIGNANT

**Request Body**:
```json
{
  "classeId": "cls_1",
  "date": "2025-11-09",
  "presences": [
    {
      "enfantId": "enf_1",
      "statut": "Present",
      "arriveeA": "08:30",
      "departA": "17:00"
    }
  ]
}
```

**Success (201)**:
```json
{
  "message": "Présences enregistrées avec succès",
  "count": 15,
  "classeId": "cls_1",
  "date": "2025-11-09"
}
```

**Errors**:
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé
- `404`: Classe non trouvée

---

## 🍽️ MENUS ENDPOINTS

### POST /api/menus
**Créer un menu**

**Rôle Requis**: ADMIN

**Request Body**:
```json
{
  "date": "2025-11-09",
  "entree": "Soupe de légumes",
  "plat": "Poulet rôti avec riz",
  "dessert": "Yaourt nature",
  "allergenes": ["Arachides", "Gluten", "Lait"]
}
```

**Success (201)**:
```json
{
  "id": "menu_1",
  "date": "2025-11-09",
  "entree": "Soupe de légumes",
  "plat": "Poulet rôti avec riz",
  "dessert": "Yaourt nature",
  "statut": "Brouillon",
  "allergenes": ["Arachides", "Gluten", "Lait"]
}
```

**Errors**:
- `400`: Un menu existe déjà pour cette date
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### GET /api/menus
**Récupérer les menus**

**Rôle Requis**: ADMIN, ENSEIGNANT, PARENT

**RBAC**:
- ADMIN: Tous les menus
- ENSEIGNANT/PARENT: Menus publiés uniquement

**Query Parameters**:
- `date`: Filtrer par date (optionnel, format: YYYY-MM-DD)
- `statut`: Brouillon | Publie (optionnel)
- `page`: Numéro de page (optionnel, défaut: 1)
- `pageSize`: Nombre d'éléments par page (optionnel, défaut: 10)

**Success (200)**:
```json
{
  "data": [
    {
      "id": "menu_1",
      "date": "2025-11-09",
      "entree": "Soupe de légumes",
      "plat": "Poulet rôti avec riz",
      "dessert": "Yaourt nature",
      "statut": "Publie",
      "allergenes": ["Arachides", "Gluten", "Lait"]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 30,
    "hasNext": true
  }
}
```

**Errors**:
- `401`: Non authentifié

---

### GET /api/menus/today
**Récupérer le menu du jour**

**Rôle Requis**: Public

**Success (200)**:
```json
{
  "id": "menu_1",
  "date": "2025-11-09",
  "entree": "Soupe de légumes",
  "plat": "Poulet rôti avec riz",
  "dessert": "Yaourt nature",
  "statut": "Publie"
}
```

**Errors**:
- `404`: Aucun menu pour aujourd'hui

---

### GET /api/menus/:id
**Obtenir un menu**

**Rôle Requis**: ADMIN, ENSEIGNANT, PARENT

**Success (200)**:
```json
{
  "id": "menu_1",
  "date": "2025-11-09",
  "entree": "Soupe de légumes",
  "plat": "Poulet rôti avec riz",
  "dessert": "Yaourt nature",
  "statut": "Publie",
  "allergenes": ["Arachides", "Gluten", "Lait"]
}
```

**Errors**:
- `404`: Menu non trouvé
- `401`: Non authentifié

---

### PATCH /api/menus/:id
**Modifier un menu**

**Rôle Requis**: ADMIN

**Request Body**:
```json
{
  "entree": "Soupe de tomates",
  "plat": "Poulet rôti avec légumes"
}
```

**Success (200)**:
```json
{
  "id": "menu_1",
  "date": "2025-11-09",
  "entree": "Soupe de tomates",
  "plat": "Poulet rôti avec légumes",
  "dessert": "Yaourt nature",
  "statut": "Brouillon"
}
```

**Errors**:
- `404`: Menu non trouvé
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### POST /api/menus/:id/publish
**Publier un menu**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "id": "menu_1",
  "date": "2025-11-09",
  "statut": "Publie",
  "publieLe": "2025-11-09T08:00:00Z"
}
```

**Errors**:
- `404`: Menu non trouvé
- `400`: Menu déjà publié
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

### DELETE /api/menus/:id
**Supprimer un menu**

**Rôle Requis**: ADMIN

**Success (200)**:
```json
{
  "message": "Menu supprimé avec succès",
  "id": "menu_1"
}
```

**Errors**:
- `404`: Menu non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (ADMIN requis)

---

## 📝 DAILY-RESUMES ENDPOINTS

### POST /api/daily-resumes
**Créer un résumé quotidien**

**Rôle Requis**: ADMIN, ENSEIGNANT

**Request Body**:
```json
{
  "enfantId": "enf_1",
  "date": "2025-11-09",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "activites": "Jeux libres, peinture, chansons",
  "observations": "Très actif et joyeux"
}
```

**Success (201)**:
```json
{
  "id": "resume_1",
  "enfantId": "enf_1",
  "date": "2025-11-09",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "activites": "Jeux libres, peinture, chansons",
  "observations": "Très actif et joyeux",
  "statut": "Brouillon"
}
```

**Errors**:
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé
- `404`: Enfant non trouvé

---

### GET /api/daily-resumes
**Récupérer les résumés quotidiens**

**Rôle Requis**: ADMIN, ENSEIGNANT, PARENT

**RBAC**:
- ADMIN: Tous les résumés
- ENSEIGNANT: Résumés de ses classes
- PARENT: Résumés de ses enfants

**Query Parameters**:
- `enfantId`: Filtrer par enfant (optionnel)
- `classeId`: Filtrer par classe (optionnel)
- `dateMin`: Date minimum (optionnel, format: YYYY-MM-DD)
- `dateMax`: Date maximum (optionnel, format: YYYY-MM-DD)
- `statut`: Brouillon | Publie (optionnel)
- `page`: Numéro de page (optionnel, défaut: 1)
- `pageSize`: Nombre d'éléments par page (optionnel, défaut: 30)

**Success (200)**:
```json
{
  "data": [
    {
      "id": "resume_1",
      "enfantId": "enf_1",
      "date": "2025-11-09",
      "humeur": "Excellent",
      "statut": "Publie",
      "enfant": {
        "prenom": "Alice",
        "nom": "Dupont"
      }
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

**Errors**:
- `401`: Non authentifié
- `403`: Accès refusé

---

### GET /api/daily-resumes/:id
**Obtenir un résumé quotidien**

**Rôle Requis**: ADMIN, ENSEIGNANT, PARENT

**Success (200)**:
```json
{
  "id": "resume_1",
  "enfantId": "enf_1",
  "date": "2025-11-09",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "activites": "Jeux libres, peinture, chansons",
  "observations": "Très actif et joyeux",
  "statut": "Publie"
}
```

**Errors**:
- `404`: Résumé non trouvé
- `401`: Non authentifié
- `403`: Accès refusé

---

### PATCH /api/daily-resumes/:id
**Modifier un résumé quotidien**

**Rôle Requis**: ADMIN, ENSEIGNANT

**Request Body**:
```json
{
  "humeur": "Très bon",
  "observations": "Enfant très actif"
}
```

**Success (200)**:
```json
{
  "id": "resume_1",
  "enfantId": "enf_1",
  "date": "2025-11-09",
  "humeur": "Très bon",
  "observations": "Enfant très actif",
  "statut": "Brouillon"
}
```

**Errors**:
- `404`: Résumé non trouvé
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé

---

### POST /api/daily-resumes/:id/publish
**Publier un résumé quotidien**

**Rôle Requis**: ADMIN, ENSEIGNANT

**Success (200)**:
```json
{
  "id": "resume_1",
  "enfantId": "enf_1",
  "date": "2025-11-09",
  "statut": "Publie",
  "publieLe": "2025-11-09T17:00:00Z"
}
```

**Errors**:
- `404`: Résumé non trouvé
- `400`: Résumé déjà publié
- `401`: Non authentifié
- `403`: Accès refusé

---

### DELETE /api/daily-resumes/:id
**Supprimer un résumé quotidien**

**Rôle Requis**: ADMIN, ENSEIGNANT

**Success (200)**:
```json
{
  "message": "Résumé supprimé avec succès",
  "id": "resume_1"
}
```

**Errors**:
- `404`: Résumé non trouvé
- `401`: Non authentifié
- `403`: Accès refusé

---

## 👨‍👩‍👧 PARENT ENDPOINTS

### GET /api/parent/me
**Récupérer mon profil**

**Rôle Requis**: PARENT

**Success (200)**:
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

**Errors**:
- `401`: Non authentifié
- `403`: Accès refusé (PARENT requis)

---

### PATCH /api/parent/me
**Modifier mon profil**

**Rôle Requis**: PARENT

**Request Body**:
```json
{
  "telephone": "06 98 76 54 32",
  "adresse": "Rue Nouvelle, Marrakech"
}
```

**Success (200)**:
```json
{
  "id": "tuteur_123",
  "prenom": "Jean",
  "nom": "Dupont",
  "telephone": "06 98 76 54 32",
  "adresse": "Rue Nouvelle, Marrakech"
}
```

**Errors**:
- `400`: Données invalides
- `401`: Non authentifié
- `403`: Accès refusé (PARENT requis)

---

### GET /api/parent/enfants/:enfantId/presences
**Récupérer les présences de mon enfant**

**Rôle Requis**: PARENT

**Query Parameters**:
- `dateMin`: Date minimum (optionnel, format: YYYY-MM-DD)
- `dateMax`: Date maximum (optionnel, format: YYYY-MM-DD)
- `page`: Numéro de page (optionnel, défaut: 1)
- `pageSize`: Nombre d'éléments par page (optionnel, défaut: 30)

**Success (200)**:
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

**Errors**:
- `404`: Enfant non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (PARENT requis)

---

### GET /api/parent/classes/:classeId/menu
**Récupérer le menu du jour d'une classe**

**Rôle Requis**: PARENT

**Query Parameters**:
- `date`: Date du menu (optionnel, format: YYYY-MM-DD, défaut: aujourd'hui)

**Success (200)**:
```json
{
  "id": "menu_1",
  "date": "2025-11-09",
  "petit_dejeuner": "Lait, pain, beurre",
  "collation_matin": "Fruit",
  "dejeuner": "Poulet, riz, légumes",
  "collation_apres_midi": "Yaourt",
  "gouter": "Gâteau, jus",
  "notes": "Aucune allergie",
  "publieLe": "2025-11-09T08:00:00Z"
}
```

**Errors**:
- `404`: Menu non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (PARENT requis)

---

### GET /api/parent/enfants/:enfantId/resume
**Récupérer le résumé quotidien de mon enfant**

**Rôle Requis**: PARENT

**Query Parameters**:
- `date`: Date du résumé (optionnel, format: YYYY-MM-DD, défaut: aujourd'hui)

**Success (200)**:
```json
{
  "id": "resume_1",
  "date": "2025-11-09",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "activites": "Jeux libres, peinture, chansons",
  "observations": "Très actif et joyeux",
  "publieLe": "2025-11-09T17:00:00Z"
}
```

**Errors**:
- `404`: Résumé non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (PARENT requis)

---

### GET /api/parent/classes/:classeId/journal/latest
**Récupérer le dernier résumé publié de la classe**

**Rôle Requis**: PARENT

**Success (200)**:
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

**Errors**:
- `404`: Résumé non trouvé
- `401`: Non authentifié
- `403`: Accès refusé (PARENT requis)

---

### GET /api/parent/events
**Récupérer mes événements**

**Rôle Requis**: PARENT

**Query Parameters**:
- `page`: Numéro de page (optionnel, défaut: 1)
- `pageSize`: Nombre d'éléments par page (optionnel, défaut: 20)

**Success (200)**:
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

**Errors**:
- `401`: Non authentifié
- `403`: Accès refusé (PARENT requis)

---

## 🔗 Utilisation avec Swagger

Pour utiliser cette documentation avec Swagger:

1. Copier le contenu de `SWAGGER_COMPLETE_CONFIG.ts`
2. Remplacer la configuration Swagger dans `src/main.ts`
3. Redémarrer le serveur
4. Accéder à http://localhost:3000/api/docs

---

## 📞 Support

- **Documentation**: Voir les fichiers `.md` dans le projet
- **Postman**: Importer `Creche-Admin-API.postman_collection.json`
- **API Docs**: http://localhost:3000/api/docs
- **GitHub**: github.com:wlw-tech/creche-saas.git

---

**Dernière mise à jour**: 2025-11-10

