# 📮 Postman Collection v2 - Guide Complet

## 🎯 Contenu de la Collection

La collection **Creche-API-Complete-v2.postman_collection.json** contient tous les endpoints organisés par rôle et fonctionnalité:

### 📁 Dossiers

1. **🔐 Authentification** (3 endpoints)
   - Login Admin
   - Login Utilisateur (Enseignant/Parent)
   - Vérifier Token

2. **👥 Admin - Utilisateurs** (2 endpoints)
   - Créer Utilisateur
   - Lister Utilisateurs

3. **📚 Admin - Classes** (3 endpoints)
   - Créer Classe
   - Lister Classes
   - Détails Classe avec Enfants

4. **📍 Presences - Enseignant** (3 endpoints)
   - Enregistrer Présence Enfant
   - Enregistrer Présences Classe
   - Voir Toutes Présences Classe

5. **📝 Résumés Quotidiens - Enseignant** (3 endpoints)
   - Créer Résumé Enfant
   - Voir Résumés Enfant
   - Voir Tous Résumés Classe

6. **🍽️ Menus - Admin** (4 endpoints)
   - Créer Menu
   - Voir Menu du Jour
   - Lister Menus
   - Publier Menu

7. **👨‍👩‍👧 Parent Dashboard** (7 endpoints)
   - Mon Profil
   - Changer Mon Mot de Passe
   - Présences Mon Enfant
   - Résumé Quotidien Mon Enfant
   - Journal Rapide Classe
   - Menu du Jour Classe
   - Mes Événements

---

## 🚀 Installation et Configuration

### Étape 1: Importer la Collection

1. Ouvrir **Postman**
2. Cliquer sur **Import**
3. Sélectionner le fichier `Creche-API-Complete-v2.postman_collection.json`
4. Cliquer sur **Import**

### Étape 2: Configurer les Variables

Les variables suivantes doivent être configurées:

| Variable | Valeur | Description |
|----------|--------|-------------|
| `base_url` | `http://localhost:3000/api` | URL de base de l'API |
| `admin_token` | (à remplir) | Token JWT admin |
| `teacher_token` | (à remplir) | Token JWT enseignant |
| `parent_token` | (à remplir) | Token JWT parent |
| `classe_id` | (à remplir) | ID d'une classe |
| `enfant_id` | (à remplir) | ID d'un enfant |
| `menu_id` | (à remplir) | ID d'un menu |

---

## 📋 Workflow Complet

### 1️⃣ Authentification Admin

```bash
POST /api/auth/login
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

**Action**: Copier le `accessToken` et le coller dans la variable `admin_token`

---

### 2️⃣ Créer Classe

```bash
POST /api/admin/classes
Authorization: Bearer {{admin_token}}
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

**Action**: Copier l'`id` et le coller dans la variable `classe_id`

---

### 3️⃣ Créer Utilisateur (Enseignant)

```bash
POST /api/admin/users
Authorization: Bearer {{admin_token}}
{
  "email": "prof@example.com",
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
  "email": "prof@example.com",
  "role": "ENSEIGNANT",
  "statut": "INVITED",
  "tempPassword": "temp_password_123"
}
```

**Action**: Copier le `tempPassword` pour la connexion

---

### 4️⃣ Login Enseignant

```bash
POST /api/auth/login-user
{
  "email": "prof@example.com",
  "password": "temp_password_123"
}
```

