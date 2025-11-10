# 🔧 GUIDE DE DÉPANNAGE - CRECHE API

## ❌ Erreur: "Utilisateur non trouvé" (403 Forbidden)

### Symptômes
```json
{
  "message": "Utilisateur non trouvé",
  "error": "Forbidden",
  "statusCode": 403
}
```

### Causes Possibles

#### 1. **L'utilisateur n'existe pas dans la base de données**
**Solution**:
```bash
# 1. Créer d'abord l'utilisateur
POST /api/admin/users
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT"
}

# 2. Copier l'ID retourné
# Réponse: { "utilisateurId": "usr_123", ... }

# 3. Utiliser cet ID pour les autres opérations
POST /api/admin/users/teachers/usr_123/assign-class
{
  "classeId": "cls_456"
}
```

#### 2. **L'ID utilisateur est incorrect**
**Vérification**:
- Copier exactement l'ID retourné lors de la création
- Vérifier qu'il n'y a pas d'espaces supplémentaires
- Vérifier le format UUID

#### 3. **L'utilisateur a été supprimé**
**Solution**:
- Recréer l'utilisateur avec `POST /api/admin/users`

---

## ❌ Erreur: "Token invalide ou expiré" (401 Unauthorized)

### Symptômes
```json
{
  "statusCode": 401,
  "message": "Token invalide ou expiré",
  "error": "Unauthorized"
}
```

### Causes Possibles

#### 1. **Token manquant dans le header**
**Solution**:
```bash
# Ajouter le header Authorization
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 2. **Token expiré (24h)**
**Solution**:
```bash
# Se reconnecter
POST /api/auth/login
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}

# Copier le nouveau token
# Réponse: { "accessToken": "new_token_here", ... }
```

#### 3. **Token mal formaté**
**Vérification**:
- Format: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Pas d'espaces supplémentaires
- Pas de guillemets

---

## ❌ Erreur: "Rôle insuffisant" (403 Forbidden)

### Symptômes
```json
{
  "statusCode": 403,
  "message": "Rôle insuffisant pour accéder à cette ressource",
  "error": "Forbidden"
}
```

### Causes Possibles

#### 1. **Vous n'êtes pas ADMIN**
**Solution**:
- Utiliser le compte admin: `admin@wlw.ma` / `change_me`
- Ou créer un utilisateur avec rôle ADMIN

#### 2. **Endpoint réservé à un rôle spécifique**
**Vérification**:
- `POST /api/admin/users` → ADMIN uniquement
- `POST /api/menus` → ADMIN uniquement
- `GET /api/parent/me` → PARENT uniquement

#### 3. **Token d'un autre rôle utilisé**
**Solution**:
```bash
# Se reconnecter avec le bon compte
POST /api/auth/login
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

---

## ❌ Erreur: "Email déjà utilisé" (400 Bad Request)

### Symptômes
```json
{
  "statusCode": 400,
  "message": "Un utilisateur avec l'email user@example.com existe déjà",
  "error": "Bad Request"
}
```

### Causes Possibles

#### 1. **L'email existe déjà**
**Solution**:
- Utiliser un email différent
- Ou supprimer l'utilisateur existant puis le recréer

#### 2. **Vérifier les utilisateurs existants**
```bash
GET /api/admin/users?q=user@example.com
```

---

## ❌ Erreur: "Ressource non trouvée" (404 Not Found)

### Symptômes
```json
{
  "statusCode": 404,
  "message": "Ressource non trouvée",
  "error": "Not Found"
}
```

### Causes Possibles

#### 1. **L'ID n'existe pas**
**Solution**:
- Vérifier l'ID avec `GET /api/admin/classes`
- Copier l'ID exact

#### 2. **Mauvais endpoint**
**Vérification**:
- Vérifier l'URL exacte
- Vérifier la méthode HTTP (GET, POST, PATCH, DELETE)

#### 3. **Ressource supprimée**
**Solution**:
- Recréer la ressource

---

## ❌ Erreur: "Ressource déjà existante" (409 Conflict)

### Symptômes
```json
{
  "statusCode": 409,
  "message": "Un menu existe déjà pour cette date",
  "error": "Conflict"
}
```

### Causes Possibles

#### 1. **Menu déjà créé pour cette date**
**Solution**:
- Utiliser une date différente
- Ou modifier le menu existant avec `PATCH /api/menus/:id`

#### 2. **Classe déjà existante**
**Solution**:
- Utiliser un nom différent
- Ou modifier la classe existante

---

## ❌ Erreur: "Données invalides" (400 Bad Request)

### Symptômes
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Causes Possibles

#### 1. **Champs requis manquants**
**Solution**:
```bash
# Vérifier les champs requis
POST /api/admin/users
{
  "email": "prof@example.com",      # Requis
  "prenom": "Ahmed",                # Requis
  "nom": "Dupont",                  # Requis
  "role": "ENSEIGNANT",             # Requis
  "telephone": "+212612345678"      # Optionnel
}
```

#### 2. **Format de date incorrect**
**Solution**:
- Format: `YYYY-MM-DD`
- Exemple: `2025-11-10`

#### 3. **Enum invalide**
**Solution**:
- Rôles: `ADMIN`, `ENSEIGNANT`, `PARENT`
- Statuts: `INVITED`, `ACTIVE`, `DISABLED`
- Humeur: `JOYEUX`, `CALME`, `TRISTE`, `FATIGUE`

---

## ✅ Workflow de Dépannage

### Étape 1: Vérifier l'authentification
```bash
POST /api/auth/login
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

### Étape 2: Vérifier le token
```bash
POST /api/auth/verify
{
  "token": "YOUR_TOKEN"
}
```

### Étape 3: Vérifier les ressources
```bash
# Lister les utilisateurs
GET /api/admin/users

# Lister les classes
GET /api/admin/classes

# Lister les menus
GET /api/menus
```

### Étape 4: Vérifier les permissions
- Vérifier le rôle de l'utilisateur
- Vérifier que l'endpoint n'est pas réservé à un rôle spécifique

---

## 📝 Checklist de Dépannage

- [ ] Token valide et non expiré
- [ ] Header `Authorization: Bearer TOKEN` présent
- [ ] Rôle correct pour l'endpoint
- [ ] ID de ressource correct
- [ ] Données valides (format, champs requis)
- [ ] Ressource existe dans la base de données
- [ ] Pas de conflit (email, date, etc.)

---

## 🆘 Besoin d'aide?

1. Consulter la documentation Swagger: http://localhost:3000/api/docs
2. Consulter le guide Postman: `POSTMAN_COLLECTION_GUIDE.md`
3. Consulter la collection Postman: `Creche-API-Complete.postman_collection.json`
4. Vérifier les logs du serveur

---

## 🚀 Prochaines Étapes

1. ✅ Importer la collection Postman
2. ✅ Configurer les variables
3. ✅ Tester les endpoints
4. ✅ Consulter ce guide en cas d'erreur

**Prêt pour les tests!** 🚀

