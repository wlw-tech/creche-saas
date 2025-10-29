# 📮 Tester en Postman - Guide Simple

## 🚀 Étape 1: Importer la Collection

1. Ouvrir **Postman**
2. Cliquer **Import** (en haut à gauche)
3. Sélectionner: **`POSTMAN_AUTH_COLLECTION.json`**
4. Cliquer **Import**

✅ Collection importée!

---

## ⚙️ Étape 2: Créer une Environment

1. Cliquer **Environments** (à gauche)
2. Cliquer **+** pour créer une nouvelle
3. Nommer: **`Crèche API`**
4. Ajouter 2 variables:

| Variable | Valeur |
|----------|--------|
| `base_url` | `http://localhost:3000/api` |
| `accessToken` | *(vide pour maintenant)* |

5. Cliquer **Save**
6. Sélectionner cette environment en haut à droite

✅ Environment créée!

---

## 🔐 Étape 3: Démarrer le Serveur

```bash
cd creche-api
pnpm start:dev
```

Attendre: `Application successfully started`

✅ Serveur démarré!

---

## 🧪 Étape 4: Tester les Endpoints

### 1️⃣ Login Admin

1. Aller à: **Auth → Login Admin**
2. Vérifier le body:
   ```json
   {
     "email": "admin@wlw.ma",
     "password": "change_me"
   }
   ```
3. Cliquer **Send** 

**Réponse (Status 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

**Sauvegarder le token:**
- Copier la valeur de `accessToken`
- Aller à **Environments → Crèche API**
- Coller dans `accessToken`
- Cliquer **Save**

✅ Token sauvegardé!

---

### 2️⃣ Inviter un Enseignant

1. Aller à: **Admin - Users → Invite Teacher**
2. Vérifier le body:
   ```json
   {
     "email": "prof@wlw.ma",
     "prenom": "Ahmed",
     "nom": "Dupont",
     "telephone": "+212612345678"
   }
   ```
3. Cliquer **Send**

**Réponse (Status 201):**
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}
```

✅ Enseignant invité!

---

### 3️⃣ Lister les Utilisateurs

1. Aller à: **Admin - Users → List Users**
2. Cliquer **Send**

**Réponse (Status 200):**
```json
{
  "data": [
    {
      "utilisateurId": "uuid-xxx",
      "email": "prof@wlw.ma",
      "prenom": "Ahmed",
      "nom": "Dupont",
      "role": "ENSEIGNANT",
      "statut": "INVITED"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

✅ Utilisateurs listés!

---

### 4️⃣ Obtenir un Utilisateur

1. Aller à: **Admin - Users → Get User**
2. Remplacer `uuid-xxx` par l'ID de l'utilisateur
3. Cliquer **Send**

**Réponse (Status 200):**
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}
```

✅ Utilisateur obtenu!

---

### 5️⃣ Mettre à Jour le Statut

1. Aller à: **Admin - Users → Update Status**
2. Remplacer `uuid-xxx` par l'ID de l'utilisateur
3. Vérifier le body:
   ```json
   {
     "statut": "ACTIVE"
   }
   ```
4. Cliquer **Send**

**Réponse (Status 200):**
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "statut": "ACTIVE",
  "activeLe": "2025-10-28T15:35:00Z"
}
```

✅ Statut mis à jour!

---

### 6️⃣ Accepter une Inscription

1. Aller à: **Inscriptions → Accept Inscription**
2. Remplacer `uuid-xxx` par l'ID de l'inscription
3. Vérifier le body:
   ```json
   {
     "notes": "Inscription acceptée"
   }
   ```
4. Cliquer **Send**

**Réponse (Status 200):**
```json
{
  "inscriptionId": "uuid-xxx",
  "statut": "Actif",
  "familleId": "uuid-xxx",
  "enfantId": "uuid-xxx",
  "tuteurs": [
    {
      "tuteurId": "uuid-xxx",
      "email": "parent@example.com",
      "statut": "sent"
    }
  ]
}
```

✅ Inscription acceptée!

---

### 7️⃣ Rejeter une Inscription

1. Aller à: **Inscriptions → Reject Inscription**
2. Remplacer `uuid-xxx` par l'ID de l'inscription
3. Vérifier le body:
   ```json
   {
     "raison": "Classe complète"
   }
   ```
4. Cliquer **Send**

**Réponse (Status 200):**
```json
{
  "inscriptionId": "uuid-xxx",
  "statut": "Rejetée",
  "raison": "Classe complète"
}
```

✅ Inscription rejetée!

---

## 🧪 Tester les Erreurs

### ❌ Email invalide
```json
{
  "email": "invalid-email",
  "prenom": "Ahmed",
  "nom": "Dupont"
}
```
**Résultat:** Status 400 - "Email invalide"

### ❌ Données manquantes
```json
{
  "email": "prof@wlw.ma"
}
```
**Résultat:** Status 400 - "Champ manquant: prenom"

### ❌ Sans token
Supprimer le header `Authorization` et cliquer **Send**

**Résultat:** Status 401 - "Unauthorized"

### ❌ Token invalide
Remplacer le token par `invalid_token` et cliquer **Send**

**Résultat:** Status 401 - "Invalid token"

---

## 📊 Tableau des Endpoints

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/auth/login` | POST | ❌ | Connexion admin |
| `/admin/users/teachers/invite` | POST | ✅ | Inviter enseignant |
| `/admin/users` | GET | ✅ | Lister utilisateurs |
| `/admin/users/:id` | GET | ✅ | Obtenir utilisateur |
| `/admin/users/:id/status` | PATCH | ✅ | Mettre à jour statut |
| `/inscriptions/:id/accept` | POST | ✅ | Accepter inscription |
| `/inscriptions/:id/reject` | PATCH | ✅ | Rejeter inscription |

---

## 🎯 Flux Complet

```
1. Login Admin
   ↓
2. Copier le token
   ↓
3. Inviter un enseignant
   ↓
4. Lister les utilisateurs
   ↓
5. Obtenir un utilisateur
   ↓
6. Mettre à jour le statut
   ↓
7. Accepter une inscription
   ↓
8. Vérifier les parents invités
```

---

## 💡 Conseils

- **Variables:** Utiliser `{{base_url}}` et `{{accessToken}}` dans les requêtes
- **Sauvegarder:** Cliquer **Save Response** pour garder les exemples
- **Tester les erreurs:** Essayer les cas d'erreur pour vérifier la validation
- **Swagger:** http://localhost:3000/docs pour la documentation complète

---

**🎉 Vous êtes prêt à tester l'API en Postman!**

