# 📚 GUIDE COMPLET - GESTION ADMIN CRUD

## 🎯 OBJECTIF

L'**ADMIN** peut maintenant:
- ✅ **CRÉER** des comptes enseignants ET parents
- ✅ **LISTER** les utilisateurs (avec filtres)
- ✅ **OBTENIR** les détails d'un utilisateur
- ✅ **MODIFIER** le statut (ACTIVE, DISABLED, INVITED)
- ✅ **SUPPRIMER** un utilisateur

---

## 🚀 DÉMARRAGE RAPIDE

### Étape 1: Importer la Collection Postman

1. Ouvrir **Postman**
2. Cliquer sur **"Import"**
3. Sélectionner: **`POSTMAN_ADMIN_CRUD.json`**
4. Cliquer **"Import"**

### Étape 2: Configurer les Variables

Dans Postman, aller à **"Environments"** et créer/modifier:

```
base_url = http://localhost:3000
accessToken = (sera rempli après login)
userId = (sera rempli après création d'utilisateur)
```

---

## 📋 WORKFLOW COMPLET

### 1️⃣ LOGIN ADMIN

**Endpoint:** `POST /api/auth/login`

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

**⚠️ IMPORTANT:** Copier le `accessToken` et le mettre dans la variable `{{accessToken}}`

---

### 2️⃣ CRÉER UN ENSEIGNANT

**Endpoint:** `POST /api/admin/users`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "telephone": "+212612345678"
}
```

**Réponse (201):**
```json
{
  "utilisateurId": "usr_123",
  "email": "teacher1@wlw.ma",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "invited": true
}
```

**⚠️ IMPORTANT:** Copier `utilisateurId` et le mettre dans `{{userId}}`

---

### 3️⃣ CRÉER UN PARENT

**Endpoint:** `POST /api/admin/users`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "parent1@wlw.ma",
  "prenom": "Fatima",
  "nom": "Alaoui",
  "role": "PARENT",
  "telephone": "+212612345679"
}
```

**Réponse (201):**
```json
{
  "utilisateurId": "usr_456",
  "email": "parent1@wlw.ma",
  "role": "PARENT",
  "statut": "INVITED",
  "invited": true
}
```

---

### 4️⃣ LISTER TOUS LES UTILISATEURS

**Endpoint:** `GET /api/admin/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Réponse (200):**
```json
{
  "data": [
    {
      "id": "usr_123",
      "email": "teacher1@wlw.ma",
      "prenom": "Ahmed",
      "nom": "Bennani",
      "role": "ENSEIGNANT",
      "statut": "INVITED"
    },
    {
      "id": "usr_456",
      "email": "parent1@wlw.ma",
      "prenom": "Fatima",
      "nom": "Alaoui",
      "role": "PARENT",
      "statut": "INVITED"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---

### 5️⃣ FILTRER PAR RÔLE

**Lister enseignants:**
```
GET /api/admin/users?role=ENSEIGNANT&page=1&limit=10
```

**Lister parents:**
```
GET /api/admin/users?role=PARENT&page=1&limit=10
```

**Lister par statut:**
```
GET /api/admin/users?statut=ACTIVE&page=1&limit=10
```

---

### 6️⃣ OBTENIR UN UTILISATEUR

**Endpoint:** `GET /api/admin/users/{{userId}}`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Réponse (200):**
```json
{
  "id": "usr_123",
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "telephone": "+212612345678",
  "creeLe": "2025-10-29T16:10:47.000Z"
}
```

---

### 7️⃣ MODIFIER LE STATUT

**Endpoint:** `PATCH /api/admin/users/{{userId}}/status`

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Activer:**
```json
{
  "statut": "ACTIVE"
}
```

**Désactiver:**
```json
{
  "statut": "DISABLED"
}
```

**Réinviter:**
```json
{
  "statut": "INVITED"
}
```

---

### 8️⃣ SUPPRIMER UN UTILISATEUR

**Endpoint:** `DELETE /api/admin/users/{{userId}}`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Réponse (200):**
```json
{
  "message": "Utilisateur supprimé avec succès",
  "id": "usr_123"
}
```

---

## 📊 TABLEAU DES ENDPOINTS

| # | Endpoint | Méthode | Description | Auth |
|---|----------|---------|-------------|------|
| 1 | `/auth/login` | POST | Login admin | ❌ |
| 2 | `/admin/users` | POST | Créer utilisateur | ✅ |
| 3 | `/admin/users` | GET | Lister utilisateurs | ✅ |
| 4 | `/admin/users/:id` | GET | Obtenir utilisateur | ✅ |
| 5 | `/admin/users/:id/status` | PATCH | Modifier statut | ✅ |
| 6 | `/admin/users/:id` | DELETE | Supprimer utilisateur | ✅ |

---

## ✅ CHECKLIST DE TEST

- [ ] Login admin réussi
- [ ] Créer enseignant réussi
- [ ] Créer parent réussi
- [ ] Lister tous les utilisateurs
- [ ] Filtrer par rôle ENSEIGNANT
- [ ] Filtrer par rôle PARENT
- [ ] Obtenir utilisateur par ID
- [ ] Modifier statut à ACTIVE
- [ ] Modifier statut à DISABLED
- [ ] Supprimer utilisateur

---

## 🔐 SÉCURITÉ

- ✅ **JWT Authentication** - Token requis pour tous les endpoints
- ✅ **RBAC** - Seul l'ADMIN peut gérer les utilisateurs
- ✅ **Validation** - Tous les inputs validés
- ✅ **Error Handling** - Gestion complète des erreurs

---

## 🐛 DÉPANNAGE

### Erreur: "Utilisateur non trouvé"
- Vérifier que l'ID utilisateur est correct
- Vérifier que l'utilisateur existe

### Erreur: "Email déjà utilisé"
- L'email existe déjà dans la base de données
- Utiliser un email différent

### Erreur: "Unauthorized"
- Le token JWT est expiré ou invalide
- Refaire le login

### Erreur: "Forbidden"
- L'utilisateur n'a pas le rôle ADMIN
- Utiliser un compte ADMIN

---

**🎉 Prêt à tester!**

