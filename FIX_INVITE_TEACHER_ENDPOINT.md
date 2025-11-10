# 🔧 FIX - Endpoint "Invite Teacher" 404 Not Found

## ❌ Problème

Vous aviez l'erreur:
```json
{
  "message": "Cannot POST /api/admin/users/invite-teacher",
  "error": "Not Found",
  "statusCode": 404
}
```

## 🔍 Cause

L'endpoint `/api/admin/users/invite-teacher` **n'existe pas**!

Les endpoints corrects sont:
1. `POST /api/admin/users` - Créer utilisateur (enseignant ou parent)
2. `POST /api/admin/users/teachers/invite` - Inviter enseignant (legacy)

## ✅ Solutions

### Solution 1: Créer Utilisateur (RECOMMANDÉ)

**Endpoint**: `POST /api/admin/users`

**Body**:
```json
{
  "email": "douaachemnane@gmail.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```

**Réponse**:
```json
{
  "utilisateurId": "usr_123",
  "email": "douaachemnane@gmail.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "tempPassword": "temp_password_123"
}
```

**Avantages**:
- ✅ Endpoint moderne
- ✅ Supporte ENSEIGNANT et PARENT
- ✅ Retourne le mot de passe temporaire
- ✅ Crée l'utilisateur directement

---

### Solution 2: Inviter Enseignant (Legacy)

**Endpoint**: `POST /api/admin/users/teachers/invite`

**Body**:
```json
{
  "email": "douaachemnane@gmail.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678"
}
```

**Réponse**:
```json
{
  "utilisateurId": "usr_123",
  "email": "douaachemnane@gmail.com",
  "statut": "INVITED",
  "invited": true
}
```

**Note**: Cet endpoint est legacy (ancien). Préférez la Solution 1.

---

## 📋 Comparaison des Endpoints

| Endpoint | Méthode | Rôle | Supporte | Retourne |
|----------|---------|------|----------|----------|
| `/admin/users` | POST | ENSEIGNANT, PARENT | ✅ Moderne | tempPassword |
| `/admin/users/teachers/invite` | POST | ENSEIGNANT uniquement | ⚠️ Legacy | Basique |

---

## 🚀 Workflow Correct

### Étape 1: Créer Utilisateur
```bash
POST /api/admin/users
Authorization: Bearer {{admin_token}}
{
  "email": "douaachemnane@gmail.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```

**Réponse**:
```json
{
  "utilisateurId": "usr_123",
  "email": "douaachemnane@gmail.com",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "tempPassword": "temp_password_123"
}
```

### Étape 2: Copier le Mot de Passe Temporaire
```
tempPassword: temp_password_123
```

### Étape 3: Login Utilisateur
```bash
POST /api/auth/login-user
{
  "email": "douaachemnane@gmail.com",
  "password": "temp_password_123"
}
```

**Réponse**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "usr_123",
  "role": "ENSEIGNANT",
  "email": "douaachemnane@gmail.com"
}
```

### Étape 4: Utiliser le Token
```bash
Authorization: Bearer {{teacher_token}}
```

---

## 📮 Collection Postman Mise à Jour

La collection **Creche-API-Complete-v2.postman_collection.json** a été mise à jour avec:

1. ✅ **Créer Utilisateur** - Endpoint moderne
2. ✅ **Inviter Enseignant** - Endpoint legacy
3. ✅ **Lister Utilisateurs** - Avec pagination
4. ✅ **Détails Utilisateur** - Par ID

---

## 📊 Endpoints Admin/Users

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/admin/users` | POST | Créer utilisateur |
| `/admin/users` | GET | Lister utilisateurs |
| `/admin/users/:id` | GET | Détails utilisateur |
| `/admin/users/:id/status` | PATCH | Changer statut |
| `/admin/users/:id` | DELETE | Supprimer utilisateur |
| `/admin/users/teachers/invite` | POST | Inviter enseignant (legacy) |

---

## ✅ Checklist

- [x] Problème identifié
- [x] Endpoints corrects trouvés
- [x] Collection Postman mise à jour
- [x] Guide de correction créé
- [x] Workflow complet documenté

---

## 🎉 Résumé

**Utilisez cet endpoint pour créer des utilisateurs**:
```bash
POST /api/admin/users
```

**Avec ce body**:
```json
{
  "email": "douaachemnane@gmail.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```

**Et vous recevrez le mot de passe temporaire pour la connexion!**

---

## 📞 Support

- 📖 Swagger: http://localhost:3000/api/docs
- 📮 Collection: `Creche-API-Complete-v2.postman_collection.json`
- 📖 Guide: `POSTMAN_COLLECTION_V2_GUIDE.md`

**Bonne chance!** 🚀

