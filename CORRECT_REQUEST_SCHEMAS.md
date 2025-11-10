# ✅ SCHÉMAS DE REQUÊTE CORRECTS

## 🔴 Erreurs Identifiées et Corrections

### Erreur 1: "property niveau should not exist"

**Problème**: Vous envoyez `niveau` mais le DTO n'accepte pas ce champ.

**Schéma INCORRECT**:
```json
{
  "nom": "Petite Section",
  "niveau": "PS",
  "capacite": 20
}
```

**Schéma CORRECT**:
```json
{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20
}
```

**Champs disponibles**:
- `nom` (requis) - Nom de la classe
- `trancheAge` (optionnel) - Tranche d'âge (ex: "PS", "MS", "GS")
- `capacite` (optionnel) - Capacité maximale (1-100)
- `active` (optionnel) - Actif ou non (true/false)

---

## 🔐 AUTHENTIFICATION

### POST /api/auth/login - Login Admin

**Schéma CORRECT**:
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

**Réponse (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

**Erreurs possibles**:
- 400: Email ou mot de passe incorrect
- 401: Non authentifié

---

### POST /api/auth/login-user - Login Utilisateur

**Schéma CORRECT**:
```json
{
  "email": "user@example.com",
  "password": "temporary_password"
}
```

**Réponse (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "usr_123",
  "role": "ENSEIGNANT",
  "email": "user@example.com"
}
```

---

### POST /api/auth/change-password

**Schéma CORRECT**:
```json
{
  "oldPassword": "change_me",
  "newPassword": "new_password_123"
}
```

**Header requis**:
```
Authorization: Bearer YOUR_TOKEN
```

---

## 👥 ADMIN - UTILISATEURS

### POST /api/admin/users - Créer Utilisateur

**Schéma CORRECT**:
```json
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```

**Champs**:
- `email` (requis) - Email unique
- `prenom` (requis) - Prénom
- `nom` (requis) - Nom
- `telephone` (optionnel) - Téléphone
- `role` (requis) - ADMIN, ENSEIGNANT, ou PARENT

**Réponse (201 Created)**:
```json
{
  "utilisateurId": "usr_123",
  "email": "prof@example.com",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "invited": true,
  "emailSent": true
}
```

**Erreurs possibles**:
- 400: Email déjà utilisé
- 403: Rôle insuffisant (ADMIN requis)

---

### POST /api/admin/users/teachers/invite - Inviter Enseignant

**Schéma CORRECT**:
```json
{
  "email": "teacher@example.com",
  "prenom": "Fatima",
  "nom": "Martin"
}
```

**Réponse (201 Created)**:
```json
{
  "utilisateurId": "usr_456",
  "email": "teacher@example.com",
  "statut": "INVITED",
  "invited": true
}
```

---

### GET /api/admin/users - Lister Utilisateurs

**Query Parameters**:
```
?role=ENSEIGNANT&statut=ACTIVE&q=Ahmed&page=1&limit=10
```

**Paramètres**:
- `role` (optionnel) - ADMIN, ENSEIGNANT, PARENT
- `statut` (optionnel) - INVITED, ACTIVE, DISABLED
- `q` (optionnel) - Recherche par email/prénom/nom
- `page` (optionnel) - Numéro de page (défaut: 1)
- `limit` (optionnel) - Nombre par page (défaut: 10)

**Réponse (200 OK)**:
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
    "total": 1,
    "pages": 1
  }
}
```

---

### PATCH /api/admin/users/:id/status - Changer Statut

**Schéma CORRECT**:
```json
{
  "statut": "ACTIVE"
}
```

**Statuts valides**: INVITED, ACTIVE, DISABLED

---

### POST /api/admin/users/teachers/:utilisateurId/assign-class - Assigner Classe

**Schéma CORRECT**:
```json
{
  "classeId": "cls_456"
}
```

**Réponse (200 OK)**:
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

**Erreurs possibles**:
- 400: L'utilisateur n'est pas un enseignant
- 403: Utilisateur non trouvé
- 404: Classe non trouvée

---

## 📚 ADMIN - CLASSES

### POST /api/admin/classes - Créer Classe

**Schéma CORRECT**:
```json
{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```

**Champs**:
- `nom` (requis) - Nom de la classe
- `trancheAge` (optionnel) - Tranche d'âge (PS, MS, GS, etc.)
- `capacite` (optionnel) - Capacité (1-100)
- `active` (optionnel) - Actif (true/false)

**Réponse (201 Created)**:
```json
{
  "id": "cls_123",
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true,
  "creeLe": "2025-11-10T12:00:00Z"
}
```

---

### GET /api/admin/classes/:id - Détails Classe (avec enfants)

**Réponse (200 OK)**:
```json
{
  "id": "cls_123",
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true,
  "enfants": [
    {
      "id": "enf_1",
      "prenom": "Liam",
      "nom": "Martin",
      "dateNaissance": "2022-01-15",
      "presence": "PRESENT"
    },
    {
      "id": "enf_2",
      "prenom": "Emma",
      "nom": "Dupont",
      "dateNaissance": "2022-03-20",
      "presence": "ABSENT"
    }
  ]
}
```

---

### PATCH /api/admin/classes/:id - Modifier Classe

**Schéma CORRECT**:
```json
{
  "nom": "Petite Section A",
  "trancheAge": "PS",
  "capacite": 22,
  "active": true
}
```

---

### GET /api/admin/classes/:classeId/enfants - Enfants de la Classe

**Réponse (200 OK)**:
```json
{
  "classeId": "cls_123",
  "nom": "Petite Section",
  "enfants": [
    {
      "id": "enf_1",
      "prenom": "Liam",
      "nom": "Martin",
      "dateNaissance": "2022-01-15",
      "presence": "PRESENT"
    }
  ]
}
```

---

### POST /api/admin/classes/:classeId/enseignants/:enseignantId - Assigner Enseignant

**Pas de body requis**

**Réponse (200 OK)**:
```json
{
  "message": "Enseignant assigné à la classe avec succès",
  "classeId": "cls_123",
  "enseignantId": "ens_456"
}
```

---

## 🍽️ MENUS

### POST /api/menus - Créer Menu

**Schéma CORRECT**:
```json
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides", "Gluten"]
}
```

**Champs**:
- `date` (requis) - Format: YYYY-MM-DD
- `entree` (optionnel) - Entrée
- `plat` (optionnel) - Plat principal
- `dessert` (optionnel) - Dessert
- `allergenes` (optionnel) - Array d'allergènes

**Réponse (201 Created)**:
```json
{
  "id": "menu_123",
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "statut": "Brouillon",
  "allergenes": ["Arachides", "Gluten"],
  "creeLe": "2025-11-10T12:00:00Z"
}
```

**Erreurs possibles**:
- 400: Un menu existe déjà pour cette date
- 401: Non authentifié
- 403: Rôle insuffisant (ADMIN requis)

---

### GET /api/menus - Lister Menus

**Query Parameters**:
```
?date=2025-11-10&statut=Publie&page=1&pageSize=10
```

**Paramètres**:
- `date` (optionnel) - Format: YYYY-MM-DD
- `dateMin` (optionnel) - Date de début
- `dateMax` (optionnel) - Date de fin
- `statut` (optionnel) - Brouillon, Publie
- `page` (optionnel) - Numéro de page
- `pageSize` (optionnel) - Nombre par page

---

### PATCH /api/menus/:id - Modifier Menu

**Schéma CORRECT**:
```json
{
  "entree": "Soupe",
  "plat": "Poulet frites",
  "dessert": "Yaourt",
  "allergenes": ["Arachides", "Gluten", "Lait"]
}
```

---

### POST /api/menus/:id/publish - Publier Menu

**Pas de body requis**

**Réponse (200 OK)**:
```json
{
  "id": "menu_123",
  "date": "2025-11-10",
  "statut": "Publie",
  "publieLe": "2025-11-10T14:00:00Z"
}
```

---

## 📍 PRÉSENCES

### POST /api/presences - Créer Présence

**Schéma CORRECT**:
```json
{
  "enfantId": "enf_123",
  "date": "2025-11-10",
  "statut": "Present"
}
```

**Statuts valides**: Present, Absent, Justifie

---

### POST /api/presences/class - Présences par Classe

**Schéma CORRECT**:
```json
{
  "classeId": "cls_123",
  "date": "2025-11-10",
  "presences": [
    {
      "enfantId": "enf_1",
      "statut": "Present"
    },
    {
      "enfantId": "enf_2",
      "statut": "Absent"
    }
  ]
}
```

---

## 📝 RÉSUMÉS QUOTIDIENS

### POST /api/daily-resumes - Créer Résumé

**Schéma CORRECT**:
```json
{
  "enfantId": "enf_123",
  "date": "2025-11-10",
  "humeur": "Bon",
  "appetit": "Bon",
  "qualiteSieste": "Bon",
  "participation": "Active",
  "activites": "Jeux, dessin, lecture",
  "observations": "Enfant très actif aujourd'hui"
}
```

**Énums valides**:
- `humeur`: Excellent, Bon, Moyen, Difficile
- `appetit`: Excellent, Bon, Moyen, Faible, Refus
- `qualiteSieste`: Excellent, Bon, Moyen, Difficile
- `participation`: Active, Passive, Absente

---

## 👨‍👩‍👧 PARENT

### GET /api/parent/me - Profil Parent

**Header requis**:
```
Authorization: Bearer YOUR_TOKEN
```

**Réponse (200 OK)**:
```json
{
  "id": "parent_123",
  "email": "parent@example.com",
  "prenom": "Marie",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "adresse": "123 Rue de la Paix"
}
```

---

### PATCH /api/parent/me - Modifier Profil

**Schéma CORRECT**:
```json
{
  "telephone": "+212612345678",
  "adresse": "123 Rue de la Paix"
}
```

---

## ✅ CHECKLIST DE VALIDATION

- [ ] Classe: Utiliser `trancheAge` au lieu de `niveau`
- [ ] Menu: Utiliser `date` au format YYYY-MM-DD
- [ ] Utilisateur: Vérifier que l'email n'existe pas
- [ ] Token: Vérifier qu'il est valide et non expiré
- [ ] Rôle: Vérifier que vous êtes ADMIN pour les endpoints admin
- [ ] ID: Vérifier que l'ID existe dans la base de données

---

## 🚀 Prochaines Étapes

1. ✅ Utiliser les schémas corrects
2. ✅ Tester avec Postman
3. ✅ Consulter Swagger: http://localhost:3000/api/docs
4. ✅ Consulter TROUBLESHOOTING_GUIDE.md en cas d'erreur

**Prêt pour les tests!** 🚀

