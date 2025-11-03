# 🎯 ADMIN CRUD - GUIDE RAPIDE

## 🚀 DÉMARRAGE RAPIDE

### 1. Créer l'utilisateur ADMIN
```bash
cd creche-api
node create-admin.js
```

### 2. Démarrer le serveur
```bash
pnpm start:dev
```

### 3. Importer la collection Postman
- Fichier: `POSTMAN_ADMIN_CRUD_FIXED.json`
- Ouvrez Postman → Import → Sélectionnez le fichier

---

## 📋 ENDPOINTS

### 🔐 Authentification
```
POST /api/auth/login
Body: { "email": "admin@wlw.ma", "password": "change_me" }
Response: { "accessToken": "...", "userId": "admin_dev", "role": "ADMIN" }
```

### 👥 Gestion des Utilisateurs

#### Créer Utilisateur
```
POST /api/admin/users
Headers: Authorization: Bearer {{accessToken}}
Body: {
  "email": "user@example.com",
  "prenom": "John",
  "nom": "Doe",
  "role": "ENSEIGNANT" | "PARENT",
  "telephone": "+212..."
}
```

#### Lister Utilisateurs
```
GET /api/admin/users?page=1&limit=10
GET /api/admin/users?role=ENSEIGNANT&page=1&limit=10
GET /api/admin/users?role=PARENT&page=1&limit=10
Headers: Authorization: Bearer {{accessToken}}
```

#### Obtenir Utilisateur
```
GET /api/admin/users/:id
Headers: Authorization: Bearer {{accessToken}}
```

#### Modifier Statut
```
PATCH /api/admin/users/:id/status
Headers: Authorization: Bearer {{accessToken}}
Body: { "statut": "ACTIVE" | "DISABLED" }
```

#### Supprimer Utilisateur
```
DELETE /api/admin/users/:id
Headers: Authorization: Bearer {{accessToken}}
```

---

## 📚 DOCUMENTATION

| Fichier | Description |
|---------|------------|
| `TEST_RAPIDE.md` | Guide de test rapide (5 min) |
| `GUIDE_COMPLET_ADMIN_CRUD.md` | Guide détaillé avec étapes |
| `SOLUTION_COMPLETE.md` | Analyse du problème et solution |
| `POSTMAN_ADMIN_CRUD_FIXED.json` | Collection Postman |

---

## 🎯 WORKFLOW

```
1. Login Admin
   ↓
2. Créer Enseignant/Parent
   ↓
3. Lister Utilisateurs
   ↓
4. Modifier Statut
   ↓
5. Supprimer Utilisateur
```

---

## ✅ STATUTS

| Statut | Description |
|--------|------------|
| `INVITED` | En attente d'activation |
| `ACTIVE` | Actif |
| `DISABLED` | Désactivé |

---

## 👥 RÔLES

| Rôle | Description |
|------|------------|
| `ADMIN` | Administrateur |
| `ENSEIGNANT` | Enseignant |
| `PARENT` | Parent/Tuteur |

---

## 🔗 LIENS UTILES

- **API:** `http://localhost:3000`
- **Swagger:** `http://localhost:3000/docs`
- **GitHub:** `https://github.com/wlw-tech/creche-saas`

---

**🎉 PRÊT À UTILISER!**

