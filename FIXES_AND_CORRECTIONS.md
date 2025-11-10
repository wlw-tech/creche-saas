# 🔧 CORRECTIONS ET FIXES - ERREURS RÉSOLUES

## ✅ Erreurs Identifiées et Corrigées

### ❌ Erreur 1: "property niveau should not exist"

**Problème**: Vous envoyiez `niveau` mais le DTO n'accepte pas ce champ.

**Cause**: Le DTO utilise `trancheAge` au lieu de `niveau`.

**Avant (INCORRECT)**:
```json
POST /api/admin/classes
{
  "nom": "Petite Section",
  "niveau": "PS",
  "capacite": 20
}
```

**Après (CORRECT)**:
```json
POST /api/admin/classes
{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```

**Champs disponibles**:
- `nom` (requis) - Nom de la classe
- `trancheAge` (optionnel) - Tranche d'âge (PS, MS, GS, etc.)
- `capacite` (optionnel) - Capacité maximale (1-100)
- `active` (optionnel) - Actif ou non (true/false)

**Fichiers mis à jour**:
- ✅ `Creche-API-Complete.postman_collection.json` - Collection Postman
- ✅ `CORRECT_REQUEST_SCHEMAS.md` - Schémas corrects

---

### ❌ Erreur 2: "Utilisateur non trouvé" (403 Forbidden)

**Problème**: Vous essayez d'accéder à un utilisateur qui n'existe pas.

**Cause**: L'utilisateur n'a pas été créé ou l'ID est incorrect.

**Solution - Workflow Correct**:

#### Étape 1: Créer l'utilisateur
```bash
POST /api/admin/users
Header: Authorization: Bearer {{admin_token}}
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT"
}

# Réponse:
{
  "utilisateurId": "usr_123",
  "email": "prof@example.com",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}
```

#### Étape 2: Copier l'ID retourné
- Copier: `usr_123`

#### Étape 3: Utiliser cet ID pour les autres opérations
```bash
POST /api/admin/users/teachers/usr_123/assign-class
Header: Authorization: Bearer {{admin_token}}
{
  "classeId": "cls_456"
}
```

**Checklist**:
- [ ] L'utilisateur existe dans la base de données
- [ ] L'ID est correct (copié exactement)
- [ ] Vous êtes authentifié (token valide)
- [ ] Vous êtes ADMIN

---

### ❌ Erreur 3: Créer Menu - Erreur d'authentification

**Problème**: Vous recevez une erreur 403 ou 401 en créant un menu.

**Cause**: Token manquant, invalide ou expiré.

**Solution - Workflow Correct**:

#### Étape 1: Se connecter
```bash
POST /api/auth/login
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}

# Réponse:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

#### Étape 2: Copier le token
- Copier: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Étape 3: Ajouter le token dans le header
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Étape 4: Créer le menu
```bash
POST /api/menus
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"]
}

# Réponse:
{
  "id": "menu_123",
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "statut": "Brouillon",
  "allergenes": ["Arachides"]
}
```

**Checklist**:
- [ ] Token copié correctement
- [ ] Header `Authorization: Bearer TOKEN` présent
- [ ] Token non expiré (24h)
- [ ] Vous êtes ADMIN

---

## 📊 Schémas Corrects par Endpoint

### 🔐 Authentification

#### POST /api/auth/login
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

#### POST /api/auth/login-user
```json
{
  "email": "user@example.com",
  "password": "temporary_password"
}
```

---

### 👥 Admin/Users

#### POST /api/admin/users
```json
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```

#### POST /api/admin/users/teachers/invite
```json
{
  "email": "teacher@example.com",
  "prenom": "Fatima",
  "nom": "Martin"
}
```

#### PATCH /api/admin/users/:id/status
```json
{
  "statut": "ACTIVE"
}
```

#### POST /api/admin/users/teachers/:utilisateurId/assign-class
```json
{
  "classeId": "cls_456"
}
```

---

### 📚 Admin/Classes

#### POST /api/admin/classes
```json
{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```

#### PATCH /api/admin/classes/:id
```json
{
  "nom": "Petite Section A",
  "trancheAge": "PS",
  "capacite": 22,
  "active": true
}
```

---

### 🍽️ Menus

#### POST /api/menus
```json
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides", "Gluten"]
}
```

#### PATCH /api/menus/:id
```json
{
  "entree": "Soupe",
  "plat": "Poulet frites",
  "dessert": "Yaourt",
  "allergenes": ["Arachides", "Gluten", "Lait"]
}
```

---

### 📍 Présences

#### POST /api/presences
```json
{
  "enfantId": "enf_123",
  "date": "2025-11-10",
  "statut": "Present"
}
```

#### POST /api/presences/class
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

### 📝 Résumés Quotidiens

#### POST /api/daily-resumes
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

---

## 📁 Fichiers Mis à Jour

- ✅ `Creche-API-Complete.postman_collection.json` - Schémas corrects
- ✅ `CORRECT_REQUEST_SCHEMAS.md` - Référence complète
- ✅ `FIXES_AND_CORRECTIONS.md` - Ce fichier

---

## 🚀 Prochaines Étapes

1. ✅ Télécharger la collection Postman mise à jour
2. ✅ Importer dans Postman
3. ✅ Utiliser les schémas corrects
4. ✅ Tester les endpoints
5. ✅ Consulter `CORRECT_REQUEST_SCHEMAS.md` pour les détails

---

## ✅ Checklist

- [ ] Classe: Utiliser `trancheAge` au lieu de `niveau`
- [ ] Utilisateur: Créer avant d'assigner à une classe
- [ ] Menu: Avoir un token valide avant de créer
- [ ] Token: Vérifier qu'il n'est pas expiré
- [ ] ID: Vérifier que la ressource existe

---

## 📞 Support

- 📖 Schémas corrects: `CORRECT_REQUEST_SCHEMAS.md`
- 📖 Troubleshooting: `TROUBLESHOOTING_GUIDE.md`
- 📖 Swagger: http://localhost:3000/api/docs
- 📮 Collection: `Creche-API-Complete.postman_collection.json`

**Prêt pour les tests!** 🚀

