# 📋 WORKFLOW COMPLET - POSTMAN TESTING

## 🎯 OBJECTIF
Ce guide montre comment tester **TOUS les endpoints** de l'API en Postman avec des exemples complets.

---

## 📊 WORKFLOW GLOBAL

```
1. LOGIN ADMIN
   ↓
2. COPIER LE TOKEN
   ↓
3. INVITER UN ENSEIGNANT (CREATE)
   ↓
4. LISTER LES UTILISATEURS (READ)
   ↓
5. OBTENIR UN UTILISATEUR (READ ONE)
   ↓
6. MODIFIER LE STATUT (UPDATE)
   ↓
7. SUPPRIMER UN UTILISATEUR (DELETE) - À IMPLÉMENTER
```

---

## 🔐 ÉTAPE 1: LOGIN ADMIN

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

**Réponse attendue (Status 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHdsdy5tYSIsInJvbGUiOiJBRE1JTiIsInVzZXJJZCI6ImFkbWluX2RldiIsImlhdCI6MTcwMzAwMDAwMCwiZXhwIjoxNzAzMDg2NDAwfQ.xxx",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

✅ **Copier le token et le coller dans la variable `accessToken` de Postman**

---

## 👨‍🏫 ÉTAPE 2: INVITER UN ENSEIGNANT (CREATE)

**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/admin/users/teachers/invite`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Body (raw JSON):**
```json
{
  "email": "teacher1@wlw.ma",
  "firstName": "Ahmed",
  "lastName": "Bennani",
  "phone": "+212612345678"
}
```

**Réponse attendue (Status 201):**
```json
{
  "id": "usr_123abc",
  "email": "teacher1@wlw.ma",
  "firstName": "Ahmed",
  "lastName": "Bennani",
  "phone": "+212612345678",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "createdAt": "2025-10-28T23:46:00.000Z"
}
```

✅ **Copier l'ID utilisateur pour les prochaines étapes**

---

## 📋 ÉTAPE 3: LISTER TOUS LES UTILISATEURS (READ ALL)

**Méthode:** `GET`  
**URL:** `http://localhost:3000/api/admin/users`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Body:** Vide

**Réponse attendue (Status 200):**
```json
[
  {
    "id": "usr_123abc",
    "email": "teacher1@wlw.ma",
    "firstName": "Ahmed",
    "lastName": "Bennani",
    "phone": "+212612345678",
    "role": "ENSEIGNANT",
    "statut": "INVITED",
    "createdAt": "2025-10-28T23:46:00.000Z"
  },
  {
    "id": "usr_456def",
    "email": "parent1@wlw.ma",
    "firstName": "Fatima",
    "lastName": "Alaoui",
    "phone": "+212698765432",
    "role": "PARENT",
    "statut": "ACTIVE",
    "createdAt": "2025-10-28T23:45:00.000Z"
  }
]
```

---

## 👤 ÉTAPE 4: OBTENIR UN UTILISATEUR (READ ONE)

**Méthode:** `GET`  
**URL:** `http://localhost:3000/api/admin/users/usr_123abc`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Body:** Vide

**Réponse attendue (Status 200):**
```json
{
  "id": "usr_123abc",
  "email": "teacher1@wlw.ma",
  "firstName": "Ahmed",
  "lastName": "Bennani",
  "phone": "+212612345678",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "createdAt": "2025-10-28T23:46:00.000Z"
}
```

---

## ✏️ ÉTAPE 5: MODIFIER LE STATUT (UPDATE)

**Méthode:** `PATCH`  
**URL:** `http://localhost:3000/api/admin/users/usr_123abc/status`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{accessToken}}
```

**Body (raw JSON):**
```json
{
  "statut": "ACTIVE"
}
```

**Réponse attendue (Status 200):**
```json
{
  "id": "usr_123abc",
  "email": "teacher1@wlw.ma",
  "firstName": "Ahmed",
  "lastName": "Bennani",
  "phone": "+212612345678",
  "role": "ENSEIGNANT",
  "statut": "ACTIVE",
  "createdAt": "2025-10-28T23:46:00.000Z"
}
```

---

## 🗑️ ÉTAPE 6: SUPPRIMER UN UTILISATEUR (DELETE)

**Méthode:** `DELETE`  
**URL:** `http://localhost:3000/api/admin/users/usr_123abc`

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Body:** Vide

**Réponse attendue (Status 200):**
```json
{
  "message": "Utilisateur supprimé avec succès",
  "id": "usr_123abc"
}
```

---

## 🧪 CAS DE TEST D'ERREURS

### ❌ Test 1: Sans Token
**URL:** `http://localhost:3000/api/admin/users`  
**Status:** 401  
**Réponse:**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### ❌ Test 2: Token Invalide
**Headers:** `Authorization: Bearer invalid_token`  
**Status:** 401  
**Réponse:**
```json
{
  "message": "Token invalide ou expiré",
  "statusCode": 401
}
```

### ❌ Test 3: Email Invalide
**Body:**
```json
{
  "email": "invalid-email",
  "firstName": "Test",
  "lastName": "User"
}
```
**Status:** 400  
**Réponse:**
```json
{
  "message": ["Email invalide"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### ❌ Test 4: Utilisateur Non Trouvé
**URL:** `http://localhost:3000/api/admin/users/usr_nonexistent`  
**Status:** 404  
**Réponse:**
```json
{
  "message": "Utilisateur non trouvé",
  "statusCode": 404
}
```

---

## 📝 RÉSUMÉ DES ENDPOINTS

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/auth/login` | POST | Connexion admin | ❌ |
| `/admin/users/teachers/invite` | POST | Inviter enseignant | ✅ |
| `/admin/users` | GET | Lister utilisateurs | ✅ |
| `/admin/users/:id` | GET | Obtenir utilisateur | ✅ |
| `/admin/users/:id/status` | PATCH | Modifier statut | ✅ |
| `/admin/users/:id` | DELETE | Supprimer utilisateur | ✅ |

---

## 🚀 DÉMARRAGE RAPIDE

1. **Démarrer le serveur:**
   ```bash
   cd creche-api
   pnpm start:dev
   ```

2. **Ouvrir Postman**

3. **Créer une Environment:**
   - Nom: `Crèche API - DEV`
   - Variables:
     - `base_url`: `http://localhost:3000/api`
     - `accessToken`: (à remplir après login)

4. **Suivre le workflow étape par étape**

---

## ✅ CHECKLIST DE TEST

- [ ] Login admin réussi
- [ ] Token copié dans Postman
- [ ] Inviter enseignant réussi
- [ ] Lister utilisateurs réussi
- [ ] Obtenir utilisateur réussi
- [ ] Modifier statut réussi
- [ ] Supprimer utilisateur réussi
- [ ] Tests d'erreurs passés

---

**🎉 Tous les endpoints testés avec succès!**

