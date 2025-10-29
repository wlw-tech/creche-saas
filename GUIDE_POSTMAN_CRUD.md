# 🚀 GUIDE POSTMAN - CRUD COMPLET

## 📥 IMPORTER LA COLLECTION

1. **Ouvrir Postman**
2. **Cliquer sur "Import"** (en haut à gauche)
3. **Sélectionner le fichier:** `POSTMAN_COLLECTION_CRUD.json`
4. **Cliquer "Import"**

---

## ⚙️ CONFIGURER L'ENVIRONMENT

### Créer une Environment

1. **Cliquer sur "Environments"** (à gauche)
2. **Cliquer sur "+"** pour créer une nouvelle environment
3. **Nommer:** `Crèche API - DEV`
4. **Ajouter les variables:**

| Variable | Valeur | Type |
|----------|--------|------|
| `base_url` | `http://localhost:3000/api` | string |
| `accessToken` | (vide pour maintenant) | string |
| `userId` | (vide pour maintenant) | string |

5. **Cliquer "Save"**

### Sélectionner l'Environment

- **En haut à droite**, sélectionner `Crèche API - DEV` dans le dropdown

---

## 🔄 WORKFLOW COMPLET - ÉTAPE PAR ÉTAPE

### ✅ ÉTAPE 1: LOGIN ADMIN

**Requête:** `1. AUTH - Login Admin`

1. **Cliquer sur la requête**
2. **Cliquer "Send"**
3. **Copier le token** de la réponse
4. **Coller dans la variable** `accessToken` de l'environment

**Réponse attendue:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

---

### ✅ ÉTAPE 2: CRÉER UN ENSEIGNANT

**Requête:** `2. CREATE - Inviter Enseignant`

1. **Cliquer sur la requête**
2. **Modifier le body** (optionnel):
   ```json
   {
     "email": "teacher1@wlw.ma",
     "prenom": "Ahmed",
     "nom": "Bennani",
     "telephone": "+212612345678"
   }
   ```
3. **Cliquer "Send"**
4. **Copier l'ID** de la réponse
5. **Coller dans la variable** `userId` de l'environment

**Réponse attendue:**
```json
{
  "utilisateurId": "usr_123abc",
  "email": "teacher1@wlw.ma",
  "statut": "INVITED",
  "invited": true
}
```

---

### ✅ ÉTAPE 3: LISTER TOUS LES UTILISATEURS

**Requête:** `3. READ ALL - Lister Utilisateurs`

1. **Cliquer sur la requête**
2. **Optionnel - Ajouter des filtres:**
   - `role=ENSEIGNANT` (filtrer par rôle)
   - `statut=INVITED` (filtrer par statut)
   - `q=Ahmed` (rechercher par nom/email)
3. **Cliquer "Send"**

**Réponse attendue:**
```json
{
  "data": [
    {
      "id": "usr_123abc",
      "email": "teacher1@wlw.ma",
      "prenom": "Ahmed",
      "nom": "Bennani",
      "role": "ENSEIGNANT",
      "statut": "INVITED"
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

### ✅ ÉTAPE 4: OBTENIR UN UTILISATEUR

**Requête:** `4. READ ONE - Obtenir Utilisateur`

1. **Cliquer sur la requête**
2. **La variable `{{userId}}` est automatiquement remplacée**
3. **Cliquer "Send"**

**Réponse attendue:**
```json
{
  "id": "usr_123abc",
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}
```

---

### ✅ ÉTAPE 5: MODIFIER LE STATUT

**Requête:** `5. UPDATE - Modifier Statut`

1. **Cliquer sur la requête**
2. **Modifier le body** (optionnel):
   ```json
   {
     "statut": "ACTIVE"
   }
   ```
   **Statuts possibles:** `INVITED`, `ACTIVE`, `DISABLED`
3. **Cliquer "Send"**

**Réponse attendue:**
```json
{
  "id": "usr_123abc",
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "statut": "ACTIVE"
}
```

---

### ✅ ÉTAPE 6: SUPPRIMER UN UTILISATEUR

**Requête:** `6. DELETE - Supprimer Utilisateur`

1. **Cliquer sur la requête**
2. **La variable `{{userId}}` est automatiquement remplacée**
3. **Cliquer "Send"**

**Réponse attendue:**
```json
{
  "message": "Utilisateur supprimé avec succès",
  "id": "usr_123abc"
}
```

---

## 🧪 TESTS D'ERREURS

### ❌ Test 1: Sans Token
- **Supprimer le header** `Authorization`
- **Status attendu:** 401
- **Message:** `Unauthorized`

### ❌ Test 2: Token Invalide
- **Modifier le token** dans le header
- **Status attendu:** 401
- **Message:** `Token invalide ou expiré`

### ❌ Test 3: Utilisateur Non Trouvé
- **Modifier l'ID** dans l'URL
- **Status attendu:** 404
- **Message:** `Utilisateur non trouvé`

### ❌ Test 4: Email Invalide
- **Modifier le body** avec un email invalide
- **Status attendu:** 400
- **Message:** `Email invalide`

---

## 📝 RÉSUMÉ DES ENDPOINTS

| # | Endpoint | Méthode | Description |
|---|----------|---------|-------------|
| 1 | `/auth/login` | POST | Login admin |
| 2 | `/admin/users/teachers/invite` | POST | Créer enseignant |
| 3 | `/admin/users` | GET | Lister utilisateurs |
| 4 | `/admin/users/:id` | GET | Obtenir utilisateur |
| 5 | `/admin/users/:id/status` | PATCH | Modifier statut |
| 6 | `/admin/users/:id` | DELETE | Supprimer utilisateur |

---

## ✅ CHECKLIST

- [ ] Collection importée
- [ ] Environment créée
- [ ] Login réussi
- [ ] Token copié
- [ ] Enseignant créé
- [ ] Utilisateurs listés
- [ ] Utilisateur obtenu
- [ ] Statut modifié
- [ ] Utilisateur supprimé
- [ ] Tests d'erreurs passés

---

**🎉 Tous les endpoints testés avec succès!**

