# 📮 POSTMAN COLLECTION - GUIDE COMPLET

## 🎯 Problèmes Identifiés et Solutions

### 1. **Erreur: "Utilisateur non trouvé" (403 Forbidden)**

**Cause**: Vous essayez d'accéder à un utilisateur qui n'existe pas dans la base de données.

**Solution**:
1. D'abord, créer un utilisateur avec: `POST /api/admin/users`
2. Puis utiliser l'ID retourné pour les autres opérations

**Exemple**:
```bash
# 1. Créer un utilisateur
POST /api/admin/users
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "role": "ENSEIGNANT"
}

# Réponse:
{
  "utilisateurId": "usr_123",
  "email": "prof@example.com",
  "role": "ENSEIGNANT",
  "statut": "INVITED"
}

# 2. Utiliser cet ID pour assigner à une classe
POST /api/admin/users/teachers/usr_123/assign-class
{
  "classeId": "cls_456"
}
```

### 2. **GET /api/admin/classes/:id - Inclure les enfants**

**Problème**: Vous voulez voir la classe avec les enfants inclus.

**Solution**: Le endpoint retourne déjà les enfants. Vérifiez que:
1. L'ID de la classe existe
2. Vous êtes authentifié en tant qu'ADMIN
3. La classe a des enfants inscrits

**Exemple de réponse**:
```json
{
  "id": "cls_123",
  "nom": "Petite Section",
  "niveau": "PS",
  "capacite": 20,
  "enfants": [
    {
      "id": "enf_1",
      "prenom": "Liam",
      "nom": "Martin",
      "dateNaissance": "2022-01-15",
      "presence": "PRESENT"
    }
  ]
}
```

### 3. **Créer Menu - Erreur d'authentification**

**Cause**: Token JWT invalide ou expiré.

**Solution**:
1. Vous devez d'abord vous connecter: `POST /api/auth/login`
2. Copier le token retourné
3. L'ajouter dans le header: `Authorization: Bearer YOUR_TOKEN`

**Exemple**:
```bash
# 1. Login
POST /api/auth/login
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}

# Réponse:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin_dev",
  "role": "ADMIN",
  "email": "admin@wlw.ma"
}

# 2. Créer menu avec le token
POST /api/menus
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"]
}
```

---

## 📁 Structure de la Collection Postman

La collection est organisée en **dossiers par rôle et fonctionnalité**:

### 🔐 **1. AUTHENTIFICATION**
- `POST /api/auth/login` - Login Admin
- `POST /api/auth/login-user` - Login Utilisateur
- `POST /api/auth/change-password` - Changer mot de passe
- `POST /api/auth/verify` - Vérifier token

### 👨‍💼 **2. ADMIN - GESTION DES UTILISATEURS**
- `POST /api/admin/users` - Créer utilisateur
- `POST /api/admin/users/teachers/invite` - Inviter enseignant
- `GET /api/admin/users` - Lister utilisateurs
- `GET /api/admin/users/:id` - Détails utilisateur
- `PATCH /api/admin/users/:id/status` - Changer statut
- `POST /api/admin/users/teachers/:utilisateurId/assign-class` - Assigner classe
- `DELETE /api/admin/users/:id` - Supprimer utilisateur

### 📚 **3. ADMIN - GESTION DES CLASSES**
- `POST /api/admin/classes` - Créer classe
- `GET /api/admin/classes` - Lister classes
- `GET /api/admin/classes/:id` - Détails classe (avec enfants)
- `GET /api/admin/classes/:id/stats` - Statistiques classe
- `PATCH /api/admin/classes/:id` - Modifier classe
- `DELETE /api/admin/classes/:id` - Supprimer classe
- `GET /api/admin/classes/:classeId/enfants` - Enfants de la classe
- `POST /api/admin/classes/:classeId/enseignants/:enseignantId` - Assigner enseignant
- `DELETE /api/admin/classes/:classeId/enseignants/:enseignantId` - Retirer enseignant

