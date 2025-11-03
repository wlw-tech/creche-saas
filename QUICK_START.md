# 🚀 QUICK START - ADMIN CRUD

## ⚡ 3 ÉTAPES POUR COMMENCER

### 1️⃣ INITIALISER L'ADMIN (30 secondes)
```bash
cd creche-api
node create-admin.js
```

✅ Résultat:
```
✅ Admin user created successfully
```

---

### 2️⃣ DÉMARRER LE SERVEUR (10 secondes)
```bash
pnpm start:dev
```

✅ Résultat:
```
✅ API running on http://[::1]:3000
📚 Swagger on http://[::1]:3000/docs
```

---

### 3️⃣ IMPORTER POSTMAN (1 minute)
1. Ouvrez **Postman**
2. Cliquez sur **Import**
3. Sélectionnez: `POSTMAN_ADMIN_CRUD_FIXED.json`
4. Cliquez sur **Import**

✅ Résultat: 10 endpoints prêts à tester!

---

## 🎯 TESTER EN 5 MINUTES

### Étape 1: Login
```
POST http://localhost:3000/api/auth/login
Body: { "email": "admin@wlw.ma", "password": "change_me" }
```

**Copier le `accessToken` reçu!**

---

### Étape 2: Créer Enseignant
```
POST http://localhost:3000/api/admin/users
Headers: Authorization: Bearer {{accessToken}}
Body: {
  "email": "teacher1@wlw.ma",
  "prenom": "Ahmed",
  "nom": "Bennani",
  "role": "ENSEIGNANT",
  "telephone": "+212612345678"
}
```

✅ Réponse (201):
```json
{
  "utilisateurId": "usr_123",
  "email": "teacher1@wlw.ma",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}
```

---

### Étape 3: Créer Parent
```
POST http://localhost:3000/api/admin/users
Headers: Authorization: Bearer {{accessToken}}
Body: {
  "email": "parent1@wlw.ma",
  "prenom": "Fatima",
  "nom": "Alaoui",
  "role": "PARENT",
  "telephone": "+212612345679"
}
```

---

### Étape 4: Lister Utilisateurs
```
GET http://localhost:3000/api/admin/users?page=1&limit=10
Headers: Authorization: Bearer {{accessToken}}
```

---

### Étape 5: Modifier Statut
```
PATCH http://localhost:3000/api/admin/users/{{userId}}/status
Headers: Authorization: Bearer {{accessToken}}
Body: { "statut": "ACTIVE" }
```

---

## 📚 DOCUMENTATION COMPLÈTE

| Fichier | Temps | Description |
|---------|-------|------------|
| `README_ADMIN_CRUD.md` | 2 min | Référence rapide |
| `TEST_RAPIDE.md` | 5 min | Guide de test |
| `GUIDE_COMPLET_ADMIN_CRUD.md` | 15 min | Guide détaillé |
| `SOLUTION_COMPLETE.md` | 10 min | Analyse complète |
| `RESUME_SOLUTION.md` | 5 min | Résumé |

---

## 🔗 LIENS UTILES

- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/docs
- **Postman Collection:** `POSTMAN_ADMIN_CRUD_FIXED.json`

---

## ✅ ENDPOINTS

```
1. POST   /api/auth/login                    Login Admin
2. POST   /api/admin/users                   Créer Utilisateur
3. GET    /api/admin/users                   Lister Utilisateurs
4. GET    /api/admin/users/:id               Obtenir Utilisateur
5. PATCH  /api/admin/users/:id/status        Modifier Statut
6. DELETE /api/admin/users/:id               Supprimer Utilisateur
```

---

## 🎯 RÔLES

- `ADMIN` - Administrateur
- `ENSEIGNANT` - Enseignant
- `PARENT` - Parent/Tuteur

---

## 📊 STATUTS

- `INVITED` - En attente d'activation
- `ACTIVE` - Actif
- `DISABLED` - Désactivé

---

## 🐛 DÉPANNAGE

### Erreur: "Utilisateur non trouvé" (403)
```bash
node create-admin.js
```

### Erreur: "Token invalide" (401)
Reconnectez-vous avec le login admin.

### Erreur: "Email déjà utilisé" (400)
Utilisez un email différent.

---

## 🎉 PRÊT!

Vous êtes maintenant prêt à tester tous les endpoints CRUD!

**Commencez par:** `POSTMAN_ADMIN_CRUD_FIXED.json`

---

**Happy Testing! 🚀**

