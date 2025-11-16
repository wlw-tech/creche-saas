# 📖 Crèche API - Guide Complet

## 🚀 Quick Start

### 1. Importer Collection Postman
- Ouvrir Postman
- Cliquer **Import** → Sélectionner `Creche-API.postman_collection.json`

### 2. Configurer Environment
- Créer environment: **Crèche API**
- Ajouter variables:
  - `base_url`: `http://localhost:3000/api`
  - `admin_token`: (vide)
  - `teacher_token`: (vide)
  - `parent_token`: (vide)
  - `classe_id`: (vide)
  - `enfant_id`: (vide)
  - `menu_id`: (vide)
  - `teacher_id`: (vide)

---

## 🔐 Authentification

### Login Admin
```
POST /auth/login
{
  "email": "admin@wlw.ma",
  "password": "change_me"
}
```
**Réponse**: Copier `accessToken` → `{{admin_token}}`

### Login Parent/Enseignant
```
POST /auth/login-user
{
  "email": "user@example.com",
  "password": "temp_password"
}
```
**Réponse**: Copier `accessToken` → `{{parent_token}}` ou `{{teacher_token}}`

---

## 👥 Utilisateurs (Admin)

### Créer Utilisateur
```
POST /admin/users
Authorization: Bearer {{admin_token}}
{
  "email": "prof@example.com",
  "prenom": "Ahmed",
  "nom": "Dupont",
  "telephone": "+212612345678",
  "role": "ENSEIGNANT"
}
```
**Réponse**: Copier `utilisateurId` → `{{teacher_id}}` et `tempPassword`

### Lister Utilisateurs
```
GET /admin/users?page=1&limit=25
Authorization: Bearer {{admin_token}}
```

---

## 📚 Classes (Admin)

### Créer Classe
```
POST /admin/classes
Authorization: Bearer {{admin_token}}
{
  "nom": "Petite Section",
  "trancheAge": "PS",
  "capacite": 20,
  "active": true
}
```
**Réponse**: Copier `id` → `{{classe_id}}`

### Lister Classes
```
GET /admin/classes
Authorization: Bearer {{admin_token}}
```

### Voir Classe avec Enfants + Présences
```
GET /admin/classes/{{classe_id}}/enfants
Authorization: Bearer {{admin_token}}
```
**Réponse**: Enfants avec statut présence (Present/Absent/null)

### Assigner Enseignant à Classe
```
POST /admin/classes/{{classe_id}}/enseignants/{{teacher_id}}
Authorization: Bearer {{admin_token}}
{}
```

---

## 📍 Présences (Enseignant)

