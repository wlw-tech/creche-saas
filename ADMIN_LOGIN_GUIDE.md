# 🔐 Admin Login Guide - Crèche SaaS

## ✅ Identifiants Admin (DEV)

```
Email: admin@wlw.ma
Password: change_me
```

⚠️ **IMPORTANT**: Ces identifiants sont pour le développement uniquement. En production, utiliser Supabase Auth.

---

## 🚀 Comment Se Connecter

### Option 1: Avec Postman (Recommandé)

1. **Importer la collection**
   - Ouvrir Postman
   - Cliquer sur "Import"
   - Sélectionner `Creche-Admin-API.postman_collection.json`

2. **Exécuter le login**
   - Aller à "🔐 Authentication" → "Login Admin"
   - Cliquer sur "Send"
   - Le token sera automatiquement sauvegardé dans `{{adminToken}}`

3. **Utiliser le token**
   - Tous les autres endpoints utiliseront automatiquement le token
   - Vous pouvez maintenant tester les endpoints admin

### Option 2: Avec cURL

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wlw.ma",
    "password": "change_me"
  }'
```

**Réponse**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}
```

### Option 3: Avec JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@wlw.ma',
    password: 'change_me'
  })
});

const data = await response.json();
const token = data.accessToken;

// Utiliser le token
const classesResponse = await fetch('http://localhost:3000/api/admin/classes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔍 Dépannage

### ❌ Erreur: "Email ou mot de passe incorrect"

**Cause**: Les identifiants sont incorrects

**Solution**:
- Vérifier que l'email est exactement: `admin@wlw.ma`
- Vérifier que le password est exactement: `change_me`
- Vérifier qu'il n'y a pas d'espaces avant/après

### ❌ Erreur: "Endpoint non disponible en production"

**Cause**: L'API est en mode production

**Solution**:
- Vérifier que `NODE_ENV=development` dans le fichier `.env`
- Redémarrer le serveur après modification

### ❌ Erreur: 403 Forbidden sur les endpoints admin

**Cause**: Le token n'est pas valide ou l'utilisateur n'a pas le rôle ADMIN

**Solution**:
- Vérifier que le token commence par "Bearer "
- Vérifier que le token n'est pas expiré (24h)
- Vérifier que le header est: `Authorization: Bearer <TOKEN>`

### ❌ Erreur: 401 Unauthorized

**Cause**: Le token est manquant ou invalide

**Solution**:
- Vérifier que le header Authorization est présent
- Vérifier que le token n'est pas expiré
- Refaire un login pour obtenir un nouveau token

---

## 📋 Checklist - Avant de Tester

- [ ] API en cours d'exécution: `npm run start:dev`
- [ ] Base de données connectée
- [ ] `.env` configuré avec `NODE_ENV=development`
- [ ] Identifiants corrects: `admin@wlw.ma` / `change_me`
- [ ] Postman importé ou cURL prêt

---

## 🧪 Test Complet

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@wlw.ma", "password": "change_me"}'
```

### 2. Copier le token
```
accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Tester un endpoint admin
```bash
curl -H "Authorization: Bearer <VOTRE_TOKEN>" \
  http://localhost:3000/api/admin/classes
```

### 4. Résultat attendu
```json
[
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "nom": "Petite Section",
    "capacite": 20,
    "trancheAge": "3-4 ans",
    "active": true
  }
]
```

---

## 🔐 Sécurité

### En Développement
- Les identifiants sont en dur dans le code
- Le JWT secret est `dev_secret`
- Les tokens expirent après 24h

### En Production
- Utiliser Supabase Auth
- Les identifiants sont gérés par Supabase
- Les tokens sont signés avec une clé secrète forte
- Implémenter le refresh token

---

## 📞 Support

- **Documentation**: Voir `ADMIN_CLASSES_GUIDE.md`
- **Postman**: `Creche-Admin-API.postman_collection.json`
- **API Docs**: http://localhost:3000/api/docs
- **GitHub**: github.com:wlw-tech/creche-saas.git

---

## 🎯 Prochaines Étapes

1. ✅ Se connecter avec les identifiants admin
2. ✅ Obtenir un JWT token
3. ✅ Tester les endpoints admin
4. ✅ Créer des classes
5. ✅ Assigner des enseignants
6. ✅ Voir les enfants et leurs présences

Bon développement! 🚀