### 🍽️ **4. MENUS**
- `POST /api/menus` - Créer menu (ADMIN)
- `GET /api/menus` - Lister menus
- `GET /api/menus/today` - Menu du jour
- `GET /api/menus/:id` - Détails menu
- `PATCH /api/menus/:id` - Modifier menu (ADMIN)
- `POST /api/menus/:id/publish` - Publier menu (ADMIN)
- `DELETE /api/menus/:id` - Supprimer menu (ADMIN)

### 📍 **5. PRÉSENCES**
- `GET /api/presences` - Lister présences
- `POST /api/presences` - Créer présence
- `POST /api/presences/class` - Présences par classe

### 📝 **6. RÉSUMÉS QUOTIDIENS**
- `POST /api/daily-resumes` - Créer résumé
- `GET /api/daily-resumes` - Lister résumés
- `GET /api/daily-resumes/:id` - Détails résumé
- `PATCH /api/daily-resumes/:id` - Modifier résumé
- `POST /api/daily-resumes/:id/publish` - Publier résumé
- `DELETE /api/daily-resumes/:id` - Supprimer résumé

### 👨‍👩‍👧 **7. PARENT - TABLEAU DE BORD**
- `GET /api/parent/me` - Profil parent
- `PATCH /api/parent/me` - Modifier profil
- `GET /api/parent/enfants/:id/presences` - Présences enfant
- `GET /api/parent/classes/:id/menu` - Menu classe
- `GET /api/parent/enfants/:id/resume` - Résumé enfant
- `GET /api/parent/classes/:id/journal/latest` - Journal classe
- `GET /api/parent/events` - Événements

### 👨‍👩‍👧 **8. FAMILLES**
- `POST /api/familles` - Créer famille
- `GET /api/familles` - Lister familles
- `GET /api/familles/:id` - Détails famille
- `PATCH /api/familles/:id` - Modifier famille
- `DELETE /api/familles/:id` - Supprimer famille
- `GET /api/familles/:id/stats` - Statistiques famille

### 📋 **9. INSCRIPTIONS**
- `POST /api/public/inscriptions` - Créer inscription (Public)
- `GET /api/admin/inscriptions` - Lister inscriptions (ADMIN)
- `GET /api/admin/inscriptions/:id` - Détails inscription
- `PATCH /api/admin/inscriptions/:id/status` - Changer statut
- `POST /api/admin/inscriptions/:id/accept` - Accepter inscription
- `PATCH /api/admin/inscriptions/:id/reject` - Rejeter inscription

### 📅 **10. ÉVÉNEMENTS**
- `POST /api/events` - Créer événement
- `GET /api/events` - Lister événements

---

## 🔑 Variables Postman à Configurer

### Environnement: Development

```json
{
  "base_url": "http://localhost:3000/api",
  "admin_token": "{{token_from_login}}",
  "user_token": "{{token_from_login}}",
  "admin_email": "admin@wlw.ma",
  "admin_password": "change_me",
  "classe_id": "{{id_from_create_class}}",
  "user_id": "{{id_from_create_user}}",
  "menu_id": "{{id_from_create_menu}}"
}
```

---

## ✅ Workflow Recommandé

### 1. **Setup Initial**
1. Login Admin: `POST /api/auth/login`
2. Copier le token
3. Configurer la variable `admin_token`

### 2. **Créer Utilisateurs**
1. Créer enseignant: `POST /api/admin/users`
2. Copier l'ID retourné
3. Assigner à une classe: `POST /api/admin/users/teachers/:id/assign-class`

### 3. **Créer Classe**
1. Créer classe: `POST /api/admin/classes`
2. Copier l'ID retourné
3. Voir les enfants: `GET /api/admin/classes/:id`

### 4. **Créer Menu**
1. Créer menu: `POST /api/menus`
2. Publier menu: `POST /api/menus/:id/publish`
3. Voir menu du jour: `GET /api/menus/today`

---

## 📥 Importer la Collection

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Sélectionner le fichier JSON
4. Configurer l'environnement
5. Commencer à tester!

---

## 🎯 Prochaines Étapes

1. ✅ Télécharger la collection Postman
2. ✅ Importer dans Postman
3. ✅ Configurer les variables
4. ✅ Tester les endpoints
5. ✅ Consulter la documentation Swagger

**Prêt pour les tests!** 🚀