### Enregistrer Présences Classe
```
POST /presences/class
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

### Voir Présences Classe
```
GET /presences?classeId={{classe_id}}&date=2025-11-10
Authorization: Bearer {{teacher_token}}
```

---

## 📝 Résumés Quotidiens (Enseignant)

### Créer Résumé Enfant
```
POST /daily-resumes
Authorization: Bearer {{teacher_token}}
{
  "enfantId": "{{enfant_id}}",
  "date": "2025-11-10",
  "humeur": "Excellent",
  "appetit": "Bon",
  "sieste": "Excellent",
  "participation": "Excellent",
  "activites": "Jeux libres, peinture",
  "observations": "Très actif"
}
```

### Voir Résumés Classe
```
GET /daily-resumes?classeId={{classe_id}}&date=2025-11-10
Authorization: Bearer {{teacher_token}}
```

---

## 🍽️ Menus (Admin)

### Créer Menu
```
POST /menus
Authorization: Bearer {{admin_token}}
{
  "date": "2025-11-10",
  "entree": "Salade",
  "plat": "Poulet riz",
  "dessert": "Fruit",
  "allergenes": ["Arachides"]
}
```
**Réponse**: Copier `id` → `{{menu_id}}`

### Publier Menu
```
POST /menus/{{menu_id}}/publish
Authorization: Bearer {{admin_token}}
```

---

## 👨‍👩‍👧 Parent Dashboard

### Mon Profil (avec Enfants)
```
GET /parent/me
Authorization: Bearer {{parent_token}}
```
**Réponse**: Contient `enfants[].id` → Copier → `{{enfant_id}}`

### Présences Mon Enfant
```
GET /parent/enfants/{{enfant_id}}/presences?page=1&pageSize=30
Authorization: Bearer {{parent_token}}
```

### Résumé Quotidien Mon Enfant
```
GET /parent/enfants/{{enfant_id}}/resume?date=2025-11-10
Authorization: Bearer {{parent_token}}
```

### Journal Rapide Classe
```
GET /parent/classes/{{classe_id}}/journal/latest
Authorization: Bearer {{parent_token}}
```

### Menu du Jour Classe
```
GET /parent/classes/{{classe_id}}/menu?date=2025-11-10
Authorization: Bearer {{parent_token}}
```

### Changer Mot de Passe
```
POST /parent/me/change-password
Authorization: Bearer {{parent_token}}
{
  "oldPassword": "old_password",
  "newPassword": "new_password_123"
}
```

---

## 📊 Workflow Complet

### 1. Admin: Créer Utilisateur
```
POST /admin/users → Copier utilisateurId + tempPassword
```

### 2. Admin: Créer Classe
```
POST /admin/classes → Copier id
```

### 3. Admin: Assigner Enseignant
```
POST /admin/classes/{{classe_id}}/enseignants/{{teacher_id}}
```

### 4. Enseignant: Login
```
POST /auth/login-user → Copier accessToken
```

### 5. Enseignant: Enregistrer Présences
```
POST /presences/class
```

### 6. Enseignant: Créer Résumés
```
POST /daily-resumes
```

### 7. Parent: Login
```
POST /auth/login-user → Copier accessToken
```

### 8. Parent: Voir Profil
```
GET /parent/me → Copier enfant_id
```

### 9. Parent: Voir Présences Enfant
```
GET /parent/enfants/{{enfant_id}}/presences
```

### 10. Parent: Voir Menu
```
GET /parent/classes/{{classe_id}}/menu
```

---

## ⚠️ Points Importants

### Authorization Header
```
Authorization: Bearer {{token}}
```
**Important**: Toujours utiliser `Bearer` avant le token!

### Obtenir enfant_id
- Appeler `GET /parent/me`
- Copier `enfants[0].id`

### Voir Classe Complète
- Appeler `GET /admin/classes/{{classe_id}}/enfants`
- Retourne enfants avec statut présence

### Assigner Enseignant
- Créer classe d'abord
- Puis assigner enseignant avec son ID

---

## 📞 Support

- 📖 **Swagger**: http://localhost:3000/api/docs
- 📮 **Collection**: `Creche-API.postman_collection.json`
- 📖 **Ce Guide**: `API_COMPLETE_GUIDE.md`

---

## ✅ Endpoints Résumé

| Endpoint | Méthode | Rôle | Description |
|----------|---------|------|-------------|
| `/auth/login` | POST | - | Login Admin |
| `/auth/login-user` | POST | - | Login User |
| `/admin/users` | POST | ADMIN | Créer Utilisateur |
| `/admin/users` | GET | ADMIN | Lister Utilisateurs |
| `/admin/classes` | POST | ADMIN | Créer Classe |
| `/admin/classes` | GET | ADMIN | Lister Classes |
| `/admin/classes/:id/enfants` | GET | ADMIN | Voir Classe+Enfants |
| `/admin/classes/:id/enseignants/:id` | POST | ADMIN | Assigner Enseignant |
| `/presences/class` | POST | TEACHER | Enregistrer Présences |
| `/presences` | GET | TEACHER | Voir Présences |
| `/daily-resumes` | POST | TEACHER | Créer Résumé |
| `/daily-resumes` | GET | TEACHER | Voir Résumés |
| `/menus` | POST | ADMIN | Créer Menu |
| `/menus/:id/publish` | POST | ADMIN | Publier Menu |
| `/parent/me` | GET | PARENT | Mon Profil |
| `/parent/enfants/:id/presences` | GET | PARENT | Présences Enfant |
| `/parent/enfants/:id/resume` | GET | PARENT | Résumé Enfant |
| `/parent/classes/:id/journal/latest` | GET | PARENT | Journal Classe |
| `/parent/classes/:id/menu` | GET | PARENT | Menu Classe |
| `/parent/me/change-password` | POST | PARENT | Changer Mot de Passe |

**Prêt à utiliser!** 🚀

