# 📮 Guide Postman - Tester l'Authentification

## 🚀 Étape 1: Importer la Collection

1. Ouvrir **Postman**
2. Cliquer sur **Import** (en haut à gauche)
3. Sélectionner le fichier: **`POSTMAN_AUTH_COLLECTION.json`**
4. Cliquer **Import**

✅ La collection est maintenant disponible dans Postman!

---

## ⚙️ Étape 2: Configurer les Variables

### Créer une Environment

1. Cliquer sur **Environments** (à gauche)
2. Cliquer sur **+** pour créer une nouvelle environment
3. Nommer: **`Crèche API - DEV`**
4. Ajouter les variables:

| Variable | Valeur | Description |
|----------|--------|-------------|
| `base_url` | `http://localhost:3000/api` | URL de base |
| `accessToken` | *(vide pour maintenant)* | Token JWT (sera rempli après login) |

5. Cliquer **Save**

### Sélectionner l'Environment

1. En haut à droite, sélectionner: **`Crèche API - DEV`**

✅ Les variables sont maintenant disponibles!

---

## 🔐 Étape 3: Tester le Login

### 1️⃣ Démarrer le serveur

```bash
cd creche-api
pnpm start:dev
```

Attendre le message: `[Nest] ... - 10/28/2025, 3:00:00 PM     LOG [NestFactory] Application successfully started`

### 2️⃣ Faire le Login

1. Dans Postman, aller à: **Auth → Login Admin**
2. Vérifier le body:
   ```json
   {
     "email": "admin@wlw.ma",
     "password": "change_me"
   }
   ```
3. Cliquer **Send**

### ✅ Réponse attendue (Status 200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

### 3️⃣ Sauvegarder le Token

1. Copier la valeur de `accessToken` de la réponse
2. Aller à **Environments → Crèche API - DEV**
3. Coller dans la variable `accessToken`
4. Cliquer **Save**

✅ Le token est maintenant disponible pour les autres requêtes!

---

## 👥 Étape 4: Inviter un Enseignant

### 1️⃣ Faire la requête

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

### ✅ Réponse attendue (Status 201):
```json
{
  "utilisateurId": "uuid-xxx",
  "email": "prof@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "inviteLe": "2025-10-28T15:30:00Z"
}
```

✅ L'enseignant a été invité!

---

## 📋 Étape 5: Lister les Utilisateurs

### 1️⃣ Faire la requête

1. Aller à: **Admin - Users → List Users**
2. Cliquer **Send**

### ✅ Réponse attendue (Status 200):
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

✅ Les utilisateurs sont listés!

---

## 📝 Étape 6: Accepter une Inscription

### 1️⃣ Obtenir l'ID d'une inscription

1. Aller à: **Inscriptions → List Inscriptions** (si disponible)
2. Ou utiliser un ID connu: `00000000-0000-0000-0000-000000000001`

### 2️⃣ Faire la requête

1. Aller à: **Inscriptions → Accept Inscription**
2. Remplacer l'ID dans l'URL: `/inscriptions/{id}/accept`
3. Vérifier le body:
   ```json
   {
     "notes": "Inscription acceptée"
   }
   ```
4. Cliquer **Send**

### ✅ Réponse attendue (Status 200):
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

✅ L'inscription a été acceptée et les parents ont reçu une invitation!

---

## 🧪 Cas de Test Supplémentaires

### Test 1: Email invalide
```json
{
  "email": "invalid-email",
  "prenom": "Ahmed",
  "nom": "Dupont"
}
```
**Résultat attendu:** ❌ Status 400 - "Email invalide"

### Test 2: Données manquantes
```json
{
  "email": "prof@wlw.ma"
}
```
**Résultat attendu:** ❌ Status 400 - "Champ manquant: prenom"

### Test 3: Sans token
1. Aller à: **Admin - Users → Invite Teacher**
2. Supprimer le header `Authorization`
3. Cliquer **Send**

**Résultat attendu:** ❌ Status 401 - "Unauthorized"

### Test 4: Rôle insuffisant
1. Créer un token avec rôle PARENT
2. Essayer d'inviter un enseignant

**Résultat attendu:** ❌ Status 403 - "Forbidden"

---

## 📊 Tableau des Endpoints

| Endpoint | Méthode | Auth | Rôle | Description |
|----------|---------|------|------|-------------|
| `/auth/login` | POST | ❌ | - | Connexion admin |
| `/admin/users/teachers/invite` | POST | ✅ | ADMIN | Inviter enseignant |
| `/admin/users` | GET | ✅ | ADMIN | Lister utilisateurs |
| `/admin/users/:id` | GET | ✅ | ADMIN | Obtenir utilisateur |
| `/admin/users/:id/status` | PATCH | ✅ | ADMIN | Mettre à jour statut |
| `/inscriptions/:id/accept` | POST | ✅ | ADMIN | Accepter inscription |
| `/inscriptions/:id/reject` | PATCH | ✅ | ADMIN | Rejeter inscription |

---

## 🐛 Troubleshooting

### ❌ "Cannot GET /api/auth/login"
- Vérifier que le serveur est démarré: `pnpm start:dev`
- Vérifier l'URL: `http://localhost:3000/api/auth/login`

### ❌ "Unauthorized"
- Vérifier que le token est dans le header `Authorization: Bearer <token>`
- Vérifier que le token n'a pas expiré

### ❌ "Forbidden"
- Vérifier que le rôle est ADMIN
- Vérifier que le statut est ACTIVE

### ❌ "Email already exists"
- Utiliser un email différent
- Ou supprimer l'utilisateur de la base de données

### ❌ "Invalid email format"
- Vérifier le format de l'email: `user@domain.com`

---

## 💡 Conseils

1. **Sauvegarder les réponses:** Cliquer sur **Save Response** pour garder les exemples
2. **Utiliser les variables:** Utiliser `{{base_url}}` et `{{accessToken}}` dans les requêtes
3. **Tester les erreurs:** Essayer les cas d'erreur pour vérifier la validation
4. **Consulter Swagger:** http://localhost:3000/docs pour la documentation complète

---

## 🎯 Flux Complet de Test

```
1. Démarrer le serveur
   ↓
2. Login Admin (POST /auth/login)
   ↓
3. Copier le token dans les variables
   ↓
4. Inviter un enseignant (POST /admin/users/teachers/invite)
   ↓
5. Lister les utilisateurs (GET /admin/users)
   ↓
6. Accepter une inscription (POST /inscriptions/:id/accept)
   ↓
7. Vérifier que les parents ont reçu une invitation
```

---

**🎉 Vous êtes prêt à tester l'API en Postman!**

Pour plus de détails, consultez: `AUTH_WORKFLOW_GUIDE.md`

