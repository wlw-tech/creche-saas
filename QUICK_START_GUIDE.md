# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## ⚡ 5 Minutes pour Commencer

### 1️⃣ Login Admin (1 min)

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
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

✅ **Copier le token** pour les prochaines requêtes

---

### 2️⃣ Créer une Classe (1 min)

```bash
POST http://localhost:3000/api/admin/classes
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```

**Réponse**:
```json
{
  "id": "cls_123",
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20
}
```

✅ **Copier l'ID** (cls_123)

---

### 3️⃣ Créer un Utilisateur (1 min)

```bash
POST http://localhost:3000/api/admin/users
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT"
}
```

**Réponse**:
```json
{
  "utilisateurId": "usr_123",
  "email": "prof@example.com",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}
```

✅ **Copier l'ID** (usr_123)

---

### 4️⃣ Assigner l'Enseignant à la Classe (1 min)

```bash
POST http://localhost:3000/api/admin/users/teachers/usr_123/assign-class
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "classeId": "cls_123"
}
```

**Réponse**:
```json
{
  "message": "Enseignant assigné à la classe avec succès",
  "enseignantId": "ens_123",
  "utilisateurId": "usr_123",
  "classeId": "cls_123"
}
```

---

### 5️⃣ Créer un Menu (1 min)

```bash
POST http://localhost:3000/api/menus
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"]
}
```

**Réponse**:
```json
{
  "id": "menu_123",
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "statut": "Brouillon"
}
```

---

## 🎯 Erreurs Courantes et Solutions

### ❌ "property niveau should not exist"
**Solution**: Utiliser `trancheAge` au lieu de `niveau`

### ❌ "Utilisateur non trouvé"
**Solution**: Créer l'utilisateur d'abord avec `POST /api/admin/users`

### ❌ "Token invalide"
**Solution**: Se reconnecter avec `POST /api/auth/login`

### ❌ "Rôle insuffisant"
**Solution**: Utiliser le compte admin: `admin@wlw.ma` / `change_me`

---

## 📚 Documentation Complète

| Fichier | Description |
|---------|-------------|
| `DOCUMENTATION_INDEX.md` | Index complet de la documentation |
| `COMPLETE_API_SUMMARY.md` | Résumé complet de l'API |
| `CORRECT_REQUEST_SCHEMAS.md` | Schémas corrects pour chaque endpoint |
| `FIXES_AND_CORRECTIONS.md` | Erreurs résolues et solutions |
| `TROUBLESHOOTING_GUIDE.md` | Guide de dépannage |
| `POSTMAN_COLLECTION_GUIDE.md` | Guide Postman |

---

## 🔗 Accès à la Documentation

- **Swagger UI**: http://localhost:3000/api/docs
- **Postman Collection**: `Creche-API-Complete.postman_collection.json`
- **Guides Markdown**: Tous les fichiers `.md` dans le répertoire racine

---

## 📊 39 Endpoints Disponibles

### 🔐 Authentification (4)
- Login Admin
- Login Utilisateur
- Changer mot de passe
- Vérifier token

### 👥 Admin/Users (7)
- Créer utilisateur
- Inviter enseignant
- Lister utilisateurs
- Détails utilisateur
- Changer statut
- Assigner classe
- Supprimer utilisateur

### 📚 Admin/Classes (9)
- Créer classe
- Lister classes
- Détails classe (avec enfants)
- Statistiques classe
- Modifier classe
- Supprimer classe
- Enfants de la classe
- Assigner enseignant
- Retirer enseignant

### 🍽️ Menus (7)
- Créer menu
- Lister menus
- Menu du jour
- Détails menu
- Modifier menu
- Publier menu
- Supprimer menu

### 📍 Présences (3)
- Lister présences
- Créer présence
- Présences par classe

### 📝 Résumés Quotidiens (6)
- Créer résumé
- Lister résumés
- Détails résumé
- Modifier résumé
- Publier résumé
- Supprimer résumé

### 👨‍👩‍👧 Parent (7)
- Profil parent
- Modifier profil
- Présences enfant
- Menu classe
- Résumé enfant
- Journal classe
- Événements

---

## ✅ Checklist de Démarrage

- [ ] Lire ce guide (5 min)
- [ ] Tester login admin (1 min)
- [ ] Créer une classe (1 min)
- [ ] Créer un utilisateur (1 min)
- [ ] Assigner l'utilisateur à la classe (1 min)
- [ ] Créer un menu (1 min)
- [ ] Consulter Swagger: http://localhost:3000/api/docs
- [ ] Importer la collection Postman
- [ ] Tester les autres endpoints

---

## 🎉 Résumé

Vous avez maintenant:
- ✅ **API complètement documentée**
- ✅ **39 endpoints testables**
- ✅ **Collection Postman prête**
- ✅ **Guides complets**
- ✅ **Solutions aux erreurs courantes**

**Prêt pour les tests!** 🚀

---

## 📞 Support

- 📖 Swagger: http://localhost:3000/api/docs
- 📖 Guides: Tous les fichiers `.md`
- 📮 Collection: `Creche-API-Complete.postman_collection.json`

**Bonne chance!** 🚀