**Réponse**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "usr_123",
  "role": "ENSEIGNANT",
  "email": "prof@example.com"
}
```

**Action**: Copier le `accessToken` et le coller dans la variable `teacher_token`

---

### 5️⃣ Enregistrer Présences Classe

```bash
POST /api/presences/class
Authorization: Bearer {{teacher_token}}
{
  "classeId": "{{classe_id}}",
  "date": "2025-11-10",
  "presences": [
    {
      "enfantId": "enf_1",
      "statut": "Present",
      "arriveeA": "08:30",
      "departA": "17:00"
    },
    {
      "enfantId": "enf_2",
      "statut": "Absent"
    }
  ]
}
```

---

### 6️⃣ Créer Résumés Enfants

```bash
POST /api/daily-resumes
Authorization: Bearer {{teacher_token}}
{
  "enfantId": "enf_1",
  "date": "2025-11-10",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "activites": "Jeux libres, peinture, chansons",
  "observations": "Très actif et joyeux"
}
```

---

### 7️⃣ Créer Menu (Admin)

```bash
POST /api/menus
Authorization: Bearer {{admin_token}}
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"]
}
```

**Action**: Copier l'`id` du menu et le coller dans la variable `menu_id`

---

### 8️⃣ Publier Menu

```bash
POST /api/menus/{{menu_id}}/publish
Authorization: Bearer {{admin_token}}
```

---

### 9️⃣ Parent - Voir Présences Enfant

```bash
GET /api/parent/enfants/{{enfant_id}}/presences?page=1&pageSize=30
Authorization: Bearer {{parent_token}}
```

---

### 🔟 Parent - Voir Résumé Enfant

```bash
GET /api/parent/enfants/{{enfant_id}}/resume?date=2025-11-10
Authorization: Bearer {{parent_token}}
```

---

### 1️⃣1️⃣ Parent - Voir Journal Classe

```bash
GET /api/parent/classes/{{classe_id}}/journal/latest
Authorization: Bearer {{parent_token}}
```

---

### 1️⃣2️⃣ Parent - Voir Menu du Jour

```bash
GET /api/parent/classes/{{classe_id}}/menu?date=2025-11-10
Authorization: Bearer {{parent_token}}
```

---

### 1️⃣3️⃣ Parent - Changer Mot de Passe

```bash
POST /api/parent/me/change-password
Authorization: Bearer {{parent_token}}
{
  "oldPassword": "old_password",
  "newPassword": "new_password_123"
}
```

---

## 📊 Endpoints par Rôle

### 👨‍💼 Admin
- ✅ Créer/Lister/Voir Utilisateurs
- ✅ Créer/Lister/Voir Classes
- ✅ Voir Toutes Présences
- ✅ Voir Tous Résumés
- ✅ Créer/Lister/Publier Menus

### 👨‍🏫 Enseignant
- ✅ Enregistrer Présences
- ✅ Créer Résumés Enfants
- ✅ Voir Présences Classe
- ✅ Voir Résumés Classe
- ✅ Voir Menus Publiés

### 👨‍👩‍👧 Parent
- ✅ Voir Profil
- ✅ Changer Mot de Passe
- ✅ Voir Présences Enfant
- ✅ Voir Résumé Enfant
- ✅ Voir Journal Classe
- ✅ Voir Menu du Jour
- ✅ Voir Événements

---

## 🔑 Authentification

### Admin (Hardcodé)
```json
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```

### Utilisateurs (Créés par Admin)
- Email: Défini lors de la création
- Mot de passe temporaire: Généré et retourné lors de la création
- Endpoint: `POST /api/auth/login-user`

---

## 💡 Conseils

1. **Toujours configurer les variables** avant de tester
2. **Copier les tokens** après chaque login
3. **Utiliser les variables** `{{variable}}` dans les URLs
4. **Vérifier les rôles** requis pour chaque endpoint
5. **Consulter Swagger** pour plus de détails: http://localhost:3000/api/docs

---

## ✅ Checklist

- [ ] Importer la collection
- [ ] Configurer `base_url`
- [ ] Login Admin et copier token
- [ ] Créer une classe et copier ID
- [ ] Créer un utilisateur
- [ ] Login utilisateur et copier token
- [ ] Enregistrer présences
- [ ] Créer résumés
- [ ] Créer et publier menu
- [ ] Tester endpoints parent

---

## 📞 Support

- 📖 Swagger: http://localhost:3000/api/docs
- 📖 Guides: Tous les fichiers `.md`
- 📮 Collection: `Creche-API-Complete-v2.postman_collection.json`

**Bonne chance!** 🚀

