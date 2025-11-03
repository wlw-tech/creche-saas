# 📚 GUIDE COMPLET - ADMIN CRUD

## 🎯 OBJECTIF

Ce guide vous montre comment:
- ✅ Se connecter en tant qu'ADMIN
- ✅ Créer des enseignants
- ✅ Créer des parents
- ✅ Lister les utilisateurs
- ✅ Filtrer par rôle
- ✅ Obtenir un utilisateur
- ✅ Modifier le statut
- ✅ Supprimer un utilisateur

---

## 🔧 PRÉREQUIS

1. **Serveur en cours d'exécution:**
   ```
   http://localhost:3000
   ```

2. **Postman installé** (ou tout autre client HTTP)

3. **Admin user créé dans la base de données:**
   - Email: `admin@wlw.ma`
   - Mot de passe: `change_me`
   - Rôle: `ADMIN`
   - Statut: `ACTIVE`

---

## 📋 ÉTAPES DE TEST

### ÉTAPE 1: IMPORTER LA COLLECTION POSTMAN

1. Ouvrez **Postman**
2. Cliquez sur **Import**
3. Sélectionnez le fichier `POSTMAN_ADMIN_CRUD_FIXED.json`
4. Cliquez sur **Import**

---

### ÉTAPE 2: CONFIGURER LES VARIABLES

1. Allez dans **Environments** (en haut à droite)
2. Créez un nouvel environnement ou modifiez l'existant
3. Définissez les variables:

| Variable | Valeur |
|----------|--------|
| `base_url` | `http://localhost:3000` |
| `accessToken` | (vide pour maintenant) |
| `userId` | (vide pour maintenant) |

---

### ÉTAPE 3: LOGIN ADMIN

**Requête:** `1️⃣ LOGIN - Connexion Admin`

1. Cliquez sur la requête
2. Cliquez sur **Send**
3. Vous devriez recevoir:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

**⚠️ IMPORTANT:** Copiez le `accessToken` et collez-le dans la variable `accessToken` de Postman!

---

### ÉTAPE 4: CRÉER UN ENSEIGNANT

**Requête:** `2️⃣ CREATE - Créer Enseignant`

1. Cliquez sur la requête
2. Vérifiez le **Body:**
   ```json
   {
     "email": "teacher1@wlw.ma",
     "prenom": "Ahmed",
     "nom": "Bennani",
     "role": "ENSEIGNANT",
     "telephone": "+212612345678"
   }
   ```
3. Cliquez sur **Send**
4. Vous devriez recevoir (201):
   ```json
   {
     "utilisateurId": "usr_123",
     "email": "teacher1@wlw.ma",
     "role": "ENSEIGNANT",
     "statut": "INVITED",
     "invited": true
   }
   ```

**💾 SAUVEGARDEZ l'`utilisateurId` pour les prochaines étapes!**

---

### ÉTAPE 5: CRÉER UN PARENT

**Requête:** `3️⃣ CREATE - Créer Parent`

1. Cliquez sur la requête
2. Vérifiez le **Body:**
   ```json
   {
     "email": "parent1@wlw.ma",
     "prenom": "Fatima",
     "nom": "Alaoui",
     "role": "PARENT",
     "telephone": "+212612345679"
   }
   ```
3. Cliquez sur **Send**
4. Vous devriez recevoir (201):
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

### ÉTAPE 6: LISTER TOUS LES UTILISATEURS

**Requête:** `4️⃣ READ - Lister tous les utilisateurs`

1. Cliquez sur la requête
2. Cliquez sur **Send**
3. Vous devriez recevoir (200):
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

### ÉTAPE 7: FILTRER PAR RÔLE

**Lister enseignants:**
- Requête: `5️⃣ READ - Lister enseignants`
- Cliquez sur **Send**

**Lister parents:**
- Requête: `6️⃣ READ - Lister parents`
- Cliquez sur **Send**

---

### ÉTAPE 8: OBTENIR UN UTILISATEUR

**Requête:** `7️⃣ READ - Obtenir utilisateur par ID`

1. Définissez la variable `userId` avec l'ID d'un utilisateur (ex: `usr_123`)
2. Cliquez sur **Send**
3. Vous devriez recevoir (200):
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

### ÉTAPE 9: MODIFIER LE STATUT

**Activer un utilisateur:**
- Requête: `8️⃣ UPDATE - Activer utilisateur`
- Définissez `userId`
- Cliquez sur **Send**
- Réponse (200):
  ```json
  {
    "id": "usr_123",
    "email": "teacher1@wlw.ma",
    "statut": "ACTIVE",
    "activeLe": "2025-11-03T19:45:00.000Z"
  }
  ```

**Désactiver un utilisateur:**
- Requête: `9️⃣ UPDATE - Désactiver utilisateur`
- Définissez `userId`
- Cliquez sur **Send**

---

### ÉTAPE 10: SUPPRIMER UN UTILISATEUR

**Requête:** `🔟 DELETE - Supprimer utilisateur`

1. Définissez `userId`
2. Cliquez sur **Send**
3. Vous devriez recevoir (200):
   ```json
   {
     "message": "Utilisateur supprimé avec succès",
     "id": "usr_123"
   }
   ```

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

## 🐛 DÉPANNAGE

### Erreur: "Utilisateur non trouvé" (403)

**Cause:** L'utilisateur ADMIN n'existe pas dans la base de données.

**Solution:**
```bash
cd creche-api
node create-admin.js
```

---

### Erreur: "Token invalide" (401)

**Cause:** Le token JWT a expiré ou est invalide.

**Solution:** Reconnectez-vous avec le login admin.

---

### Erreur: "Email déjà utilisé" (400)

**Cause:** L'email existe déjà dans la base de données.

**Solution:** Utilisez un email différent.

---

## 📞 SUPPORT

Si vous avez des questions, consultez:
- `TEST_RAPIDE.md` - Guide rapide
- `GUIDE_ADMIN_COMPLET.md` - Guide détaillé
- Swagger: `http://localhost:3000/docs`

---

**🎉 VOUS ÊTES PRÊT À TESTER!**

